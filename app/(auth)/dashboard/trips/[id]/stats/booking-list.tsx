import Link from "next/link";

export type BookingDetail = {
  id: string;
  reference: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    mobile: string | null;
    role: string;
  };
};

const statusLabels: Record<string, string> = {
  REQUESTED: "Requested",
  CONFIRMED: "Confirmed",
  DEPOSIT_PAID: "Deposit paid",
  PAID: "Paid",
  COMPLETED: "Completed",
};

type Props = { bookings: BookingDetail[] };

export function BookingList({ bookings }: Props) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500">
            <th className="pb-2 font-medium">Reference</th>
            <th className="pb-2 font-medium">User</th>
            <th className="pb-2 font-medium">Status</th>
            <th className="pb-2 font-medium">Created</th>
            <th className="pb-2 font-medium">View</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr
              key={b.id}
              className="border-b border-zinc-100 last:border-0"
            >
              <td className="py-2 font-mono text-zinc-700">
                {b.reference ?? "—"}
              </td>
              <td className="py-2 text-zinc-700">
                {b.user.firstName || b.user.lastName
                  ? [b.user.firstName, b.user.lastName].filter(Boolean).join(" ")
                  : b.user.email}
              </td>
              <td className="py-2">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                  {statusLabels[b.status] ?? b.status}
                </span>
              </td>
              <td className="py-2 text-zinc-500">
                {new Date(b.createdAt).toLocaleDateString()}
              </td>
              <td className="py-2">
                <Link
                  href={`/dashboard/bookings/${b.id}`}
                  className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
