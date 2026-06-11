export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export interface WellnessCheck {
  moodRating: number; // 1-10
  stressLevel: 'low' | 'moderate' | 'high' | 'severe';
  emotions: string[];
  notes: string;
}

export interface QuizAnswer {
  questionId: number;
  selectedOptionId: string;
}

export interface QuizQuestion {
  id: number;
  text: string;
  category: string;
  options: {
    id: string;
    text: string;
    description?: string;
    personaWeights: { [key: string]: number };
  }[];
}

export interface CareerPersona {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coreStrengths: string[];
  aiGrowthOpportunities: string[];
  wellnessAdvice: string;
}

export interface ReSkillingItem {
  traditionalSkill: string;
  aiEraEquivalent: string;
  conceptualGap: string;
  handsOnExercise: string;
  learningResource: string;
  timeframe: string;
}

export interface ResumeAnalysisResult {
  candidateName: string;
  parsedSummary: string;
  identifiedStrengths: string[];
  gapsToIndustryTrends: string[];
  suggestedAIPersonas: string[];
  skillsBreakdown: ReSkillingItem[];
}
