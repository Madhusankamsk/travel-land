import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";
import { authLoginSearchParams } from "@/lib/auth-url";
import { prisma } from "@/lib/prisma";
import { ProfileView } from "@/components/profile-view";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect(`/?${authLoginSearchParams({ from: "/profile" })}`);
  }

  let user: Awaited<ReturnType<typeof prisma.user.findUnique>> = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true, email: true, mobile: true },
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown database error";
    console.warn(`[profile] Failed to load user: ${reason}`);
  }

  if (!user) {
    const cookieStore = await cookies();
    cookieStore.delete("auth_user_id");
    cookieStore.delete("auth_session");
    cookieStore.delete("auth_role");
    redirect(`/?${authLoginSearchParams({ from: "/profile" })}`);
  }

  let bookings: Awaited<ReturnType<typeof prisma.booking.findMany>> = [];
  let membershipBookings: Awaited<ReturnType<typeof prisma.membershipBooking.findMany>> = [];
  let upcomingTours: Awaited<ReturnType<typeof prisma.tour.findMany>> = [];
  try {
    [bookings, membershipBookings, upcomingTours] = await Promise.all([
      prisma.booking.findMany({
        where: { userId },
        include: { tour: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.membershipBooking.findMany({
        where: { userId },
        select: { id: true, reference: true, tourId: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.tour.findMany({
        where: { status: { in: ["UPCOMING", "OPEN"] } },
        select: { id: true, title: true, durationLabel: true, basePrice: true },
        take: 10,
        orderBy: { createdAt: "desc" },
      }),
    ]);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown database error";
    console.warn(`[profile] Failed to load bookings/tours: ${reason}`);
  }

  const membershipTourIds = membershipBookings
    .map((b) => b.tourId)
    .filter((id): id is string => Boolean(id));

  let membershipTours: Awaited<ReturnType<typeof prisma.tour.findMany>> = [];
  if (membershipTourIds.length) {
    try {
      membershipTours = await prisma.tour.findMany({
        where: { id: { in: membershipTourIds } },
        select: { id: true, title: true, durationLabel: true, basePrice: true },
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown database error";
      console.warn(`[profile] Failed to resolve membership tours: ${reason}`);
    }
  }

  const toursById = new Map(membershipTours.map((t) => [t.id, t]));

  const serializedBookingsLegacy = bookings.map((b) => ({
    id: b.id,
    status: b.status,
    reference: b.reference,
    createdAt: b.createdAt,
    tour: {
      id: b.tour.id,
      title: b.tour.title,
      durationLabel: b.tour.durationLabel,
      basePrice: b.tour.basePrice.toString(),
    },
  }));

  const serializedMembershipBookings = membershipBookings
    .map((mb) => {
      if (!mb.tourId) return null;
      const tour = toursById.get(mb.tourId);
      if (!tour) return null;
      return {
        id: mb.id,
        status: "REQUESTED",
        reference: mb.reference,
        createdAt: mb.createdAt,
        tour: {
          id: tour.id,
          title: tour.title,
          durationLabel: tour.durationLabel,
          basePrice: tour.basePrice.toString(),
        },
      };
    })
    .filter((x): x is NonNullable<typeof x> => x != null);

  const combinedBookings = [...serializedBookingsLegacy, ...serializedMembershipBookings].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  const serializedBookings = combinedBookings.map(({ createdAt, ...rest }) => rest);

  const serializedUpcoming = upcomingTours.map((t) => ({
    id: t.id,
    title: t.title,
    durationLabel: t.durationLabel,
    basePrice: t.basePrice.toString(),
  }));

  return (
    <ProfileView
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
      }}
      bookings={serializedBookings}
      upcomingTours={serializedUpcoming}
    />
  );
}
