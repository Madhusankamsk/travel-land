"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";
import { logoutAction } from "@/lib/auth-actions";
import { BookingProgressStepper } from "./booking-progress-stepper";

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
    <div className="mx-auto max-w-[960px] px-6 py-16 lg:px-20 lg:py-24">
      <header className="mb-16">
        <h1 className="font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,48px)] font-medium leading-tight text-obsidian">
          {t("profile.title")}
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[#7A7060]">
          {t("profile.subtitle")}
        </p>
      </header>

      <section className="mb-16">
        <div className="rounded-[20px] border border-bone bg-white p-6 shadow-[var(--shadow-sm)] lg:p-8">
          <h2 className="mb-4 font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-tight text-obsidian">
            {displayName}
          </h2>
          <dl className="grid gap-2 text-[15px]">
            <div>
              <dt className="text-[12px] font-medium uppercase tracking-wider text-[#7A7060]">
                Email
              </dt>
              <dd className="text-obsidian">{user.email}</dd>
            </div>
            {user.mobile && (
              <div>
                <dt className="text-[12px] font-medium uppercase tracking-wider text-[#7A7060]">
                  Mobile
                </dt>
                <dd className="text-obsidian">{user.mobile}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <section className="mb-16">
        <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-terracotta">
          {t("profile.myBookings")}
        </p>
        {bookings.length === 0 ? (
          <div className="rounded-[20px] border border-bone bg-white p-8 text-center shadow-[var(--shadow-sm)]">
            <p className="text-[15px] text-[#7A7060]">{t("profile.noBookings")}</p>
            <Link
              href="/upcoming-trips"
              className="mt-4 inline-block font-medium text-terracotta underline decoration-terracotta underline-offset-2 hover:text-siena"
            >
              {t("profile.browseUpcoming")}
            </Link>
          </div>
        ) : (
          <ul className="space-y-8">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="rounded-[20px] border border-bone bg-white p-6 shadow-[var(--shadow-sm)] lg:p-8"
              >
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                  <Link
                    href={`/upcoming-trips/${booking.tour.id}`}
                    className="font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-tight text-obsidian underline decoration-bone underline-offset-2 hover:decoration-obsidian"
                  >
                    {booking.tour.title}
                  </Link>
                  {booking.reference && (
                    <span className="text-[13px] text-[#7A7060]">
                      {booking.reference}
                    </span>
                  )}
                </div>
                <p className="mb-4 text-[13px] text-[#7A7060]">
                  {booking.tour.durationLabel}
                </p>
                <BookingProgressStepper status={booking.status as import("@prisma/client").BookingStatus} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-16">
        <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-terracotta">
          {t("profile.upcomingTrips")}
        </p>
        <ul className="grid gap-6 sm:grid-cols-2">
          {upcomingTours.map((tour) => (
            <li key={tour.id}>
              <Link
                href={`/upcoming-trips/${tour.id}`}
                className="block rounded-[20px] border border-bone bg-white p-6 shadow-[var(--shadow-sm)] transition-[box-shadow,transform] duration-150 hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5"
              >
                <h3 className="font-[family-name:var(--font-cormorant)] text-[20px] font-medium leading-tight text-obsidian">
                  {tour.title}
                </h3>
                <p className="mt-2 text-[13px] text-[#7A7060]">
                  {tour.durationLabel}
                </p>
                <p className="mt-2 text-[15px] font-medium text-obsidian">
                  From {formatPrice(tour.basePrice)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-wrap items-center gap-4">
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex items-center rounded-full border border-bone bg-white px-5 py-3 text-sm font-medium tracking-wide text-obsidian transition-all duration-150 hover:border-obsidian hover:bg-travertine focus:outline-2 focus:outline-oro focus:outline-offset-2"
          >
            {t("profile.logOut")}
          </button>
        </form>
        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-parchment px-5 py-3 text-sm font-medium tracking-wide text-siena transition-all duration-150 hover:bg-bone/80"
        >
          {t("profile.home")}
        </Link>
      </section>
    </div>
  );
}
