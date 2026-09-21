import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Check, MessageCircle, ShieldCheck, Users, Wrench } from "lucide-react";

import type { HeroContent } from "@/types/content";

interface HeroProps {
  content: HeroContent;
  phoneTel?: string;
  phoneDisplay?: string;
}

// Avatars for social proof (real customer portraits)
const SOCIAL_PROOF_AVATARS = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    alt: "Elena - Homeowner in Dubai Marina"
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    alt: "Marcus - Resident in Downtown Dubai"
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    alt: "Amina - Villa Owner in Arabian Ranches"
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    alt: "Tariq - Resident in Palm Jumeirah"
  }
];

export function Hero({ content }: HeroProps) {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-[#041633] via-[#051c3f] to-[#030f24] text-white"
      aria-label="Hero Section"
    >
      {/* Subtle radial ambient glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-brand-sky/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-brand-blue/20 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-500/10 blur-[130px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-4 xl:gap-6">
          {/* Left Column: Copy, Trust Badges, CTAs, Social Proof (Vertically Centered) */}
          <div className="flex flex-col items-start text-left sm:py-10 lg:col-span-5 lg:self-center lg:py-16 xl:col-span-5">
            {/* Pill Tag: Professional Cleaning Services in Dubai */}
            {/* <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-950/40 px-4 py-1.5 text-xs font-medium text-sky-200 shadow-sm backdrop-blur-md sm:text-sm">
              <span>{content.badge || "Professional Cleaning Services in Dubai"}</span>
            </div> */}

            {/* Main Headline */}
            <h1 className="mb-5 text-4xl leading-[1.08] font-extrabold tracking-tight text-white sm:text-5xl md:text-5xl lg:text-[3.6rem] xl:text-[3.9rem]">
              Turning Houses <br className="hidden sm:inline" />
              into{" "}
              <span className="relative inline-block text-[#34d399]">
                Fresh Homes
              </span>
            </h1>

            {/* Subheadline description */}
            <p className="mb-8 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
              {content.subheadline}
            </p>

            {/* Trust Badges: Licensed in Dubai, Professional Equipment, Reliable Service */}
            <div className="mb-8 flex flex-wrap items-center gap-2.5 sm:gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-tight text-white">Licensed in</span>
                <span className="text-[11px] leading-tight text-slate-300">Dubai</span>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
                <Wrench className="h-7 w-7 text-sky-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-tight text-white">Professional</span>
                <span className="text-[11px] leading-tight text-slate-300">Equipment</span>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Users className="h-7 w-7 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-tight text-white">Reliable</span>
                <span className="text-[11px] leading-tight text-slate-300">Service</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-10 flex flex-wrap items-center gap-4">
              <Link
                href={content.primaryCta.href}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-green px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-green/30 transition-all duration-200 hover:bg-brand-green-hover hover:shadow-xl active:scale-98 sm:text-base"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{content.primaryCta.label}</span>
              </Link>

              <Link
                href={content.secondaryCta.href}
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-[#092348]/90 px-7 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:border-sky-400 hover:bg-[#0d2f5e] active:scale-98 sm:text-base"
              >
                <span>{content.secondaryCta.label}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Social Proof: Serving 10 Communities */}
            <div className="flex items-center gap-3.5">
              <div className="flex -space-x-2.5 overflow-hidden">
                {SOCIAL_PROOF_AVATARS.map((avatar) => (
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
                Serving 10 major residential & commercial areas in Dubai
              </p>
            </div>

          </div>

          {/* Right/Center Column: Enlaarged Cleaner Cutout & Shifted Floating Badges */}
          <div className="relative flex items-end justify-center self-end lg:col-span-7 lg:-ml-6 lg:justify-start xl:col-span-7 xl:-ml-10">

            {/* Cleaner visual wrapper with relative badge positioning */}
            <div className="relative mx-auto flex w-full max-w-[420px] items-end justify-center sm:max-w-[520px] lg:mx-0 lg:max-w-[620px] xl:max-w-[680px]">

              {/* Decorative Four-Point Sparkles around cleaner */}
              <div className="pointer-events-none absolute top-12 -left-2 z-10 text-sky-400 animate-pulse sm:left-2 lg:-left-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>
              <div className="pointer-events-none absolute top-32 right-12 z-10 text-sky-400 animate-pulse delay-300 sm:right-24">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>
              <div className="pointer-events-none absolute bottom-48 -left-4 z-10 text-sky-400 animate-pulse delay-700">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>

              {/* Central Cleaner Cutout Photo: Enlarged and touching bottom of hero */}
              <Image
                src="/images/placeholder/hero-cleaner.png"
                alt="JUBU Professional Cleaner in uniform with spray bottle and microfibre cloth"
                width={800}
                height={950}
                priority
                className="relative z-10 block h-auto w-full object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]"
              />

              {/* Floating Badge 1: Top Right - Licensed in Dubai */}
              <div className="absolute top-16 -right-2 z-20 hidden items-center gap-2.5 rounded-full border border-white/80 bg-white px-4 py-2.5 shadow-xl transition-transform hover:scale-105 sm:flex sm:top-14 sm:right-2 lg:top-16 lg:-right-10 xl:-right-14">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <span className="text-xs font-extrabold tracking-tight text-slate-900 sm:text-sm">
                  Licensed in Dubai
                </span>
              </div>

              {/* Floating Badge 2: Mid Right - Free Quotes */}
              <div className="absolute top-36 -right-2 z-20 hidden items-center gap-2.5 rounded-full border border-white/80 bg-white px-4 py-2.5 shadow-xl transition-transform hover:scale-105 sm:flex sm:top-36 sm:right-0 lg:top-36 lg:-right-12 xl:-right-18">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue text-white shadow-xs">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <span className="text-xs font-extrabold tracking-tight text-slate-900 sm:text-sm">
                  Free Custom Quotes
                </span>
              </div>

              {/* Cursive Decorative Slogan (Right Side) */}
              <div className="pointer-events-none absolute right-4 bottom-44 z-20 hidden select-none text-left sm:block sm:right-6 lg:right-0 xl:-right-4">
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
                    <span className="text-2xl font-bold text-white/95 drop-shadow-sm sm:text-3xl lg:text-[2.2rem]">
                      Cleaner
                    </span>
                    <span className="text-2xl font-bold text-white/95 drop-shadow-sm sm:text-3xl lg:text-[2.2rem]">
                      Spaces
                    </span>
                    <span className="text-2xl font-bold text-white/95 drop-shadow-sm sm:text-3xl lg:text-[2.2rem]">
                      Brighter
                    </span>
                    <span className="text-2xl font-bold text-white/95 drop-shadow-sm sm:text-3xl lg:text-[2.2rem]">
                      Lives
                    </span>
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
