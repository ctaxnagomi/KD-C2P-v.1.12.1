---
name: agent-memory-architecture
description: Complete agent memory architecture. Four memory types (working, episodic, semantic, procedural), vector retrieval, multi-scope memory, graph memory, context compression, and production deployment patterns.
source: https://www.youtube.com/watch?v=aYfZN8t6AQs
author: Mem0 / AI Agent Memory Research
license: MIT
---

# Agent Memory Architecture — Complete Guide

Memory is not a "remember this" field. It is a layered system that makes future agent runs require less repeated context and fewer corrections. This skill covers the complete architecture of persistent agent memory.

## The Memory Problem

A large language model has no persistent state. Every API call is stateless: the model receives context, processes it, returns a response, and retains nothing.

For anything agent-like, this is a fundamental problem:
1. **What happened before?** An agent that books calendar events needs to know what is already scheduled
2. **What does the user prefer?** Repeated instructions waste tokens and frustrate users
3. **What worked last time?** Agents that don't learn from success repeat experimentation
4. **What failed?** Without failure memory, agents repeat the same mistakes

## The Four Memory Types

### 1. Working Memory (Context Window)

**What:** Current conversation state. The active context the model sees.

**Characteristics:**
- Transient — lost when session ends
- Limited by context window size
- Contains current task, recent messages, tool results
- Equivalent to "scratchpad" in human cognition

**Implementation:**
```python
working_memory = {
    "system_prompt": "You are a helpful assistant...",
    "conversation_history": [...],
    "tool_results": [...],
    "current_task": "..."
}
```

### 2. Episodic Memory (What Happened)

**What:** Specific past events, interactions, and experiences.

**Characteristics:**
- Stores sequences of observations and actions
- Captures outcomes of specific interactions
- Snapshots of internal state at given times
- Essential for causal chain analysis

**Storage Patterns:**
- Verbatim for recent window (exact messages)
- Summarized for older episodes (compressed)
- Embedded for similarity search (vectors)

**When to Store:**
- User corrections ("Don't use sudo for Docker")
- Task completions ("Migrated database on 2026-01-15")
- Error conditions ("API rate limit hit at 1000 req/min")
- Key decisions ("Chose PostgreSQL over MySQL for JSONB support")

### 3. Semantic Memory (What Is Known)

**What:** General knowledge, facts, concepts, and world knowledge.

**Characteristics:**
- Abstract and independent of specific experiences
- Facts about users, projects, environments
- Preferences, conventions, and rules
- World knowledge and domain expertise

**Storage Patterns:**
- Fact extraction from conversations
- Knowledge base integration
- Entity-relationship graphs
- Structured metadata

**Examples:**
- "User prefers TypeScript over JavaScript"
- "Project uses tabs, 120-char line width"
- "Server runs Debian 12 with PostgreSQL 16"
- "API key rotation happens monthly"

### 4. Procedural Memory (How Things Are Done)

**What:** Learned workflows, tool-usage patterns, and refined processes.

**Characteristics:**
- How the agent does things, not what it knows
- Tool-usage patterns and habits
- Decision protocols and workflows
- Muscle memory for repeated tasks

**Storage Patterns:**
- Workflow sequences with success/failure markers
- Tool-usage frequency and context patterns
- Decision trees with outcomes
- Playbooks for common scenarios

**Examples:**
- "When deploying, run tests first, then build, then push"
- "For PR reviews, check lint, then types, then tests, then logic"
- "When debugging, start with logs, then traces, then reproduce"

## Memory Architecture

### The Layered Stack

```
┌─────────────────────────────────────────────┐
│           Context Window (Working)          │
│  Current conversation + retrieved memories  │
└─────────────────┬───────────────────────────┘
                  │ Retrieval
┌─────────────────▼───────────────────────────┐
│           Retrieval Pipeline                │
│  Semantic + Keyword + Entity Matching       │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│           Vector Store                      │
│  Embeddings + Metadata + Timestamps         │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│           Memory Extraction                 │
│  Facts + Events + Workflows + Preferences   │
└─────────────────────────────────────────────┘
```

