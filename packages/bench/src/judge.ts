import { execFileSync } from "child_process";

const JUDGE_MODEL = "claude-haiku-4-5";

const JUDGE_SYSTEM_PROMPT = `You are a judge scoring how well a response answers a question about the content creator Theo (t3.gg). Score from 0 to 1 based on accuracy and completeness compared to the reference answer(s). Respond with ONLY a JSON object: {"score": 0.X, "reasoning": "..."}`;

function findClaudeBinary(): string {
  try {
    return execFileSync("/usr/bin/which", ["claude"], {
      encoding: "utf-8",
    }).trim();
  } catch {
    throw new Error(
      "Claude CLI binary not found. Install it with: npm install -g @anthropic-ai/claude-code"
    );
  }
}

export interface JudgeResult {
  score: number;
  reasoning: string;
}

export async function judgeResponse(
  question: string,
  response: string,
  referenceAnswers: string[]
): Promise<JudgeResult> {
  const binaryPath = findClaudeBinary();
  const { query } = await import("@anthropic-ai/claude-agent-sdk");

  const prompt = `${JUDGE_SYSTEM_PROMPT}

Question: ${question}

Model's Response: ${response}

Reference Answer(s):
${referenceAnswers.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Score the model's response from 0 to 1. Respond with ONLY a JSON object.`;

  let result = "";
  for await (const message of query({
    prompt,
    options: {
      pathToClaudeCodeExecutable: binaryPath,
      permissionMode: "bypassPermissions",
      tools: [],
      model: JUDGE_MODEL,
    },
  })) {
    if (
      message.type === "assistant" &&
      message.message?.content &&
      Array.isArray(message.message.content)
    ) {
      for (const block of message.message.content) {
        if ("text" in block) {
          result += block.text;
        }
      }
    }
  }

  const content = result.trim();
  if (!content) {
    throw new Error("Empty response from judge model");
  }

  try {
    const parsed = JSON.parse(content) as JudgeResult;
    return { score: Math.max(0, Math.min(1, parsed.score)), reasoning: parsed.reasoning };
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*?"score"[\s\S]*?\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as JudgeResult;
      return { score: Math.max(0, Math.min(1, parsed.score)), reasoning: parsed.reasoning };
    }
    throw new Error(`Failed to parse judge response: ${content}`);
  }
}
