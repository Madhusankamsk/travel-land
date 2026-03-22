import { redirect } from "next/navigation";
import { authSignupSearchParams } from "@/lib/auth-url";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Legacy `/signup` URLs redirect to home with the auth modal query (same behavior). */
export default async function LegacySignupRedirect({ searchParams }: Props) {
  const sp = await searchParams;
  const from = typeof sp.from === "string" ? sp.from : undefined;
  const email = typeof sp.email === "string" ? sp.email : undefined;
  redirect(`/?${authSignupSearchParams({ from, email })}`);
}
