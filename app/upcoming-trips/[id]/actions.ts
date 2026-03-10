"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

// Temporary cast until Prisma client is regenerated with the Booking model
const bookingClient = prisma as any;

export async function requestToBookAction(formData: FormData): Promise<void> {
  const tourId = formData.get("tourId");

  if (typeof tourId !== "string" || !tourId) {
    redirect("/upcoming-trips");
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }

  const tour = await prisma.tour.findUnique({
    where: { id: tourId, status: "UPCOMING" },
  });
  if (!tour) {
    redirect("/upcoming-trips");
  }

  const existing = await bookingClient.booking.findUnique({
    where: {
      userId_tourId: { userId, tourId },
    },
  });
  if (existing) {
    redirect("/profile");
  }

  const ref = "TL-" + Date.now().toString(36).toUpperCase().slice(-6);
  await bookingClient.booking.create({
    data: {
      userId,
      tourId,
      status: "REQUESTED",
      reference: ref,
    },
  });

  redirect("/profile");
}
