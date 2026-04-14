import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import { v4 as uuidv4 } from "uuid";
import { ClaudeAdapter } from "./adapters/claude.js";
import { CodexAdapter } from "./adapters/codex.js";
import { OpenRouterAdapter } from "./adapters/openrouter.js";
import { ProviderAdapter, MODEL_CONFIGS } from "./adapters/types.js";
import { recordResponse, responseExists, getAllResponses } from "./db.js";
import { findMissingTasks, loadQuestions } from "./questions.js";
import { judgeResponse } from "./judge.js";

function parseArgs() {
  const args = process.argv.slice(2).filter((a) => a !== "--");
  const command = args.find((a) => !a.startsWith("-")) ?? "status";
  const flags = new Map<string, string>();
  for (let i = 0; i < args.length; i++) {
    if (
      args[i].startsWith("--") &&
      args[i + 1] &&
      !args[i + 1].startsWith("-")
    ) {
      flags.set(args[i].slice(2), args[i + 1]);
      i++;
    } else if (args[i].startsWith("--")) {
      flags.set(args[i].slice(2), "true");
    }
  }
  return { command, flags };
}

function getAdapter(provider: string): ProviderAdapter {
  switch (provider) {
    case "anthropic":
      return new ClaudeAdapter();
    case "openai":
      return new CodexAdapter();
    default:
      return new OpenRouterAdapter();
  }
}

const CONCURRENCY = 10;

async function runPool<T>(items: T[], concurrency: number, fn: (item: T) => Promise<void>) {
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const i = index++;
      await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
}

async function runBenchmark(opts: { provider?: string; model?: string }) {
  const tasks = findMissingTasks(opts);

  if (tasks.length === 0) {
    console.log("All questions already collected and judged. Nothing to do.");
    return;
  }

  console.log(`Found ${tasks.length} missing question-model pairs to process.`);
  console.log(`Running with concurrency: ${CONCURRENCY}`);

  // Group tasks by model slug so each model's questions run together
  const byModel = new Map<string, typeof tasks>();
  for (const task of tasks) {
    const key = task.config.slug;
    if (!byModel.has(key)) byModel.set(key, []);
    byModel.get(key)!.push(task);
  }

  const modelGroups = Array.from(byModel.entries()).map(([slug, modelTasks]) => ({
    slug,
    config: modelTasks[0].config,
    tasks: modelTasks,
  }));

  // Run model groups concurrently with pool
  await runPool(modelGroups, CONCURRENCY, async (group) => {
    let adapter: ProviderAdapter;
    try {
      adapter = getAdapter(group.config.provider);
    } catch (err) {
      console.error(`Skipping ${group.slug}: ${(err as Error).message}`);
      return;
    }

    let consecutiveFailures = 0;
    let lastError = "";

    for (const task of group.tasks) {
      const { question, config } = task;
      const label = `[${config.slug}] "${question.question.slice(0, 50)}..."`;

      if (responseExists(question.id, config.model)) {
        continue;
      }

      if (consecutiveFailures >= 3) {
        console.error(`  Stopping ${config.slug}: 3 consecutive failures (${lastError})`);
        break;
      }

      console.log(`Collecting ${label}`);

      try {
        // Step 1: Get model's answer
        const prompt = `The following question is about Theo Browne, the software engineer and content creator known as Theo - t3.gg on YouTube and @theo on Twitter/X. Answer concisely.\n\n${question.question}`;
        const answerText = await adapter.generateAnswer(prompt, config.model);

        // Step 2: Judge immediately
        console.log(`  Judging ${label}`);
        const judgeResult = await judgeResponse(
          question.question,
          answerText,
          question.answers
        );

        // Step 3: Record both response and score
        const now = new Date().toISOString();
        recordResponse({
          id: uuidv4(),
          question_id: question.id,
          provider: config.provider,
          model: config.model,
          model_slug: config.slug,
          response_text: answerText,
          score: judgeResult.score,
          judge_model: "claude-haiku-4-5",
          collected_at: now,
          judged_at: now,
        });

        consecutiveFailures = 0;
        console.log(`  Done ${label} -> score: ${judgeResult.score.toFixed(2)}`);
      } catch (err) {
        const msg = (err as Error).message;
        console.error(`  FAILED ${label}: ${msg}`);
        consecutiveFailures++;
        lastError = msg;
      }
    }
  });

  console.log("Benchmark run complete.");
}

