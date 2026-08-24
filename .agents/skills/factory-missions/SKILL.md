# Factory Missions — Multi-Agent Architecture Skill

> Source: "The Multi-Agent Architecture That Actually Ships — Luke Alvoeiro, Factory" (AI Engineer, May 2026)
> Video: https://www.youtube.com/watch?v=ow1we5PzK-o

## When to Load

- Designing multi-agent coordination systems
- Implementing orchestrator-worker-validator patterns
- Defining validation contracts for autonomous tasks
- Building long-running (multi-day) agent workflows
- Optimizing model selection across agent roles
- Implementing structured handoffs between agents
- Building mission control dashboards

---

## Core Concept: Attention Bottleneck

**The primary constraint is human attention, not model intelligence.**

- Models can handle 50+ features concurrently
- Engineers can supervise only a handful of tasks
- Missions inverts the paradigm: humans define objectives, agents execute autonomously

---

## Five Coordination Patterns

### 1. Delegation
One agent delegates subtasks to specialized agents.
- Parent assigns task to child agent
- Simplest form of multi-agent coordination
- Example: Orchestrator delegates code review to Security Agent

### 2. Creator-Verifier
Separation of creation and validation.
- Creator produces output
- Verifier validates against contract
- Example: Worker writes code, Validator checks assertions

### 3. Broadcast
Event spine publishes findings to all agents.
- Single event triggers multiple agent reactions
- Ensures consistency across agent knowledge
- Example: PR webhook broadcasts to all reviewers

### 4. Negotiation
Agents debate severity/priority.
- Adversarial verification
- Synthesizer ranks and deduplicates findings
- Example: Security Agent and Quality Agent debate priority

### 5. Direct Communication
Agent-to-agent without hub mediation.
- Reduces latency for critical paths
- Bypasses orchestrator for efficiency
- Example: Validator sends rollback signal directly to Worker

---

## Three-Role Architecture

### Orchestrator (Planning)
**Model Requirements:** Careful reasoning, slow thinking
**Responsibilities:**
- Mission decomposition
- Validation contract definition
- Resource allocation and scheduling
- Model selection for workers

**DeckerGUI Mapping:** Coordinator Hub (port 3011)

### Worker (Implementation)
**Model Requirements:** Code fluency, creativity, instruction following
**Responsibilities:**
- Code implementation
- Feature development
- Unit test creation
- Documentation

**DeckerGUI Mapping:** Agent Server (port 3005)

### Validator (Verification)
**Model Requirements:** Strict instruction following, adversarial thinking
**Responsibilities:**
- Validation contract checking
- Quality assurance
- Security scanning
- Test coverage verification

**DeckerGUI Mapping:** Synthesizer Agent

---

## Validation Contracts

**Critical Innovation:** Define correctness BEFORE implementation begins.

```typescript
interface ValidationContract {
  features: {
    name: string;
    assertions: string[];
    modelRole: 'orchestrator' | 'worker' | 'validator';
  }[];
  milestones: {
    checkpoint: string;
    requiredEvidence: string[];
  }[];
  rollbackTriggers: string[];
}
```

### Key Principles
1. Assertions are independent of implementation details
2. Validator checks against contract, not against code style
3. Contract enables parallel validation during execution
4. Rollback triggers defined upfront prevent cascading failures

### Contract Template
```yaml
validation_contract:
  features:
    - name: "PR Review Agent"
      assertions:
        - "All security findings have severity rating"
        - "Quality findings include line references"
        - "Test coverage calculation is accurate"
        - "Documentation suggestions are actionable"
      model_role: "worker"
  milestones:
    - checkpoint: "PR received"
      required_evidence:
        - "Webhook payload parsed"
        - "Diff extracted"
        - "Agent fan-out initiated"
    - checkpoint: "Review complete"
      required_evidence:
        - "4 mindset agents responded"
        - "Findings synthesized"
        - "Severity ranked"
        - "Comment posted"
  rollback_triggers:
    - "Agent timeout > 60s"
    - "Token budget exceeded"
    - "Security finding = critical"
```

---

## Structured Handoffs

**Context preservation through explicit handoff schemas:**

```typescript
interface StructuredHandoff {
  from: AgentRole;
  to: AgentRole;
  context: {
    summary: string;
    decisionsMade: Decision[];
    openQuestions: string[];
    artifacts: Artifact[];
  };
  validationContractRef: string;
  timestamp: Date;
}
```

### Benefits
- Prompt caching across role transitions (50-80% token reduction)
- No unbounded context windows required
- Audit trail of decision provenance
- Enable multi-day mission execution

