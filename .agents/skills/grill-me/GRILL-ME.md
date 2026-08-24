# GRILL-ME.md — DeckerGUI Plan Interrogation Protocol

> Based on Matt Pocock's grill-me technique (mattpocock/skills)
> Customized for DeckerGUI ecosystem architecture and CTAX agent development

---

## Purpose

This file inverts the usual developer-instructs-AI flow. When you invoke this protocol, the agent challenges your plan rather than executing it — surfacing hidden assumptions and decision gaps before any code is written.

---

## When to Use

- Designing new CTAX agent capabilities
- Planning QLoRA fine-tuning runs
- Architecting multi-agent coordination changes
- Before implementing features that touch multiple ports (3002-3011)
- When the decision space is large and wrong choices are expensive

---

## Protocol

### Core Instructions

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer. Ask the questions one at a time. If a question can be answered by exploring the codebase, explore the codebase instead.

### DeckerGUI-Specific Constraints

1. **Port Awareness** — Every new service must declare its port. Check against: 3002 (OS), 3004 (KPI), 3005 (Agent Server), 3006 (Emitter), 3010 (Landing), 3011 (Coordinator Hub)

2. **Three-Layer Compliance** — Every feature must map to one or more layers:
   - **Big Pickle** (reasoning/LLM) — token reduction, caching, provider routing
   - **DGUI Ecosystem** (tools/caching) — DGM Gate, Seeds, CaaS, KPI metering
   - **CTAX-Ai** (runtime) — browser, terminal, MCP execution

3. **Fail-Closed Gate** — Mutating routes must validate Enterprise Digital API Keys with scope `AGENT.*`. Read routes remain open.

4. **Mode Alignment** — Confirm which mode(s) the feature serves: ENTERPRISE (gold), CLOUD (sky), AGS (green), LOCAL (purple)

5. **Tunnel Hostnames** — If exposed externally, declare which hostname: hub.deckergui.my, agent.deckergui.my, or custom

### Question Flow

```
START
  │
  ├─→ 1. What problem does this solve?
  │     └─→ Who benefits? (Enterprise user / Cloud user / AGS operator / Local dev)
  │
  ├─→ 2. Which layer does this live in?
  │     ├─→ Big Pickle: What model/provider? Token budget?
  │     ├─→ DGUI Ecosystem: Which cache? Which gate? TTL?
  │     └─→ CTAX-Ai: Browser mode? Terminal access? MCP tools?
  │
  ├─→ 3. What's the data flow?
  │     ├─→ Ingress: Webhook? API call? CLI command?
  │     ├─→ Processing: Sync or async? Parallel or serial?
  │     └─→ Egress: SSE event? HTTP response? File write?
  │
  ├─→ 4. What can fail?
  │     ├─→ Network: Tunnel down? API timeout?
  │     ├─→ Auth: Token expired? Scope insufficient?
  │     ├─→ Resource: Disk full? Memory exhausted?
  │     └─→ Graceful degradation path?
  │
  ├─→ 5. What's the cost?
  │     ├─→ Tokens: Input/output estimate per operation
  │     ├─→ Latency: p50/p95/p99 targets
  │     └─→ Storage: Cache size, log retention
  │
  ├─→ 6. How do we measure success?
  │     ├─→ KPI: Which tokenizer metrics?
  │     ├─→ Audit: JSONL event format?
  │     └─→ Dashboard: Which tab renders this?
  │
  └─→ 7. What's the rollback plan?
        ├─→ Feature flag? Toggle?
        ├─→ Data migration reversible?
        └─→ Tunnel config changes?
```

---

## QLoRA Fine-Tuning Context

When grilling plans for CTAX model training:

### Base Model Selection Questions
1. What's the target hardware? (VRAM, RAM, disk)
2. What task domain? (browser automation, code generation, tool calling)
3. What latency requirement? (real-time vs batch)
4. What's the dataset size and quality?
5. Which evaluation benchmarks matter?

