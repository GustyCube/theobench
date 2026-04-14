import { useState } from "react";
import type { ModelResult } from "../types";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "personal", label: "Personal" },
  { key: "tech-opinions", label: "Tech Opinions" },
  { key: "t3-stack", label: "T3 Stack" },
  { key: "company", label: "Company" },
  { key: "content", label: "Content" },
];

const PAGE_SIZE = 10;

function scoreColor(score: number): string {
  if (score >= 0.7) return "text-score-high";
  if (score >= 0.4) return "text-score-mid";
  return "text-score-low";
}

interface LeaderboardProps {
  models: ModelResult[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  totalQuestions: number;
  categoryTotals: Record<string, number>;
}

interface TableRow {
  model: ModelResult;
  score: number | null;
  points: number | null;
  answered: number;
  possible: number;
}

interface ResultsTableProps {
  title: string;
  subtitle: string;
  rows: TableRow[];
  ranked: boolean;
  showCoverageColumn: boolean;
  coverageLabel?: string;
  formatCoverage?: (row: TableRow) => string;
  showPointsMax: boolean;
}

function getModelScore(model: ModelResult, activeCategory: string): number | null {
  if (activeCategory === "all") return model.overall;
  return model.categories[activeCategory] ?? null;
}

function getCoverage(model: ModelResult, activeCategory: string, totalQuestions: number, categoryTotals: Record<string, number>) {
  if (activeCategory === "all") {
    return {
      answered: model.totalQuestions,
      possible: model.totalPossibleQuestions ?? totalQuestions,
    };
  }

  return {
    answered: model.categoryCounts?.[activeCategory] ?? 0,
    possible: categoryTotals[activeCategory] ?? 0,
  };
}

function formatCompletionPercent(answered: number, possible: number): string {
  if (possible <= 0) return "—";
  return `${((answered / possible) * 100).toFixed(1)}%`;
}

function ResultsTable({
  title,
  subtitle,
  rows,
  ranked,
  showCoverageColumn,
  coverageLabel = "Coverage",
  formatCoverage = (row) => `${row.answered}/${row.possible}`,
  showPointsMax,
}: ResultsTableProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>

      <div className="bg-bg-secondary border border-border-primary rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-border-primary">
              {ranked && <th className="text-left px-4 py-3 w-12">#</th>}
              <th className="text-left px-4 py-3">Model</th>
              {showCoverageColumn && (
                <th className="text-right px-4 py-3">{coverageLabel}</th>
              )}
              <th className="text-right px-4 py-3">Pts</th>
              <th className="text-right px-4 py-3">Avg</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={(ranked ? 1 : 0) + 3 + (showCoverageColumn ? 1 : 0)}
                  className="px-4 py-6 text-sm text-center text-gray-500"
                >
                  No models available for this view.
                </td>
              </tr>
            ) : (
              rows.map(({ model, score, points, answered, possible }, i) => {
                const rank = i + 1;
                const rankColor =
                  rank === 1
                    ? "text-yellow-400"
                    : rank === 2
                      ? "text-gray-300"
                      : rank === 3
                        ? "text-amber-600"
                        : "text-gray-500";

                return (
                  <tr
                    key={model.slug}
                    className="border-b border-border-primary last:border-b-0 hover:bg-bg-tertiary transition-colors"
                  >
                    {ranked && (
                      <td className={`px-4 py-3 font-mono text-sm ${rankColor}`}>
                        {rank}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <span className="text-white font-medium">{model.slug}</span>
                      <span className="text-gray-500 text-xs ml-2">
                        {model.provider}
                      </span>
                      {!ranked && (
                        <span className="text-xs text-amber-400 ml-2 uppercase tracking-wide">
                          Unofficial
                        </span>
                      )}
                    </td>
                    {showCoverageColumn && (
                      <td className="px-4 py-3 text-right font-mono text-sm text-gray-300">
                        {formatCoverage({ model, score, points, answered, possible })}
                      </td>
                    )}
                    <td className="px-4 py-3 text-right font-mono text-sm text-gray-300">
                      {points == null
                        ? "—"
                        : showPointsMax
                          ? `${points.toFixed(1)}/${possible}`
                          : points.toFixed(1)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-mono text-sm font-semibold ${
                        score == null ? "text-gray-500" : scoreColor(score)
                      }`}
                    >
                      {score == null ? "—" : `${(score * 100).toFixed(1)}%`}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function Leaderboard({
  models,
  activeCategory,
  onCategoryChange,
  totalQuestions,
  categoryTotals,
}: LeaderboardProps) {
  const [page, setPage] = useState(0);

  const officialModels = models.filter(
    (model) => model.complete ?? model.totalQuestions === totalQuestions
  );
  const previewSource = models.filter(
    (model) => !(model.complete ?? model.totalQuestions === totalQuestions)
  );

  const officialRows = officialModels
    .map((model) => {
      const score = getModelScore(model, activeCategory);
      const { answered, possible } = getCoverage(
        model,
        activeCategory,
        totalQuestions,
        categoryTotals
      );

      return {
        model,
        score,
        points: score == null ? null : score * answered,
        answered,
        possible,
      };
    })
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));

  const previewRows = previewSource
    .map((model) => {
      const score = getModelScore(model, activeCategory);
      const { answered, possible } = getCoverage(
        model,
        activeCategory,
        totalQuestions,
        categoryTotals
      );

      return {
        model,
        score,
        points: score == null ? null : score * answered,
        answered,
        possible,
      };
    })
    .filter((row) => activeCategory === "all" || row.answered > 0)
    .sort((a, b) => {
      const coverageA = a.possible > 0 ? a.answered / a.possible : 0;
      const coverageB = b.possible > 0 ? b.answered / b.possible : 0;
      if (coverageB !== coverageA) return coverageB - coverageA;
      return (b.score ?? -1) - (a.score ?? -1);
    });

  const totalPages = Math.max(1, Math.ceil(officialRows.length / PAGE_SIZE));
  const pageRows = officialRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleCategoryChange = (cat: string) => {
    setPage(0);
    onCategoryChange(cat);
  };

  return (
    <div className="px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Category tabs */}
        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat.key
                  ? "bg-white text-black"
                  : "bg-bg-tertiary text-gray-400 hover:text-white hover:bg-border-primary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 mb-6 sm:grid-cols-3">
          <div className="bg-bg-secondary border border-border-primary rounded-lg px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              Official
            </div>
            <div className="text-white text-lg font-semibold">
              {officialModels.length}
            </div>
          </div>
          <div className="bg-bg-secondary border border-border-primary rounded-lg px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              Unofficial
            </div>
            <div className="text-white text-lg font-semibold">
              {previewSource.length}
            </div>
          </div>
          <div className="bg-bg-secondary border border-border-primary rounded-lg px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              Questions
            </div>
            <div className="text-white text-lg font-semibold">{totalQuestions}</div>
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-primary rounded-lg px-4 py-3 mb-6">
          <p className="text-sm text-gray-300">
            A model only enters the official leaderboard after all 70
            benchmark questions have been answered and judged. Models in
            unofficial results were stopped early or are still in progress,
            so their scores only reflect the subset completed so far.
          </p>
        </div>

        <ResultsTable
          title="Official Leaderboard"
          subtitle="Every score here is based on all 70 judged benchmark questions."
          rows={pageRows}
          ranked
          showCoverageColumn={false}
          showPointsMax
        />

        {/* Pagination */}
        {officialRows.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg text-sm bg-bg-tertiary text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            <span className="text-gray-500 text-sm">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1.5 rounded-lg text-sm bg-bg-tertiary text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

        <ResultsTable
          title="Unofficial Results"
          subtitle={
            activeCategory === "all"
              ? "Sorted by % of tests completed, then average score."
              : `Shows % of ${CATEGORIES.find((cat) => cat.key === activeCategory)?.label ?? activeCategory} tests completed. Models with no completed tests in this category are hidden.`
          }
          rows={previewRows}
          ranked={false}
          showCoverageColumn
          coverageLabel="% of Tests Completed"
          formatCoverage={(row) => formatCompletionPercent(row.answered, row.possible)}
          showPointsMax={false}
        />
      </div>
    </div>
  );
}
