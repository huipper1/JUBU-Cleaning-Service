"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, MessageCircle } from "lucide-react";

import { SectionHeading } from "@/ui";
import type { ServiceArea } from "@/types/content";

// Skeleton loader matching the exact dimensions of the larger map
function MapSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading interactive map"
      className="relative flex h-[380px] w-full animate-pulse flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-slate-400 shadow-sm sm:h-[420px] lg:h-[480px]"
    >
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 animate-bounce text-[#16a34a]" />
        <span className="text-xs font-semibold text-slate-500">Loading Dubai Service Map...</span>
      </div>
    </div>
  );
}

// Dynamically load the Leaflet map with SSR disabled
const ServiceAreaMap = dynamic(
  () => import("./ServiceAreaMap"),
  {
    ssr: false,
    loading: () => <MapSkeleton />
  }
);

interface ServiceAreasProps {
  areas: ServiceArea[];
  whatsappUrl: string;
}

export function ServiceAreas({ areas, whatsappUrl }: ServiceAreasProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleChipClick = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="areas"
      className="relative overflow-hidden bg-white py-14 sm:py-18 lg:py-22"
      aria-label="Dubai Service Areas"
    >
      {/* Decorative tropical palm leaf in the top-right corner */}
      <div
        className="pointer-events-none absolute -top-10 -right-10 z-0 h-64 w-64 opacity-20 sm:h-80 sm:w-80 lg:opacity-30"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 200 200"
          className="h-full w-full fill-[#2e7d32]/30 text-emerald-800"
        >
          <path d="M180,0 C160,40 140,80 100,110 C80,125 50,135 10,140 C50,130 90,110 120,80 C150,50 170,25 180,0 Z" />
          <path d="M190,10 C165,55 135,95 90,125 C65,142 35,150 0,152 C45,142 85,122 118,90 C150,58 175,30 190,10 Z" />
          <path d="M200,30 C170,75 135,115 85,145 C55,162 20,168 -15,168 C35,158 75,135 110,102 C145,68 180,45 200,30 Z" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Heading, Description, Smaller Compact Chips & WhatsApp Banner */}
          <div className="flex flex-col items-start text-left lg:col-span-6 xl:col-span-6">
            <SectionHeading
              badge="DUBAI SERVICE AREAS"
              title="Areas We Serve in Dubai"
              description="We provide professional cleaning services across all major areas of Dubai and surrounding communities. Click any area to locate it on the map."
              align="left"
              className="mb-6 max-w-lg"
            />

            {/* Smaller, Compact Area Pill Buttons */}
            <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5">
              {areas.map((area) => {
                const isActive = area.id === activeId;
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => handleChipClick(area.id)}
                    aria-pressed={isActive}
                    className={`group flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#0070ba] focus-visible:outline-offset-2 sm:px-3.5 sm:py-2 ${isActive
                        ? "border-2 border-[#16a34a] bg-[#f0fdf4] shadow-xs"
                        : "border border-sky-100 bg-white shadow-[0_1px_4px_rgba(0,112,186,0.04)] hover:border-[#0070ba] hover:bg-sky-50/50 hover:shadow-xs"
                      }`}
                  >
                    <MapPin
                      className={`h-3.5 w-3.5 shrink-0 transition-colors ${isActive ? "text-[#16a34a]" : "text-[#0070ba] group-hover:text-[#005e9e]"
                        }`}
                    />
                    <span
                      className={`truncate text-xs font-bold tracking-tight ${isActive ? "text-[#15803d]" : "text-[#081839]"
                        }`}
                    >
                      {area.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom WhatsApp Callout Banner */}
            <div className="mt-6 flex w-full flex-col items-center justify-between gap-3 rounded-2xl border border-emerald-200/80 bg-[#eefbf4] p-3.5 shadow-2xs sm:flex-row sm:px-5 sm:py-2.5">
              <span className="text-center text-xs font-bold text-[#081839] sm:text-left">
                Don&apos;t see your area? Message us on WhatsApp
              </span>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#00a651] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-[#008f45] active:scale-98"
              >
                <MessageCircle className="h-4 w-4 fill-white" />
                <span>Message Us</span>
              </a>
            </div>
          </div>

          {/* Right Column: Larger Interactive Map */}
          <div className="w-full lg:col-span-6 xl:col-span-6">
            <ServiceAreaMap
              areas={areas}
              activeId={activeId}
              onSelect={setActiveId}
            />
          </div>
        </div>
      </div>
    </section>
  );
}




