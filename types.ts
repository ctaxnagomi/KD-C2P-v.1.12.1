
export interface FileData {
  name: string;
  content: string;
  type: string;
}

export interface TechItem {
  name: string;
  description: string;
}

export interface TechSuggested {
  name: string;
  description: string;
  benefit: string;
}

export interface RoadmapItem {
  milestone: string;
  description: string;
  timeline: string;
  dependencies?: string;
}

export interface MVPData {
  projectName: string;
  valueProposition: string;
  tagline: string;
  techStack: {
    used: TechItem[];
    suggested: TechSuggested[];
  };
  intelligenceReport: string;
  roadmap: RoadmapItem[];
  mvpVersion: string;
  deploymentStatus: string;
  valuation: {
    usd: number;
    myr: number;
    justification: string;
  };
  valuationTutorial: string;
  buymeacoffee: string;
  whitepaper: string;
  portfolio: string;
  suggestedMVPStructure: string;
}

export interface Funder {
  name: string;
  amount: number;
  date: string;
}

export interface AppState {
  isConverting: boolean;
  mvpData: MVPData | null;
  backers: Funder[];
  showSponsorModal: boolean;
  activeTab: 'overview' | 'tech' | 'funding' | 'community';
}
