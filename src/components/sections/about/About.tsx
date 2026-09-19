import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Sparkles } from "lucide-react";

import type { AboutContent } from "@/types/content";

import { Icon } from "@/ui";

interface AboutProps {
  content: AboutContent;
}

export function About({ content }: AboutProps) {
  const mainImage = content.images[0];
  const detailImage = content.images[1] ?? content.images[0];
  const vacuumImage = content.images[2] ?? content.images[0];

  return (
    <section
      id="about"
      className="border-b border-brand-border/60 bg-brand-pale-blue/40 py-16 sm:py-20 lg:py-24"
      aria-label="About JUBU Cleaning Service"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Story, Philosophy, CTA & Highlights */}
          <div className="flex flex-col items-start text-left lg:col-span-6">
            <span className="mb-2.5 text-xs font-bold tracking-wider text-brand-green uppercase sm:text-sm">
              {content.badge}
            </span>

            <h2 className="mb-5 text-3xl leading-tight font-extrabold tracking-tight text-brand-navy sm:text-4xl lg:text-[2.6rem]">
              {content.heading}
            </h2>

            <div className="mb-8 max-w-xl space-y-4 text-sm leading-relaxed font-normal text-brand-muted sm:text-base">
              {content.paragraphs.map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mb-8 sm:mb-10">
              <Link
                href={content.cta.href}
                className="inline-flex items-center gap-2.5 rounded-full bg-brand-green px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-brand-green-hover active:scale-98 sm:text-base"
              >
                <span>{content.cta.label}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* 3 Core Highlights / Pillars */}
            <div className="grid w-full grid-cols-1 gap-4 border-t border-brand-border/80 pt-6 sm:grid-cols-3 sm:gap-5">
              {content.highlights.map((item) => (
                <div key={item.id} className="flex items-center gap-3 sm:flex-col sm:items-start">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-border bg-white text-brand-blue shadow-xs">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-xs font-bold text-brand-navy sm:text-sm">{item.title}</h3>
                    {item.description && (
                      <p className="mt-0.5 line-clamp-2 text-[11px] font-normal text-brand-muted sm:text-xs">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Photo Collage & Floating Badges */}
          <div className="relative lg:col-span-6">
            <div className="grid grid-cols-12 items-stretch gap-4 sm:gap-5">
              {/* Left Photo Stack: Wide Main photo + Detail photo */}
              <div className="col-span-7 flex flex-col gap-4 sm:gap-5">
                {mainImage && (
                  <figure className="relative m-0 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-brand-border shadow-md">
                    <Image
                      src={mainImage.src}
                      alt={mainImage.alt}
                      fill
                      sizes="(max-width: 768px) 60vw, 350px"
                      className="object-cover object-center"
                    />
                    <figcaption className="sr-only">{mainImage.alt}</figcaption>

                    {content.secondaryBadge && (
                      <div className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-xl border border-brand-border bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-xs">
                        <span className="text-[11px] font-extrabold text-brand-blue sm:text-xs">
                          {content.secondaryBadge}
                        </span>
                      </div>
                    )}
                  </figure>
                )}

                {detailImage && (
                  <figure className="relative m-0 aspect-square w-full overflow-hidden rounded-2xl border border-brand-border shadow-md">
                    <Image
                      src={detailImage.src}
                      alt={detailImage.alt}
                      fill
                      sizes="(max-width: 768px) 60vw, 350px"
                      className="object-cover object-center"
                    />
                    <figcaption className="sr-only">{detailImage.alt}</figcaption>
                  </figure>
                )}
              </div>

              {/* Right Tall Photo: Full height cleaner in uniform */}
              <div className="col-span-5 flex flex-col justify-between">
                {vacuumImage && (
                  <figure className="relative m-0 h-full min-h-[260px] w-full overflow-hidden rounded-2xl border border-brand-border shadow-lg sm:min-h-[360px]">
                    <Image
                      src={vacuumImage.src}
                      alt={vacuumImage.alt}
                      fill
                      sizes="(max-width: 768px) 40vw, 250px"
                      className="object-cover object-center"
                    />
                    <figcaption className="sr-only">{vacuumImage.alt}</figcaption>
                  </figure>
                )}
              </div>
            </div>

            {/* Slogan Floating Badge */}
            {content.taglineBadge && (
              <div className="absolute -bottom-5 left-6 z-10 hidden items-center gap-2 rounded-full border border-brand-border bg-white/95 px-5 py-2.5 shadow-lg backdrop-blur-md sm:flex">
                <Sparkles className="h-4 w-4 text-brand-sky" />
                <span className="text-xs font-bold text-brand-navy sm:text-sm">
                  {content.taglineBadge}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