### Recommended Base Models for CTAX

| Model | Params | VRAM | Best For | QLoRA Ready |
|-------|--------|------|----------|-------------|
| **DeepSeek-Coder-V2-Lite** | 16B (2.4B active) | ~12GB | Code + tool use | ✅ |
| **Qwen2.5-Coder-7B** | 7B | ~6GB | Code generation | ✅ |
| **Mistral-7B-Instruct-v0.3** | 7B | ~6GB | General reasoning | ✅ |
| **CodeLlama-13B-Instruct** | 13B | ~10GB | Code completion | ✅ |
| **Llama-3.1-8B-Instruct** | 8B | ~6GB | Instruction following | ✅ |

### QLoRA Configuration Template
```yaml
qlora_config:
  base_model: "Qwen/Qwen2.5-Coder-7B-Instruct"
  adapter_rank: 64
  adapter_alpha: 128
  target_modules: ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]
  quantization:
    bits: 4
    type: "nf4"
    double_quant: true
  training:
    epochs: 3
    batch_size: 4
    gradient_accumulation: 8
    learning_rate: 2e-4
    lr_scheduler: "cosine"
    warmup_ratio: 0.03
    max_seq_length: 4096
  dataset:
    format: "chatml"
    source: "hf-datasets-staging/"
    split: "train"
```

---

## CTAX Agent Architecture Context

When grilling plans for CTAX agents:

### Agent Layer Questions
1. Does this agent need browser access? (neo/puppeteer/playwright)
2. Does this agent need terminal access? (shell execution)
3. Does this agent need MCP tools? (which servers?)
4. What's the token budget per invocation?
5. Which LLM provider handles this agent? (bigpickle/anthropic/openai/ollama)

### Agent Role Mapping
```
┌─────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR (Big Pickle reasoning)                        │
│  - Mission decomposition                                    │
│  - Validation contract definition                           │
│  - Model routing decisions                                  │
└─────────────────────────────────────────────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
    ┌───────▼───────┐ ┌───▼───┐ ┌───────▼───────┐
    │  CTAX-WORKER  │ │CTAX-W│ │  CTAX-WORKER  │
    │  (Browser)    │ │(Term)│ │  (MCP)        │
    │  neo/puppeteer│ │      │ │  tool calls   │
    └───────┬───────┘ └───┬───┘ └───────┬───────┘
            │              │              │
            └──────────────┼──────────────┘
                           │
                    ┌──────▼──────┐
                    │  VALIDATOR  │
                    │  (DGM Gate) │
                    │  assertion  │
                    │  checking   │
                    └─────────────┘
```

---

## Invocation

To use this protocol, type:

```
/grill-me [describe your plan here]
```

Or simply reference this file and the agent will adopt the interrogation posture.

---

## Output Format

After grilling, produce a resolved decision tree:

```markdown
## Resolved Decisions

### Problem Statement
[What we're solving]

### Layer Assignment
[Big Pickle / DGUI / CTAX / Multi-layer]

### Data Flow
[Ingress → Processing → Egress]

### Failure Modes
[What can go wrong + graceful degradation]

### Cost Estimate
[Tokens + latency + storage]

### Success Metrics
[KPIs + audit events + dashboard tabs]

### Rollback Plan
[How to undo if needed]

### Open Questions
[Anything not fully resolved]
```

---

## References

1. Matt Pocock grill-me skill (github.com/mattpocock/skills)
2. DeckerGUI Three-Layer Architecture (dgui-cli-go/ARCHITECTURE.md)
3. Factory Missions Validation Contracts (.agents/skills/factory-missions/SKILL.md)
4. Multi-Agent PR Review System (.agents/skills/multi-agent-pr-review/SKILL.md)
5. QLoRA paper: "QLoRA: Efficient Finetuning of Quantized LLMs" (Dettmers et al., 2023)
