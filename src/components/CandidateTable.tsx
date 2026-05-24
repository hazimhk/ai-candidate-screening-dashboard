import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";

type CandidateRow = {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experienceYears: number;
  aiScore: number | null;
  status: "SHORTLISTED" | "PENDING" | "REJECTED";
};

export function CandidateTable({ candidates }: { candidates: CandidateRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line">
          <thead className="bg-slate-50">
            <tr>
              {["Candidate", "Skills", "Experience", "AI Score", "Status", ""].map((header) => (
                <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div className="font-semibold text-ink">{candidate.name}</div>
                  <div className="text-sm text-slate-500">{candidate.email}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex max-w-md flex-wrap gap-1.5">
                    {candidate.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{candidate.experienceYears} yrs</td>
                <td className="px-4 py-4 text-sm font-semibold text-ink">
                  {candidate.aiScore ?? "Not scored"}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={candidate.status} />
                </td>
                <td className="px-4 py-4 text-right">
                  <Link className="text-sm font-semibold text-brand hover:text-blue-700" href={`/candidates/${candidate.id}`}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {candidates.length === 0 ? (
        <div className="px-4 py-12 text-center text-sm text-slate-500">No candidates match this search.</div>
      ) : null}
    </div>
  );
}
