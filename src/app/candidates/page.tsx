import { AppShell } from "@/components/AppShell";
import { CandidateForm } from "@/components/CandidateForm";
import { CandidateTable } from "@/components/CandidateTable";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CandidateListPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; skill?: string; status?: string; new?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const skill = params.skill?.trim() ?? "";
  const status = params.status?.trim();

  const candidates = await prisma.candidate.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { resumeText: { contains: q, mode: "insensitive" } }
              ]
            }
          : {},
        skill ? { skills: { has: skill } } : {},
        status && ["SHORTLISTED", "PENDING", "REJECTED"].includes(status) ? { status: status as never } : {}
      ]
    },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <AppShell>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">Candidates</h1>
          <p className="mt-1 text-sm text-slate-600">Search, filter, add, and review candidate profiles.</p>
        </div>
        <form className="grid gap-3 rounded-lg border border-line bg-white p-4 shadow-soft md:grid-cols-[1fr_220px_180px_auto]">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name, email, resume text"
            className="focus-ring rounded-md border border-line px-3 py-2"
          />
          <input
            name="skill"
            defaultValue={skill}
            placeholder="Filter by skill"
            className="focus-ring rounded-md border border-line px-3 py-2"
          />
          <select name="status" defaultValue={status ?? ""} className="focus-ring rounded-md border border-line px-3 py-2">
            <option value="">All statuses</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button className="focus-ring rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">Filter</button>
        </form>
        <CandidateTable candidates={candidates} />
        <section id="new">
          <h2 className="mb-3 text-lg font-semibold">Add candidate</h2>
          <CandidateForm />
        </section>
      </div>
    </AppShell>
  );
}
