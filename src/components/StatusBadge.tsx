import clsx from "clsx";

const labels = {
  SHORTLISTED: "Shortlisted",
  PENDING: "Pending",
  REJECTED: "Rejected"
};

export function StatusBadge({ status }: { status: keyof typeof labels }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "SHORTLISTED" && "bg-teal-50 text-positive ring-1 ring-teal-200",
        status === "PENDING" && "bg-amber-50 text-warning ring-1 ring-amber-200",
        status === "REJECTED" && "bg-red-50 text-danger ring-1 ring-red-200"
      )}
    >
      {labels[status]}
    </span>
  );
}
