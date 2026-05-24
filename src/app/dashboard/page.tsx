import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { CandidateTable } from "@/components/CandidateTable";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [count, shortlisted, pending, rejected, candidates] = await Promise.all([
    prisma.candidate.count(),
    prisma.candidate.count({ where: { status: "SHORTLISTED" } }),
    prisma.candidate.count({ where: { status: "PENDING" } }),
    prisma.candidate.count({ where: { status: "REJECTED" } }),
    prisma.candidate.findMany({ orderBy: { updatedAt: "desc" }, take: 6 })
  ]);

  return (
    <AppShell>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">Candidate pipeline and AI scoring overview.</p>
          </div>
          <Link
            href="/candidates?new=1"
            className="focus-ring rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Add candidate
          </Link>
        </div>
        <section className="grid gap-4 md:grid-cols-4">
          {[
            ["Total", count],
            ["Shortlisted", shortlisted],
            ["Pending", pending],
            ["Rejected", rejected]
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-line bg-white p-5 shadow-soft">
              <div className="text-sm font-medium text-slate-500">{label}</div>
              <div className="mt-2 text-3xl font-bold text-ink">{value}</div>
            </div>
          ))}
        </section>
        <section className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent candidates</h2>
            <Link href="/candidates" className="text-sm font-semibold text-brand">
              View all
            </Link>
          </div>
          <CandidateTable candidates={candidates} />
        </section>
      </div>
    </AppShell>
  );
}
