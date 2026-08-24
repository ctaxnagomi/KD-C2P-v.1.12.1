import { GoogleGenAI, Type } from "@google/genai";
import { FileData, MVPData } from "../types";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateMVPAnalysis = async (files: FileData[], nameHint?: string): Promise<MVPData> => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server environment.");
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

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

  const prompt = `
IDENTITY: You are a Distinguished Research Scientist, Lead Venture Architect, and Senior Systems Engineer.
PLATFORM CONTEXT: "KD Synthesizer" ecosystem. Branding: "KD C2P" (Code-to-Product).
${nameHint ? `PROJECT NAME HINT: "${nameHint}"` : ''}

TASK: Perform an architectural analysis of the provided repository and generate a high-fidelity Technical Whitepaper in academic research style (arXiv/NeurIPS style).

WHITE PAPER SPECIFICATION:
- TONE: High-level academic, rigorous, and visionary.
- FORMATTING: Use Wikitext headers:
  - Main Sections: == 1. Section Name ==
  - Subsections: === 1.1 Technical Aspect ===
- WATERMARKING: Embed "[KD C2P PROTOCOL]" at the end of each major section.

REQUIRED 14 SECTIONS (STRICT ORDER):
  1. == 1. Abstract ==: Formal technical summary of system innovations.
  2. == 2. Introduction & Mission ==: Philosophical underpinnings and transition from code to commercial product.
  3. == 3. Market Gap & Competitive Analysis ==: Academic analysis of existing solutions and friction points solved with TAM calculations.
  4. == 4. Functional Architecture ==: System walkthrough and modular breakdown.
  5. == 5. Core Engine Specifications ==: Algorithmic analysis of processing logic.
  6. == 6. Technical Implementation ==: Direct analysis of code patterns, type safety, and state management.
  7. == 7. System Topology & ASCII Architecture ==: Include at least TWO complex ASCII diagrams (using |, +, -, >) showing infrastructure and data flow.
  8. == 8. Performance & Scalability Modeling ==: System throughput, latency, and scaling strategy.
  9. == 9. Security & Governance ==: Threat modeling and governance protocol.
  10. == 10. Data Integrity & Safety ==: Verification methods and privacy-preserving design.
  11. == 11. Economic Impact & Valuation ==: Asset capitalization strategy and market impact.
  12. == 12. Strategic Execution Roadmap ==: Granular execution phases.
  13. == 13. Future Evolution ==: Theoretical future iterations and auto-scaling.
  14. == 14. Conclusion & Bibliography ==: Visionary statement and academic references.

ANALYSIS DATA (REPOSITORY CONTENTS):
${fileSummary}

BMC SIGNAL:
${coffeeContent}

REQUIREMENTS:
1. Synthesize realistic valuation estimates (in USD and MYR with justification).
2. Generate intelligence report, tech stack breakdown (used and suggested), roadmap, portfolio summary, and suggested MVP folder structure.
3. If BMC config is present, supply a working BuyMeACoffee HTML button/embed widget or interactive widget html.
`;

  const schema = {
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
      whitepaper: { type: Type.STRING, description: 'Full 14-section wikitext formatted whitepaper' },
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
  };

  // High-availability models in optimal fallback order
  const candidateModels = ['gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-3.7-flash'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      console.log(`[Gemini API] Querying model ${model}...`);
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });

      const rawText = response.text;
      if (!rawText) {
        throw new Error(`Empty response returned from model ${model}`);
      }

      const parsedData = JSON.parse(rawText) as MVPData;
      return parsedData;
    } catch (err: any) {
      lastError = err;
      const isUnavailable = err?.message?.includes('503') || err?.message?.includes('429') || err?.message?.includes('UNAVAILABLE') || err?.message?.includes('high demand');
      if (isUnavailable) {
        console.info(`[Gemini API Failover] ${model} unavailable (high demand), switching immediately to next candidate model...`);
      } else {
        console.warn(`[Gemini API Warning] ${model} failed:`, err?.message || err);
      }
      // Small pause before failover
      await sleep(300);
    }
  }

  let formattedMessage = "Synthesis service is temporarily busy. Please try again in a few moments.";
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

  throw new Error(formattedMessage);
};
