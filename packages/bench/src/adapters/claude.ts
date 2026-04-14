import { ProviderAdapter } from "./types.js";
import { execFileSync } from "child_process";

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

export class ClaudeAdapter implements ProviderAdapter {
  name = "anthropic";

  async generateAnswer(question: string, model: string): Promise<string> {
    const binaryPath = findClaudeBinary();

    const { query } = await import("@anthropic-ai/claude-agent-sdk");

    let result = "";
    for await (const message of query({
      prompt: question,
      options: {
        pathToClaudeCodeExecutable: binaryPath,
        permissionMode: "bypassPermissions",
        tools: [],
        model,
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

    if (!result.trim()) {
      throw new Error(`Empty response from Claude model ${model}`);
    }

    return result.trim();
  }
}
