import { useState } from "react";
import { useResults } from "./hooks/useResults";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Leaderboard } from "./components/Leaderboard";
import { QuestionDirectory } from "./components/QuestionDirectory";
import { Footer } from "./components/Footer";

export function App() {
  const { results, loading, error } = useResults();
  const [activeCategory, setActiveCategory] = useState("all");

  const questionTotals = results?.totals?.questions ?? results?.questions.length ?? 0;
  const categoryTotals =
    results?.totals?.categories ??
    Object.fromEntries(
      (results?.questions ?? []).reduce(
        (entries, question) => {
          const current = entries.get(question.category) ?? 0;
          entries.set(question.category, current + 1);
          return entries;
        },
        new Map<string, number>()
      )
    );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading results...</p>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Hero />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">
            No benchmark results available yet. Run the benchmark first.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Leaderboard
        models={results.models}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        totalQuestions={questionTotals}
        categoryTotals={categoryTotals}
      />
      <QuestionDirectory questions={results.questions} />
      <Footer />
    </div>
  );
}