### Multi-Scope Memory

Every memory write is tagged with identity scopes:

| Scope | Purpose | Persistence |
|-------|---------|-------------|
| `user_id` | User-specific facts | Cross-session |
| `agent_id` | Agent-specific behavior | Per-agent instance |
| `run_id` / `session_id` | Conversation-specific | Per-session |
| `app_id` / `org_id` | Shared context | Organization-wide |

**Composition:** A query can scope to a specific user within a specific run, or retrieve all memories for a user across all runs. The retrieval pipeline merges and ranks automatically.

**Example Scopes:**
```python
# User preference (persists across all sessions)
memory.add("User prefers dark mode", user_id="user-123")

# Session-specific (lost after session)
memory.add("Current task: migrate database", session_id="sess-456")

# Agent-specific (this agent's learnings)
memory.add("Docker commands don't need sudo", agent_id="agent-789")

# Organization-wide (shared knowledge)
memory.add("Company uses AWS us-east-1", org_id="org-012")
```

## Retrieval Strategies

### 1. Vector Similarity Search

**How:** Embed current context, find top-K most similar memories.

**Pros:**
- Fast and approximate
- Works well for unstructured memory
- Captures semantic meaning

**Cons:**
- Quality depends on embedding model
- Requires chunking strategy
- May miss exact keyword matches

**Implementation:**
```python
query_embedding = embed(current_context)
results = vector_store.search(
    query_embedding,
    top_k=10,
    filter={"user_id": "user-123"}
)
```

### 2. Keyword Matching (BM25)

**How:** Traditional text search with term frequency scoring.

**Pros:**
- Exact keyword matching
- No embedding model needed
- Fast for precise queries

**Cons:**
- Misses semantic similarity
- Requires exact term overlap
- No understanding of synonyms

### 3. Entity Matching

**How:** Extract entities from query, match against stored entities.

**Pros:**
- Precise for entity-centric queries
- Works with structured data
- Good for multi-hop reasoning

**Cons:**
- Requires entity extraction
- Limited to known entity types
- Doesn't capture relationships well

### 4. Multi-Signal Retrieval (Best Practice)

**How:** Run all three in parallel, normalize scores, fuse results.

**Pros:**
- Combines strengths of all approaches
- More robust than any single method
- Handles diverse query types

**Implementation:**
```python
# Three parallel scoring passes
semantic_score = cosine_similarity(query_emb, memory_emb)
keyword_score = bm25_score(query_tokens, memory_tokens)
entity_score = entity_match_score(query_entities, memory_entities)

# Normalize and fuse
final_score = (
    0.5 * normalize(semantic_score) +
    0.3 * normalize(keyword_score) +
    0.2 * normalize(entity_score)
)
```

## Context Compression

Long-running agents hit context limits. Compression preserves essential state while reducing tokens.

### Compression Triggers

1. **Proactive:** Before every turn, check character count vs. threshold
2. **Reactive:** If model returns context-overflow error, compress immediately
3. **Configurable threshold:** Default ~50% of context window

### Structured Compression Output

When compression triggers, produce structured summary:

| Section | Content |
|---------|---------|
| **Goal** | What the conversation is trying to achieve |
| **Constraints** | Limitations and requirements |
| **Completed Actions** | What has already been done |
| **Active State** | Current status and position |
| **Key Decisions** | Important choices made |
| **Resolved Questions** | Questions that have been answered |
| **Relevant Files** | Files mentioned or modified |
| **Critical Context** | Essential information to preserve |
| **Previous Summaries** | Earlier compressed summaries |
| **Next Turns** | What still needs to be incorporated |

### Compression Strategy

```python
def compress_conversation(history, threshold=0.5):
    current_tokens = count_tokens(history)
    max_tokens = get_context_window()
    
    if current_tokens > max_tokens * threshold:
        # Keep recent messages verbatim
        recent = history[-10:]  # Last 10 messages
        
        # Summarize older messages
        older = history[:-10]
        summary = llm.summarize(older, structure=COMPRESSION_TEMPLATE)
        
        # Reconstruct context
        return [summary] + recent
    
    return history
```