function exportResults() {
  const responses = getAllResponses();
  const questions = loadQuestions();

  if (responses.length === 0) {
    console.log("No responses to export. Run the benchmark first.");
    return;
  }

  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const latestByQuestionAndSlug = new Map<string, (typeof responses)[number]>();

  for (const response of responses) {
    if (response.score == null) continue;

    const key = `${response.model_slug}::${response.question_id}`;
    const current = latestByQuestionAndSlug.get(key);
    const responseTimestamp = response.judged_at ?? response.collected_at;
    const currentTimestamp = current?.judged_at ?? current?.collected_at;

    if (!current || responseTimestamp > currentTimestamp) {
      latestByQuestionAndSlug.set(key, response);
    }
  }

  // Group by model slug
  const byModel = new Map<
    string,
    { config: { slug: string; provider: string; model: string }; scores: { questionId: string; score: number }[] }
  >();

  for (const r of latestByQuestionAndSlug.values()) {
    if (!byModel.has(r.model_slug)) {
      byModel.set(r.model_slug, {
        config: { slug: r.model_slug, provider: r.provider, model: r.model },
        scores: [],
      });
    }
    byModel.get(r.model_slug)!.scores.push({
      questionId: r.question_id,
      score: r.score,
    });
  }

  const categories = [
    "personal",
    "tech-opinions",
    "t3-stack",
    "company",
    "content",
  ];
  const totalPossibleQuestions = questions.length;
  const questionTotalsByCategory = Object.fromEntries(
    categories.map((cat) => [
      cat,
      questions.filter((question) => question.category === cat).length,
    ])
  );

  const models = Array.from(byModel.values()).map(({ config, scores }) => {
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    const overall = scores.length > 0 ? totalScore / scores.length : 0;

    const categoryScores: Record<string, number | null> = {};
    const categoryCounts: Record<string, number> = {};
    for (const cat of categories) {
      const catScores = scores.filter(
        (s) => questionMap.get(s.questionId)?.category === cat
      );
      categoryCounts[cat] = catScores.length;
      categoryScores[cat] =
        catScores.length > 0
          ? catScores.reduce((sum, s) => sum + s.score, 0) / catScores.length
          : null;
    }

    return {
      slug: config.slug,
      provider: config.provider,
      model: config.model,
      overall,
      categories: categoryScores,
      categoryCounts,
      totalQuestions: scores.length,
      totalPossibleQuestions,
      coverage: totalPossibleQuestions > 0 ? scores.length / totalPossibleQuestions : 0,
      complete: scores.length === totalPossibleQuestions,
      totalScore,
    };
  });

  models.sort((a, b) => b.overall - a.overall);

  const result = {
    generatedAt: new Date().toISOString(),
    totals: {
      questions: totalPossibleQuestions,
      categories: questionTotalsByCategory,
    },
    models,
    questions: questions.map((q) => ({
      id: q.id,
      category: q.category,
      question: q.question,
      difficulty: q.difficulty,
    })),
  };

  const outPath = path.resolve(__dirname, "../../../data/results.json");
  const publicDir = path.resolve(__dirname, "../../web/public");
  const publicOutPath = path.join(publicDir, "results.json");

  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf-8");
  fs.writeFileSync(publicOutPath, JSON.stringify(result, null, 2), "utf-8");
  console.log(
    `Exported results for ${models.length} models to ${outPath} and ${publicOutPath}`
  );
}

function showStatus() {
  const questions = loadQuestions();
  const tasks = findMissingTasks();
  const total = questions.length * MODEL_CONFIGS.length;
  const collected = total - tasks.length;

  console.log(`Questions: ${questions.length}`);
  console.log(`Models: ${MODEL_CONFIGS.length}`);
  console.log(`Total combinations: ${total}`);
  console.log(`Collected & judged: ${collected}`);
  console.log(`Missing: ${tasks.length}`);

  if (tasks.length > 0) {
    console.log("\nMissing by model:");
    const byModel = new Map<string, number>();
    for (const t of tasks) {
      const key = t.config.slug;
      byModel.set(key, (byModel.get(key) ?? 0) + 1);
    }
    for (const [model, count] of byModel) {
      console.log(`  ${model}: ${count} missing`);
    }
  }
}

const { command, flags } = parseArgs();

if (command === "run") {
  runBenchmark({
    provider: flags.get("provider"),
    model: flags.get("model"),
  });
} else if (command === "export") {
  exportResults();
} else if (command === "status") {
  showStatus();
} else {
  console.log("Usage:");
  console.log("  pnpm bench run -- run [--provider <name>] [--model <name>]");
  console.log("  pnpm bench run -- export");
  console.log("  pnpm bench run -- status");
}
