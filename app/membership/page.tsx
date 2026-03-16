import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { MembershipPageClient } from "./membership-client";
import type { PackageOption } from "@/components/membership-form";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ callback?: string; error?: string; tourId?: string }>;
};

export default async function MembershipPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const userId = await getCurrentUserId();

  const [tours, user] = await Promise.all([
    prisma.tour.findMany({
      where: { status: "UPCOMING" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        basePrice: true,
        singleSupplement: true,
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
  }));

  const userProfile =
    user?.email != null
      ? {
          fullName: [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || "",
          email: user.email,
        }
      : null;

  return (
    <MembershipPageClient
      packages={packages}
      isAuthenticated={!!userId}
      userProfile={userProfile}
      callbackParam={resolved.callback ?? null}
      errorParam={resolved.error ?? null}
      tourIdParam={resolved.tourId ?? null}
    />
  );
}
