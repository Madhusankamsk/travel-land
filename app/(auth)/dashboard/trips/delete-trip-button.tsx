"use client";

import { useRouter } from "next/navigation";
import { deleteTrip } from "./actions";

type Props = { tourId: string; tourTitle: string };

export function DeleteTripButton({ tourId, tourTitle }: Props) {
  const router = useRouter();

  async function handleClick() {
    const ok = window.confirm(
      `Delete "${tourTitle}"? This cannot be undone.`
    );
    if (!ok) return;

    const formData = new FormData();
    formData.set("id", tourId);
    await deleteTrip(formData);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-xs font-medium text-red-600 hover:text-red-700"
    >
      Delete
    </button>
  );
}