## Graph Memory

### Vector vs. Graph

| Aspect | Vector Memory | Graph Memory |
|--------|---------------|--------------|
| **Retrieval** | Semantically similar | Entity-relationship based |
| **Strength** | Semantic understanding | Structural relationships |
| **Use Case** | "Find similar past conversations" | "What entities relate to this?" |
| **Storage** | Embeddings in vector DB | Nodes and edges in graph DB |

### Entity Linking

Modern memory systems extract entities during `add()` and store them in a parallel collection:

```python
# During add()
entities = extract_entities(memory_text)
entity_store.add(entities, memory_id=memory.id)

# During search()
query_entities = extract_entities(query)
entity_matches = entity_store.search(query_entities)

# Boost memories with matching entities
for memory in results:
    memory.score += entity_boost(memory, entity_matches)
```

### When to Use Graph Memory

- Multi-hop reasoning ("What did User A say about Project B?")
- Entity-centric queries ("Show me everything about PostgreSQL")
- Relationship tracking ("Which agents worked on this task?")
- NOT for simple fact retrieval or preference storage

## Production Requirements

### 1. Async Mode (Default)

Memory writes must not block response pipeline:

```python
# Async write (non-blocking)
memory.add_async(
    "User prefers TypeScript",
    user_id="user-123",
    callback=on_memory_saved
)

# Response returns immediately
return response
```

### 2. Reranking

Vector similarity returns right candidates, often wrong order:

```python
# Initial retrieval (fast, approximate)
candidates = vector_store.search(query, top_k=20)

# Reranking (slow, precise)
reranked = reranker.rerank(
    query=query,
    documents=candidates,
    top_k=5
)
```

### 3. Metadata Filtering

Structured attributes for scoped queries:

```python
# Store with metadata
memory.add(
    "Deployed to production",
    metadata={
        "environment": "production",
        "service": "api-gateway",
        "region": "us-east-1"
    }
)

# Filter at retrieval
results = memory.search(
    "deployment history",
    filter={"environment": "production", "service": "api-gateway"}
)
```

### 4. Timestamp on Update

Accurate temporal ordering for recency weighting:

```python
memory.add(
    "Updated database schema",
    metadata={
        "created_at": "2026-01-15T10:30:00Z",
        "updated_at": "2026-01-15T10:30:00Z"
    }
)
```

### 5. Memory Depth Configuration

Project-level settings for inclusion/exclusion:

```yaml
memory:
  inclusion_prompts:
    - "Store user preferences and corrections"
    - "Store workflow completions and failures"
  exclusion_prompts:
    - "Do not store trivial greetings"
    - "Do not store intermediate reasoning"
  depth: "standard"  # minimal | standard | deep
```

### 6. Structured Exceptions

Error codes and suggested actions:

```python
class MemoryError:
    code: str  # "STORAGE_FULL", "EXTRACTION_FAILED"
    message: str
    suggested_action: str  # "Increase storage quota"
    context: dict  # {"current_usage": "95%", "quota": "10GB"}
```

## Benchmarks

### LoCoMo (1,540 questions)

Four categories testing memory recall:
- **Single-hop:** Direct fact retrieval
- **Multi-hop:** Reasoning across multiple memories
- **Open-domain:** Broad knowledge queries
- **Temporal:** Time-based reasoning

### LongMemEval (500 questions)

Six categories for comprehensive evaluation:
- Single-session user recall
- Single-session assistant recall
- Single-session preference recall
- Knowledge update
- Temporal reasoning
- Multi-session recall

### BEAM (1M and 10M tokens)

Production-scale testing:
- Preference following
- Instruction following
- Information extraction
- Knowledge update
- Multi-session reasoning
- Summarization
- Temporal reasoning
- Event ordering
- Abstention
- Contradiction resolution

### Benchmark Results (2026)

