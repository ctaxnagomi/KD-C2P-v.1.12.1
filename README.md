# KD C2P — Code-to-Product Protocol v1.12.1

**KD C2P** is an AI-powered repository synthesizer. Upload any codebase (a folder of source files), and the KD Synthesis Engine — backed by Google **Gemini** — performs an architectural analysis and generates a complete "code-to-product" package:

- 📄 **Technical Whitepaper** — 14-section academic-style document (arXiv/NeurIPS tone, wikitext headers, ASCII architecture diagrams)
- 💼 **Executive Portfolio** — product showcase document
- 💰 **Market Valuation** — estimated USD/MYR valuation with financial justification and a valuation tutorial guide
- 🧱 **Architecture Report** — core tech stack in use, suggested upgrades, and a suggested MVP folder structure
- 🗺️ **Launch Roadmap** — milestone-by-milestone execution plan
- ☕ **BuyMeACoffee Integration** — if the upload contains a `kd-buymeacoffee.json`, its support widget is automatically detected and rendered

Everything exportable: whitepaper/portfolio as branded PDFs (watermarked, with synthesis IDs) and the project structure as JSON.

---

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root containing your Gemini API key:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   Pick **any one** backend below — every option produces the exact same `MVPData` output (identical prompt, identical JSON schema contract, enforced server-side in `server/geminiHandler.ts`). The app auto-detects which one you configured, in precedence order **A → B → C → D → E**.

   <details open>
   <summary><b>Option A — Gemini API key</b> (Google AI Studio, fastest)</summary>

   1. Sign in at [aistudio.google.com](https://aistudio.google.com/prompts/new_chat) with any Google account.
   2. Open [**Get API key** → *Create API key*](https://aistudio.google.com/apikey).
   3. Copy the generated key (`AIza...`) into `.env.local`. No billing or cloud setup required.
   </details>

   <details>
   <summary><b>Option B — Google Cloud Console / gcloud CLI (Gemini key)</b></summary>

   Via Console:
   1. At [console.cloud.google.com](https://console.cloud.google.com), create (or select) a project.
   2. Enable the **Generative Language API**: [direct link](https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com).
   3. Go to [**APIs & Services → Credentials**](https://console.cloud.google.com/apis/credentials) → **Create credentials → API key**, copy it into `.env.local`.

   Or via `gcloud` CLI (same result, fully scripted):

   ```bash
   gcloud auth login
   gcloud projects create kd-c2p-$(date +%s) --set-as-default   # or reuse an existing project id
   gcloud services enable generativelanguage.googleapis.com
   gcloud services api-keys create --display-name="KD C2P" --format="value(primaryKeyString)"
   ```

   The last command prints the raw key — paste it straight into `.env.local`.

   > Restrict the key to the Generative Language API in Credentials settings for tighter security.
   </details>

   <details>
   <summary><b>Option C — Vertex AI with gcloud login — NO API KEY</b></summary>

   Uses Application Default Credentials instead of a key; same Gemini models and schema enforcement:

   ```bash
   gcloud auth login
   gcloud auth application-default login          # this is the credential, not a key
   ```

   Then put only these lines in `.env.local`:

   ```env
   GOOGLE_CLOUD_PROJECT=your-project-id
   GOOGLE_CLOUD_LOCATION=us-central1
   ```

   For CI/servers without interactive login, attach a service account JSON instead:
   `GOOGLE_APPLICATION_CREDENTIALS=/path/to/sa.json`.
   </details>

   <details>
   <summary><b>Option D — Local Ollama — NO KEY, fully offline</b></summary>

   ```bash
   # install from https://ollama.com, then:
   ollama pull qwen2.5:14b        # any model that follows JSON schemas works
   ```
   Nothing else to configure if Ollama runs on its default port; otherwise set in `.env.local`:

   ```env
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=qwen2.5:14b
   ```

   Structured output is enforced via Ollama's native `format: <json-schema>`, so results match the cloud backends.
   </details>

   <details>
   <summary><b>Option E — Any OpenAI-compatible API</b> (OpenRouter, Groq, DeepSeek, LM Studio…)</summary>

   ```env
   OPENAI_BASE_URL=https://openrouter.ai/api/v1    # or https://api.groq.com/openai/v1 etc.
   OPENAI_API_KEY=sk-or-...                        # omit for localhost servers (LM Studio)
   OPENAI_MODEL=meta-llama/llama-3.3-70b-instruct  # comma-separate for failover: modelA,modelB
   ```

   Requests try strict `json_schema` mode first and fall back to `json_object`, so virtually every OpenAI-compatible provider yields the same validated `MVPData`.
   </details>

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000), click **Upload Repository**, and select your project folder (or files). The synthesis log streams live while Gemini analyzes the code.

### Production Mode

```bash
npm run build   # builds the Vite client into dist/
npm start       # runs Express on http://localhost:3000 (serves dist/ + API)
```

---

## How It Works

```
Browser (React SPA)                Server                          Google AI
────────────────────               ──────                          ─────────
Upload files ──► collect text  ─► POST /api/convert-repo  ─►  Gemini generateContent
                 (name/content)    • filters lockfiles/junk        • structured JSON output
                                   • caps 25 files / 2500 chars    • responseSchema enforced
Dashboard ◄──── MVPData JSON   ◄── { MVPData }             ◄──  model failover chain:
• Overview / Valuation                                             gemini-3.6-flash →
• Architecture                                                     gemini-3.1-flash-lite →
• Funding & Guide                                                  gemini-3.7-flash
• Collaborators
```

- **Dev mode**: `vite.config.ts` registers an inline middleware that handles `/api/*` directly inside the Vite dev server.
- **Production**: `server.ts` (Express 5) serves both the built client and the same API routes.
- The Gemini key never reaches the browser in production — all AI calls happen server-side (`server/geminiHandler.ts`).

## API

| Method | Route                 | Description                                                        |
| ------ | --------------------- | ------------------------------------------------------------------ |
| `POST` | `/api/convert-repo`   | Body: `{ files: FileData[], nameHint?: string }` → `MVPData` JSON |
| `GET`  | `/api/health`         | Health check                                                       |

## Project Structure

```
├── App.tsx                  # Main UI: hero/upload, synthesis log, dashboard tabs, PDF export
├── index.tsx                # React entry point
├── index.html               # Shell w/ Tailwind CDN, GSAP, import map, PWA icons
├── types.ts                 # Shared types: FileData, MVPData, Funder, ...
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

## Key Features Detail

- **Synthesis Log** — live terminal-style streaming of each analysis step while converting.
- **PDF Export** — jsPDF-rendered A4 documents with per-page branding, diagonal watermark, and unique `SYNTH-ID` stamps.
- **Structured Output** — Gemini responses are schema-enforced (`responseSchema`), so the dashboard always receives a fully typed `MVPData` object.
- **High Availability** — automatic failover across multiple Gemini models when one is rate-limited or unavailable.
- **Smart File Handling** — lockfiles, `node_modules/`, `.git/`, and `dist/` are excluded before analysis; project name is auto-detected from `package.json` or `README.md`.
