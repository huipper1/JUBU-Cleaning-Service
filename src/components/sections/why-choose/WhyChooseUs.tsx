import Image from "next/image";

import type { ImageItem, WhyChooseItem } from "@/types/content";

import { Icon } from "@/ui";

interface WhyChooseUsProps {
  items: WhyChooseItem[];
  image?: ImageItem;
  badge?: string;
  title?: string;
  description?: string;
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

          {/* Right Column: Content and 4 Icons */}
          <div className="flex flex-col justify-center py-12 lg:col-span-7 lg:py-16 lg:pl-14 lg:pr-4">
            <span className="mb-2 text-xs font-bold tracking-wider text-[#00a651] uppercase sm:text-sm">
              {badge}
            </span>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[#081839] sm:text-3xl lg:text-4xl">
              {title}
            </h2>
            <p className="mb-10 max-w-xl text-sm leading-relaxed text-[#4a5f78] sm:text-base">
              {description}
            </p>

            {/* 4 Feature Items */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#0070ba] shadow-[0_4px_16px_rgba(0,112,186,0.12)] transition-transform duration-200 hover:scale-105 sm:h-18 sm:w-18">
                    <Icon name={item.icon} className="h-7 w-7 stroke-[2.2]" />
                  </div>
                  <h3 className="text-xs font-bold leading-tight text-[#081839] sm:text-sm">
                    {item.title}
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

