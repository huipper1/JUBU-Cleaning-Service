import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { AboutContent } from "@/types/content";

interface AboutProps {
  content: AboutContent;
}

export function About({ content }: AboutProps) {
  // Use the 12 equipment items in the checklist grid
  const checklistItems = content.equipment && content.equipment.length > 0
    ? content.equipment
    : content.highlights.map((h) => h.title);

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#f9fcfe] py-16 sm:py-20 lg:py-24"
      aria-label="About JUBU Cleaning Service"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: 2 Columns (Headline + CTA on left, Description + Checklist on right) */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-14">
          {/* Top Left: Badge, Main Headline & View All Services CTA */}
          <div className="flex flex-col items-start text-left lg:col-span-5">
            <span className="mb-2 text-xs font-bold tracking-wider text-[#00a651] uppercase sm:text-sm">
              {content.badge}
            </span>

            <h2 className="mb-6 text-3xl font-black tracking-tight text-[#0a1e3b] sm:text-4xl lg:text-[2.6rem] lg:leading-[1.18]">
              {content.heading}
            </h2>

            <Link
              href={content.cta.href}
              className="group inline-flex items-center gap-3 rounded-full bg-[#00a651] py-2.5 pr-2.5 pl-6 text-xs font-bold text-white shadow-md transition-all duration-200 hover:bg-[#008f45] active:scale-98 sm:text-sm"
            >
              <span>{content.cta.label}</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0a1e3b] text-white transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>

          {/* Top Right: Paragraphs & Equipment Checklist */}
          <div className="flex flex-col items-start text-left lg:col-span-7">
            {content.paragraphs.map((p, idx) => (
              <p
                key={idx}
                className="mb-3 text-xs leading-relaxed text-[#4a5f78] sm:text-sm"
              >
                {p}
              </p>
            ))}

            {/* Equipment Checklist Grid */}
            <div className="mt-2 grid w-full grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {checklistItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#e6f7ed] text-[#00a651]">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                  <span className="text-xs font-bold text-[#0a1e3b] sm:text-[13px]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Asymmetric Visual Layout (Large Photo on left, Duo Photo on right) */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          {/* Left Large Photo: Cleaners in action */}
          <div className="relative h-[340px] w-full overflow-hidden rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_rgba(8,24,57,0.06)] sm:h-[420px] lg:col-span-7 lg:h-[480px]">
            <Image
              src="/images/placeholder/about-cleaner.png"
              alt="Professional JUBU cleaning team sanitizing office space"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Right Column: Duo Photo + Dubai Licensed Info Card */}
          <div className="flex flex-col gap-6 lg:col-span-5 lg:gap-6">
            {/* Top Team Duo Photo */}
            <div className="relative h-[200px] w-full overflow-hidden rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_rgba(8,24,57,0.06)] sm:h-[240px] lg:h-[250px]">
              <Image
                src="/images/placeholder/about-team.png"
                alt="Two professional cleaners smiling in clean kitchen"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
            </div>

            {/* Bottom Dark Card: Factual Business Info (JUBU Brand Navy) */}
            <div className="flex flex-1 flex-col justify-between rounded-3xl border border-[#152c4f] bg-gradient-to-br from-[#0a1e3b] via-[#07152b] to-[#040e1e] p-6 text-white shadow-lg sm:p-7">
              <div className="flex items-start justify-between">
                <span className="text-sm font-bold text-slate-200">
                  Licensed in Dubai
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xs">
                  <Check className="h-5 w-5 stroke-[2.5] text-[#00a651]" />
                </div>
              </div>

              <div className="my-4">
                <div className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  DET Licensed
                </div>
                <p className="mt-1.5 text-xs font-medium text-slate-300 sm:text-sm">
                  Dubai Department of Economy and Tourism · Licence No. 1026183
                </p>
              </div>

              {/* Decorative progress accent with JUBU Green & Sky Blue */}
              <div className="flex items-center gap-2 pt-2">
                <span className="h-1.5 w-10 rounded-full bg-[#00a651]" />
                <span className="h-1.5 w-4 rounded-full bg-[#0070ba]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

