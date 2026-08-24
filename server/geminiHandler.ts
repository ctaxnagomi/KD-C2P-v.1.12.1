import { GoogleGenAI, Type } from "@google/genai";
import { FileData, MVPData } from "../types";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ---------------------------------------------------------------------------
// Shared synthesis building blocks (provider-agnostic)
// ---------------------------------------------------------------------------

export const MVP_JSON_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING, description: 'Clear, modern name of the project' },
    valueProposition: { type: Type.STRING, description: 'Core value proposition statement' },
    tagline: { type: Type.STRING, description: 'Snappy professional tagline' },
    techStack: {
      type: Type.OBJECT,
      properties: {
        used: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ['name', 'description'],
          },
        },
        suggested: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              benefit: { type: Type.STRING },
            },
            required: ['name', 'description', 'benefit'],
          },
        },
      },
      required: ['used', 'suggested'],
    },
    intelligenceReport: { type: Type.STRING, description: 'Deep technical synthesis report' },
    roadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          milestone: { type: Type.STRING },
          description: { type: Type.STRING },
          timeline: { type: Type.STRING },
          dependencies: { type: Type.STRING },
        },
        required: ['milestone', 'description', 'timeline'],
      },
    },
    mvpVersion: { type: Type.STRING, description: 'e.g. v1.0.0-MVP' },
    deploymentStatus: { type: Type.STRING, description: 'e.g. Production Ready / Synthesis Verified' },
    valuation: {
      type: Type.OBJECT,
      properties: {
        usd: { type: Type.NUMBER, description: 'Estimated valuation in USD' },
        myr: { type: Type.NUMBER, description: 'Estimated valuation in MYR' },
        justification: { type: Type.STRING, description: 'Financial justification' },
      },
      required: ['usd', 'myr', 'justification'],
    },
    valuationTutorial: { type: Type.STRING, description: 'Guide on how this valuation is realized' },
    buymeacoffee: { type: Type.STRING, description: 'BuyMeACoffee button/widget HTML string' },
    whitepaper: { type: Type.STRING, description: 'Full arXiv-style wikitext formatted whitepaper' },
    portfolio: { type: Type.STRING, description: 'Portfolio showcase markdown/text' },
    suggestedMVPStructure: { type: Type.STRING, description: 'Suggested project architecture directory tree' },
  },
  required: [
    'projectName',
    'valueProposition',
    'tagline',
    'techStack',
    'intelligenceReport',
    'roadmap',
    'mvpVersion',
    'deploymentStatus',
    'valuation',
    'valuationTutorial',
    'buymeacoffee',
    'whitepaper',
    'portfolio',
    'suggestedMVPStructure',
  ],
} as const;

