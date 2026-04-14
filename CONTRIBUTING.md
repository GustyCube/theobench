# Contributing

## Getting started

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env` and add `OPENROUTER_API_KEY` if you are running OpenRouter-backed models.
3. Install any required CLIs for the providers you plan to use:
   - `codex` for OpenAI/Codex-backed runs
   - `claude` for Anthropic-backed runs and judging

## Benchmark changes

Treat benchmark changes carefully. The benchmark is only useful if question wording, reference answers, and scoring assumptions stay stable and reviewable.

- Keep edits to [`data/questions.json`](./data/questions.json) intentional and easy to audit.
- When changing question content or scoring behavior, explain why in the pull request.
- Re-export results after any change that affects the frontend dataset.

## Development workflow

Run the frontend:

```bash
pnpm dev
```

Check benchmark progress:

```bash
pnpm --filter bench status
```

Run missing benchmark tasks:

```bash
pnpm --filter bench run
```

Export benchmark results:

```bash
pnpm --filter bench export
```

Build before opening a pull request:

```bash
pnpm build
```

## Pull requests

- Keep changes scoped.
- Describe behavior changes clearly.
- Note whether a change affects benchmark comparability.
- Include screenshots for meaningful frontend changes.
