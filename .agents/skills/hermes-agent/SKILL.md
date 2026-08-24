---
name: hermes-agent
description: Always-on AI agent architecture. Agent loop, context construction from markdown files, context compression, memory layers (markdown + SQLite + external), messaging gateway (Telegram/Slack/Discord/Email), and cron jobs for scheduled tasks.
source: https://www.youtube.com/watch?v=n32qq7Kwzh0
author: Alejandro AO / Hugging Face
license: MIT
---

# Hermes Agent Architecture

Hermes is an always-on AI agent with a simple but powerful architecture. It is not a chat wrapper — it is an execution runtime that keeps reassembling context, executing tool calls, and deciding what deserves to survive past the current turn.

## Core Philosophy

The individual pieces are simple:
- A loop
- A context builder
- Memory files
- SQLite sessions
- Optional external memory
- Gateways
- Scheduled jobs

The power comes from how those pieces fit together.

## High-Level Architecture

```
                    ┌─────────────────────┐
                    │   Messaging Gateway  │
                    │  (Telegram, Slack,   │
                    │   Discord, Email)    │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │      CLI / API       │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │    Hermes Agent Core │
                    │  ┌────────────────┐  │
                    │  │  Agent Loop    │  │
                    │  │  Context       │  │
                    │  │  Memory        │  │
                    │  │  Tools         │  │
                    │  │  Skills        │  │
                    │  └────────────────┘  │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼─────────┐ ┌───▼───┐ ┌─────────▼─────────┐
    │   SQLite Sessions  │ │ LLM   │ │  External Memory   │
    │   (History)        │ │       │ │  (mem0, etc.)      │
    └───────────────────┘ └───────┘ └───────────────────┘
```

## Three Access Paths

| Path | Use Case | Notes |
|------|----------|-------|
| **CLI** | Direct terminal interaction | Primary development interface |
| **Gateway** | Messaging platforms | Telegram, Slack, Discord, Email, SMS, WhatsApp |
| **API** | Software integrations | Programmatic access for external systems |

One agent runtime serves all surfaces without rewriting the stack.

## The Agent Loop

```
1. User message arrives
2. Hermes rebuilds context for that session
3. Full prompt goes to the LLM
4. LLM can call tools
5. Hermes loops until task is done
6. Final response is returned
7. Memory-update pass analyzes what should be persisted
```

**Key insight:** Step 7 is what makes Hermes improve over time. After each interaction, it decides whether new information should be written into memory for future turns.

## Context Construction

Context is intentionally minimal and file-based. Three core markdown files:

### soul.md — Personality and Behavior
- Describes what the agent is
- Tone and communication style
- Goals to optimize for
- Behavioral rules and constraints
- Similar to a system prompt

### user.md — Learned Facts About the User
- Updated as Hermes learns about you
- Professional role, projects, preferences
- Becomes part of future context automatically

### memory.md — Durable Notes and Workflows
- Arbitrary durable notes
- Workflows and procedures
- Tool usage details
- Facts learned during conversations
- Not limited to user information

### Additional Context Components
- Recent message history
- Tool descriptions
- Skill descriptions
- Relevant external memory (when configured)

## Context Compression

Long-running agents hit context limits. Hermes handles this with structured compression.

### Compression Triggers
1. **Proactive check:** Before every turn, cheap character-count approximation
2. **Reactive check:** If model returns context-overflow error, use real token counts

### Default Threshold
~50% of context window (configurable for smaller models)

### Compression Output Structure
When compression triggers, Hermes produces a structured summary:

| Section | Content |
|---------|---------|
| Goal | What the conversation is trying to achieve |
| Constraints | Limitations and requirements |
| Completed Actions | What has already been done |
| Active State | Current status and position |
| Key Decisions | Important choices made |
| Resolved Questions | Questions that have been answered |
| Relevant Files | Files mentioned or modified |
| Critical Context | Essential information to preserve |
| Previous Summaries | Earlier compressed summaries |
| Next Turns | What still needs to be incorporated |

**This is more operational than a minimalist "conversation summary."**

## Memory Architecture

Hermes memory has three layers:

