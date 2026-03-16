import Link from "next/link";

type PageProps = {
  searchParams: Promise<{ ref?: string }>;
};

export default async function MembershipSuccessPage({ searchParams }: PageProps) {
  const { ref } = await searchParams;

  return (
    <div className="min-h-screen bg-[var(--color-travertine)] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[20px] border border-[var(--color-bone)] bg-white p-8 shadow-[var(--shadow-lg)] text-center">
        <h1 className="font-[var(--font-display)] text-2xl font-medium text-[var(--color-obsidian)]">
          Thank you
        </h1>
        <p className="mt-3 text-[#7A7060]">
          Your travel membership form has been submitted successfully.
        </p>
        {ref && (
          <p className="mt-2 text-sm font-mono text-[var(--color-obsidian)]">
            Reference: {ref}
          </p>
        )}
        <p className="mt-4 text-sm text-[#7A7060]">
          We will contact you within 24 hours to confirm your booking.
        </p>
        <Link
          href="/profile"
          className="mt-6 inline-flex rounded-full bg-[var(--color-obsidian)] px-6 py-3 text-sm font-medium text-[#F0EAE0] shadow-[var(--shadow-md)] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-oro)] focus:ring-offset-2"
        >
          View my profile
        </Link>
      </div>
    </div>
  );
}
