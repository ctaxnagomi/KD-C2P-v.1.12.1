---
name: js-promises-task-microtask
description: Reference for JavaScript event loop ordering — how promises, setTimeout, and async/await interleave through the task (macrotask) and microtask queues. Use when reasoning about async execution order, debugging race conditions, explaining timing bugs, writing tests around setTimeout/promise callbacks, or answering "which runs first" questions in JS/Node/Electron code.
---

# JavaScript Promises: Task & Microtask Queues

The JavaScript engine processes asynchronous work through the **event loop** using two queues with strict priority. Getting the ordering right is the difference between correct code and subtle timing bugs.

## The two queues

| Queue | Holds | Examples | When it drains |
|---|---|---|---|
| **Microtask queue** | Promise callbacks (`.then`, `.catch`, `.finally`), `queueMicrotask`, `await` continuations, MutationObserver callbacks | `Promise.resolve().then(...)`, `async` function resumption | **Immediately after the current task completes**, before the next task starts. Always drains to empty (a microtask scheduled by a microtask runs in the same drain). |
| **Task queue (macrotask)** | Timers, I/O, events | `setTimeout`, `setInterval`, `setImmediate` (Node), message events, `requestAnimationFrame` (browser) | One task per event-loop tick, after the microtask queue is fully empty. |

## Core ordering rule

1. Run the current script/task synchronously to completion.
2. Drain the **entire** microtask queue (new microtasks appended during draining also run).
3. Take the **next one** task from the task queue.
4. Repeat.

So a microtask always runs **before** any pending timer, even if the timer was scheduled first:

```js
setTimeout(() => console.log('task: setTimeout'), 0);
Promise.resolve().then(() => console.log('microtask: promise'));
// console output order:
// microtask: promise
// task: setTimeout
```

## `await` = microtask boundary

`await` always yields to the event loop. The code after `await` is scheduled as a microtask, so it runs before any timer, but only after the synchronously-running code that scheduled it has finished:

```js
async function foo() {
  console.log('1');
  await null;           // yields — continuation queued as microtask
  console.log('3');     // microtask
}
foo();
console.log('2');
// 1, 2, 3
```

Even `await` on an already-resolved value still defers. Nothing after an `await` runs synchronously in the same tick.

## Deeply-chained promises

A `then` returning a promise waits for that inner promise to settle first; the outer continuation is scheduled as a fresh microtask, which can visibly reorder output:

```js
Promise.resolve()
  .then(() => console.log('A'))
  .then(() => console.log('B'));
Promise.resolve()
  .then(() => console.log('C'))
  .then(() => console.log('D'));
// A, C, B, D  — each .then is its own microtask, chained per-pipeline
```

The pipelines interleave because each `.then` appends a new microtask; they are not grouped.

## Scheduling order within one drain

Microtasks run in FIFO order. Scheduling a microtask from inside a microtask appends it to the current drain (still runs this tick), whereas scheduling a task from a microtask defers it to the next tick:

```js
Promise.resolve().then(() => {
  console.log('microtask 1');
  setTimeout(() => console.log('task later'), 0); // runs next tick
  queueMicrotask(() => console.log('microtask 2')); // runs this drain
});
// microtask 1, microtask 2, task later
```

## Common bug: zero-delay setTimeout as "wait for render/paint"

`setTimeout(fn, 0)` is a **task** — it runs after the microtask queue and after the browser may have painted. If you need the minimum possible delay before a callback that must run before the next task, use `queueMicrotask`. For awaiting a paint, use `requestAnimationFrame` (browser) instead.

## Error handling

- An unhandled rejection surfaces at the end of the microtask drain (as `unhandledRejection` in Node, `unhandledrejection` in browsers) — a `.catch` attached later in the same tick still counts as handled.
- `finally` runs as a microtask after the promise settles and does not swallow the rejection unless it itself throws.

## Testing recipes

- To assert a value after several async hops, `await` a microtask drain: `await Promise.resolve()` (one tick), or `await new Promise(r => setTimeout(r, 0))` to force a task boundary.
- To test "timer never fired" style assertions, drive the clock (Vitest/Jest fake timers) rather than real waits; be aware fake timers also mock microtask scheduling in some setups — verify which queue your runner controls.
- For event-loop-order assertions, log markers and compare sequences rather than asserting on absolute timing.

## Node-specific notes

- `process.nextTick` runs its callbacks **before** promise microtasks in the same phase. Order: `nextTick` queue → microtask queue → task.
- `setImmediate` runs on the check phase; its ordering vs `setTimeout(0)` is nondeterministic outside I/O callbacks (inside I/O callbacks, `setImmediate` wins).
- In Electron main/renderer processes the same browser-style rules apply in the renderer; the main process is Node-flavored (with `nextTick`).

## Quick mental model

> Current synchronous code → drain all microtasks (promises/await) → one task (timer/event) → repeat.

When in doubt about two callbacks, ask: *is it a promise callback (microtask, runs first) or a timer/event callback (task, runs next tick)?*
