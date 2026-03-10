import Link from "next/link";
import { logoutAction } from "@/lib/auth";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-[960px] px-6 py-16 lg:px-20 lg:py-24">
      <h1 className="mb-4 font-[family-name:var(--font-cormorant)] text-[clamp(28px,4vw,40px)] font-medium leading-tight text-obsidian">
        User profile
      </h1>
      <p className="mb-8 text-[15px] leading-relaxed text-obsidian/70">
        This is your profile area. Here you&apos;ll soon be able to review your
        details and upcoming trips.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex items-center rounded-full border border-bone bg-white px-5 py-3 text-sm font-medium tracking-wide text-obsidian transition-all duration-150 hover:border-obsidian hover:bg-travertine focus:outline-2 focus:outline-oro focus:outline-offset-2"
          >
            Log out
          </button>
        </form>
        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-parchment px-5 py-3 text-sm font-medium tracking-wide text-siena transition-all duration-150 hover:bg-bone/80"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
