import Image from "next/image";

import { MapPin, MessageCircle } from "lucide-react";

import type { ServiceArea } from "@/types/content";

interface ServiceAreasProps {
  areas: ServiceArea[];
  whatsappUrl: string;
}

export function ServiceAreas({ areas, whatsappUrl }: ServiceAreasProps) {
  return (
    <section
      id="areas"
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
      aria-label="Dubai Service Areas"
    >
      {/* Dubai Service Area Panorama Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/images/placeholder/dubai-service-area.png"
          alt="Dubai cityscape and service area map"
          fill
          priority
          sizes="100vw"
          className="object-cover object-left md:object-center"
        />
        {/* Soft white gradient overlay on the right to make chips and CTA pristine & readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-blue-100/60 to-blue-100/95 lg:from-blue-100/10 lg:via-blue-100/50 lg:to-blue-100/90" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Headline & Description */}
          <div className="flex flex-col items-start text-left lg:col-span-5">
            <span className="mb-2.5 text-xs font-bold tracking-wider text-brand-green uppercase sm:text-sm">
              DUBAI SERVICE AREAS
            </span>

            <h2 className="mb-4 text-3xl leading-tight font-extrabold tracking-tight text-brand-navy sm:text-4xl lg:text-[2.6rem]">
              Areas We Serve in Dubai
            </h2>

            <p className="max-w-md text-sm leading-relaxed font-normal text-slate-700 sm:text-base">
              We provide professional cleaning services across all major areas of Dubai and
              surrounding communities.
            </p>
          </div>

          {/* Right Column: 15 Area Tag Chips + WhatsApp callout */}
          <div className="flex flex-col lg:col-span-7">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center gap-2 rounded-full border border-sky-100 bg-white/90 px-3.5 py-2 shadow-2xs backdrop-blur-xs transition-all duration-200 hover:border-brand-blue hover:shadow-md sm:px-4 sm:py-2.5"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-brand-blue" />
                  <span className="truncate text-xs font-semibold text-brand-navy sm:text-sm">
                    {area.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Callout Banner */}
            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-5 py-2.5 shadow-xs backdrop-blur-xs sm:flex-row sm:px-6 sm:py-3">
              <span className="text-center text-xs font-semibold text-brand-navy sm:text-left sm:text-sm">
                Don&apos;t see your area? Message us on WhatsApp
              </span>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-green px-5 py-2 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-brand-green-hover sm:text-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Message Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
