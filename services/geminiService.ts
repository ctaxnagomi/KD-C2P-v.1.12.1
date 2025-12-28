
import { GoogleGenAI, Type } from "@google/genai";
import { FileData, MVPData } from "../types";

export const convertRepoToMVP = async (files: FileData[], nameHint?: string): Promise<MVPData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Provide a clear separation for the specific config file to help AI find it easily
  const coffeeFile = files.find(f => f.name.toLowerCase().endsWith('kd-buymeacoffee.txt'));
  const coffeeContent = coffeeFile ? `CRITICAL CONFIG (kd-buymeacoffee.txt):\n${coffeeFile.content}\n` : "";

  const fileSummary = files
    .map(f => `FILE: ${f.name}\nCONTENT PREVIEW:\n${f.content.substring(0, 2000)}`)
    .join('\n\n---\n\n');

const prompt = `
  IDENTITY: You are a senior product engineer and venture architect with expertise in startup evaluation, technical architecture, and market analysis.
  PLATFORM CONTEXT: You are operating within the "KD Synthesizer" platform for project analysis.
  CRITICAL CONSTRAINT: The platform name is "KD". THE PROJECT YOU ARE ANALYZING IS NOT CALLED "KD" OR "KD SYNTHESIZER".

  TASK OVERVIEW:
  Analyze the provided repository files to extract key insights about the project.
  
  ${coffeeContent}

  SPECIFIC TASKS:
  1. Determine the ACTUAL project name. scan package.json, README.md, or config files. Fallback to "${nameHint || 'Untitled Project'}".
  2. Identify the core value proposition and create a catchy tagline.
  3. Extract the actual tech stack and suggest 2-4 missing or complementary pieces.
  4. Generate an "AI Intelligence Report" (SWOT, SPACE, BCG, Porter's Five Forces).
  5. Generate a structured roadmap for launch (5-7 milestones).
  6. Propose an MVP version number based on completeness.
  7. Search for project deployment status. Estimate market valuation (Seed/Pre-seed stage) using weighted averages of 3y, 5y, 10y, 15y data. Cross-reference with S&P/Bursa Malaysia for established projects.
  8. Generate a "Valuation Tutorial Guide" explaining the mathematical algorithms applied.
  
  9. BUY ME A COFFEE INTEGRATION:
     - IF "kd-buymeacoffee.txt" was provided (see CRITICAL CONFIG above), you MUST extract the script tag content.
     - Transform that script: 
        a. Ensure data-text="Buy Coffee"
        b. Ensure data-emoji="☕"
        c. Set data-color="#222222", data-outline-color="#ffffff", data-font-color="#ffffff", data-coffee-color="#000000".
     - Wrap this script in: <div style="animation: glow 1s ease-in-out infinite alternate; display: inline-block;"><style>@keyframes glow { 0% { box-shadow: 0 0 5px #fff; } 100% { box-shadow: 0 0 15px #fff; } }</style> [TRANSFORMED_SCRIPT] </div>
     - Set buymeacoffee to this final HTML string. 
     - IF NO FILE FOUND, set to empty string "".

  10. Generate a "Whitepaper" (Markdown).
  11. Generate a "Portfolio" (Markdown).

  INPUT REPO FILES:
  ${fileSummary}

  OUTPUT FORMAT: Return valid JSON strictly. The "buymeacoffee" field MUST contain the full HTML string if the file was found.
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
          portfolio: { type: Type.STRING }
        },
        required: [
          'projectName', 'valueProposition', 'tagline', 'techStack', 
          'intelligenceReport', 'roadmap', 'mvpVersion', 'deploymentStatus', 
          'valuation', 'valuationTutorial', 'buymeacoffee', 'whitepaper', 'portfolio'
        ]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI failed to generate content");
  
  return JSON.parse(text);
};

export const generateWhitepaper = async (mvpData: MVPData): Promise<string> => {
  return mvpData.whitepaper;
};

export const generatePortfolio = async (mvpData: MVPData): Promise<string> => {
  return mvpData.portfolio;
};
