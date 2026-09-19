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
    src: "/images/placeholder/about-detail.svg",
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
      className="border-y border-brand-mint-border/60 bg-brand-mint/50 py-16 sm:py-20 lg:py-24"
      aria-label="Why Choose JUBU Cleaning Service"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Image */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <figure className="relative m-0 aspect-[4/3] w-full overflow-hidden rounded-3xl border border-brand-mint-border/80 shadow-xl sm:aspect-[16/11] lg:aspect-[4/4]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                className="object-cover object-center"
              />
              <figcaption className="sr-only">{image.alt}</figcaption>
            </figure>
          </div>

          {/* Right Column: Content and 4 Pillars */}
          <div className="order-1 flex flex-col items-start text-left lg:order-2 lg:col-span-7">
            <span className="mb-2.5 text-xs font-bold tracking-wider text-brand-green uppercase sm:text-sm">
              {badge}
            </span>
            <h2 className="mb-3 text-2xl leading-tight font-extrabold tracking-tight text-brand-navy sm:text-3xl lg:text-4xl">
              {title}
            </h2>
            <p className="mb-8 max-w-xl text-sm leading-relaxed font-normal text-brand-muted sm:mb-10 sm:text-base">
              {description}
            </p>

            {/* 4 Feature Items */}
            <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center rounded-2xl border border-brand-mint-border/60 bg-white/80 p-4 text-center shadow-2xs transition-all duration-200 hover:bg-white hover:shadow-md"
                >
                  <div className="mb-3 flex h-13 w-13 items-center justify-center rounded-full border border-brand-border bg-white text-brand-blue shadow-xs sm:h-14 sm:w-14">
                    <Icon name={item.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="text-xs leading-snug font-bold text-brand-navy sm:text-sm">
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
