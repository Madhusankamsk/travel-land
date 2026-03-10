"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function requestToBookAction(tourId: string): Promise<{ error?: string }> {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }

  const tour = await prisma.tour.findUnique({
    where: { id: tourId, status: "UPCOMING" },
  });
  if (!tour) {
    return { error: "Trip not found or no longer available." };
  }

  const existing = await prisma.booking.findUnique({
    where: {
      userId_tourId: { userId, tourId },
    },
  });
  if (existing) {
    redirect("/profile");
  }

  const ref = "TL-" + Date.now().toString(36).toUpperCase().slice(-6);
  await prisma.booking.create({
    data: {
      userId,
      tourId,
      status: "REQUESTED",
      reference: ref,
    },
  });

  redirect("/profile");
}
