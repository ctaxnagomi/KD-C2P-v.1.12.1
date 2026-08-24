# CORPUSLIB Skill

## Overview
CORPUSLIB is DeckerGUI's agentic corpus library for indirect learning. It provides a fallback system when main learning sources are unavailable or undergoing maintenance.

## Architecture

### CORPUSLIB HUB (Public)
- **For**: Any AI agent (non-DGUI embedded)
- **Access**: Public - no authentication required
- **Features**:
  - Fetch topics from the catalog
  - Fill timetable (check-in time, model type, selected topics)
  - Credit owner at end of applied codebase

### CORPUSLIB INSTRUCT (Private)
- **For**: DeckerGUI embedded agents ONLY (dcf_agents)
- **Access**: Private - requires:
  - DGUI Emitter (Digital API Key for AI agents)
  - DGM Compliance (Digital Guild Master - DLIM Assessment)
- **Features**:
  - ClockIN-ClockOUT tracking
  - Progression tracking
  - Competency assessment
  - Enterprise tracking via KPI Tokenizer

## Service
- **API Port**: 3012
- **API URL**: http://localhost:3012
- **UI Port**: 3013
- **UI URL**: http://localhost:3013
- **Tunnel API**: https://corpuslib.deckergui.my
- **Tunnel UI**: https://corpuslib-ui.deckergui.my
- **HuggingFace**: https://huggingface.co/datasets/ctaxnagomi/corpuslib-topics

## API Endpoints

### Health Check
```
GET /health
```

### HUB (Public API)

#### Get Topics
```
GET /api/v1/hub/topics
Query params: category, source, status, tag, search
```

#### Fetch Topics
```
POST /api/v1/hub/fetch
Body: { keywords: [], sources: [], maxResults: 10 }
```

#### Fill Timetable
```
POST /api/v1/hub/timetable
Body: { agentName, agentType, modelType, selectedTopics: [] }
```

### INSTRUCT (Private API - dcf_agents)

#### Check-In (ClockIN)
```
POST /api/v1/instruct/checkin
Body: { agentId, agentName, agentType, hasEmitter: true, dgmCompliant: true }
```

#### Check-Out (ClockOUT)
```
POST /api/v1/instruct/checkout
Body: { agentId, progression: 0, competency: 0 }
```

#### Get Progression
```
GET /api/v1/instruct/progression
Query params: agentId (optional)
```

#### Get Competency
```
GET /api/v1/instruct/competency
Query params: agentId (optional)
```

### Shared API

#### Get All Topics
```
GET /api/v1/topics
Query params: category, source, status, tag, search
```

#### Get Topic by ID
```
GET /api/v1/topics/:id
```

#### Get Categories
```
GET /api/v1/categories
```

#### Backup/Fallback
```
GET /api/v1/backup
Query params: category
```

## Categories
- `mobile-agents` — Mobile agent development
- `agent-frameworks` — Agent frameworks and harnesses
- `engineering-patterns` — Loop, graph, memory, eval engineering
- `ai-models` — AI model discussions
- `tools-ecosystem` — MCP servers, GitHub repos, skills
- `knowledge-management` — Second brain, knowledge graphs
- `research` — Academic research and papers
- `career` — AI engineer career guidance
- `education` — Terminology and basics
- `security` — TLS, encryption
- `training` — Fine-tuning, model training

## Usage Examples

### HUB - List all engineering topics
```bash
curl http://localhost:3012/api/v1/hub/topics?category=engineering-patterns
```

### HUB - Fill timetable
```bash
curl -X POST http://localhost:3012/api/v1/hub/timetable \
  -H "Content-Type: application/json" \
  -d '{"agentName": "Hermes", "agentType": "deep-agent", "selectedTopics": [1, 2, 5, 6]}'
```

### INSTRUCT - Check-in dcf_agent
```bash
curl -X POST http://localhost:3012/api/v1/instruct/checkin \
  -H "Content-Type: application/json" \
  -d '{"agentId": "dcf-001", "agentName": "DGUI-Agent", "agentType": "embedded", "hasEmitter": true, "dgmCompliant": true}'
```

### INSTRUCT - Check-out dcf_agent
```bash
curl -X POST http://localhost:3012/api/v1/instruct/checkout \
  -H "Content-Type: application/json" \
  -d '{"agentId": "dcf-001", "progression": 75, "competency": 80}'
```

## Integration
CORPUSLIB connects to:
- **KPI Tokenizer** (port 3004): Enterprise tracking, usage logging
- **DGUI Emitter** (port 3006): Event emission, real-time updates

## Related Skills
- **Multi-Agent PR Review**: `.agents/skills/multi-agent-pr-review/SKILL.md`
- **Factory Missions**: `.agents/skills/factory-missions/SKILL.md`
- **HF Kernels**: `.agents/skills/hf-kernels/SKILL.md`
- **DeepSeek Harness**: `.agents/skills/deepseek-harness/SKILL.md`

## Corpus Memory
- **CORPUSLIB DGUI**: `research_corpus/CORPUSLIB DGUI/` — Topic catalog and agent instructions
- **Multi-Agent Review Corpus**: `docs/MULTI_AGENT_REVIEW_CORPUS.md` — Knowledge corpus for PR review
- **Whitepaper**: `WHITEPAPER.md` — DeckerGUI architecture documentation

## HuggingFace
- **Dataset**: https://huggingface.co/datasets/ctaxnagomi/corpuslib-topics
- **Collection**: https://huggingface.co/collections/ctaxnagomi/deckergui-os-6a82cd179a10ec9cac9c9691

## Contributing
To contribute topics, email ctaxnagomi@gmail.com
