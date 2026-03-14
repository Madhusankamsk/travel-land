"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
};

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "Are you sure you want to continue?",
  confirmLabel = "Yes",
  cancelLabel = "Cancel",
  variant = "default",
}: Props) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const confirmClass =
    variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-zinc-900 text-white hover:bg-zinc-800";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
        <h2
          id="confirm-modal-title"
          className="text-lg font-semibold text-zinc-900"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm text-zinc-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
