# DeepSeek Harness — Open-Source Agent Framework Skill

> Source: https://github.com/deepseek-ai/deepseek-harness
> License: MIT
> Version: 0.1.0-rc.6 (Developer Preview)
> Released: August 13, 2026
> Stars: 157K+ in 2 days

## When to Load

- Comparing DeckerGUI architecture with DSH plugin model
- Building DSH plugins for CTAX agent integration
- Using Cordis dependency injection in DeckerGUI
- Deploying DSH as alternative agent runtime alongside CTAX-Ai
- Integrating DSH provider adapters with DGUI LLM routing
- Understanding "everything is a plugin" architecture patterns

---

## Core Concept

**Agent = Model + Harness**

> "The model is the soul of an agent. A harness lets it understand its environment, use tools, and keep working in real-world settings." — DeepSeek

A model only emits text. The harness is the layer around it: workspace, tools, permissions, session memory, and the loop that keeps work moving.

### DSH vs DeckerGUI

| Aspect | DeepSeek Harness | DeckerGUI |
|--------|-----------------|-----------|
| Philosophy | Everything is a plugin | Three-layer architecture |
| DI Framework | Cordis | Manual wiring |
| Provider | Multi-provider (DeepSeek default) | Big Pickle + 4 providers |
| Token Economics | None | CaaS federation + DGM gate caching |
| Browser Runtime | Plugin-based | CTAX-Ai (neo/puppeteer/playwright) |
| Pricing | API costs pass-through | Token reduction via caching |
| License | MIT | Proprietary |
| Status | Developer preview (0.1.0-rc) | Production (v2.0.0) |

---

## Architecture

### Cordis — Dependency Injection

DSH is powered by **Cordis**, a dependency injection framework described in "A Programming Paradigm for Spatiotemporal Composability."

```typescript
// Cordis service registration
import { Context } from 'cordis'

// Services are plugins with reversible registrations
ctx.plugin(ToolRegistry, { tools: [...] })
ctx.plugin(AgentLoop, { maxSteps: 30 })
ctx.plugin(SessionMemory, { ttl: 3600 })
```

**Key features:**
- Reversible registrations (services can be swapped at runtime)
- Spatiotemporal composability (services aware of time/space context)
- No privileged core to patch

### Plugin Categories (120+ plugins)

| Category | Examples | DeckerGUI Equivalent |
|----------|----------|---------------------|
| **Inference** | DeepSeek, Anthropic, OpenAI, Bedrock, Vertex, Azure | `internal/llm/client.go` |
| **Tools** | File ops, terminal, browser, API calls | `internal/tools/registry.go` |
| **Session** | Memory, history, context window | Seeds Cache + DGM Gate |
| **Agent Loop** | ReAct, plan-execute, tree-of-thought | `internal/agent/agent.go` |
| **Sandbox** | Docker, Wasm, firecracker | CTAX-Ai runtime |
| **Storage** | SQLite, PostgreSQL, Redis | Audit Trail (JSONL) |
| **Web UI** | Chat interface, dashboard | Enterprise Dashboard (3010) |
| **Skills** | Custom capabilities | `.agents/skills/` |

### Four Operational Modes

| Mode | Purpose | DSH Command |
|------|---------|-------------|
| **Standard** | General tasks | `npx @deepseek-ai/dsh web` |
| **Code** | Multi-app code execution | Mode toggle in UI |
| **Creative** | Custom tool experimentation | Mode toggle in UI |
| **Minimal** | Isolated testing | Mode toggle in UI |

---

## Quick Start

```bash
# Install and run
npx @deepseek-ai/dsh web

# Open http://127.0.0.1:3080
# Enter DeepSeek API key
# Configure model under Settings → Models
# Send task, watch agent work
```

### Run from Source

```bash
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

---

## Plugin Development

### Creating a DSH Plugin

```typescript
// my-plugin/index.ts
import { Context } from 'cordis'

export const name = 'my-tool'