### DeckerGUI Implementation
```typescript
// CaaS Context Bundle as structured handoff
const handoff: StructuredHandoff = {
  from: 'worker',
  to: 'validator',
  context: {
    summary: 'Implemented PR review agent with 4 mindset agents',
    decisionsMade: [
      { decision: 'Used fan-out/fan-in pattern', rationale: 'Parallel execution' },
      { decision: 'Added event deduplication', rationale: 'Idempotent processing' }
    ],
    openQuestions: ['Should we add caching for PR diffs?', 'What about rate limits?'],
    artifacts: ['coordinator/src/pr-review/agents.ts', 'docs/MULTI_AGENT_REVIEW_CORPUS.md']
  },
  validationContractRef: 'contract-001',
  timestamp: new Date()
};
```

---

## Droid Whispering

**Model selection as engineering skill:**

| Role | Model Characteristics | Example |
|---|---|---|
| Planning | Careful reasoning, slow thinking | Claude 3.5 Sonnet, GPT-4o |
| Implementation | Code fluency, creativity | Codex, Claude 3.5 Haiku |
| Validation | Strict instruction following | Fine-tuned open-weight models |

### Model-Architecture Advantages
1. System improves as models improve
2. No code changes for new model releases
3. Cost optimization through role-specific pricing
4. Open-weight models viable with sufficient scaffolding

### DeckerGUI LLM Routing
```typescript
const modelRouting = {
  orchestrator: { provider: 'bigpickle', model: 'bigpickle-1' },
  worker: { provider: 'anthropic', model: 'claude-3-5-sonnet' },
  validator: { provider: 'bigpickle', model: 'bigpickle-gate' }
};
```

---

## Mission Control

**Asynchronous monitoring interface:**

### Dashboard Components
1. **Worker Status** — Active, idle, blocked
2. **Progress** — Features completed / total
3. **Budget Burn** — Tokens used / allocated
4. **Handoff Timeline** — Context transfers
5. **Validator Discoveries** — Findings by severity
6. **Mission ETA** — Estimated completion time

### DeckerGUI Mapping
- Enterprise Dashboard (port 3010) → Mission Control UI
- KPI Tokenizer (port 3004) → Budget tracking
- Coordinator SSE → Real-time updates

---

## Cost Management

**Prompt caching strategies for multi-day missions:**
1. Structured handoffs enable cache hits across role transitions
2. Role-specific context windows (orchestrator: full, worker: relevant, validator: focused)
3. Token budget per feature with graceful degradation
4. Checkpointing to avoid redundant work

---

## Implementation Checklist

### Phase 1: Validation Contract API
- [ ] Define contract schema (TypeScript)
- [ ] Create contract storage (JSON/DB)
- [ ] Add contract validation endpoint
- [ ] Implement contract versioning

### Phase 2: Worker Specialization
- [ ] Role-specific model routing
- [ ] Context window optimization
- [ ] Token budget per feature
- [ ] Graceful degradation on budget exceeded

### Phase 3: Structured Handoffs
- [ ] Handoff schema validation
- [ ] Prompt caching integration
- [ ] Audit trail logging
- [ ] Context compression for long missions

### Phase 4: Mission Control UI
- [ ] Real-time worker status
- [ ] Progress visualization
- [ ] Budget burn charts
- [ ] Handoff timeline

---

## DeckerGUI Integration Points

### Existing Components
- **Orchestrator:** Coordinator Hub (port 3011)
- **Workers:** Agent Server (port 3005)
- **Validator:** Synthesizer Agent
- **Event Spine:** Coordinator SSE
- **Context Bundles:** CaaS Federation
- **Token Budget:** KPI Tokenizer (port 3004)

### Components to Build
1. **Validation Contract API** — Formal contract definition interface
2. **Worker Specialization** — Role-specific model routing
3. **Handoff Schema** — Explicit context transfer format
4. **Mission Control UI** — Real-time worker status visualization
5. **Budget Enforcement** — Token budget per feature with rollback

---

## References

1. "The Multi-Agent Architecture That Actually Ships — Luke Alvoeiro, Factory" (AI Engineer, May 2026)
2. Factory Missions Framework Documentation (factory.ai)
3. Droid Whispering: Model Selection for Multi-Agent Systems (AI Engineer Blog, Jun 2026)
4. "System Design for AI Agents — Building a Multi-Agent PR Reviewer" (AI Native Engineering, Aug 2026)
5. Agent Native Engineering Field Guide (agentnativeengineering.com)