export const buildSynthesisPrompt = (files: FileData[], nameHint?: string): string => {
  const coffeeFile = files.find(f => f.name.toLowerCase().endsWith('kd-buymeacoffee.json'));
  const coffeeContent = coffeeFile ? `CRITICAL_FEATURE_SIGNAL (kd-buymeacoffee.json):\n${coffeeFile.content}\n` : "NO_BMC_CONFIG_FOUND";

  // Filter and prioritize meaningful code and config files
  const meaningfulFiles = files
    .filter(f => {
      const lower = f.name.toLowerCase();
      if (lower.includes('package-lock.json') || lower.includes('yarn.lock') || lower.includes('pnpm-lock.yaml') || lower.includes('bun.lock')) return false;
      if (lower.includes('node_modules/') || lower.includes('.git/') || lower.includes('dist/')) return false;
      return true;
    })
    .slice(0, 25);

  const fileSummary = (meaningfulFiles.length > 0 ? meaningfulFiles : files.slice(0, 10))
    .map(f => `FILE: ${f.name}\nCONTENT PREVIEW:\n${f.content.substring(0, 2500)}`)
    .join('\n\n---\n\n');

  return `
IDENTITY: You are a Distinguished Research Scientist, Lead Venture Architect, and Senior Systems Engineer.
PLATFORM CONTEXT: "KD Synthesizer" ecosystem. Branding: "KD C2P" (Code-to-Product).
${nameHint ? `PROJECT NAME HINT: "${nameHint}"` : ''}

TASK: Perform an architectural analysis of the provided repository and generate a high-fidelity Technical Whitepaper in academic research style (arXiv preprint standard).

WHITE PAPER SPECIFICATION (arXiv preprint standard — see .agents/skills/documentation/SKILL.md):
- TONE: High-level academic, rigorous, and visionary (current arXiv/cs preprint style).
- FORMATTING: Use Wikitext headers:
  - Main Sections: == 1. Section Name ==
  - Subsections: === 1.1 Technical Aspect ===
- WATERMARKING: Embed "[KD C2P PROTOCOL]" at the end of each major section.
- CITATIONS: Numeric [n] citations in Related Work; References section lists real,
  verifiable arXiv preprints or official tooling docs, one per line, format:
  "[1] A. Author and B. Author. Title. arXiv preprint arXiv:XXXX.XXXXX, Year."

REQUIRED SECTIONS IN STRICT arXiv ORDER:
  1.  == 1. Abstract ==: Single dense paragraph (150-250 words) then "Keywords:" line.
  2.  == 2. Introduction ==: Mission, problem statement, explicit contributions C1-C3.
  3.  == 3. Related Work ==: Prior art and competing systems, every claim cited [n].
  4.  == 4. Methodology: System Design ==: Functional architecture and module decomposition.
  5.  == 5. Core Algorithms ==: Engine internals with O() complexity where honest.
  6.  == 6. Implementation Details ==: Code patterns, type safety, state management.
  7.  == 7. System Topology ==: At least TWO ASCII diagrams as numbered figures
      ("| Figure 1. <caption>." header line, diagram lines start with | + or [).
  8.  == 8. Evaluation ==: Performance & scalability modeling with at least ONE pipe-table of metrics.
  9.  == 9. Security & Safety Analysis ==: STRIDE-style threat model, governance, data integrity.
  10. == 10. Economic Impact & Valuation ==: USD/MYR valuation with market-comparable justification.
  11. == 11. Deployment Roadmap & Future Work ==: Phased milestones plus theoretical evolution.
  12. == 12. Conclusion ==
  13. == References ==: Numbered arXiv-style list (5-12 entries), no fabricated IDs.

FORMAT EXAMPLES (STRICT SYNTAX — output is parsed as plain text, NEVER LaTeX):
1. Abstract section ends with a single keywords line, exactly:
   "Keywords: term one; term two; term three."
2. Numbered ASCII figure (caption line first, diagram contiguous, NO blank lines inside):
   | Figure 1. High-level system topology.
   +----------+     +-----------+
   |  Client  | --> |  Server   |
   +----------+     +-----------+
3. Metrics table as CONTIGUOUS pipe rows (no blank lines between rows):
   | Metric | Baseline | Proposed |
   | --- | --- | --- |
   | Latency | 18 ms | 2 ms |
4. Reference entries start each line with "[n] " and use plain sentence text:
   [1] A. Author and B. Author. Paper title. arXiv preprint arXiv:2401.12345, 2024.
   Never wrap references in code fences or tables.

ANALYSIS DATA (REPOSITORY CONTENTS):
${fileSummary}

BMC SIGNAL:
${coffeeContent}

REQUIREMENTS:
1. Synthesize realistic valuation estimates (in USD and MYR with justification).
2. Generate intelligence report, tech stack breakdown (used and suggested), roadmap, portfolio summary, and suggested MVP folder structure.
3. If BMC config is present, supply a working BuyMeACoffee HTML button/embed widget or interactive widget html.
`;
};

const REQUIRED_MVP_KEYS = MVP_JSON_SCHEMA.required as readonly string[];

export const validateMVPData = (parsed: unknown): MVPData => {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Model returned a non-object JSON payload.');
  }
  const obj = parsed as Record<string, unknown>;
  const missing = REQUIRED_MVP_KEYS.filter(k => obj[k] === undefined || obj[k] === null);
  if (missing.length > 0) {
    throw new Error(`Model output missing required field(s): ${missing.join(', ')}`);
  }
  const v = obj.valuation as Record<string, unknown>;
  if (typeof v.usd !== 'number' && typeof v.myr !== 'number') {
    try {
      v.usd = Number(v.usd);
      v.myr = Number(v.myr);
    } catch { /* validation below catches */ }
  }
  return obj as unknown as MVPData;
};