| System | LoCoMo | LongMemEval | Tokens/Query |
|--------|--------|-------------|--------------|
| Mem0 | 92.5 | 94.4 | ~6,900 |
| Full Context | 78.2 | 81.3 | ~26,000 |
| RAG Baseline | 71.4 | 73.8 | ~8,500 |

## Open Problems

### 1. Temporal Abstraction

BEAM 1M to 10M shows ~25% performance loss as context scales 10x. Temporal queries are hardest category.

**Current approach:** Timestamp-based recency weighting
**Needed:** Understanding of time as a dimension, not just a metadata field

### 2. Cross-Session Structure

A user who moves from New York to San Francisco should have that transition understood, not just the new city stored.

**Current approach:** Replace old facts with new ones
**Needed:** Treat change as evolution, not replacement

### 3. Memory Staleness

A highly-retrieved memory about a user's employer is accurate until they change jobs, then becomes confidently wrong.

**Current approach:** Decay based on retrieval frequency
**Needed:** Active staleness detection and correction

### 4. Cross-Session Identity

Anonymous sessions, multi-device users, and mixed auth flows break the stable `user_id` assumption.

**Current approach:** Assume stable identity
**Needed:** Identity resolution across sessions and devices

### 5. Privacy and Consent

Who can inspect stored memories? How long are they retained? How does a user delete them?

**Current approach:** Application-layer decisions
**Needed:** Built-in privacy architecture with consent management

## DeckerGUI Integration

### Memory Layers Mapping

| Agent Memory Layer | DeckerGUI Equivalent |
|-------------------|---------------------|
| Working Memory | Big Pickle context window |
| Episodic Memory | Emitter event logs |
| Semantic Memory | CORPUSLIB instruct files |
| Procedural Memory | DGUI skills and workflows |

### Multi-Scope Memory in DeckerGUI

| Scope | DeckerGUI Implementation |
|-------|---------------------------|
| `user_id` | DCF-agent identity (agent-001, agent-002) |
| `agent_id` | Agent category (browser, terminal) |
| `session_id` | Timetable activity session |
| `app_id` | Organization (ctaxnagomi, wanmo) |

### Retrieval Strategy

```python
# DeckerGUI multi-signal retrieval
def dgui_retrieve_memory(query, agent_id):
    # Semantic: CORPUSLIB topic similarity
    semantic_results = corpuslib.search(query)
    
    # Keyword: Emitter event keyword match
    keyword_results = emitter.search_keywords(query)
    
    # Entity: DCF-agent entity extraction
    entity_results = extract_agent_entities(query)
    
    # Fuse and rank
    return fuse_results(
        semantic_results,
        keyword_results,
        entity_results,
        agent_scope=agent_id
    )
```

### Context Compression

```python
# DeckerGUI compression
def dgui_compress_context(history, agent_id):
    # Check token count
    if count_tokens(history) > MAX_CONTEXT * 0.5:
        # Keep recent timetable activities
        recent = history[-5:]
        
        # Summarize older interactions
        older = history[:-5]
        summary = summarize_with_corpuslib(older)
        
        # Preserve KPI metrics
        kpi_summary = extract_kpi_metrics(older)
        
        return [summary, kpi_summary] + recent
    
    return history
```

### Production Checklist

- [ ] Async memory writes (non-blocking response)
- [ ] Multi-signal retrieval (semantic + keyword + entity)
- [ ] Reranking for precision
- [ ] Metadata filtering by agent/session
- [ ] Timestamp tracking on all memories
- [ ] Structured compression at 50% threshold
- [ ] Privacy scoping per agent identity
- [ ] Staleness detection for high-retrieval memories

## References

- **Video:** [Agent Memory EXPLAINED](https://www.youtube.com/watch?v=aYfZN8t6AQs)
- **Research:** [Mem0: Building Production-Ready AI Agents with Scalable Long-Term Memory](https://arxiv.org/abs/2504.19413)
- **Benchmarks:** [github.com/mem0ai/memory-benchmarks](https://github.com/mem0ai/memory-benchmarks)
- **Platform:** [mem0.ai](https://mem0.ai)
