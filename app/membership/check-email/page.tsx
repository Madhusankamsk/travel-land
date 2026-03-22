import Link from "next/link";
import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { InnerPageHero } from "@/components/inner-page-hero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Controlla la tua email — TRAVEL-LAND.IT",
  description:
    "Ti abbiamo inviato un link per accedere. Aprilo per continuare con la richiesta di iscrizione.",
};

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

/** Accept only same-site relative paths (open redirect safe). */
function safeNextPath(raw: string | undefined): string | null {
  if (!raw || typeof raw !== "string") return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw).trim();
  } catch {
    return null;
  }
  if (!decoded.startsWith("/") || decoded.startsWith("//")) return null;
  return decoded;
}

export default async function MembershipCheckEmailPage({ searchParams }: PageProps) {
  const { next: nextRaw } = await searchParams;
  const returnPath = safeNextPath(nextRaw);

  return (
    <main id="main-content" className="min-h-screen bg-[var(--color-travertine)] pb-24 pt-0">
      <InnerPageHero
        title="Controlla la tua email"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Iscrizione", href: "/membership" },
          { label: "Accesso" },
        ]}
      />

      <div className="mx-auto max-w-[720px] px-4 pt-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[20px] border border-[var(--color-bone)] bg-white shadow-[var(--shadow-md)]">
          <div className="border-b border-[var(--color-bone)] bg-[var(--color-parchment)] px-6 py-8 sm:px-8">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-6">
              <span
                className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-adriatic)] shadow-[var(--shadow-sm)] sm:mb-0"
                aria-hidden
              >
                <Mail className="h-7 w-7" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-terracotta)]">
                  Prossimo passaggio
                </p>
                <h1 className="mt-1 font-[family-name:var(--font-cormorant)] text-[28px] font-medium leading-tight text-[var(--color-obsidian)] sm:text-[32px]">
                  Link di accesso inviato
                </h1>
                <p className="mt-3 text-[15px] leading-relaxed text-[#7A7060]">
                  Controlla la tua casella di posta e anche la cartella <em>spam</em> o <em>promozioni</em>.
                  Clicca sul link che ti abbiamo inviato per accedere in modo sicuro senza password.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 px-6 py-8 sm:px-8">
            <div
              className="flex gap-3 rounded-xl border border-[#2E5B8B]/25 bg-[#D8E8F5] px-4 py-3 text-[14px] leading-relaxed text-[#1A4A70]"
              role="status"
            >
              <span className="mt-0.5 shrink-0 font-medium" aria-hidden>
                →
              </span>
              <p>
                Dopo aver effettuato l&apos;accesso, la tua richiesta di iscrizione continuerà
                automaticamente sulla pagina da cui stavi compilando il modulo.
              </p>
            </div>

            {returnPath && (
              <p className="text-[13px] leading-relaxed text-[#7A7060]">
                Destinazione dopo l&apos;accesso:{" "}
                <Link
                  href={returnPath}
                  className="font-medium text-[var(--color-azure)] underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2 rounded-sm"
                >
                  apri la pagina del viaggio
                </Link>{" "}
                (puoi anche chiuderla e usare solo il link ricevuto via email).
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/"
                className="inline-flex rounded-full border-[1.5px] border-[var(--color-bone)] bg-white px-6 py-3 text-sm font-medium text-[var(--color-obsidian)] shadow-[var(--shadow-sm)] transition-transform hover:bg-[var(--color-parchment)] focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2 active:scale-[0.97]"
              >
                Home
              </Link>
              <Link
                href="/upcoming-trips"
                className="inline-flex rounded-full bg-[var(--color-obsidian)] px-6 py-3 text-sm font-medium tracking-[0.04em] text-[#F0EAE0] shadow-[var(--shadow-md)] transition-transform hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2 active:scale-[0.97]"
              >
                Prossimi viaggi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
