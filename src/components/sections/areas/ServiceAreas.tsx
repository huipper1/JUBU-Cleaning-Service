import { MapPin, MessageCircle, Sparkles } from "lucide-react";

import type { ServiceArea } from "@/types/content";

interface ServiceAreasProps {
  areas: ServiceArea[];
  whatsappUrl: string;
}

export function ServiceAreas({ areas, whatsappUrl }: ServiceAreasProps) {
  return (
    <section
      id="areas"
      className="border-b border-brand-border/60 bg-brand-pale-blue/40 py-16 sm:py-20 lg:py-24"
      aria-label="Dubai Service Areas"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Headline, Description & Skyline graphic representation */}
          <div className="flex flex-col items-start text-left lg:col-span-5">
            <span className="mb-2.5 text-xs font-bold tracking-wider text-brand-green uppercase sm:text-sm">
              DUBAI SERVICE AREAS
            </span>

            <h2 className="mb-4 text-3xl leading-tight font-extrabold tracking-tight text-brand-navy sm:text-4xl lg:text-[2.6rem]">
              Areas We Serve in Dubai
            </h2>

            <p className="mb-8 max-w-md text-sm leading-relaxed font-normal text-brand-muted sm:text-base">
              We provide professional cleaning services across all major areas of Dubai and
              surrounding communities.
            </p>

            {/* Visual Graphic Representation with Palm / Skyline badge */}
            <div className="relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-brand-border/80 bg-gradient-to-r from-brand-blue/10 via-brand-sky/10 to-brand-green/10 p-6 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white shadow-xs">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold text-brand-navy sm:text-sm">
                    Serving Greater Dubai
                  </span>
                  <span className="text-xs text-brand-muted">Villas, Apartments & Offices</span>
                </div>
              </div>

              <div className="hidden items-center gap-1.5 rounded-full border border-brand-border bg-white/90 px-3.5 py-1.5 text-xs font-bold text-brand-blue shadow-2xs backdrop-blur-xs sm:flex">
                <span>Cleaner Dubai, Happier You</span>
                <Sparkles className="h-3 w-3 text-brand-sky" />
              </div>
            </div>
          </div>

          {/* Right Column: 15 Area Tag Chips + WhatsApp callout */}
          <div className="flex flex-col lg:col-span-7">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center gap-2 rounded-full border border-brand-border bg-white px-3.5 py-2.5 shadow-2xs transition-all duration-200 hover:border-brand-blue hover:bg-brand-blue-light/50 sm:px-4"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-brand-blue" />
                  <span className="truncate text-xs font-semibold text-brand-navy sm:text-sm">
                    {area.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Callout Banner */}
            <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-brand-mint-border bg-brand-green-light p-5 shadow-xs sm:flex-row sm:p-6">
              <div className="text-center sm:text-left">
                <h3 className="text-sm font-bold text-brand-navy sm:text-base">
                  Don&apos;t see your area? Message us on WhatsApp
                </h3>
                <p className="mt-0.5 text-xs text-brand-muted">
                  We frequently expand routes to custom residential communities.
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-brand-green-hover sm:text-sm"
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
