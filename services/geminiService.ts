
import { GoogleGenAI, Type } from "@google/genai";
import { FileData, MVPData } from "../types";

export const convertRepoToMVP = async (files: FileData[], nameHint?: string, customApiKey?: string): Promise<MVPData> => {
  const apiKey = customApiKey || process.env.API_KEY || "";
  const ai = new GoogleGenAI({ apiKey });
  
  const coffeeFile = files.find(f => f.name.toLowerCase().endsWith('kd-buymeacoffee.json'));
  const coffeeContent = coffeeFile ? `CRITICAL_FEATURE_SIGNAL (kd-buymeacoffee.json):\n${coffeeFile.content}\n` : "NO_BMC_CONFIG_FOUND";

  const fileSummary = files
    .map(f => `FILE: ${f.name}\nCONTENT PREVIEW:\n${f.content.substring(0, 4000)}`) 
    .join('\n\n---\n\n');

const prompt = `
  IDENTITY: You are a Distinguished Research Scientist, Lead Venture Architect, and Senior Systems Engineer.
  PLATFORM CONTEXT: "KD Synthesizer" ecosystem. Branding: "KD C2P" (Code-to-Product).
  
  TASK: Perform an exhaustive architectural analysis of the provided repository and generate a high-fidelity Technical Whitepaper in the style of a top-tier peer-reviewed research paper (arXiv/NeurIPS/HuggingFace style).

  WHITE PAPER SPECIFICATION (BLUEPRINT OF RECORD):
  - TONE: High-level academic, objective, rigorous, and visionary. Use advanced technical lexicon.
  - FORMATTING: Use Wikitext headers:
    - Main Sections: == 1. Section Name ==
    - Subsections: === 1.1 Technical Aspect ===
  - LENGTH: MANDATORY MINIMUM OF 400 WORDS PER SECTION. The document must be massive and dense.
  - WATERMARKING: Subtlely embed the string "[KD C2P PROTOCOL]" as a footer or inline reference at the end of every section.
  
  REQUIRED 14 SECTIONS (STRICT ORDER):
    1. == 1. Abstract ==: A formal, high-density technical summary of system innovations.
    2. == 2. Introduction & Mission ==: Philosophical underpinnings and the transition from raw code to commercial asset.
    3. == 3. Market Gap & Competitive Analysis ==: Deep academic analysis of existing solutions and the specific industry friction points solved. Include TAM calculations.
    4. == 4. Functional Architecture ==: High-level system walkthrough and modular breakdown.
    5. == 5. Core Engine Specifications ==: Algorithmic deep-dive into the processing logic.
    6. == 6. Technical Implementation ==: Direct analysis of the provided repository's code patterns, type safety, and state synchronization.
    7. == 7. System Topology & ASCII Architecture ==: MANDATORY: Provide at least TWO complex ASCII diagrams (using |, +, -, >) showing infrastructure and data flow.
    8. == 8. Performance & Scalability Modeling ==: Mathematical modeling of system throughput, latency, and horizontal scaling strategies.
    9. == 9. Security & Governance ==: Threat modeling, encryption standards, and the community-driven steering protocol.
    10. == 10. Data Integrity & Safety ==: Formal verification methods and privacy-preserving design.
    11. == 11. Economic Impact & Valuation ==: Asset capitalization strategy and projected market impact.
    12. == 12. Strategic Execution Roadmap ==: Granular phases from synthesis to global deployment.
    13. == 13. Future Evolution ==: Theoretical future iterations, including AI-driven auto-scaling and cross-chain integrations.
    14. == 14. Conclusion & Bibliography ==: Final visionary statement and formal (simulated) academic references.

  ANALYSIS DATA:
  ${fileSummary}
  
  BMC SIGNAL:
  ${coffeeContent}

  OUTPUT: Valid JSON matching the MVPData interface. The 'whitepaper' field must contain the full 14-section document.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          projectName: { type: Type.STRING },
          valueProposition: { type: Type.STRING },
          tagline: { type: Type.STRING },
          techStack: { 
            type: Type.OBJECT,
            properties: {
              used: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ['name', 'description']
                }
              },
              suggested: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    benefit: { type: Type.STRING }
                  },
                  required: ['name', 'description', 'benefit']
                }
              }
            },
            required: ['used', 'suggested']
          },
          intelligenceReport: { type: Type.STRING },
          roadmap: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                milestone: { type: Type.STRING },
                description: { type: Type.STRING },
                timeline: { type: Type.STRING },
                dependencies: { type: Type.STRING }
              },
              required: ['milestone', 'description', 'timeline']
            } 
          },
          mvpVersion: { type: Type.STRING },
          deploymentStatus: { type: Type.STRING },
          valuation: {
            type: Type.OBJECT,
            properties: {
              usd: { type: Type.NUMBER },
              myr: { type: Type.NUMBER },
              justification: { type: Type.STRING }
            },
            required: ['usd', 'myr', 'justification']
          },
          valuationTutorial: { type: Type.STRING },
          buymeacoffee: { type: Type.STRING },
          whitepaper: { type: Type.STRING },
          portfolio: { type: Type.STRING },
          suggestedMVPStructure: { type: Type.STRING }
        },
        required: [
          'projectName', 'valueProposition', 'tagline', 'techStack', 
          'intelligenceReport', 'roadmap', 'mvpVersion', 'deploymentStatus', 
          'valuation', 'valuationTutorial', 'buymeacoffee', 'whitepaper', 'portfolio', 'suggestedMVPStructure'
        ]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI failed to generate content");
  
  return JSON.parse(text);
};
