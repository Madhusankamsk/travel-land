"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "./confirm-modal";

type Props = { href: string };

export function EditTripButton({ href }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleConfirm() {
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-zinc-700 hover:text-zinc-900"
      >
        Edit
      </button>
      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        title="Are you sure?"
        message="Are you sure you want to edit this trip?"
        confirmLabel="Yes, edit"
      />
    </>
  );
}
