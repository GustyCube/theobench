import { ProviderAdapter } from "./types.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export class OpenRouterAdapter implements ProviderAdapter {
  name = "openrouter";

  private apiKey: string;

  constructor() {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) {
      throw new Error("OPENROUTER_API_KEY environment variable is required");
    }
    this.apiKey = key;
  }

  async generateAnswer(question: string, model: string): Promise<string> {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/gustycube/theobench",
        "X-Title": "TheoBench",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `OpenRouter API error ${response.status}: ${errorBody}`
      );
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content?.trim()) {
      throw new Error(`Empty response from OpenRouter model ${model}`);
    }

    return content.trim();
  }
}
