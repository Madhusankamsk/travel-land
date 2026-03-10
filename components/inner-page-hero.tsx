import Image from "next/image";
import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type InnerPageHeroProps = {
  title: string;
  /**
   * Breadcrumb items from left to right.
   * Example: [{ label: "Home", href: "/" }, { label: "About Us" }]
   */
  breadcrumb?: BreadcrumbItem[];
  /**
   * Optional custom background image for the hero strip.
   * If not provided, a default travel image is used.
   */
  image?: string;
};

const DEFAULT_IMAGE = "/Hero-other-pages.jpeg";

export function InnerPageHero({
  title,
  breadcrumb,
  image = DEFAULT_IMAGE,
}: InnerPageHeroProps) {
  const items: BreadcrumbItem[] =
    breadcrumb && breadcrumb.length > 0
      ? breadcrumb
      : [
          { label: "Home", href: "/" },
          { label: title },
        ];

  return (
    <section
      className="relative flex flex-col overflow-hidden bg-obsidian"
      aria-labelledby="inner-page-hero-heading"
      style={{
        marginTop: "calc(-1 * var(--header-height))",
      }}
    >
      <div className="relative h-[220px] w-full overflow-hidden rounded-none sm:h-[260px] lg:h-[300px]">
        {/* Single background image */}
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-obsidian/70" aria-hidden />

        {/* Centered title and breadcrumb */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-20">
          <div>
            <h1
              id="inner-page-hero-heading"
              className="mb-3 pt-6 font-[family-name:var(--font-cormorant)] text-[clamp(32px,4vw,40px)] font-medium leading-tight tracking-tight text-[#F0EAE0]"
            >
              {title}
            </h1>
            <p className="text-[13px] font-medium text-[#F0EAE0]">
              {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const content =
                  item.href && !isLast ? (
                    <Link
                      key={`${item.label}-${index}`}
                      href={item.href}
                      className="pointer-events-auto text-[#F0EAE0]/80 hover:underline"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      key={`${item.label}-${index}`}
                      className={
                        isLast ? "text-champagne" : "text-[#F0EAE0]/80"
                      }
                    >
                      {item.label}
                    </span>
                  );

                return (
                  <span key={`${item.label}-${index}`}>
                    {index > 0 && (
                      <span className="mx-1.5 text-[#B5A890]">›</span>
                    )}
                    {content}
                  </span>
                );
              })}
            </p>
          </div>
        </div>
      </div>
      {/* bottom spacing to separate hero strip from page content */}
      <div className="" />
    </section>
  );
}