// ---------------------------------------------------------------------------
// Schema conversion: Gemini (uppercase) -> JSON Schema (OpenAI/Ollama)
// ---------------------------------------------------------------------------

const GEMINI_TYPE_TO_JSON: Record<string, string> = {
  STRING: 'string', NUMBER: 'number', INTEGER: 'integer',
  BOOLEAN: 'boolean', ARRAY: 'array', OBJECT: 'object',
};

export const toJsonSchema = (node: any): any => {
  if (Array.isArray(node)) return node.map(toJsonSchema);
  if (!node || typeof node !== 'object') return node;
  const out: any = {};
  for (const [key, value] of Object.entries(node)) {
    if (key === 'propertyOrdering') continue;
    if (key === 'type' && typeof value === 'string') {
      out.type = GEMINI_TYPE_TO_JSON[value] ?? value.toLowerCase();
      continue;
    }
    out[key] = toJsonSchema(value);
  }
  if (out.type === 'object') out.additionalProperties = false;
  return out;
};

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

type ProviderKind = 'gemini' | 'vertex' | 'openai' | 'ollama';

interface ResolvedProvider {
  kind: ProviderKind;
  models: string[];
  label: string;
}

export const resolveProvider = (): ResolvedProvider => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  if (apiKey) {
    return {
      kind: 'gemini',
      models: ['gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-3.7-flash'],
      label: 'Gemini Developer API',
    };
  }

  if (process.env.GOOGLE_CLOUD_PROJECT) {
    return {
      kind: 'vertex',
      models: ['gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-3.7-flash'],
      label: `Vertex AI (${process.env.GOOGLE_CLOUD_PROJECT})`,
    };
  }

  const openAiKey = process.env.OPENAI_API_KEY || '';
  const openAiBase = process.env.OPENAI_BASE_URL || '';
  if ((openAiKey || openAiBase.includes('localhost')) && openAiBase) {
    const models = (process.env.OPENAI_MODEL || 'gpt-4o-mini')
      .split(',').map(m => m.trim()).filter(Boolean);
    return { kind: 'openai', models, label: `OpenAI-compatible (${openAiBase})` };
  }

  if (process.env.OLLAMA_BASE_URL || process.env.OLLAMA_MODEL) {
    const models = [process.env.OLLAMA_MODEL || 'qwen2.5:14b'];
    return {
      kind: 'ollama',
      models,
      label: `Ollama (${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'})`,
    };
  }

  throw new Error(
    'No synthesis provider configured. Set one of:\n' +
    '  1. GEMINI_API_KEY in .env.local\n' +
    '  2. GOOGLE_CLOUD_PROJECT (+ gcloud auth application-default login) for Vertex AI\n' +
    '  3. OPENAI_BASE_URL [+ OPENAI_API_KEY] + OPENAI_MODEL for any OpenAI-compatible API\n' +
    '  4. OLLAMA_BASE_URL/OLLAMA_MODEL for fully local inference'
  );
};

// --- Gemini family (Developer API key OR Vertex AI ADC — no key needed) -----

async function runGeminiFamily(provider: ResolvedProvider, prompt: string): Promise<MVPData> {
  const config = provider.kind === 'vertex'
    ? {
        vertexai: true,
        project: process.env.GOOGLE_CLOUD_PROJECT,
        location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
      }
    : { apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY };

  const ai = new GoogleGenAI({
    ...config,
    httpOptions: { headers: { 'User-Agent': 'kd-c2p-synthesizer/1.12.1' } },
  } as any);

  let lastError: any = null;

  for (const model of provider.models) {
    try {
      console.log(`[${provider.label}] Querying model ${model}...`);
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: MVP_JSON_SCHEMA,
        },
      });

      const rawText = response.text;
      if (!rawText) {
        throw new Error(`Empty response returned from model ${model}`);
      }

      return validateMVPData(JSON.parse(rawText));
    } catch (err: any) {
      lastError = err;
      const isUnavailable = err?.message?.includes('503') || err?.message?.includes('429') || err?.message?.includes('UNAVAILABLE') || err?.message?.includes('high demand');
      if (isUnavailable) {
        console.info(`[Gemini Failover] ${model} unavailable (high demand), switching immediately to next candidate model...`);
      } else {
        console.warn(`[Gemini Warning] ${model} failed:`, err?.message || err);
      }
      await sleep(300);
    }
  }

  throw normalizeLastError(lastError, 'Synthesis service is temporarily busy. Please try again in a few moments.');
}

