"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPin } from "lucide-react";

import type { ServiceArea, SiteSettings } from "@/types/content";

// Skeleton loader matching the dimensions of the map card
function MapSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading interactive map"
      className="relative flex h-[480px] w-full animate-pulse flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400 shadow-sm sm:h-[520px] lg:h-[560px]"
    >
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 animate-bounce text-brand-green" />
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
  settings?: SiteSettings;
  initialActiveAreaId?: string;
  headline?: string;
  nearYouText?: string;
}

export function ServiceAreas({
  areas,
  settings,
  initialActiveAreaId,
  headline,
  nearYouText
}: ServiceAreasProps) {
  const [activeId, setActiveId] = useState<string | null>(
    initialActiveAreaId ?? null
  );

  const handleAreaClick = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  const phoneDisplay = settings?.phoneDisplay || "+971 54 299 5191";
  const phoneTel = settings?.phoneTel || "+971542995191";

  // Group the 10 areas into 4 logical Dubai zone cards matching the 2x2 cards in the screenshot
  const AREA_ZONES = [
    {
      id: "zone-downtown",
      title: "Central Dubai:",
      description: "Downtown Dubai, Business Bay & surrounding iconic towers.",
      areaIds: ["downtown-dubai", "business-bay"]
    },
    {
      id: "zone-coastal",
      title: "Marina & Coastal:",
      description: "Dubai Marina, JBR, Jumeirah Beach & waterfront residences.",
      areaIds: ["dubai-marina", "jbr", "jumeirah"]
    },
    {
      id: "zone-lakes-palm",
      title: "Palm & Towers:",
      description: "Palm Jumeirah luxury villas & Jumeirah Lake Towers (JLT) apartments.",
      areaIds: ["palm-jumeirah", "jlt"]
    },
    {
      id: "zone-hills-gardens",
      title: "Communities & Hills:",
      description: "Dubai Hills Estate, JVC (Jumeirah Village Circle) & Al Barsha homes.",
      areaIds: ["dubai-hills-estate", "jvc", "al-barsha"]
    }
  ];

  return (
    <section
      id="areas"
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
      aria-label="Dubai Service Areas"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16">
          
          {/* Left Column: Rounded-2xl Map Container with no extra padding/whitespace */}
          <div className="w-full lg:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_rgba(8,24,57,0.06)]">
              <div className="h-[460px] w-full sm:h-[500px] lg:h-[540px]">
                <ServiceAreaMap
                  areas={areas}
                  activeId={activeId}
                  onSelect={setActiveId}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Title, Intro Description, 2x2 Feature Cards, and Dual Action Buttons */}
          <div className="flex flex-col items-start text-left lg:col-span-6">
            
            {/* Badge */}
            <span className="mb-2 text-xs font-bold tracking-wider text-[#00a651] uppercase sm:text-sm">
              DUBAI SERVICE AREAS
            </span>

            {/* Headline matching site theme */}
            <h2 className="text-3xl font-black tracking-tight text-[#0a1e3b] sm:text-4xl lg:text-[2.6rem] lg:leading-[1.18]">
              {headline || "Professional Cleaning Services Across Dubai"}
            </h2>

            {/* Introductory Paragraph matching site theme */}
            <p className="mt-4 text-xs leading-relaxed text-[#4a5f78] sm:text-sm lg:text-[14px]">
              {nearYouText ||
                "We understand the challenges of keeping residential homes and commercial spaces spotless in Dubai. Our dedicated JUBU cleaning team provides reliable, licensed cleaning services tailored to your schedule. Whether you need deep cleaning, move-in sanitization, or regular home upkeep, we bring professional equipment and free custom quotes directly to you."}
            </p>

            {/* 2x2 Soft Feature Cards matching site theme */}
            <div className="mt-6 grid w-full grid-cols-1 gap-3.5 sm:grid-cols-2">
              {AREA_ZONES.map((zone) => {
                const isSelected = zone.areaIds.some((id) => id === activeId);
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => {
                      const targetId = isSelected ? null : zone.areaIds[0];
                      setActiveId(targetId);
                    }}
                    className={`cursor-pointer rounded-2xl p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-2 border-[#00a651] bg-[#e6f7ed] shadow-xs"
                        : "border border-slate-100 bg-[#f9fcfe] hover:border-sky-200 hover:bg-sky-50/50"
                    }`}
                  >
                    <h3 className="text-xs font-extrabold text-[#0a1e3b] sm:text-sm">
                      {zone.title}
                    </h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500 sm:text-xs">
                      {zone.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Bottom Quick Chips for All 10 Areas */}
            <div className="mt-5 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400">
                Direct pin:
              </span>
              {areas.map((area) => {
                const isActive = area.id === activeId;
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => handleAreaClick(area.id)}
                    className={`cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
                      isActive
                        ? "bg-[#00a651] text-white"
                        : "bg-slate-100 text-[#0a1e3b] hover:bg-slate-200"
                    }`}
                  >
                    {area.name}
                  </button>
                );
              })}
            </div>

            {/* Bottom Action Buttons: Brand Green Pill CTA + Phone Link */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
              {/* Primary JUBU Green Pill Button */}
              <Link
                href="#quote"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00a651] px-7 py-3 text-xs font-bold text-white shadow-md shadow-[#00a651]/20 transition-all duration-200 hover:bg-[#008f45] active:scale-98 sm:text-sm"
              >
                <span>Book A Cleaning Now</span>
              </Link>

              {/* Secondary Phone Pill Button */}
              <a
                href={`tel:${phoneTel}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3 text-xs font-bold text-[#0a1e3b] shadow-xs transition-all duration-200 hover:border-[#0a1e3b] hover:bg-slate-50 active:scale-98 sm:text-sm"
              >
                <span>({phoneDisplay})</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
