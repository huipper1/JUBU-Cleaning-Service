import Image from "next/image";
import Link from "next/link";

import { MessageCircle, Phone } from "lucide-react";

import type { SiteSettings } from "@/types/content";

interface ContactProps {
  settings: SiteSettings;
}

export function Contact({ settings }: ContactProps) {
  return (
    <section
      id="contact"
      className="relative z-30 -mb-32 sm:-mb-44 lg:-mb-52 pointer-events-none pt-50"
      aria-label="Contact JUBU Cleaning Service"
    >
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
        {/* Main Floating Banner Card matching website theme */}
        <div className="relative overflow-visible rounded-3xl border border-white/15 bg-gradient-to-br from-[#061e45] via-[#041530] to-[#020b18] px-6 pt-10 pb-10 shadow-[0_25px_50px_-12px_rgba(2,11,24,0.7)] sm:px-12 sm:pt-14 sm:pb-14 lg:px-16 lg:py-16">

          {/* Subtle ambient lighting glows within card */}
          <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-brand-blue/20 blur-[80px]" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-brand-green/15 blur-[90px]" />

          <div className="relative z-10 flex flex-col items-center gap-8 lg:grid lg:grid-cols-12 lg:gap-4">
            
            {/* Content Column */}
            <div className="flex w-full flex-col items-start text-left lg:col-span-7 xl:col-span-7">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-950/50 px-3.5 py-1 text-xs font-bold tracking-wider text-sky-300 uppercase backdrop-blur-xs sm:text-sm">
                Get In Touch With JUBU
              </span>
              <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
                Experience Your <br className="hidden sm:inline" />
                <span className="text-[#34d399]">Cleanest Home</span> Yet
              </h2>

              {/* Action Buttons styled to match site theme */}
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href="#quote"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-green px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-green/30 transition-all duration-200 hover:bg-brand-green-hover hover:shadow-xl active:scale-98 sm:text-base"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Get Instant Price</span>
                </Link>

                <a
                  href={`tel:${settings.phoneTel}`}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-xs transition-all duration-200 hover:border-sky-400 hover:bg-white/10 active:scale-98 sm:text-base"
                >
                  <Phone className="h-4 w-4 text-sky-400" />
                  <span>{settings.phoneDisplay}</span>
                </a>
              </div>
            </div>

            {/* Spacer for desktop grid to preserve right-side column room */}
            <div className="hidden h-56 lg:col-span-5 lg:block xl:col-span-5" />

          </div>

          {/* Cleaner Image: Stacks below text on mobile/tablet, anchors to bottom right on desktop */}
          <div className="pointer-events-none -mb-10 flex w-full max-w-[280px] items-end justify-center self-center sm:-mb-14 sm:max-w-[340px] md:max-w-[380px] lg:pointer-events-none lg:absolute lg:right-6 lg:bottom-0 lg:mb-0 lg:w-[460px] lg:max-w-none xl:right-12 xl:w-[500px]">
            <Image
              src="/images/placeholder/contact-cleaner.png"
              alt="Friendly professional JUBU cleaner giving OK gesture with spray and microfibre cloth"
              width={700}
              height={700}
              priority
              className="block h-auto w-full object-contain object-bottom drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

