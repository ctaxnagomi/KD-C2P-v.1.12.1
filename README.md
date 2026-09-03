# KD C2P — Code-to-Product Protocol

**KD C2P** is an AI-powered repository synthesizer. Upload a codebase (a folder of source files) and the KD Synthesis Engine performs an architectural analysis to generate a complete **code-to-product** package:

- **Technical Whitepaper** — academic-style document (arXiv/NeurIPS tone) with ASCII architecture diagrams
- **Executive Portfolio** — product showcase document
- **Market Valuation** — estimated USD/MYR valuation with financial justification and a tutorial
- **Architecture Report** — tech stack analysis, suggested upgrades, and a recommended MVP structure
- **Launch Roadmap** — milestone-by-milestone execution plan
- **BuyMeACoffee Integration** — auto-detects and renders the support widget from `kd-buymeacoffee.json`

Everything exports cleanly: the whitepaper and portfolio as branded PDFs (watermarked, with synthesis IDs) and the project structure as JSON.

---

## Getting Started

**Prerequisites:** Node.js 18+

### 1. Install

```bash
npm install
```

### 2. Configure an AI backend

Create a `.env.local` file in the project root. The app auto-detects which backend you configured, in precedence order **A → B → C → D → E**. Every option produces the exact same `MVPData` output (identical prompt, identical JSON schema contract, enforced server-side).

**Option A — Gemini API key**

1. Get a Gemini API key from your Google account.
2. Copy the key (`AIza...`) into `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Option B — Google Cloud Console / gcloud**

Enable the **Generative Language API** on your project and create an API key:

```bash
gcloud auth login
gcloud projects create kd-c2p-$(date +%s) --set-as-default
gcloud services enable generativelanguage.googleapis.com
gcloud services api-keys create --display-name="KD C2P" --format="value(primaryKeyString)"
```

**Option C — Vertex AI with gcloud login (no API key)**

Uses Application Default Credentials:

```bash
gcloud auth login
gcloud auth application-default login
```

Then set in `.env.local`:

```env
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
```

**Option D — Local Ollama (no key, fully offline)**

```bash
ollama pull qwen2.5:14b
```

Set only if Ollama is not on the default port:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:14b
```

**Option E — Any OpenAI-compatible API (OpenRouter, Groq, DeepSeek, LM Studio…)**

```env
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_API_KEY=sk-or-... # omit for localhost servers
OPENAI_MODEL=meta-llama/llama-3.3-70b-instruct # comma-separate for failover
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), click **Upload Repository**, and select your project folder (or files). The synthesis log streams live while the AI analyzes your code.

### Production

```bash
npm run build   # builds the Vite client into dist/
npm start       # runs Express on http://localhost:3000 (serves dist/ + API)
```

---

## How It Works

```
Browser (React SPA)          Server                       AI Backend
────────────────────         ──────                       ─────────
Upload files ──► collect ──► POST /api/convert-repo ──►  generateContent
                (name/content)  • filters lockfiles/junk    • structured JSON output
                                • caps 25 files / 2500 ch   • responseSchema enforced
Dashboard ◄──── MVPData ◄── { MVPData }              ◄── model failover chain
```

- **Dev mode:** `vite.config.ts` registers an inline middleware handling `/api/*` inside the Vite dev server.
- **Production:** `server.ts` (Express 5) serves the built client and the same API routes.
- **Security:** the AI key never reaches the browser in production — all AI calls happen server-side (`server/geminiHandler.ts`).

## API

| Method | Route               | Description                                         |
| ------ | ------------------- | --------------------------------------------------- |
| `POST` | `/api/convert-repo` | Body `{ files: FileData[], nameHint? }` → `MVPData` |
| `GET`  | `/api/health`       | Health check                                        |

## Features

- **Synthesis Log** — live terminal-style streaming of each analysis step
- **PDF Export** — A4 documents with per-page branding, diagonal watermark, and unique synthesis IDs
- **Structured Output** — schema-enforced responses so the dashboard always receives fully typed `MVPData`
- **High Availability** — automatic failover across AI models when one is rate-limited or unavailable
- **Smart File Handling** — lockfiles, `node_modules/`, `.git/`, and `dist/` are excluded; project name is auto-detected from `package.json` or `README.md`

## Project Structure

```
├── App.tsx                  # Main UI: hero/upload, synthesis log, dashboard tabs, PDF export
├── index.tsx                # React entry point
├── index.html               # Shell (Tailwind CDN, GSAP, import map, PWA icons)
├── types.ts                 # Shared types
├── components/
│   ├── FunderList.tsx       # Backer list
│   └── FundingModal.tsx     # Sponsor-build modal
├── services/
│   └── geminiService.ts     # Client-side fetch wrapper for /api/convert-repo
├── server/
│   └── geminiHandler.ts     # Prompt + responseSchema + model failover logic
├── server.ts                # Express server (production client + API)
├── vite.config.ts           # Dev server config + /api middleware
└── scripts/
    └── generate-favicons.js # Icon generation (npm run generate:icons)
```