export function apply(ctx: Context, config: Config) {
  // Register tool
  ctx.plugin(ToolRegistry, {
    tools: [{
      name: 'my_custom_tool',
      description: 'Does something useful',
      parameters: { ... },
      execute: async (params) => {
        // Tool logic here
        return { result: '...' }
      }
    }]
  })
}
```

### Plugin Manifest

```json
{
  "name": "dsh-plugin-my-tool",
  "version": "0.1.0",
  "description": "Custom tool for DeepSeek Harness",
  "main": "index.ts",
  "dsh": {
    "category": "tools",
    "provides": ["my_custom_tool"]
  }
}
```

---

## DeckerGUI Integration Opportunities

### 1. DSH as Alternative Agent Runtime

```
┌─────────────────────────────────────────────────┐
│  DeckerGUI Ecosystem                             │
├─────────────────────────────────────────────────┤
│  Big Pickle (reasoning)                          │
│    ├─→ DGUI Token Reduction                      │
│    ├─→ DGM Gate Caching                          │
│    └─→ CaaS Federation                           │
├─────────────────────────────────────────────────┤
│  DGUI Tools Layer                                │
│    ├─→ CTAX-Ai (current)                         │
│    ├─→ DSH Plugin (NEW)                          │
│    │     ├─→ Cordis DI                           │
│    │     ├─→ 120+ plugins                        │
│    │     └─→ Multi-provider                      │
│    └─→ Traditional CLI tools                     │
├─────────────────────────────────────────────────┤
│  DGUI Runtime                                    │
│    ├─→ Agent Server (3005)                       │
│    ├─→ Coordinator Hub (3011)                    │
│    └─→ DSH Web UI (3080) ← optional              │
└─────────────────────────────────────────────────┘
```

### 2. Cordis for DeckerGUI DI

```typescript
// Adopt Cordis pattern for DGUI services
import { Context } from 'cordis'

// Before: manual wiring
const kpi = new KPITokenizer(port)
const gate = new DGMGate()
const cache = new SeedsCache()

// After: Cordis DI
ctx.plugin(KPITokenizer, { port: 3004 })
ctx.plugin(DGMGate, { ttl: 300 })
ctx.plugin(SeedsCache, { maxEntries: 1000 })
ctx.plugin(CaaSFederation, { catalog: contextCatalog })
```

### 3. DSH Provider Adapters → DGUI

```typescript
// DSH supports these providers — DGUI can adopt same adapters
const providers = {
  deepseek: DeepSeekAdapter,
  anthropic: AnthropicAdapter,
  openai: OpenAIAdapter,
  bedrock: BedrockAdapter,
  vertex: VertexAdapter,
  azure: AzureAdapter,
  ollama: OllamaAdapter,      // ← L440 local inference
  custom: OpenAICompatible    // ← Big Pickle endpoint
}
```

### 4. DSH Plugins as CTAX Extensions

```bash
# Install DSH browser plugin for CTAX
dsh plugin install @deepseek-ai/plugin-browser

# Install DSH terminal plugin
dsh plugin install @deepseek-ai/plugin-terminal

# Install DSH MCP plugin
dsh plugin install @deepseek-ai/plugin-mcp
```

### 5. Token Economics Overlay

DSH has NO built-in token caching. DeckerGUI can add value:

```typescript
// DSH plugin that adds DGUI token reduction
export const name = 'dgui-token-cache'

export function apply(ctx: Context) {
  ctx.plugin(TokenCache, {
    dgmGate: 'http://localhost:3005/dgm',
    seedsCache: 'http://localhost:3005/seeds',
    caasEndpoint: 'http://localhost:3011/context',
    ttl: 300  // 5min cache
  })
}
```

---

## Comparison Matrix

| Feature | DSH | Claude Code | DeckerGUI |
|---------|-----|-------------|-----------|
| License | MIT | Proprietary | Proprietary |
| Plugin System | Cordis (full DI) | MCP servers | Skills (.agents/) |
| Provider Support | 7+ providers | Anthropic only | 4 providers |
| Token Caching | None | None | CaaS + DGM + Seeds |
| Browser Runtime | Plugin | Built-in | CTAX-Ai |
| Web UI | Built-in | Terminal | Enterprise Dashboard |
| Pricing Model | API pass-through | Subscription | Token reduction |
| Status | Preview (0.1.0-rc) | GA | Production (v2.0.0) |
| GitHub Stars | 157K+ | N/A | N/A |

---

## Implementation Checklist

### Phase 1: Assessment
- [ ] Clone DSH repo and test locally
- [ ] Evaluate Cordis DI for DGUI service wiring
- [ ] Identify high-value DSH plugins for CTAX

### Phase 2: Integration
- [ ] Create DSH plugin for DGUI token caching
- [ ] Create DSH plugin for CaaS federation
- [ ] Test DSH as alternative CTAX runtime

### Phase 3: Hybrid Architecture
- [ ] DSH handles plugin orchestration
- [ ] DGUI handles token economics (CaaS, DGM, Seeds)
- [ ] CTAX-Ai handles browser/terminal execution
- [ ] Shared audit trail via Coordinator Hub

---

## References

1. DeepSeek Harness GitHub (github.com/deepseek-ai/deepseek-harness)
2. DeepSeek Harness Official (deepseek.com/harness)
3. Cordis Framework (github.com/cordiverse/cordis)
4. "A Programming Paradigm for Spatiotemporal Composability" (Cordis paper)
5. DSHBase Community Guide (dshbase.com)
6. DeckerGUI Three-Layer Architecture (dgui-cli-go/ARCHITECTURE.md)
7. CTAX-Ai Runtime (dgui-cli-go/internal/ctax/)
