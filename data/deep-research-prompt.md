# Deep Research Prompt for TheoBench Question Generation

Paste the following into Claude's Deep Research feature:

---

Research the content creator **Theo** (YouTube: "Theo - t3.gg", Twitter/X: @t3dotgg) thoroughly. I need you to generate a comprehensive set of questions to test whether an AI model has knowledge about Theo and his work.

## What to research:
- His YouTube channel (Theo - t3.gg) — video topics, recurring themes, notable videos
- His Twitter/X presence (@t3dotgg) — known opinions, hot takes, recurring themes
- His company (T3 Tools, Inc.) — products like Uploadthing, Ping.gg
- The T3 Stack (create-t3-app) — technologies, philosophy, evolution
- His personal background — career history, where he's worked, education if public
- His tech opinions — frameworks, languages, tools he advocates for or against
- His streams on Twitch — format, what he does
- Collaborations, podcast appearances, notable interactions with other creators

## Output format:
Respond with ONLY a valid JSON object in this exact structure. No markdown code fences, no explanations — just the JSON:

```json
{
  "version": 1,
  "questions": [
    {
      "id": "theo-001",
      "category": "personal",
      "question": "Question text here?",
      "answers": [
        "A concise reference answer (1-2 sentences)",
        "An alternative valid framing of the answer (optional, for nuanced topics)"
      ],
      "difficulty": "easy"
    }
  ]
}
```

## Categories (aim for 8-10 questions per category):
- **personal** — bio, background, career history, platforms, handles
- **tech-opinions** — his stances on frameworks, languages, tools, practices
- **t3-stack** — create-t3-app, the technologies in the stack, philosophy behind it
- **company** — T3 Tools, Inc., Uploadthing, Ping.gg, products and services
- **content** — YouTube videos, streams, recurring topics, notable episodes, collaborations

## Rules:
1. Only include facts you can verify from public sources
2. Each question should have a clear, factual answer
3. The `answers` array should contain 1-2 concise reference answers (1-2 sentences each)
4. For opinion questions, include the specific stance AND context (e.g., "Theo prefers X over Y because Z")
5. Use `difficulty`: "easy" (widely known facts), "medium" (requires following his content), "hard" (deep knowledge of his work)
6. Generate IDs sequentially: theo-001, theo-002, etc.
7. Aim for 40-50 questions total across all categories
8. Avoid questions that could become outdated quickly (e.g., "How many subscribers does Theo have?")
9. Focus on stable facts and long-held opinions rather than one-off comments
