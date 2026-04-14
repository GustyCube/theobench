export interface ModelResult {
  slug: string;
  provider: string;
  model: string;
  overall: number;
  categories: Record<string, number | null>;
  categoryCounts?: Record<string, number>;
  totalQuestions: number;
  totalPossibleQuestions?: number;
  coverage?: number;
  complete?: boolean;
  totalScore: number;
}

export interface QuestionInfo {
  id: string;
  category: string;
  question: string;
  difficulty?: string;
}

export interface Results {
  generatedAt: string;
  models: ModelResult[];
  questions: QuestionInfo[];
  totals?: {
    questions: number;
    categories: Record<string, number>;
  };
}
