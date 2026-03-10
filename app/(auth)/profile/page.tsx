import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileView } from "@/components/profile-view";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login?from=/profile");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { firstName: true, lastName: true, email: true, mobile: true },
  });

  if (!user) {
    const cookieStore = await cookies();
    cookieStore.delete("auth_user_id");
    cookieStore.delete("auth_session");
    cookieStore.delete("auth_role");
    redirect("/login?from=/profile");
  }

  const [bookings, upcomingTours] = await Promise.all([
    prisma.booking.findMany({
      where: { userId },
      include: { tour: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.tour.findMany({
      where: { status: "UPCOMING" },
      select: { id: true, title: true, durationLabel: true, basePrice: true },
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const serializedBookings = bookings.map((b) => ({
    id: b.id,
    status: b.status,
    reference: b.reference,
    tour: {
      id: b.tour.id,
      title: b.tour.title,
      durationLabel: b.tour.durationLabel,
      basePrice: b.tour.basePrice.toString(),
    },
  }));

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
