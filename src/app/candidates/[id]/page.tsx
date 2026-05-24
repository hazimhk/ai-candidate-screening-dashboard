import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CandidateForm } from "@/components/CandidateForm";
import { GenerateSummaryButton } from "@/components/GenerateSummaryButton";
import { StatusBadge } from "@/components/StatusBadge";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type AiSummary = {
  summary?: string;
  strengths?: string[];
  gaps?: string[];
  relevant_skills?: string[];
  suggested_questions?: string[];
  fit_score?: number;
  generated_by?: "openai" | "demo";
};

export default async function CandidateDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ summaryError?: string }>;
}) {
  const { id } = await params;
  const { summaryError } = await searchParams;
  const candidate = await prisma.candidate.findUnique({ where: { id } });
  if (!candidate) {
    notFound();
  }

  const ai = candidate.aiSummary as AiSummary | null;

  return (
    <AppShell>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h1 className="text-2xl font-bold text-ink">{candidate.name}</h1>
              <p className="mt-1 text-sm text-slate-600">{candidate.email}</p>
              <p className="text-sm text-slate-600">{candidate.phone ?? "No phone listed"}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={candidate.status} />
              <span className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-semibold">
                Score: {candidate.aiScore ?? "Not scored"}
              </span>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {candidate.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-brand">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <div className="grid gap-3">
          <GenerateSummaryButton candidateId={candidate.id} />
          {summaryError ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">{summaryError}</p>
          ) : null}
        </div>

        {ai ? (
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-line bg-white p-5 shadow-soft md:col-span-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold">AI summary</h2>
                {ai.generated_by === "demo" ? (
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-warning ring-1 ring-amber-200">
                    Demo fallback
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700">{ai.summary}</p>
            </div>
            {[
              ["Strengths", ai.strengths],
              ["Gaps", ai.gaps],
              ["Relevant skills", ai.relevant_skills],
              ["Suggested interview questions", ai.suggested_questions]
            ].map(([title, items]) => (
              <div key={String(title)} className="rounded-lg border border-line bg-white p-5 shadow-soft">
                <h3 className="font-semibold">{String(title)}</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {(items as string[] | undefined)?.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </section>
        ) : (
          <section className="rounded-lg border border-dashed border-line bg-white p-6 text-sm text-slate-600">
            No AI summary yet. Generate one after reviewing the candidate resume.
          </section>
        )}

        <section>
          <h2 className="mb-3 text-lg font-semibold">Candidate profile</h2>
          <CandidateForm
            initial={{
              id: candidate.id,
              name: candidate.name,
              email: candidate.email,
              phone: candidate.phone,
              skills: candidate.skills,
              experienceYears: candidate.experienceYears,
              resumeText: candidate.resumeText,
              status: candidate.status
            }}
          />
        </section>
      </div>
    </AppShell>
  );
}
