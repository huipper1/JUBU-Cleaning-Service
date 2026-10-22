"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Check, ShieldCheck, Users, Wrench } from "lucide-react";

import type { HeroContent } from "@/types/content";

import { trackWhatsAppClick } from "@/lib/analytics";
import { getPublicImageUrl } from "@/lib/content/image-url";

import { WhatsAppIcon } from "@/components/icons";

interface HeroProps {
  content: HeroContent;
  phoneTel?: string;
  phoneDisplay?: string;
  headline?: string;
  intro?: string;
  heroImage?: import("@/types/content").ImageItem;
  socialProofText?: string;
  services?: import("@/types/content").Service[];
  settings?: import("@/types/content").SiteSettings;
  sourceArea?: string;
}

// Avatars for social proof (real customer portraits)
const SOCIAL_PROOF_AVATARS = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    alt: "JUBU Happy Client in Dubai Marina"
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    alt: "JUBU Happy Client in Downtown Dubai"
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    alt: "JUBU Happy Client in Arabian Ranches"
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    alt: "JUBU Happy Client in Palm Jumeirah"
  }
];

export function Hero({
  content,
  headline,
  intro,
  heroImage,
  socialProofText,
  services,
  settings,
  sourceArea
}: HeroProps) {
  const avatars =
    content.socialProofAvatars && content.socialProofAvatars.length > 0
      ? content.socialProofAvatars
      : SOCIAL_PROOF_AVATARS;
  const rawImage = heroImage || content.heroImage;
  const activeHeadline = headline || content.headline || "Professional Cleaning Services in Dubai";
  const heroAltText =
    rawImage?.alt && rawImage.alt.trim().length > 0
      ? rawImage.alt.toLowerCase().includes("dubai")
        ? rawImage.alt
        : `${rawImage.alt} in Dubai - JUBU Cleaning Service`
      : `${activeHeadline} - JUBU Cleaning Service Professional Team`;

  const displayImage = {
    src: getPublicImageUrl(rawImage?.src, "/images/placeholder/hero-cleaner.png"),
    alt: heroAltText,
    width: rawImage?.width || 800,
    height: rawImage?.height || 950
  };

  const displayIntro = intro || content.subheadline;

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-linear-to-b from-[#041633] via-[#051c3f] to-[#030f24] text-white"
      aria-label="Hero Section"
    >
      {/* Subtle radial ambient glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-brand-sky/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 right-0 h-125 w-125 rounded-full bg-brand-blue/20 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-500/10 blur-[130px]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-4 xl:gap-6">
          {/* Left Column: Copy, Trust Badges, CTAs, Social Proof (Vertically Centered) */}
          <div className="flex flex-col items-center text-center sm:py-10 lg:col-span-6 lg:items-start lg:self-center lg:py-16 lg:text-left xl:col-span-6">
            {/* Main Headline */}
            <h1 className="mb-5 text-3xl leading-[1.12] font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[3.8rem]">
              {activeHeadline}
            </h1>

            {/* Subheadline description */}
            <p className="mb-8 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base lg:text-left">
              {displayIntro}
            </p>

            {/* Trust Badges: Licensed in Dubai, Professional Equipment, Reliable Service */}
            <div className="mb-6 grid w-full max-w-sm grid-cols-3 gap-2 sm:mb-8 sm:flex sm:max-w-none sm:flex-wrap sm:items-center sm:justify-center sm:gap-4 lg:justify-start">
              {/* Badge 1 */}
              <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2 sm:text-left">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 sm:h-11 sm:w-11">
                  <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] leading-tight font-bold text-white sm:text-xs">Licensed in</span>
                  <span className="text-[10px] leading-tight text-slate-300 sm:text-[11px]">Dubai</span>
                </div>
              </div>

              {/* Badge 2 */}
              <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2 sm:text-left">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 sm:h-11 sm:w-11">
                  <Wrench className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] leading-tight font-bold text-white sm:text-xs">Professional</span>
                  <span className="text-[10px] leading-tight text-slate-300 sm:text-[11px]">Equipment</span>
                </div>
              </div>

              {/* Badge 3 */}
              <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2 sm:text-left">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 sm:h-11 sm:w-11">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] leading-tight font-bold text-white sm:text-xs">Reliable</span>
                  <span className="text-[10px] leading-tight text-slate-300 sm:text-[11px]">Service</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-10 flex flex-row items-center justify-center gap-2 sm:gap-3 lg:justify-start">
              <Link
                href={content.primaryCta.href}
                onClick={() => {
                  if (
                    content.primaryCta.href.includes("wa.me") ||
                    content.primaryCta.href.includes("whatsapp")
                  ) {
                    trackWhatsAppClick("hero_primary_cta");
                  }
                }}
                className="inline-flex min-h-[42px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-brand-green px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-green/30 transition-all duration-200 hover:bg-brand-green-hover hover:shadow-xl active:scale-98 sm:min-h-[48px] sm:gap-2.5 sm:px-7 sm:py-3.5 sm:text-base"
              >
                <WhatsAppIcon monochrome className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                <span className="whitespace-nowrap">{content.primaryCta.label}</span>
              </Link>
            </div>

            {/* Social Proof: Serving 10 Communities */}
            <div className="flex items-center justify-center gap-3.5 lg:justify-start">
              <div className="flex -space-x-2.5 overflow-hidden">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className="relative inline-block h-10 w-10 rounded-full ring-2 ring-[#051c3f]"
                  >
                    <Image
                      src={avatar.src}
                      alt={avatar.alt}
                      fill
                      sizes="40px"
                      className="rounded-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs font-semibold text-slate-200 sm:text-sm">
                {socialProofText || "Serving 10 major residential & commercial areas in Dubai"}
              </p>
            </div>
          </div>

          {/* Right/Center Column: Enlarged Cleaner Cutout & Shifted Floating Badges */}
          <div className="relative flex items-end justify-center self-end lg:col-span-6 lg:-ml-6 lg:justify-start xl:col-span-6 xl:-ml-10">
            {/* Cleaner visual wrapper with relative badge positioning */}
            <div className="relative mx-auto flex w-full max-w-[280px] items-end justify-center sm:max-w-130 lg:mx-0 lg:max-w-155 xl:max-w-170">
              {/* Decorative Four-Point Sparkles around cleaner */}
              <div className="pointer-events-none absolute top-12 -left-2 z-10 animate-pulse text-sky-400 sm:left-2 lg:-left-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>
              <div className="pointer-events-none absolute top-32 right-12 z-10 animate-pulse text-sky-400 delay-300 sm:right-24">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>
              <div className="pointer-events-none absolute bottom-48 -left-4 z-10 animate-pulse text-sky-400 delay-700">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>

              {/* Central Cleaner Cutout Photo: Enlarged and touching bottom of hero */}
              <Image
                src={displayImage.src}
                alt={displayImage.alt}
                width={displayImage.width || 750}
                height={displayImage.height || 950}
                priority
                className="relative z-10 block max-h-[290px] w-auto object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] sm:max-h-[420px] sm:w-full lg:max-h-none"
              />

              {/* Floating Badge 1: Top Right - Licensed in Dubai */}
              <div className="absolute top-16 -right-2 z-20 hidden items-center gap-2.5 rounded-full border border-white/80 bg-white px-4 py-2.5 shadow-xl transition-transform hover:scale-105 sm:top-14 sm:right-2 sm:flex lg:top-16 lg:-right-10 xl:-right-14">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                  <Check className="h-4 w-4 stroke-3" />
                </div>
                <span className="text-xs font-extrabold tracking-tight text-slate-900 sm:text-sm">
                  Licensed in Dubai
                </span>
              </div>

              {/* Floating Badge 2: Mid Right - Free Quotes */}
              <div className="absolute top-36 -right-2 z-20 hidden items-center gap-2.5 rounded-full border border-white/80 bg-white px-4 py-2.5 shadow-xl transition-transform hover:scale-105 sm:top-36 sm:right-0 sm:flex lg:top-36 lg:-right-12 xl:-right-18">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue text-white shadow-xs">
                  <Check className="h-4 w-4 stroke-3" />
                </div>
                <span className="text-xs font-extrabold tracking-tight text-slate-900 sm:text-sm">
                  Free Custom Quotes
                </span>
              </div>

              {/* Cursive Decorative Slogan (Right Side) */}
              <div className="pointer-events-none absolute right-4 bottom-44 z-20 hidden text-left select-none sm:right-6 sm:block lg:right-0 xl:-right-4">
                <div className="relative -rotate-[14deg] font-[family-name:var(--font-handwriting)]">
                  {/* Sunburst / radiating cyan spark rays on top right */}
                  <div className="absolute -top-3.5 right-2 flex flex-col items-center">
                    <span className="absolute -top-1.5 -left-3 h-1.5 w-0.5 rounded-full bg-[#00e5ff]" />
                    <span className="absolute -top-2.5 left-0 h-4 w-[2.5px] rotate-[22deg] rounded-full bg-[#00e5ff]" />
                    <span className="absolute top-1 left-1.5 h-4 w-[2.5px] rotate-[52deg] rounded-full bg-[#00e5ff]" />
                    <span className="absolute top-4 left-2.5 h-3.5 w-[2.5px] rotate-[82deg] rounded-full bg-[#00e5ff]" />
                  </div>

                  {/* Handwritten Text Lines */}
                  <div className="flex flex-col leading-[1.05] tracking-tight">
                    {(content.floatingBadge || "Cleaner Spaces Brighter Lives")
                      .split(" ")
                      .filter(Boolean)
                      .map((word, idx) => (
                        <span
                          key={idx}
                          className="text-2xl font-bold text-white/95 drop-shadow-sm sm:text-3xl lg:text-[2.2rem]"
                        >
                          {word}
                        </span>
                      ))}
                  </div>

                  {/* Gradient underline arc (cyan to vibrant lime green) */}
                  <div className="mt-1 w-full max-w-[150px]">
                    <svg
                      viewBox="0 0 120 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-full"
                    >
                      <defs>
                        <linearGradient id="sloganUnderlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#00c8ff" />
                          <stop offset="60%" stopColor="#10e796" />
                          <stop offset="100%" stopColor="#a3e635" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M3 13C35 4 85 4 117 11"
                        stroke="url(#sloganUnderlineGrad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
