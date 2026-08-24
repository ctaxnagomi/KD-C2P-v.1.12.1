# Skill: Multi-Agent PR Review System

> Load this skill when building, extending, or operating a multi-agent code review system within DeckerGUI. Covers the four-mindset agent architecture, fan-out/fan-in orchestration, RAG grounding, event spine audit trails, and observability.

---

## Quick Reference

**Pattern**: Parallel fan-out to specialized agents → synthesizer fan-in → unified review post
**Agents**: Security | Quality | Testing | Documentation
**Memory**: Semantic (vector) | Episodic (relational) | Procedural (rules)
**Orchestration**: LangGraph (agent logic) + Coordinator Hub (execution)
**Grounding**: RAG via CaaS `/context/*` endpoints
**Observability**: KPI Tokenizer + Audit Trail (JSONL)

---

## 1. Agent Definitions

### 1.1 Security Agent
```
Role: Identify security vulnerabilities
Focus:
  - SQL injection, XSS, command injection
  - Authentication/authorization bypass
  - Hardcoded secrets (API keys, passwords, tokens)
  - Insecure dependencies
  - Data exposure risks
  - CSRF, SSRF, path traversal
System Prompt:
  "You are a security engineer performing code review.
   Check for OWASP Top 10 vulnerabilities.
   Return severity: critical/high/medium/low.
   Return empty array if nothing found.
   Do not flag placeholder values like YOUR_API_KEY."
```

### 1.2 Quality Agent
```
Role: Assess code quality and maintainability
Focus:
  - Code organization and readability
  - Error handling patterns
  - Naming conventions
  - SOLID principle adherence
  - Dead code and duplication
  - Performance anti-patterns
System Prompt:
  "You are a senior code quality reviewer.
   Check for maintainability, readability, and best practices.
   Do not flag issues caught by linters (ESLint/Biome).
   Return severity: high/medium/low.
   Return empty array if nothing found."
```

### 1.3 Testing Agent
```
Role: Evaluate test coverage and quality
Focus:
  - Missing tests for changed code
  - Edge cases not covered
  - Test quality (not just presence)
  - Integration vs unit test balance
  - Mock appropriateness
System Prompt:
  "You are a test engineer reviewing test coverage.
   Assume basic coverage exists unless diff shows gaps.
   Do not suggest tests for test files.
   Return severity: high/medium/low.
   Return empty array if nothing found."
```

### 1.4 Documentation Agent
```
Role: Verify documentation alignment
Focus:
  - API documentation accuracy
  - README updates
  - Changelog entries
  - Migration guides for breaking changes
  - Inline docs for complex logic
System Prompt:
  "You are a documentation reviewer.
   Verify code matches documented behavior.
   Check for missing changelog entries.
   Return severity: medium/low.
   Return empty array if nothing found."
```

---

## 2. Orchestration Flow

### 2.1 Ingress
```
1. Receive GitHub webhook (PR opened/updated)
2. Verify HMAC-SHA256 signature
3. Extract event ID → check dedup store
4. Fetch PR diff via GitHub API
5. Parse diff into file-level chunks
6. Store in processing queue
```

### 2.2 Fan-Out
```
Coordinator receives PR from queue
  → Spawn Security Agent (parallel)
  → Spawn Quality Agent (parallel)
  → Spawn Testing Agent (parallel)
  → Spawn Documentation Agent (parallel)
Each agent:
  1. Retrieves relevant context from CaaS
  2. Performs specialized analysis
  3. Returns structured findings array
```

### 2.3 Fan-In (Synthesis)
```
Synthesizer receives all agent findings
  → Deduplicate (same file + line = merge)
  → Severity ranking (critical > high > medium > low)
  → Cross-reference (security + quality overlap = escalate)
  → Generate unified review comment
  → Post to GitHub PR via API
  → Log to audit trail
```

---

## 3. DeckerGUI Integration Points

### 3.1 CaaS Context Retrieval
```typescript
// Fetch code context for agent
const context = await fetch('https://hub.deckergui.my/context/bundle', {
  headers: { 'X-API-Key': agentKey }
});
// Returns: { chunks: [...], embeddings: [...], metadata: {...} }
```

### 3.2 Audit Trail Logging
```typescript
// Log every agent decision
const entry = {
  ts: Date.now(),
  pr: prNumber,
  agent: 'security',
  findings: [...],
  tokens: { input: 12400, output: 3200 },
  latency: 2340,
  cost: 0.003
};
// Append to JSONL audit trail
```

### 3.3 KPI Tokenizer Integration
```typescript
// Track token consumption per review
await kpi.record({
  feature: 'pr-review',
  agent: agentName,
  tokens: totalTokens,
  savings: calculatedSavings // vs baseline
});
```

### 3.4 Digital API Key Scoping
```typescript
// Each review agent gets scoped key
const key = await emitter.mintKey({
  scope: ['AGENT.READ', 'CONTEXT.READ'],
  quota: 5000, // tokens per review
  expiresIn: '1h'
});
```

### 3.5 Coordinator SSE Fan-Out
```typescript
// Broadcast review events to all subscribers
coordinator.emit('review-start', { pr: prNumber, agents: 4 });
// Each agent emits progress
coordinator.emit('agent-complete', { agent: 'security', findings: 3 });
// Synthesis complete
coordinator.emit('review-complete', { pr: prNumber, totalFindings: 12 });
```