// --- Any OpenAI-compatible endpoint (OpenRouter, Groq, DeepSeek, LM Studio…) -

async function runOpenAiCompatible(provider: ResolvedProvider, prompt: string): Promise<MVPData> {
  const baseUrl = (process.env.OPENAI_BASE_URL || '').replace(/\/+$/, '');
  const apiKey = process.env.OPENAI_API_KEY || 'not-needed';
  const jsonSchema = toJsonSchema(MVP_JSON_SCHEMA);
  let lastError: any = null;

  for (const model of provider.models) {
    for (const mode of ['json_schema', 'json_object'] as const) {
      try {
        console.log(`[OpenAI-compatible] Querying ${model} (response_format=${mode})...`);
        const body: any = {
          model,
          messages: [
            mode === 'json_object'
              ? { role: 'user', content: `${prompt}\n\nReturn ONLY a single valid JSON object conforming exactly to this JSON schema (no markdown fences, no commentary):\n${JSON.stringify(jsonSchema)}` }
              : { role: 'user', content: prompt },
          ],
          response_format:
            mode === 'json_schema'
              ? { type: 'json_schema', json_schema: { name: 'kd_c2p_mvp_data', schema: jsonSchema } }
              : { type: 'json_object' },
        };
        const res = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${(await res.text()).substring(0, 300)}`);
        }
        const data: any = await res.json();
        const rawText = data?.choices?.[0]?.message?.content;
        if (!rawText) throw new Error('Empty choices[0].message.content');
        return validateMVPData(JSON.parse(stripFences(rawText)));
      } catch (err: any) {
        lastError = err;
        console.warn(`[OpenAI-compatible] ${model}/${mode} failed:`, err?.message || err);
        await sleep(200);
      }
    }
  }

  throw normalizeLastError(lastError, `OpenAI-compatible endpoint ${baseUrl} failed for all configured models.`);
}

// --- Local Ollama (no API key, offline) --------------------------------------

async function runOllama(provider: ResolvedProvider, prompt: string): Promise<MVPData> {
  const baseUrl = (process.env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/+$/, '');
  const model = provider.models[0];

  console.log(`[Ollama] Querying ${model} via ${baseUrl}...`);
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      format: toJsonSchema(MVP_JSON_SCHEMA),
      think: false,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Ollama HTTP ${res.status}: ${(await res.text()).substring(0, 300)}`);
  }
  const data: any = await res.json();
  const rawText = data?.message?.content;
  if (!rawText) throw new Error('Empty Ollama message.content');
  return validateMVPData(JSON.parse(stripFences(rawText)));
}

// ---------------------------------------------------------------------------

const stripFences = (text: string): string =>
  text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');

function normalizeLastError(lastError: any, fallback: string): Error {
  let formattedMessage = fallback;
  if (lastError?.message) {
    try {
      const parsedErr = JSON.parse(lastError.message);
      if (parsedErr?.error?.message) {
        formattedMessage = parsedErr.error.message;
      }
    } catch {
      formattedMessage = lastError.message;
    }
  }
  return new Error(formattedMessage);
}

/**
 * Generates the KD C2P MVP analysis. The OUTPUT CONTRACT (MVPData shape,
 * prompt, whitepaper canon) is identical across every backend:
 *   gemini  – Gemini Developer API key
 *   vertex  – Vertex AI via Application Default Credentials (no API key)
 *   openai  – any OpenAI-compatible endpoint
 *   ollama  – fully local inference (no key, offline)
 */
export const generateMVPAnalysis = async (files: FileData[], nameHint?: string): Promise<MVPData> => {
  const provider = resolveProvider();
  const prompt = buildSynthesisPrompt(files, nameHint);

  switch (provider.kind) {
    case 'gemini':
    case 'vertex':
      return runGeminiFamily(provider, prompt);
    case 'openai':
      return runOpenAiCompatible(provider, prompt);
    case 'ollama':
      return runOllama(provider, prompt);
  }
};
