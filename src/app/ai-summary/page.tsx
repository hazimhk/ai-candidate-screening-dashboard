import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type AiSummary = {
  summary?: string;
  strengths?: string[];
  gaps?: string[];
  suggested_questions?: string[];
  fit_score?: number;
  generated_by?: "openai" | "demo";
};

export default async function AiSummaryPage() {
  const candidates = await prisma.candidate.findMany({
    where: { aiScore: { not: null } },
    orderBy: [{ aiScore: "desc" }, { updatedAt: "desc" }],
    take: 24
  });

  return (
    <AppShell>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">AI Summary</h1>
          <p className="mt-1 text-sm text-slate-600">Generated fit summaries, strengths, gaps, and interview questions.</p>
        </div>
        <section className="grid gap-4 lg:grid-cols-2">
          {candidates.map((candidate) => {
            const ai = candidate.aiSummary as AiSummary | null;
            return (
              <article key={candidate.id} className="rounded-lg border border-line bg-white p-5 shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/candidates/${candidate.id}`} className="font-semibold text-ink hover:text-brand">
                      {candidate.name}
                    </Link>
                    <p className="mt-1 text-sm text-slate-500">{candidate.email}</p>
                  </div>
                  <div className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-semibold">
                    {candidate.aiScore ?? ai?.fit_score ?? "-"}
                  </div>
                </div>
                {ai?.generated_by === "demo" ? (
                  <span className="mt-3 inline-flex rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-warning ring-1 ring-amber-200">
                    Demo fallback
                  </span>
                ) : null}
                <p className="mt-4 text-sm leading-6 text-slate-700">{ai?.summary}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <h3 className="text-xs font-semibold uppercase text-slate-500">Strengths</h3>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">
                      {ai?.strengths?.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase text-slate-500">Gaps</h3>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">
                      {ai?.gaps?.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
        {candidates.length === 0 ? (
          <div className="rounded-lg border border-line bg-white p-10 text-center text-sm text-slate-500 shadow-soft">
            Generate AI summaries from candidate detail pages to populate this view.
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
