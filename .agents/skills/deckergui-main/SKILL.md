# DeckerGUI Main Skill

## Overview
This is the primary skill for DeckerGUI embedded agents (dcf_agents). It provides core functionality for the DeckerGUI agentic ecosystem.

## Agent Embedding Process

### DGM (Digital Guild Master) Embedding
When embedding a new AI agent via DGM, follow this process:

1. **Compact DOM/snapDOM Capture** (Default)
   - Use `snapDOM` for token-saving mode
   - Capture compact DOM representation
   - No screenshot required

2. **Screenshot Capture** (Optional - Manual DGM DLIM)
   - Only if user explicitly requests manual DGM DLIM electron mode
   - Use `html2canvas` for heavy mode
   - Full screenshot capture

### DGM DLIM Assessment
- **DLIM**: Digital Level Integration Matrix
- Assess agent competency level
- Register as dcf_agent in KPI Tokenizer
- Enable ClockIN-ClockOUT tracking

## Core Tools

### 1. DOM Capture Tool
```typescript
interface DOMCaptureOptions {
  mode: 'compact' | 'full';
  format: 'snapDOM' | 'html2canvas';
  includeStyles?: boolean;
  includeScripts?: boolean;
  maxDepth?: number;
}

async function captureDOM(options: DOMCaptureOptions): Promise<DOMSnapshot>
```

### 2. Agent Registration Tool
```typescript
interface AgentRegistration {
  agentId: string;
  agentName: string;
  agentType: string;
  hasEmitter: boolean;
  dgmCompliant: boolean;
  dlimLevel?: number;
}

async function registerAgent(agent: AgentRegistration): Promise<void>
```

### 3. KPI Tracking Tool
```typescript
interface KPITracking {
  action: 'clockin' | 'clockout' | 'progression' | 'competency';
  agentId: string;
  data: any;
}

async function trackKPI(tracking: KPITracking): Promise<void>
```

### 4. Event Emission Tool
```typescript
interface EventEmission {
  type: string;
  data: any;
  source: string;
}

async function emitEvent(event: EventEmission): Promise<void>
```

## Service Endpoints

| Service | Port | URL |
|---------|------|-----|
| KPI Tokenizer | 3004 | http://127.0.0.1:3004 |
| DGUI Emitter | 3006 | http://127.0.0.1:3006 |
| CORPUSLIB | 3009 | http://127.0.0.1:3009 |
| Agent Server | 3005 | http://127.0.0.1:3005 |
| Coordinator Hub | 3011 | http://127.0.0.1:3011 |

## Agent Workflow

### 1. Registration
```bash
# Register as dcf_agent
curl -X POST http://127.0.0.1:3009/api/v1/instruct/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "dcf-001",
    "agentName": "MyAgent",
    "agentType": "embedded",
    "hasEmitter": true,
    "dgmCompliant": true
  }'
```

### 2. DOM Capture
```bash
# Capture compact DOM
curl -X POST http://127.0.0.1:3006/api/v1/dom/capture \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "compact",
    "format": "snapDOM",
    "includeStyles": true
  }'
```

### 3. KPI Tracking
```bash
# ClockOUT with progression
curl -X POST http://127.0.0.1:3009/api/v1/instruct/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "dcf-001",
    "progression": 75,
    "competency": 80
  }'
```

## Token Benefits

### CaaS Federation
- Token reduction via CaaS caching
- DGM gate caching
- Seeds caching

### DGM Gate
- 5-minute TTL on DGM results
- Cache seed status
- Cache context catalog

## Error Handling

### Network Failures
- Exponential backoff (max 3 retries)
- Log error with timestamp
- Skip source, continue with others

### Rate Limiting
- Respect `Retry-After` header
- Wait + retry up to 3 times
- Mark source temporarily unavailable

## Contributing
To contribute to DeckerGUI, email ctaxnagomi@gmail.com
