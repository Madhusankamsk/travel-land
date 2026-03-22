import { redirect } from "next/navigation";
import { authLoginSearchParams } from "@/lib/auth-url";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Legacy `/login` URLs redirect to home with the auth modal query (same behavior). */
export default async function LegacyLoginRedirect({ searchParams }: Props) {
  const sp = await searchParams;
  const opts: { from?: string; email?: string; error?: string; next?: string } = {};
  for (const key of ["from", "email", "error", "next"] as const) {
    const v = sp[key];
    if (typeof v === "string") opts[key] = v;
  }
  redirect(`/?${authLoginSearchParams(opts)}`);
}
