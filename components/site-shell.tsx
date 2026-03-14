"use client";

import { usePathname } from "next/navigation";
import { LiquidHeader } from "@/components/liquid-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <LiquidHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}