### Layer 1: Markdown Files (Always Active)
- `soul.md` — personality
- `user.md` — user facts
- `memory.md` — durable notes

Always part of context after system prompt.

### Layer 2: SQLite Sessions (History)
- Every interaction associated with a session identifier
- Separate histories per channel (Telegram vs. Email vs. Slack)
- Stored locally for continuity

### Layer 3: External Memory (Optional)
- Providers: mem0, SuperMemory
- Stores and retrieves memories beyond local files
- Not needed initially — add when workflows justify complexity

## The Messaging Gateway

The gateway makes Hermes operational beyond the terminal.

### Supported Platforms
- Telegram
- Discord
- Slack
- Email
- SMS
- WhatsApp

### Gateway Responsibilities
1. Receive messages from external platform
2. Map external message format to Hermes format
3. Find the right session history
4. Build context for the session
5. Send message into agent loop

### Session Identifiers
Each platform gets a unique session prefix:
- `telegram:<id>`
- `slack:<id>`
- `email:<thread-id>`

Sessions stored locally for continuation.

### Gateway Setup
```bash
hermes setup gateway
```
Then configure the platform integration and home user identity.

## Cron Jobs

Hermes has its own cron system (not OS cron).

### Capabilities
- Send email every morning with AI news
- Post daily update to Slack
- Send weekly message to boss
- Run recurring agent tasks

### Implementation
- Stored as plain JSON under cron directory
- `jobs.json` checked on interval
- Executes scheduled jobs found in file

### Gateway Interaction
Cron jobs need explicit gateway configuration to send messages. They do not automatically know where to deliver output.

## Why This Architecture Works

| Component | Purpose | Simple? |
|-----------|---------|---------|
| Loop | Execution runtime | Yes |
| Context Builder | Assembles LLM input | Yes |
| Memory Files | Durable knowledge | Yes |
| SQLite Sessions | Channel-specific history | Yes |
| External Memory | Scalable recall (optional) | Yes |
| Gateways | Multi-channel access | Yes |
| Cron Jobs | Scheduled automation | Yes |

**The agent can be used from the terminal, reached through messaging apps, remember useful information, compress long conversations, and run background tasks.**

## Implementation Patterns

### Pattern 1: File-Based Context
Keep context in markdown files, not code. Easy to edit, version, and understand.

### Pattern 2: Structured Compression
When summarizing, preserve structure (goal, actions, state, decisions). Not just "the conversation was about X."

### Pattern 3: Session Isolation
Each channel gets its own session history. Telegram conversation does not bleed into Email thread.

### Pattern 4: Progressive Memory
Start with markdown files. Add SQLite when you need session history. Add external memory only when workflows justify it.

### Pattern 5: Gateway Abstraction
Same agent core, different transport layers. One system serves terminal, chat, and API users.

## DeckerGUI Integration

This skill is part of the DeckerGUI ecosystem. When applying Hermes patterns to DeckerGUI projects:

- **Agent Loop:** Map to Big Pickle reasoning layer
- **Context Construction:** Use CORPUSLIB instruct files as context sources
- **Memory:** Leverage DGUI Ecosystem for token reduction and caching
- **Gateway:** CTAX-Ai browser runtime as execution surface
- **Cron Jobs:** Health check tasks, tunnel monitoring, KPI metering
- **Session Isolation:** Separate dcf_agent sessions from visitor sessions
- **Compression:** Map to CaaS federation for long context handling

### Hermes-to-DeckerGUI Mapping

| Hermes Concept | DeckerGUI Equivalent |
|----------------|---------------------|
| Agent Core | Big Pickle (reasoning) |
| Context Files | CORPUSLIB instruct files |
| Memory | KPI Tokenizer + Emitter events |
| Sessions | DCF-agent session IDs |
| Gateway | CTAX-Ai browser runtime |
| Cron | Health check + tunnel monitor |
| Compression | CaaS federation |

## References

- **Video:** [Hermes Architecture EXPLAINED](https://www.youtube.com/watch?v=n32qq7Kwzh0)
- **Written Version:** [alejandro-ao.com/hermes-agent-architecture](https://alejandro-ao.com/hermes-agent-architecture)
- **Author:** Alejandro AO
- **Platform:** Hugging Face
