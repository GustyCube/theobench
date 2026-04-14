import { ProviderAdapter } from "./types.js";
import { execFileSync } from "child_process";

function findCodexBinary(): string {
  try {
    return execFileSync("/usr/bin/which", ["codex"], {
      encoding: "utf-8",
    }).trim();
  } catch {
    throw new Error(
      "Codex CLI binary not found. Install it with: npm install -g @openai/codex"
    );
  }
}

export class CodexAdapter implements ProviderAdapter {
  name = "openai";

  async generateAnswer(question: string, model: string): Promise<string> {
    findCodexBinary();

    const { Codex } = await import("@openai/codex-sdk");

    const codex = new Codex({
      config: { model },
    });

    const thread = codex.startThread({
      skipGitRepoCheck: true,
      webSearchMode: "disabled",
      networkAccessEnabled: false,
    });
    const turn = await thread.run(question);
    const result = turn.finalResponse;

    if (!result?.trim()) {
      throw new Error(`Empty response from Codex model ${model}`);
    }

    return result.trim();
  }
}
