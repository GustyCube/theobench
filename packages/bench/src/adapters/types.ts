export interface ProviderAdapter {
  name: string;
  generateAnswer(question: string, model: string): Promise<string>;
}

export interface ModelConfig {
  provider: string;
  model: string;
  slug: string;
}

export const MODEL_CONFIGS: ModelConfig[] = [
  // ── Anthropic (via Claude Agent SDK) ──
  { provider: "anthropic", model: "claude-opus-4-6", slug: "claude-opus-4-6" },
  { provider: "anthropic", model: "claude-sonnet-4-6", slug: "claude-sonnet-4-6" },
  { provider: "anthropic", model: "claude-haiku-4-5", slug: "claude-haiku-4-5" },

  // ── OpenAI (via Codex SDK) ──
  { provider: "openai", model: "gpt-5.4", slug: "gpt-5-4" },
  { provider: "openai", model: "gpt-5.4-mini", slug: "gpt-5-4-mini" },
  { provider: "openai", model: "gpt-5.3-codex", slug: "gpt-5-3-codex" },
  { provider: "openai", model: "gpt-5.2-codex", slug: "gpt-5-2-codex" },
  { provider: "openai", model: "gpt-5.2", slug: "gpt-5-2" },
  { provider: "openai", model: "gpt-5.1-codex-max", slug: "gpt-5-1-codex-max" },
  { provider: "openai", model: "gpt-5.1-codex", slug: "gpt-5-1-codex" },
  { provider: "openai", model: "gpt-5.1", slug: "gpt-5-1" },
  { provider: "openai", model: "gpt-5-codex", slug: "gpt-5-codex" },
  { provider: "openai", model: "gpt-5", slug: "gpt-5" },

  // ── OpenAI (via OpenRouter) ──
  { provider: "openai-or", model: "openai/gpt-5.4-pro", slug: "gpt-5-4-pro" },
  { provider: "openai-or", model: "openai/gpt-5.4-nano", slug: "gpt-5-4-nano" },
  { provider: "openai-or", model: "openai/gpt-5.3-chat", slug: "gpt-5-3-chat" },
  { provider: "openai-or", model: "openai/gpt-5.2-codex", slug: "gpt-5-2-codex-or" },
  { provider: "openai-or", model: "openai/gpt-5.2-chat", slug: "gpt-5-2-chat" },
  { provider: "openai-or", model: "openai/gpt-5.2-pro", slug: "gpt-5-2-pro" },
  { provider: "openai-or", model: "openai/gpt-5.2", slug: "gpt-5-2-or" },
  { provider: "openai-or", model: "openai/gpt-5.1-chat", slug: "gpt-5-1-chat" },
  { provider: "openai-or", model: "openai/gpt-5.1-codex-mini", slug: "gpt-5-1-codex-mini" },
  { provider: "openai-or", model: "openai/gpt-5-pro", slug: "gpt-5-pro" },
  { provider: "openai-or", model: "openai/gpt-5-chat", slug: "gpt-5-chat" },
  { provider: "openai-or", model: "openai/gpt-5-mini", slug: "gpt-5-mini" },
  { provider: "openai-or", model: "openai/gpt-5-nano", slug: "gpt-5-nano" },
  { provider: "openai-or", model: "openai/gpt-oss-120b", slug: "gpt-oss-120b" },
  { provider: "openai-or", model: "openai/gpt-oss-20b", slug: "gpt-oss-20b" },
  { provider: "openai-or", model: "openai/gpt-4.1", slug: "gpt-4-1" },
  { provider: "openai-or", model: "openai/gpt-4.1-mini", slug: "gpt-4-1-mini" },
  { provider: "openai-or", model: "openai/gpt-4.1-nano", slug: "gpt-4-1-nano" },
  { provider: "openai-or", model: "openai/o4-mini", slug: "o4-mini" },
  { provider: "openai-or", model: "openai/o3", slug: "o3" },
  { provider: "openai-or", model: "openai/o3-mini", slug: "o3-mini" },
  { provider: "openai-or", model: "openai/o1", slug: "o1" },
  { provider: "openai-or", model: "openai/gpt-4o", slug: "gpt-4o" },
  { provider: "openai-or", model: "openai/gpt-4o-mini", slug: "gpt-4o-mini" },
  { provider: "openai-or", model: "openai/gpt-4-turbo", slug: "gpt-4-turbo" },
  { provider: "openai-or", model: "openai/gpt-4", slug: "gpt-4" },
  { provider: "openai-or", model: "openai/gpt-3.5-turbo", slug: "gpt-3-5-turbo" },
  { provider: "openai-or", model: "openai/gpt-3.5-turbo-16k", slug: "gpt-3-5-turbo-16k" },

  // ── Google (via OpenRouter) ──
  { provider: "google", model: "google/gemini-3.1-pro-preview", slug: "gemini-3-1-pro" },
  { provider: "google", model: "google/gemini-3.1-flash-lite-preview", slug: "gemini-3-1-flash-lite" },
  { provider: "google", model: "google/gemini-3-flash-preview", slug: "gemini-3-flash" },
  { provider: "google", model: "google/gemini-2.5-pro", slug: "gemini-2-5-pro" },
  { provider: "google", model: "google/gemini-2.5-flash", slug: "gemini-2-5-flash" },
  { provider: "google", model: "google/gemini-2.5-flash-lite", slug: "gemini-2-5-flash-lite" },
  { provider: "google", model: "google/gemini-2.0-flash-001", slug: "gemini-2-0-flash" },
  { provider: "google", model: "google/gemini-2.0-flash-lite-001", slug: "gemini-2-0-flash-lite" },
  { provider: "google", model: "google/gemma-4-31b-it", slug: "gemma-4-31b" },
  { provider: "google", model: "google/gemma-4-26b-a4b-it", slug: "gemma-4-26b" },
  { provider: "google", model: "google/gemma-3n-e4b-it", slug: "gemma-3n-e4b" },
  { provider: "google", model: "google/gemma-3-27b-it", slug: "gemma-3-27b" },
  { provider: "google", model: "google/gemma-3-12b-it", slug: "gemma-3-12b" },
  { provider: "google", model: "google/gemma-3-4b-it", slug: "gemma-3-4b" },
  { provider: "google", model: "google/gemma-2-27b-it", slug: "gemma-2-27b" },
  { provider: "google", model: "google/gemma-2-9b-it", slug: "gemma-2-9b" },

  // ── xAI (via OpenRouter) ──
  { provider: "xai", model: "x-ai/grok-4.20", slug: "grok-4-20" },
  { provider: "xai", model: "x-ai/grok-4.20-multi-agent", slug: "grok-4-20-multi" },
  { provider: "xai", model: "x-ai/grok-4", slug: "grok-4" },
  { provider: "xai", model: "x-ai/grok-4-fast", slug: "grok-4-fast" },
  { provider: "xai", model: "x-ai/grok-4.1-fast", slug: "grok-4-1-fast" },
  { provider: "xai", model: "x-ai/grok-3", slug: "grok-3" },
  { provider: "xai", model: "x-ai/grok-3-mini", slug: "grok-3-mini" },

  // ── Meta (via OpenRouter) ──
  { provider: "meta", model: "meta-llama/llama-4-maverick", slug: "llama-4-maverick" },
  { provider: "meta", model: "meta-llama/llama-4-scout", slug: "llama-4-scout" },
  { provider: "meta", model: "meta-llama/llama-3.3-70b-instruct", slug: "llama-3-3-70b" },
  { provider: "meta", model: "meta-llama/llama-3.1-70b-instruct", slug: "llama-3-1-70b" },
  { provider: "meta", model: "meta-llama/llama-3.1-8b-instruct", slug: "llama-3-1-8b" },
  { provider: "meta", model: "meta-llama/llama-3-70b-instruct", slug: "llama-3-70b" },
  { provider: "meta", model: "meta-llama/llama-3-8b-instruct", slug: "llama-3-8b" },

  // ── DeepSeek (via OpenRouter) ──
  { provider: "deepseek", model: "deepseek/deepseek-r1", slug: "deepseek-r1" },
  { provider: "deepseek", model: "deepseek/deepseek-r1-0528", slug: "deepseek-r1-0528" },
  { provider: "deepseek", model: "deepseek/deepseek-chat", slug: "deepseek-chat" },
  { provider: "deepseek", model: "deepseek/deepseek-chat-v3.1", slug: "deepseek-chat-v3-1" },
  { provider: "deepseek", model: "deepseek/deepseek-v3.2", slug: "deepseek-v3-2" },
  { provider: "deepseek", model: "deepseek/deepseek-r1-distill-llama-70b", slug: "deepseek-r1-distill-70b" },
  { provider: "deepseek", model: "deepseek/deepseek-r1-distill-qwen-32b", slug: "deepseek-r1-distill-32b" },

  // ── Qwen (via OpenRouter) ──
  { provider: "qwen", model: "qwen/qwen3.5-397b-a17b", slug: "qwen3-5-397b" },
  { provider: "qwen", model: "qwen/qwen3.5-122b-a10b", slug: "qwen3-5-122b" },
  { provider: "qwen", model: "qwen/qwen3.5-35b-a3b", slug: "qwen3-5-35b" },
  { provider: "qwen", model: "qwen/qwen3.5-27b", slug: "qwen3-5-27b" },
  { provider: "qwen", model: "qwen/qwen3.5-9b", slug: "qwen3-5-9b" },
  { provider: "qwen", model: "qwen/qwen3.5-plus-02-15", slug: "qwen3-5-plus" },
  { provider: "qwen", model: "qwen/qwen3-max-thinking", slug: "qwen3-max-thinking" },
  { provider: "qwen", model: "qwen/qwen3-max", slug: "qwen3-max" },
  { provider: "qwen", model: "qwen/qwen3-235b-a22b", slug: "qwen3-235b" },
  { provider: "qwen", model: "qwen/qwen3-32b", slug: "qwen3-32b" },
  { provider: "qwen", model: "qwen/qwen3-14b", slug: "qwen3-14b" },
  { provider: "qwen", model: "qwen/qwen3-8b", slug: "qwen3-8b" },
  { provider: "qwen", model: "qwen/qwen3-30b-a3b", slug: "qwen3-30b" },
  { provider: "qwen", model: "qwen/qwen3-coder-next", slug: "qwen3-coder-next" },
  { provider: "qwen", model: "qwen/qwen3-coder", slug: "qwen3-coder" },
  { provider: "qwen", model: "qwen/qwen3-coder-plus", slug: "qwen3-coder-plus" },
  { provider: "qwen", model: "qwen/qwq-32b", slug: "qwq-32b" },
  { provider: "qwen", model: "qwen/qwen-max", slug: "qwen-max" },
  { provider: "qwen", model: "qwen/qwen-plus", slug: "qwen-plus" },
  { provider: "qwen", model: "qwen/qwen-turbo", slug: "qwen-turbo" },
  { provider: "qwen", model: "qwen/qwen-2.5-72b-instruct", slug: "qwen-2-5-72b" },
  { provider: "qwen", model: "qwen/qwen-2.5-coder-32b-instruct", slug: "qwen-2-5-coder-32b" },

  // ── Mistral (via OpenRouter) ──
  { provider: "mistral", model: "mistralai/mistral-small-2603", slug: "mistral-small" },
  { provider: "mistral", model: "mistralai/mistral-small-creative", slug: "mistral-small-creative" },
  { provider: "mistral", model: "mistralai/mistral-medium-3.1", slug: "mistral-medium-3-1" },
  { provider: "mistral", model: "mistralai/mistral-medium-3", slug: "mistral-medium-3" },
  { provider: "mistral", model: "mistralai/mistral-large-2512", slug: "mistral-large-2512" },
  { provider: "mistral", model: "mistralai/mistral-large-2411", slug: "mistral-large-2411" },
  { provider: "mistral", model: "mistralai/codestral-2508", slug: "codestral" },
  { provider: "mistral", model: "mistralai/devstral-medium", slug: "devstral-medium" },
  { provider: "mistral", model: "mistralai/devstral-small", slug: "devstral-small" },
  { provider: "mistral", model: "mistralai/ministral-8b-2512", slug: "ministral-8b" },
  { provider: "mistral", model: "mistralai/mixtral-8x22b-instruct", slug: "mixtral-8x22b" },
  { provider: "mistral", model: "mistralai/mixtral-8x7b-instruct", slug: "mixtral-8x7b" },
  { provider: "mistral", model: "mistralai/mistral-nemo", slug: "mistral-nemo" },
  { provider: "mistral", model: "mistralai/mistral-7b-instruct-v0.1", slug: "mistral-7b" },

  // ── Cohere (via OpenRouter) ──
  { provider: "cohere", model: "cohere/command-a", slug: "command-a" },
  { provider: "cohere", model: "cohere/command-r-plus-08-2024", slug: "command-r-plus" },
  { provider: "cohere", model: "cohere/command-r-08-2024", slug: "command-r" },

  // ── NVIDIA (via OpenRouter) ──
  { provider: "nvidia", model: "nvidia/nemotron-3-super-120b-a12b", slug: "nemotron-3-super" },
  { provider: "nvidia", model: "nvidia/nemotron-3-nano-30b-a3b", slug: "nemotron-3-nano" },
  { provider: "nvidia", model: "nvidia/llama-3.1-nemotron-ultra-253b-v1", slug: "nemotron-ultra-253b" },
  { provider: "nvidia", model: "nvidia/llama-3.1-nemotron-70b-instruct", slug: "nemotron-70b" },

  // ── Amazon (via OpenRouter) ──
  { provider: "amazon", model: "amazon/nova-premier-v1", slug: "nova-premier" },
  { provider: "amazon", model: "amazon/nova-pro-v1", slug: "nova-pro" },
  { provider: "amazon", model: "amazon/nova-lite-v1", slug: "nova-lite" },
  { provider: "amazon", model: "amazon/nova-micro-v1", slug: "nova-micro" },

  // ── Perplexity (via OpenRouter) ──
  { provider: "perplexity", model: "perplexity/sonar-pro", slug: "sonar-pro" },
  { provider: "perplexity", model: "perplexity/sonar", slug: "sonar" },

  // ── AI21 (via OpenRouter) ──
  { provider: "ai21", model: "ai21/jamba-large-1.7", slug: "jamba-large" },

  // ── Microsoft (via OpenRouter) ──
  { provider: "microsoft", model: "microsoft/phi-4", slug: "phi-4" },

  // ── Inflection (via OpenRouter) ──
  { provider: "inflection", model: "inflection/inflection-3-pi", slug: "inflection-3-pi" },
  { provider: "inflection", model: "inflection/inflection-3-productivity", slug: "inflection-3-prod" },

  // ── IBM (via OpenRouter) ──
  { provider: "ibm", model: "ibm-granite/granite-4.0-h-micro", slug: "granite-4-micro" },

  // ── Baidu (via OpenRouter) ──
  { provider: "baidu", model: "baidu/ernie-4.5-300b-a47b", slug: "ernie-4-5-300b" },
  { provider: "baidu", model: "baidu/ernie-4.5-21b-a3b", slug: "ernie-4-5-21b" },

  // ── Tencent (via OpenRouter) ──
  { provider: "tencent", model: "tencent/hunyuan-a13b-instruct", slug: "hunyuan-a13b" },

  // ── NousResearch (via OpenRouter) ──
  { provider: "nousresearch", model: "nousresearch/hermes-4-405b", slug: "hermes-4-405b" },
  { provider: "nousresearch", model: "nousresearch/hermes-4-70b", slug: "hermes-4-70b" },
  { provider: "nousresearch", model: "nousresearch/hermes-3-llama-3.1-405b", slug: "hermes-3-405b" },

  // ── Prime Intellect (via OpenRouter) ──
  { provider: "prime-intellect", model: "prime-intellect/intellect-3", slug: "intellect-3" },

  // ── DeepCogito (via OpenRouter) ──
  { provider: "deepcogito", model: "deepcogito/cogito-v2.1-671b", slug: "cogito-v2-1-671b" },

  // ── EssentialAI (via OpenRouter) ──
  { provider: "essentialai", model: "essentialai/rnj-1-instruct", slug: "rnj-1" },

  // ── Meituan (via OpenRouter) ──
  { provider: "meituan", model: "meituan/longcat-flash-chat", slug: "longcat-flash" },

  // ── ByteDance (via OpenRouter) ──
  { provider: "bytedance", model: "bytedance-seed/seed-2.0-lite", slug: "seed-2-0-lite" },
  { provider: "bytedance", model: "bytedance-seed/seed-2.0-mini", slug: "seed-2-0-mini" },
  { provider: "bytedance", model: "bytedance-seed/seed-1.6", slug: "seed-1-6" },
  { provider: "bytedance", model: "bytedance-seed/seed-1.6-flash", slug: "seed-1-6-flash" },

  // ── Moonshot (via OpenRouter) ──
  { provider: "moonshot", model: "moonshotai/kimi-k2.5", slug: "kimi-k2-5" },
  { provider: "moonshot", model: "moonshotai/kimi-k2", slug: "kimi-k2" },
  { provider: "moonshot", model: "moonshotai/kimi-k2-thinking", slug: "kimi-k2-thinking" },

  // ── MiniMax (via OpenRouter) ──
  { provider: "minimax", model: "minimax/minimax-m2.7", slug: "minimax-m2-7" },
  { provider: "minimax", model: "minimax/minimax-m2.5", slug: "minimax-m2-5" },
  { provider: "minimax", model: "minimax/minimax-m2.1", slug: "minimax-m2-1" },
  { provider: "minimax", model: "minimax/minimax-m2", slug: "minimax-m2" },
  { provider: "minimax", model: "minimax/minimax-m1", slug: "minimax-m1" },
  { provider: "minimax", model: "minimax/minimax-01", slug: "minimax-01" },

  // ── Zhipu/GLM (via OpenRouter) ──
  { provider: "zhipu", model: "z-ai/glm-5", slug: "glm-5" },
  { provider: "zhipu", model: "z-ai/glm-5-turbo", slug: "glm-5-turbo" },
  { provider: "zhipu", model: "z-ai/glm-4.7", slug: "glm-4-7" },
  { provider: "zhipu", model: "z-ai/glm-4.7-flash", slug: "glm-4-7-flash" },
  { provider: "zhipu", model: "z-ai/glm-4.6", slug: "glm-4-6" },
  { provider: "zhipu", model: "z-ai/glm-4.5", slug: "glm-4-5" },
  { provider: "zhipu", model: "z-ai/glm-4.5-air", slug: "glm-4-5-air" },
  { provider: "zhipu", model: "z-ai/glm-4-32b", slug: "glm-4-32b" },

  // ── Arcee (via OpenRouter) ──
  { provider: "arcee", model: "arcee-ai/trinity-large-thinking", slug: "trinity-large" },
  { provider: "arcee", model: "arcee-ai/coder-large", slug: "arcee-coder-large" },

  // ── Inception (via OpenRouter) ──
  { provider: "inception", model: "inception/mercury-2", slug: "mercury-2" },
  { provider: "inception", model: "inception/mercury", slug: "mercury" },
  { provider: "inception", model: "inception/mercury-coder", slug: "mercury-coder" },

  // ── Writer (via OpenRouter) ──
  { provider: "writer", model: "writer/palmyra-x5", slug: "palmyra-x5" },

  // ── Xiaomi (via OpenRouter) ──
  { provider: "xiaomi", model: "xiaomi/mimo-v2-pro", slug: "mimo-v2-pro" },
  { provider: "xiaomi", model: "xiaomi/mimo-v2-flash", slug: "mimo-v2-flash" },

  // ── Reka (via OpenRouter) ──
  { provider: "reka", model: "rekaai/reka-edge", slug: "reka-edge" },
  { provider: "reka", model: "rekaai/reka-flash-3", slug: "reka-flash-3" },

  // ── Liquid (via OpenRouter) ──
  { provider: "liquid", model: "liquid/lfm-2-24b-a2b", slug: "lfm-2-24b" },

  // ── StepFun (via OpenRouter) ──
  { provider: "stepfun", model: "stepfun/step-3.5-flash", slug: "step-3-5-flash" },

  // ── Allen AI (via OpenRouter) ──
  { provider: "allenai", model: "allenai/olmo-3.1-32b-instruct", slug: "olmo-3-1-32b" },
  { provider: "allenai", model: "allenai/olmo-3.1-32b-think", slug: "olmo-3-1-32b-think" },

  // ── Upstage (via OpenRouter) ──
  { provider: "upstage", model: "upstage/solar-pro-3", slug: "solar-pro-3" },

  // ── Aion Labs (via OpenRouter) ──
  { provider: "aion", model: "aion-labs/aion-2.0", slug: "aion-2-0" },

  // ── KwaiPilot (via OpenRouter) ──
  { provider: "kwaipilot", model: "kwaipilot/kat-coder-pro-v2", slug: "kat-coder-pro-v2" },

  // ── Morph (via OpenRouter) ──
  { provider: "morph", model: "morph/morph-v3-large", slug: "morph-v3-large" },
];
