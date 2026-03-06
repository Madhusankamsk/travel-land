"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "rounded-lg border border-zinc-200 shadow-sm",
          title: "font-medium",
          description: "text-zinc-600",
        },
      }}
    />
  );
}
