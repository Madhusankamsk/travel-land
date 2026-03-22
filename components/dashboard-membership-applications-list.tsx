import Link from "next/link";

export type MembershipApplicationRow = {
  id: string;
  reference: string | null;
  firstName: string;
  lastName: string;
  email: string;
  roomType: string;
  totalQuota: number;
  createdAt: string;
  packageName: string;
  tourId?: string | null;
  tourTitle?: string | null;
};

type Props = {
  applications: MembershipApplicationRow[];
  /** `trip` = single-trip dashboard stats; `global` = all applications with Trip column */
  variant: "trip" | "global";
  emptyMessage?: string;
};

export function MembershipApplicationsList({
  applications,
  variant,
  emptyMessage = "No trip membership applications yet.",
}: Props) {
  if (applications.length === 0) {
    return (
      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">{emptyMessage}</p>
    );
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            {variant === "global" ? <th className="pb-2 font-medium">Trip</th> : null}
            <th className="pb-2 font-medium">Reference</th>
            <th className="pb-2 font-medium">Applicant</th>
            <th className="pb-2 font-medium">Email</th>
            <th className="pb-2 font-medium">Room</th>
            <th className="pb-2 font-medium text-right">Total (€)</th>
            <th className="pb-2 font-medium">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr
              key={a.id}
              className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
            >
              {variant === "global" ? (
                <td className="max-w-[200px] py-2.5">
                  {a.tourId ? (
                    <Link
                      href={`/dashboard/trips/${a.tourId}/stats`}
                      className="font-medium text-zinc-800 hover:underline dark:text-zinc-200"
                    >
                      {a.tourTitle ?? a.packageName}
                    </Link>
                  ) : (
                    <span className="text-zinc-600 dark:text-zinc-400">{a.packageName}</span>
                  )}
                </td>
              ) : null}
              <td className="py-2.5 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                {a.reference ?? "—"}
              </td>
              <td className="py-2.5 text-zinc-800 dark:text-zinc-200">
                {[a.firstName, a.lastName].filter(Boolean).join(" ") || "—"}
              </td>
              <td className="max-w-[180px] truncate py-2.5 text-zinc-600 dark:text-zinc-400" title={a.email}>
                {a.email}
              </td>
              <td className="py-2.5 text-zinc-700 dark:text-zinc-300">{a.roomType}</td>
              <td className="py-2.5 text-right font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                {Number(a.totalQuota).toLocaleString("en-GB", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="py-2.5 text-zinc-500 dark:text-zinc-400">
                {new Date(a.createdAt).toLocaleString(undefined, {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
