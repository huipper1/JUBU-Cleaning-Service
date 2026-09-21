import Image from "next/image";
import { SectionHeading } from "@/ui";
import type { ImageItem, WhyChooseItem } from "@/types/content";

interface WhyChooseUsProps {
  items: WhyChooseItem[];
  image?: ImageItem;
  badge?: string;
  title?: string;
  description?: string;
}

// Custom crisp SVG icons matching the exact icons in the screenshot
function FeatureIcon({ id }: { id: string }) {
  if (id.includes("clock") || id.includes("time") || id.includes("quote")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7"
      >
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 9.5 12" />
      </svg>
    );
  }

  if (id.includes("shield") || id.includes("licens") || id.includes("train")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 11.5 11.5 14 15.5 9.5" />
      </svg>
    );
  }

  if (id.includes("setting") || id.includes("equip")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }

  // Location / map pin icon for service coverage
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#16a34a"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// Split multi-word labels cleanly into 2 lines
function renderFormattedTitle(title: string) {
  const parts = title.split(" ");
  if (parts.length === 2) {
    return (
      <>
        <span>{parts[0]}</span>
        <span>{parts[1]}</span>
      </>
    );
  }
  if (parts.length > 2) {
    const half = Math.ceil(parts.length / 2);
    return (
      <>
        <span>{parts.slice(0, half).join(" ")}</span>
        <span>{parts.slice(half).join(" ")}</span>
      </>
    );
  }
  return <span>{title}</span>;
}

export function WhyChooseUs({
  items,
  image = {
    src: "/images/placeholder/why-choose-us.png",
    alt: "Professional JUBU cleaner sanitizing residential surface with care in Dubai",
    width: 800,
    height: 600
  },
  badge = "WHY CHOOSE US",
  title = "Your Trust, Our Priority",
  description = "We are committed to delivering high-quality cleaning services with professionalism and care."
}: WhyChooseUsProps) {
  return (
    <section
      id="why-choose"
      className="relative overflow-hidden bg-[#eafaf5]"
      aria-label="Why Choose JUBU Cleaning Service"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
          {/* Left Column: Image */}
          <div className="relative min-h-[320px] w-full overflow-hidden sm:min-h-[420px] lg:col-span-5 lg:min-h-[500px]">
            <Image
              src={image.src || "/images/placeholder/why-choose-us.png"}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Right Column: Content and 4 Horizontal Feature Badges */}
          <div className="flex flex-col justify-center py-12 lg:col-span-7 lg:py-16 lg:pl-10 lg:pr-2 xl:pl-14">
            <SectionHeading
              badge={badge}
              title={title}
              description={description}
              align="left"
              className="mb-8 max-w-xl"
            />

            {/* 4 Feature Items Matching Screenshot */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-3 lg:gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2.5 text-left sm:gap-3"
                >
                  <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_3px_12px_rgba(0,0,0,0.06)] sm:h-14 sm:w-14">
                    <FeatureIcon id={item.id} />
                  </div>
                  <h3 className="flex flex-col text-[11px] font-bold leading-tight text-[#081839] sm:text-xs xl:text-[13px]">
                    {renderFormattedTitle(item.title)}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

