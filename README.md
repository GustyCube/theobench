# TheoBench

TheoBench measures how well large language models know Theo Browne from built-in knowledge alone.

The benchmark asks 70 fixed questions spanning personal history, technical opinions, the T3 stack, company context, and content. Answers are collected from each model, then judged against reference answers on a `0.0` to `1.0` scale.

## Official vs unofficial results

Official placement requires a complete judged run across all 70 benchmark questions.

If a model has only been judged on part of the benchmark, it appears in **Unofficial Results** instead. Those scores are useful as progress signals, but they are not directly comparable to completed runs because they reflect only the subset of questions finished so far.

## Repository layout

```text
.
├── data/                  # question bank, SQLite DB, exported results
├── packages/
│   ├── bench/             # collection, judging, export CLI
│   └── web/               # React frontend
├── wrangler.toml          # Cloudflare Workers deployment config
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## Local development

### Prerequisites

- Node.js 22+
- pnpm 10+
- `OPENROUTER_API_KEY` in `.env` if you want to run OpenRouter-backed models
- `codex` installed globally for OpenAI/Codex-backed models
- `claude` installed globally for Anthropic-backed models and judging

Install dependencies:

```bash
pnpm install
```

Run the web app locally:

```bash
pnpm dev
```

Build the site:

```bash
pnpm build
```

## Benchmark workflow

Check benchmark progress:

```bash
pnpm --filter bench status
```

Run missing question/model pairs:

```bash
pnpm --filter bench run
```

Export the current database to the frontend:

```bash
pnpm --filter bench export
```

The exporter deduplicates repeated `model_slug + question_id` rows, includes coverage metadata, writes the canonical dataset to `data/results.json`, and writes the frontend copy to `packages/web/public/results.json`.

## Cloudflare Workers deployment

This repo is configured for **Cloudflare Workers Static Assets**, not Cloudflare Pages.

The Worker serves the built SPA from `packages/web/dist`, and SPA routing is handled through `assets.not_found_handling = "single-page-application"` in [`wrangler.toml`](./wrangler.toml).

Authenticate Wrangler:

```bash
pnpm cf:whoami
```

Start a local Workers preview:

```bash
pnpm cf:dev
```

Deploy to Workers:

```bash
pnpm cf:deploy
```

Before the first deploy, set a unique Worker name in `wrangler.toml` if `theobench` is already taken in your Cloudflare account.

The Workers scripts run a fresh benchmark export before build and deploy, so only the intended `results.json` file is published. The SQLite database and prompt files stay private.

## Governance

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing](./CONTRIBUTING.md)
- [License](./LICENSE)
