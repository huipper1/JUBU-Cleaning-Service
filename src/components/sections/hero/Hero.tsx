import Image from "next/image";
import Link from "next/link";

import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";

import type { HeroContent } from "@/types/content";

import { Icon } from "@/ui";

interface HeroProps {
  content: HeroContent;
  phoneTel?: string;
  phoneDisplay?: string;
}

export function Hero({ content }: HeroProps) {
  // Take first 3 trust badges matching the design screenshot
  const displayedBadges = content.trustBadges.slice(0, 3);

  return (
    <section
      id="top"
      className="relative flex min-h-[580px] items-center overflow-hidden sm:min-h-[640px] lg:min-h-[720px]"
      aria-label="Hero Section"
    >
      {/* Background Panorama Image (Cleaner overlooking Dubai skyline) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={content.heroImage.src}
          alt={content.heroImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_center] sm:object-[70%_center] lg:object-center"
        />
        {/* Soft white gradient on the left side to guarantee 100% crisp typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent sm:via-white/40 lg:from-white/80 lg:via-white/40 lg:to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl text-left">
          {/* Top Category Badge */}
          <div className="mb-4 inline-flex items-center rounded-full bg-[#dcfce7]/90 px-4 py-1.5 text-xs font-semibold text-brand-navy shadow-2xs backdrop-blur-xs sm:text-sm">
            <span>{content.badge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="mb-4 text-3xl leading-[1.1] font-extrabold tracking-tight text-brand-navy sm:text-4xl md:text-5xl lg:text-[3.5rem]">
            {content.headline}
          </h1>

          {/* Subheadline description */}
          <p className="mb-8 max-w-lg text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
            {content.subheadline}
          </p>

          {/* 3 Trust Badges Row (Direct icons + 2-line labels without box container) */}
          <div className="mb-8 flex flex-wrap items-center gap-6 sm:mb-10 sm:gap-8">
            {displayedBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-3">
                <div className="text-brand-blue">
                  <Icon name={badge.icon} className="h-7 w-7 stroke-[1.75]" />
                </div>
                <span className="max-w-[90px] text-xs leading-tight font-bold text-brand-navy sm:text-sm">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={content.primaryCta.href}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-green px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-brand-green-hover hover:shadow-lg active:scale-98 sm:text-base"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{content.primaryCta.label}</span>
            </Link>

            <Link
              href={content.secondaryCta.href}
              className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-blue bg-white/90 px-7 py-3.5 text-sm font-bold text-brand-navy shadow-xs transition-all duration-200 hover:bg-brand-blue hover:text-white active:scale-98 sm:text-base"
            >
              <span>{content.secondaryCta.label}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Cursive Slogan in Bottom Right */}
      <div className="pointer-events-none absolute right-6 bottom-6 z-10 hidden sm:block md:right-10 md:bottom-8 lg:right-16 lg:bottom-10">
        <div className="relative -rotate-2 select-none text-right">
          <span className="block font-serif text-xl italic tracking-wide text-brand-navy drop-shadow-xs sm:text-2xl">
            Clean Spaces,
          </span>
          <span className="flex items-center justify-end gap-1.5 font-serif text-xl italic tracking-wide text-brand-navy drop-shadow-xs sm:text-2xl">
            <span>Happy Faces</span>
            <Sparkles className="h-4 w-4 text-brand-sky" />
          </span>
          <svg
            className="ml-auto mt-0.5 h-2 w-32 text-brand-green"
            viewBox="0 0 100 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M2 6C30 1 70 1 98 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
