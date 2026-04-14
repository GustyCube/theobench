import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ModelConfig, MODEL_CONFIGS } from "./adapters/types.js";
import { getExistingPairs } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUESTIONS_PATH = path.resolve(__dirname, "../../../data/questions.json");

export interface Question {
  id: string;
  category: "personal" | "tech-opinions" | "t3-stack" | "company" | "content";
  question: string;
  answers: string[];
  difficulty?: "easy" | "medium" | "hard";
}

export interface QuestionBank {
  version: number;
  questions: Question[];
}

export function loadQuestions(): Question[] {
  const raw = fs.readFileSync(QUESTIONS_PATH, "utf-8");
  const bank = JSON.parse(raw) as QuestionBank;
  return bank.questions;
}

export interface MissingTask {
  question: Question;
  config: ModelConfig;
}

function buildBalancedQuestionOrder(questions: Question[]): Question[] {
  const byCategory = new Map<Question["category"], Question[]>();

  for (const question of questions) {
    if (!byCategory.has(question.category)) {
      byCategory.set(question.category, []);
    }
    byCategory.get(question.category)!.push(question);
  }

  const orderedCategories = Array.from(byCategory.keys());
  const ordered: Question[] = [];
  let added = true;

  while (added) {
    added = false;

    for (const category of orderedCategories) {
      const queue = byCategory.get(category);
      const next = queue?.shift();

      if (next) {
        ordered.push(next);
        added = true;
      }
    }
  }

  return ordered;
}

export function findMissingTasks(filters?: {
  provider?: string;
  model?: string;
}): MissingTask[] {
  const questions = buildBalancedQuestionOrder(loadQuestions());
  const existing = getExistingPairs();

  let configs = MODEL_CONFIGS;
  if (filters?.provider) {
    configs = configs.filter((c) => c.provider === filters.provider);
  }
  if (filters?.model) {
    configs = configs.filter(
      (c) => c.model === filters.model || c.slug === filters.model
    );
  }

  const missing: MissingTask[] = [];
  for (const config of configs) {
    for (const question of questions) {
      const key = `${question.id}::${config.model}`;
      if (!existing.has(key)) {
        missing.push({ question, config });
      }
    }
  }

  return missing;
}
