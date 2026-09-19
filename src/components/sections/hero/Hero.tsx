import Image from "next/image";
import Link from "next/link";

import { ArrowRight, MessageCircle, Phone, Sparkles } from "lucide-react";

import type { HeroContent } from "@/types/content";

import { Icon } from "@/ui";

interface HeroProps {
  content: HeroContent;
  phoneTel?: string;
  phoneDisplay?: string;
}

export function Hero({ content, phoneTel, phoneDisplay }: HeroProps) {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-brand-pale-blue/30 via-white to-brand-pale-blue/20 pt-8 pb-14 sm:py-16 lg:py-20"
      aria-label="Hero Section"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Content */}
          <div className="flex flex-col items-start text-left lg:col-span-7">
            {/* Top Category Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-mint-border bg-brand-green-light px-4 py-1.5 text-xs font-bold text-brand-green sm:text-sm">
              <Sparkles className="h-3.5 w-3.5 text-brand-green" />
              <span>{content.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="mb-5 text-3xl leading-[1.12] font-extrabold tracking-tight text-brand-navy sm:text-4xl md:text-5xl lg:text-[3.5rem]">
              {content.headline}
            </h1>

            {/* Subheadline description */}
            <p className="mb-8 max-w-xl text-base leading-relaxed font-normal text-brand-muted sm:text-lg">
              {content.subheadline}
            </p>

            {/* Trust Badges Row */}
            <div className="mb-8 grid w-full grid-cols-2 items-center gap-4 sm:mb-10 sm:flex sm:flex-wrap sm:gap-6">
              {content.trustBadges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-border bg-white text-brand-blue shadow-xs">
                    <Icon name={badge.icon} className="h-5 w-5" />
                  </div>
                  <span className="text-xs leading-tight font-bold text-brand-navy sm:text-sm">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex w-full flex-col items-stretch gap-3.5 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
              <Link
                href={content.primaryCta.href}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-green px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-brand-green-hover hover:shadow-lg active:scale-98 sm:text-base"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{content.primaryCta.label}</span>
              </Link>

              <Link
                href={content.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-blue bg-white px-7 py-3.5 text-sm font-bold text-brand-blue transition-all duration-200 hover:bg-brand-blue-light active:scale-98 sm:text-base"
              >
                <span>{content.secondaryCta.label}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              {phoneTel && (
                <a
                  href={`tel:${phoneTel}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-border bg-white px-6 py-3 text-sm font-bold text-brand-navy transition-colors hover:bg-brand-pale-blue sm:hidden"
                >
                  <Phone className="h-4 w-4 text-brand-blue" />
                  <span>Call {phoneDisplay ?? "Now"}</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Visual Image with floating badge */}
          <div className="relative lg:col-span-5">
            <figure className="relative m-0 aspect-[4/3] w-full overflow-hidden rounded-3xl border border-brand-border/80 shadow-xl sm:aspect-[16/11] lg:aspect-[4/4]">
              <Image
                src={content.heroImage.src}
                alt={content.heroImage.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover object-center"
              />
              <figcaption className="sr-only">{content.heroImage.alt}</figcaption>

              {/* Floating Badge in bottom right */}
              <div className="absolute right-4 bottom-4 flex items-center gap-2.5 rounded-2xl border border-brand-border bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-md sm:right-6 sm:bottom-6 sm:px-5 sm:py-3">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-extrabold tracking-tight text-brand-blue sm:text-sm">
                    Clean Spaces,
                  </span>
                  <span className="flex items-center gap-1 text-xs font-extrabold text-brand-green sm:text-sm">
                    Happy Faces <Sparkles className="inline h-3.5 w-3.5 shrink-0 text-brand-sky" />
                  </span>
                </div>
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
