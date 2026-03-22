import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { MembershipPageClient } from "./membership-client";
import type { PackageOption } from "@/components/membership-form";
import { MAGIC_LINK_MEMBERSHIP_NEXT } from "@/lib/membership-magic";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ callback?: string; error?: string; tourId?: string }>;
};

export default async function MembershipPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  /** Legacy magic links pointed here; continue flow on profile with auto-submit. */
  if (resolved.callback === "1") {
    redirect(MAGIC_LINK_MEMBERSHIP_NEXT);
  }
  const userId = await getCurrentUserId();

  const [tours, user] = await Promise.all([
    prisma.tour.findMany({
      where: { status: { in: ["UPCOMING", "OPEN"] } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        basePrice: true,
        singleSupplement: true,
        programPdfUrl: true,
      },
    }),
    userId ? prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true, email: true },
    }) : null,
  ]);

  const packages: PackageOption[] = tours.map((t) => ({
    id: t.id,
    title: t.title,
    basePrice: Number(t.basePrice),
    singleSupplement: t.singleSupplement != null ? Number(t.singleSupplement) : null,
    programPdfUrl: t.programPdfUrl ?? null,
  }));

  const userProfile =
    user?.email != null
      ? {
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          email: user.email,
        }
      : null;

  return (
    <MembershipPageClient
      packages={packages}
      isAuthenticated={!!userId}
      userProfile={userProfile}
      errorParam={resolved.error ?? null}
      tourIdParam={resolved.tourId ?? null}
    />
  );
}
