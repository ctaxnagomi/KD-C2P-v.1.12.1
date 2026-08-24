Convert any repository into a structured MVP showcase. Complete with tech intelligence, funding gateways, and launch roadmaps.

Disclaimer: This is very much last year project so need to review and remove any potential cve's before deploying but the links are for visual but the execution tools are non-functional at the moment until fix. 

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
