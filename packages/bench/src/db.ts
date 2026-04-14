import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, "../../../data/theobench.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("busy_timeout = 5000");

  const createTable = `
    CREATE TABLE IF NOT EXISTS responses (
      id TEXT PRIMARY KEY,
      question_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      model TEXT NOT NULL,
      model_slug TEXT NOT NULL,
      response_text TEXT NOT NULL,
      score REAL,
      judge_model TEXT,
      collected_at TEXT NOT NULL,
      judged_at TEXT,
      UNIQUE(question_id, model)
    )
  `;
  _db.prepare(createTable).run();

  return _db;
}

export function responseExists(questionId: string, model: string): boolean {
  const db = getDb();
  const row = db
    .prepare(
      "SELECT 1 FROM responses WHERE question_id = ? AND model = ? AND score IS NOT NULL"
    )
    .get(questionId, model);
  return !!row;
}

export interface ResponseRecord {
  id: string;
  question_id: string;
  provider: string;
  model: string;
  model_slug: string;
  response_text: string;
  score: number;
  judge_model: string;
  collected_at: string;
  judged_at: string;
}

export function recordResponse(record: ResponseRecord) {
  const db = getDb();
  db.prepare(
    `INSERT OR REPLACE INTO responses
     (id, question_id, provider, model, model_slug, response_text, score, judge_model, collected_at, judged_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    record.id,
    record.question_id,
    record.provider,
    record.model,
    record.model_slug,
    record.response_text,
    record.score,
    record.judge_model,
    record.collected_at,
    record.judged_at
  );
}

export function getExistingPairs(): Set<string> {
  const db = getDb();
  const rows = db
    .prepare("SELECT question_id, model FROM responses WHERE score IS NOT NULL")
    .all() as { question_id: string; model: string }[];
  return new Set(rows.map((r) => `${r.question_id}::${r.model}`));
}

export function getAllResponses() {
  const db = getDb();
  return db.prepare("SELECT * FROM responses").all() as ResponseRecord[];
}
