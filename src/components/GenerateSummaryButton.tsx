"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function GenerateSummaryButton({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateSummary() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/candidates/${candidateId}/summary`, {
        method: "POST",
        headers: {
          Accept: "application/json"
        }
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "Could not generate the AI summary.");
        return;
      }

      router.refresh();
    } catch {
      setError("Could not reach the summary service. Check the dev server and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={generateSummary}
        disabled={loading}
        className="focus-ring w-fit rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate AI Summary"}
      </button>
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
