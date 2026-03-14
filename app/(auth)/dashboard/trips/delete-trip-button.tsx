"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTrip } from "./actions";
import { ConfirmModal } from "./confirm-modal";

type Props = { tourId: string; tourTitle: string };

export function DeleteTripButton({ tourId, tourTitle }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleConfirm() {
    const formData = new FormData();
    formData.set("id", tourId);
    await deleteTrip(formData);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-red-600 hover:text-red-700"
      >
        Delete
      </button>
      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        title="Are you sure?"
        message={`Delete "${tourTitle}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  );
}
