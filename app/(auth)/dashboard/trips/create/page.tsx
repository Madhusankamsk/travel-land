import Link from "next/link";
import { TripForm } from "@/components/trip-form";
import { createTrip, noopUpdateTrip } from "../actions";

export default function CreateTripPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/trips"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          ← Trips
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900">Create trip</h1>
      </div>
      <TripForm
        mode="create"
        createAction={createTrip}
        updateAction={noopUpdateTrip}
      />
    </div>
  );
}