---

## 4. Memory Architecture

### 4.1 Semantic Memory (RAG)
```
Storage: PGVector (or CaaS bundle endpoint)
Content: Code chunks with embeddings
Query: "Find similar code patterns to [diff snippet]"
Top-k: 5 most relevant chunks
Use: Ground LLM in actual codebase context
```

### 4.2 Episodic Memory (Audit)
```
Storage: JSONL audit trail (append-only)
Content: Past reviews, outcomes, findings
Query: "What was said about this file in past reviews?"
Use: Avoid repeating advice, track improvement
TTL: Never expires (historical record)
```

### 4.3 Procedural Memory (Rules)
```
Storage: Configuration files
Content: Coding conventions, style guides, policies
Query: "What are the error handling rules for this codebase?"
Use: Enforce standards without LLM reasoning
Updates: Version-controlled, PR-reviewed
```

---

## 5. Fault Tolerance

### 5.1 Agent Failure Handling
```
If agent fails:
  1. Retry with exponential backoff (max 3 attempts)
  2. If still failing → skip agent, alert operator
  3. Continue with remaining agents
  4. Post partial review with "Security agent unavailable" note
```

### 5.2 Idempotent Processing
```
Every webhook processed exactly once:
  - Event ID stored in dedup cache
  - If duplicate → return 200 OK (already processed)
  - If new → process and store event ID
  - Cache TTL: 24 hours
```

### 5.3 Circuit Breaker
```
Track per-agent failure rate:
  - If 3+ consecutive failures → open circuit
  - Circuit open → skip agent for 5 minutes
  - After 5 minutes → half-open (try 1 request)
  - If success → close circuit
  - If failure → reopen circuit
```

---

## 6. Evaluation Framework

### 6.1 Metrics to Track
| Metric | Target | Measurement |
|--------|--------|-------------|
| False positive rate | < 5% | Manual review of dismissed findings |
| Bug escape rate | -35% | Post-merge bug reports |
| Review cycle time | -50% | Time from PR open to merge |
| Token cost per review | < $0.15 | KPI Tokenizer tracking |
| Agent latency | < 3 min total | Event spine timing |
| Coverage gap detection | > 90% | Test agent accuracy |

### 6.2 Feedback Loop
```
1. Human reviewer dismisses finding → log as false positive
2. False positive patterns → update system prompts
3. Monthly review → tune agent prompts
4. Quarterly → re-evaluate model selection
```

---

## 7. DeckerGUI-Specific Enhancements

### 7.1 DGM Gate for Review Agents
Each review agent passes through the 3-DGM gate:
1. **DSYNC Memory Reset** — Validate agent memory state
2. **Guard DGM** — Check capability scope (AGENT.READ only)
3. **Supervisor DGM** — Enforce policy (no modifications, read-only)
4. **YoloMoE Seed** — Emit execution seed

### 7.2 Persona Integration
Each mindset agent maps to a Persona guild:
- Security Agent → **Security Guild** (trait: Threat Prevention)
- Quality Agent → **DevOps Guild** (trait: Reliability)
- Testing Agent → **Researcher Guild** (trait: Accuracy)
- Documentation Agent → **Educator Guild** (trait: Knowledge Transfer)

### 7.3 Token Optimization
```
Baseline review: ~80,000 tokens (single LLM pass)
With DeckerGUI optimization:
  - Seeds cache: -30% (reuse previous context)
  - DGM gate: -20% (skip redundant validation)
  - CaaS federation: -15% (shared context across agents)
  - Total savings: ~50% → ~40,000 tokens per review
```

### 7.4 CTAX-Ai Runtime
Use CTAX-Ai for:
- **Browser**: Fetch PR diff, post review comments
- **Terminal**: Run test suites, linting, security scans
- **MCP**: Connect to GitHub API, database, vector store

---

## 8. Implementation Checklist

- [ ] GitHub webhook endpoint in Coordinator Hub
- [ ] HMAC-SHA256 signature verification
- [ ] Event ID deduplication store
- [ ] PR diff extraction and parsing
- [ ] Code chunking pipeline (AST-aware)
- [ ] Vector embedding for code chunks
- [ ] CaaS `/context/bundle` integration
- [ ] 4 mindset agents with system prompts
- [ ] Fan-out orchestration (parallel spawn)
- [ ] Synthesizer agent (fan-in aggregation)
- [ ] Severity ranking and deduplication
- [ ] GitHub PR comment posting
- [ ] Audit trail logging (JSONL)
- [ ] KPI Tokenizer tracking
- [ ] Digital API Key scoping
- [ ] Circuit breaker per agent
- [ ] Dashboard for HITL checkpoints
- [ ] Evaluation metrics collection
- [ ] False positive feedback loop

---

## References

- Corpus: `docs/MULTI_AGENT_REVIEW_CORPUS.md`
- ANE Field Guide: https://agentnativeengineering.com/guide/
- Zscaler PRISM: https://www.getdbt.com/blog/how-zscaler-cut-pr-review-time-dbt-context-multi-agent-ai
- DeckerGUI Whitepaper: `WHITEPAPER.md` (Section 14: CTAX-Ai)
