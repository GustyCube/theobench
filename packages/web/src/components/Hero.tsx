export function Hero() {
  return (
    <div className="text-center py-12 px-6">
      <h2 className="text-3xl font-bold text-white mb-3">
        How well do LLMs know Theo?
      </h2>
      <p className="text-gray-400 max-w-2xl mx-auto mb-4">
        A benchmark testing large language models on their knowledge of{" "}
        <a
          href="https://x.com/t3dotgg"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:underline"
        >
          Theo (t3.gg)
        </a>
        {" "}including his opinions, projects, content, and more.
      </p>
      <div className="inline-block bg-bg-tertiary border border-border-primary rounded-full px-4 py-2 text-sm text-gray-300">
        All models tested using only their built-in knowledge. No web
        search, no tools, no retrieval.
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Official placement requires a judged score for all 70 benchmark
        questions. Models that have not finished all 70 are shown
        separately as unofficial results.
      </p>
    </div>
  );
}
