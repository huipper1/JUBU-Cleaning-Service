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
  if (id.includes("clock") || id.includes("time")) {
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

  if (id.includes("shield") || id.includes("train")) {
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

  if (id.includes("leaf") || id.includes("eco")) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7 fill-[#16a34a]"
      >
        <path d="M20.6 3.4c-4.4-.8-9.4 1.2-12.8 4.6C4.4 11.4 2.5 16.4 3.3 20.7c.1.4.4.7.8.8 4.3.8 9.3-1.2 12.7-4.6 3.4-3.4 5.3-8.4 4.5-12.7-.1-.4-.4-.7-.7-.8zm-4.2 10.3c-2.8 2.8-6.9 4.3-10.4 3.7.8-3.5 2.3-7.6 5.1-10.4 2.8-2.8 6.9-4.3 10.4-3.7-.8 3.5-2.3 7.6-5.1 10.4z" />
      </svg>
    );
  }

  // Star icon (5-point outlined green star)
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// Split multi-word labels cleanly into 2 lines
function renderFormattedTitle(title: string) {
  if (title === "On-Time Service") {
    return (
      <>
        <span>On-Time</span>
        <span>Service</span>
      </>
    );
  }
  if (title === "Fully Trained Staff") {
    return (
      <>
        <span>Fully Trained</span>
        <span>Staff</span>
      </>
    );
  }
  if (title.includes("Eco-Friendly") || title.includes("Cleaning Products")) {
    return (
      <>
        <span>Eco-Friendly</span>
        <span>Cleaning Products</span>
      </>
    );
  }
  if (title.includes("Satisfaction") || title.includes("100%")) {
    return (
      <>
        <span>100% Customer</span>
        <span>Satisfaction</span>
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

