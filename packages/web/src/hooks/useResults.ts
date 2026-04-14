import { useState, useEffect } from "react";
import type { Results } from "../types";

export function useResults() {
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/results.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load results");
        return res.json();
      })
      .then((data) => setResults(data as Results))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return { results, loading, error };
}
