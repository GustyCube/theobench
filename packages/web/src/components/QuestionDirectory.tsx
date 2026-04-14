import type { QuestionInfo } from "../types";

const CATEGORY_LABELS: Record<string, string> = {
  personal: "Personal",
  "tech-opinions": "Tech Opinions",
  "t3-stack": "T3 Stack",
  company: "Company",
  content: "Content",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-score-high/20 text-score-high",
  medium: "bg-score-mid/20 text-score-mid",
  hard: "bg-score-low/20 text-score-low",
};

interface QuestionDirectoryProps {
  questions: QuestionInfo[];
}

export function QuestionDirectory({ questions }: QuestionDirectoryProps) {
  const grouped = new Map<string, QuestionInfo[]>();
  for (const q of questions) {
    if (!grouped.has(q.category)) grouped.set(q.category, []);
    grouped.get(q.category)!.push(q);
  }

  return (
    <div className="px-6 pb-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Question Directory
        </h2>
        <p className="text-gray-400 text-center mb-8">
          All {questions.length} questions used in the benchmark.
        </p>

        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([category, categoryQuestions]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-white mb-3 border-b border-border-primary pb-2">
                {CATEGORY_LABELS[category] ?? category}
                <span className="text-gray-500 text-sm font-normal ml-2">
                  ({categoryQuestions.length})
                </span>
              </h3>
              <div className="space-y-2">
                {categoryQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="bg-bg-secondary border border-border-primary rounded-lg px-4 py-3 flex items-start gap-3"
                  >
                    <span className="text-gray-500 font-mono text-xs mt-1 shrink-0">
                      {q.id}
                    </span>
                    <span className="text-gray-200 text-sm flex-1">
                      {q.question}
                    </span>
                    {q.difficulty && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${DIFFICULTY_COLORS[q.difficulty] ?? ""}`}
                      >
                        {q.difficulty}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
