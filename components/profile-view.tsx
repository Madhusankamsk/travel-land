"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";
import { logoutAction } from "@/lib/auth-actions";
import { InnerPageHero } from "@/components/inner-page-hero";
import { BookingProgressInteractive } from "./booking-progress-stepper";
import { MembershipMagicCallbackBanner } from "./membership-magic-callback";

type UserData = {
  firstName: string | null;
  lastName: string | null;
  email: string;
  mobile: string | null;
};

type TourSummary = {
  id: string;
  title: string;
  durationLabel: string;
  basePrice: string | number;
};

type BookingWithTour = {
  id: string;
  status: string;
  reference: string | null;
  tour: TourSummary;
};

type ProfileViewProps = {
  user: UserData;
  bookings: BookingWithTour[];
  upcomingTours: TourSummary[];
};

function formatPrice(value: string | number): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function ProfileView({ user, bookings, upcomingTours }: ProfileViewProps) {
  const { t } = useI18n();
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

  return (
    <main id="main-content" className="min-h-screen bg-[var(--color-travertine)] pb-24 pt-0">
      <InnerPageHero
        title={t("profile.title")}
        breadcrumb={[
          { label: t("nav.home"), href: "/" },
          { label: t("profile.title") },
        ]}
      />

      <div className="mx-auto max-w-[960px] px-4 pt-10 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <MembershipMagicCallbackBanner />
        </Suspense>

        <p className="mb-10 text-[15px] leading-relaxed text-[#7A7060]">
          {t("profile.subtitle")}
        </p>

        <section className="mb-12">
          <div className="overflow-hidden rounded-[20px] border border-[var(--color-bone)] bg-white shadow-[var(--shadow-md)]">
            <div className="border-b border-[var(--color-bone)] bg-[var(--color-parchment)] px-6 py-6 sm:px-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-terracotta)]">
                {t("profile.detailsEyebrow")}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-[24px] font-medium leading-tight text-[var(--color-obsidian)] sm:text-[26px]">
                {displayName}
              </h2>
            </div>
            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <dl className="grid gap-5 text-[15px]">
                <div>
                  <dt className="text-[12px] font-medium uppercase tracking-wider text-[#7A7060]">
                    Email
                  </dt>
                  <dd className="mt-1 text-[var(--color-obsidian)]">{user.email}</dd>
                </div>
                {user.mobile && (
                  <div>
                    <dt className="text-[12px] font-medium uppercase tracking-wider text-[#7A7060]">
                      Mobile
                    </dt>
                    <dd className="mt-1 text-[var(--color-obsidian)]">{user.mobile}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-terracotta)]">
            {t("profile.myBookings")}
          </p>
          {bookings.length === 0 ? (
            <div className="rounded-[20px] border border-[var(--color-bone)] bg-white p-8 text-center shadow-[var(--shadow-md)]">
              <p className="text-[15px] leading-relaxed text-[#7A7060]">{t("profile.noBookings")}</p>
              <Link
                href="/upcoming-trips"
                className="mt-5 inline-block text-sm font-medium text-[var(--color-azure)] underline underline-offset-2 transition-colors hover:text-[var(--color-obsidian)] focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2 rounded-sm"
              >
                {t("profile.browseUpcoming")}
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {bookings.map((booking) => (
                <li
                  key={booking.id}
                  className="overflow-hidden rounded-[20px] border border-[var(--color-bone)] bg-white shadow-[var(--shadow-md)]"
                >
                  <div className="border-b border-[var(--color-bone)] bg-[var(--color-parchment)]/60 px-6 py-5 sm:px-8">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <Link
                        href={`/upcoming-trips/${booking.tour.id}`}
                        className="font-[family-name:var(--font-cormorant)] text-[20px] font-medium leading-tight text-[var(--color-obsidian)] underline decoration-[var(--color-bone)] underline-offset-2 transition-colors hover:decoration-[var(--color-obsidian)] focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2 rounded-sm"
                      >
                        {booking.tour.title}
                      </Link>
                      {booking.reference && (
                        <span className="rounded-full bg-white/80 px-3 py-1 text-[12px] font-medium text-[#7A7060] shadow-[var(--shadow-sm)]">
                          {booking.reference}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-[13px] text-[#7A7060]">{booking.tour.durationLabel}</p>
                  </div>
                  <div className="px-6 py-5 sm:px-8 sm:py-6">
                    <BookingProgressInteractive
                      instanceId={booking.id}
                      status={booking.status as import("@prisma/client").BookingStatus}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mb-12">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-terracotta)]">
            {t("profile.upcomingTrips")}
          </p>
          <ul className="grid gap-6 sm:grid-cols-2">
            {upcomingTours.map((tour) => (
              <li key={tour.id}>
                <Link
                  href={`/upcoming-trips/${tour.id}`}
                  className="group block overflow-hidden rounded-[20px] border border-[var(--color-bone)] bg-white shadow-[var(--shadow-md)] transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--color-bone)]/90 hover:shadow-[var(--shadow-lg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2"
                >
                  <div className="border-b border-[var(--color-bone)] bg-[var(--color-parchment)]/40 px-5 py-4 transition-colors group-hover:bg-[var(--color-parchment)]/70">
                    <h3 className="font-[family-name:var(--font-cormorant)] text-[19px] font-medium leading-tight text-[var(--color-obsidian)]">
                      {tour.title}
                    </h3>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-[13px] text-[#7A7060]">{tour.durationLabel}</p>
                    <p className="mt-2 text-[15px] font-medium text-[var(--color-obsidian)]">
                      {t("profile.fromPrice", { price: formatPrice(tour.basePrice) })}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-wrap gap-3 pt-2">
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex rounded-full border-[1.5px] border-[var(--color-bone)] bg-white px-6 py-3 text-sm font-medium text-[var(--color-obsidian)] shadow-[var(--shadow-sm)] transition-transform hover:bg-[var(--color-parchment)] focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2 active:scale-[0.97]"
            >
              {t("profile.logOut")}
            </button>
          </form>
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-[var(--color-obsidian)] px-6 py-3 text-sm font-medium tracking-[0.04em] text-[#F0EAE0] shadow-[var(--shadow-md)] transition-transform hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2 active:scale-[0.97]"
          >
            {t("profile.home")}
          </Link>
        </section>
      </div>
    </main>
  );
}
