import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckCircle2, Mail, MapPin, Calendar } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { authLoginSearchParams } from "@/lib/auth-url";
import { InnerPageHero } from "@/components/inner-page-hero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Richiesta di partecipazione ricevuta — TRAVEL-LAND.IT",
  description:
    "La tua richiesta è stata registrata. Controlla la tua email per i prossimi passaggi della prenotazione.",
};

type PageProps = {
  searchParams: Promise<{ ref?: string }>;
};

const ROOM_IT: Record<string, string> = {
  Double: "Doppia",
  "Double Shared": "Doppia in condivisione",
  Single: "Singola",
  Triple: "Tripla",
  "Triple Shared": "Tripla in condivisione",
};

function formatEur(value: Prisma.Decimal | number): string {
  const n = typeof value === "number" ? value : Number(value);
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);
}

function formatDateIt(d: Date): string {
  return d.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[var(--color-bone)] py-3 last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
      <dt className="shrink-0 text-[12px] font-medium uppercase tracking-[0.08em] text-[#7A7060]">
        {label}
      </dt>
      <dd className="min-w-0 text-right text-[15px] text-[var(--color-obsidian)] sm:text-right">{value}</dd>
    </div>
  );
}

export default async function MembershipSuccessPage({ searchParams }: PageProps) {
  const { ref } = await searchParams;
  const refTrimmed = ref?.trim() ?? "";
  if (!refTrimmed) {
    redirect("/membership");
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    redirect(
      `/?${authLoginSearchParams({
        next: `/membership/success?ref=${encodeURIComponent(refTrimmed)}`,
      })}`
    );
  }

  const booking = await prisma.membershipBooking.findFirst({
    where: { reference: refTrimmed, userId },
  });

  const tour =
    booking?.tourId != null
      ? await prisma.tour.findUnique({
          where: { id: booking.tourId },
          select: {
            id: true,
            title: true,
            durationLabel: true,
            durationDaysNights: true,
            destinationCountry: true,
            destinationCities: true,
            tripCode: true,
          },
        })
      : null;

  if (!booking) {
    return (
      <main id="main-content" className="min-h-screen bg-[var(--color-travertine)] pb-16 pt-0">
        <InnerPageHero
          title="Richiesta non trovata"
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Iscrizione", href: "/membership" },
            { label: "Esito" },
          ]}
        />
        <div className="mx-auto max-w-[720px] px-4 pt-10 sm:px-6 lg:px-8">
          <div className="rounded-[20px] border border-[var(--color-bone)] bg-white p-8 shadow-[var(--shadow-sm)]">
            <p className="text-[15px] leading-relaxed text-[#7A7060]">
              Non abbiamo trovato una richiesta con questo riferimento associata al tuo account. Se hai
              bisogno di assistenza, contattaci dalla pagina{" "}
              <Link href="/contact" className="text-[var(--color-azure)] underline underline-offset-2">
                Contatti
              </Link>
              .
            </p>
            <Link
              href="/upcoming-trips"
              className="mt-6 inline-flex rounded-full border-[1.5px] border-[var(--color-bone)] bg-white px-7 py-3.5 text-sm font-medium text-[var(--color-obsidian)] shadow-[var(--shadow-sm)] transition-transform hover:bg-[var(--color-parchment)] focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2 active:scale-[0.97]"
            >
              Prossimi viaggi
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const roomLabel = ROOM_IT[booking.roomType] ?? booking.roomType;
  const refDisplay = booking.reference ?? refTrimmed;

  return (
    <main id="main-content" className="min-h-screen bg-[var(--color-travertine)] pb-24 pt-0">
      <InnerPageHero
        title="Richiesta ricevuta"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Iscrizione", href: "/membership" },
          { label: "Conferma" },
        ]}
      />

      <div className="mx-auto max-w-[1200px] px-4 pt-10 sm:px-6 lg:px-8">
        {/* Success alert — semantic colors per design system */}
        <div
          className="mb-10 flex gap-4 rounded-xl border border-[#2D6A4F]/25 bg-[#D8EFE4] px-5 py-4 shadow-[var(--shadow-sm)]"
          role="status"
          aria-live="polite"
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2D6A4F] text-white"
            aria-hidden
          >
            <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-snug text-[var(--color-obsidian)]">
              Iscrizione registrata con successo
            </p>
            <p className="mt-1 text-[14px] leading-relaxed text-[#2D6A4F]">
              La tua richiesta di partecipazione è stata salvata. Il riferimento della pratica è{" "}
              <span className="font-[family-name:var(--font-mono)] font-medium text-[var(--color-obsidian)]">
                {refDisplay}
              </span>
              .
            </p>
          </div>
        </div>

        {/* Email prompt — info + icon + text (WCAG: not color alone) */}
        <div className="mb-12 flex flex-col gap-4 rounded-xl border border-[var(--color-bone)] bg-white p-6 shadow-[var(--shadow-md)] sm:flex-row sm:items-start sm:gap-6">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-parchment)] text-[var(--color-adriatic)]"
            aria-hidden
          >
            <Mail className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-terracotta)]">
              Prossimo passaggio
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-cormorant)] text-[24px] font-medium leading-tight text-[var(--color-obsidian)]">
              Controlla la tua email
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#7A7060]">
              Per i prossimi passaggi della prenotazione useremo l&apos;indirizzo{" "}
              <strong className="font-medium text-[var(--color-obsidian)]">{booking.email}</strong>. Controlla
              regolarmente la posta in arrivo (anche spam e promozioni): riceverai conferme, richieste di
              documenti e istruzioni per il pagamento. Il team Travel-Land potrà contattarti anche da questo
              recapito per finalizzare l&apos;iscrizione.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Trip card */}
          {tour && (
            <section
              className="lg:col-span-5"
              aria-labelledby="trip-summary-heading"
            >
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-terracotta)]">
                Viaggio
              </p>
              <div className="overflow-hidden rounded-[20px] border border-[var(--color-bone)] bg-white shadow-[var(--shadow-sm)]">
                <div className="border-b border-[var(--color-bone)] bg-[var(--color-parchment)] px-6 py-5">
                  <h2
                    id="trip-summary-heading"
                    className="font-[family-name:var(--font-cormorant)] text-[28px] font-medium leading-tight text-[var(--color-obsidian)]"
                  >
                    {tour.title}
                  </h2>
                  {tour.tripCode && (
                    <p className="mt-2 font-[family-name:var(--font-mono)] text-[12px] text-[#7A7060]">
                      Codice: {tour.tripCode}
                    </p>
                  )}
                </div>
                <div className="space-y-4 px-6 py-5">
                  <div className="flex items-start gap-3 text-[14px] text-[#7A7060]">
                    <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-terracotta)]" aria-hidden />
                    <div>
                      <span className="sr-only">Periodo: </span>
                      {tour.durationLabel}
                      {tour.durationDaysNights ? (
                        <span className="text-[#B5A890]"> · {tour.durationDaysNights}</span>
                      ) : null}
                    </div>
                  </div>
                  {(tour.destinationCountry || tour.destinationCities) && (
                    <div className="flex items-start gap-3 text-[14px] text-[#7A7060]">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-terracotta)]" aria-hidden />
                      <div>
                        <span className="sr-only">Destinazione: </span>
                        {[tour.destinationCities, tour.destinationCountry].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                  )}
                  <Link
                    href={`/upcoming-trips/${tour.id}`}
                    className="inline-flex text-[14px] font-medium text-[var(--color-azure)] underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2 rounded-sm"
                  >
                    Torna alla scheda del viaggio
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Submitted data */}
          <section
            className={tour ? "lg:col-span-7" : "lg:col-span-12"}
            aria-labelledby="submitted-data-heading"
          >
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-terracotta)]">
              Riepilogo dati inseriti
            </p>
            <div className="rounded-[20px] border border-[var(--color-bone)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
              <h2
                id="submitted-data-heading"
                className="font-[family-name:var(--font-cormorant)] text-[22px] font-medium text-[var(--color-obsidian)]"
              >
                I tuoi dati
              </h2>
              <p className="mt-2 text-[13px] text-[#7A7060]">
                Riepilogo della richiesta così come l&apos;hai inviata. Per modifiche, contattaci citando il
                riferimento <span className="font-[family-name:var(--font-mono)]">{refDisplay}</span>.
              </p>
              <dl className="mt-6">
                <SummaryRow label="Nome e cognome" value={`${booking.firstName} ${booking.lastName}`.trim()} />
                <SummaryRow label="Data di nascita" value={formatDateIt(booking.dateOfBirth)} />
                <SummaryRow label="Indirizzo" value={booking.address} />
                <SummaryRow label="Codice fiscale" value={booking.taxCode} />
                <SummaryRow label="Email" value={booking.email} />
                <SummaryRow label="Telefono" value={booking.telephone} />
                <SummaryRow label="Pacchetto / viaggio" value={booking.packageName} />
                <SummaryRow label="Tipologia camera" value={roomLabel} />
                <SummaryRow label="Quota base" value={formatEur(booking.baseQuota)} />
                <SummaryRow label="Supplementi vari" value={formatEur(booking.supplementsVarious)} />
                <SummaryRow
                  label="Assicurazione medico-bagaglio"
                  value={formatEur(booking.mandatoryMedicalBaggageInsuranceAmount)}
                />
                <SummaryRow
                  label="Assicurazione annullamento"
                  value={formatEur(booking.travelCancellationInsuranceAmount)}
                />
                <SummaryRow label="Iscrizione / pratica" value={formatEur(booking.registrationFee)} />
                <div className="flex flex-col gap-1 border-t border-[var(--color-bone)] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--color-obsidian)]">
                    Totale indicativo
                  </dt>
                  <dd className="font-[family-name:var(--font-cormorant)] text-[28px] font-medium text-[var(--color-obsidian)]">
                    {formatEur(booking.totalQuota)}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/profile"
            className="inline-flex rounded-full bg-[var(--color-obsidian)] px-7 py-3.5 text-sm font-medium tracking-[0.04em] text-[#F0EAE0] shadow-[var(--shadow-md)] transition-transform hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2 active:scale-[0.97]"
          >
            Il mio profilo
          </Link>
          <Link
            href="/upcoming-trips"
            className="inline-flex rounded-full border-[1.5px] border-[var(--color-bone)] bg-white px-7 py-3.5 text-sm font-medium tracking-[0.04em] text-[var(--color-obsidian)] shadow-[var(--shadow-sm)] transition-transform hover:bg-[var(--color-parchment)] focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2 active:scale-[0.97]"
          >
            Altri viaggi
          </Link>
        </div>
      </div>
    </main>
  );
}
