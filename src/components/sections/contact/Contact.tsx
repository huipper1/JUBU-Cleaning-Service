import { Mail, MapPin, Phone } from "lucide-react";

import type { SiteSettings } from "@/types/content";

interface ContactProps {
  settings: SiteSettings;
}

export function Contact({ settings }: ContactProps) {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#f3f9fd] py-14 sm:py-16 lg:py-20"
      aria-label="Contact JUBU Cleaning Service"
    >
      {/* Subtle organic background accent shapes matching screenshot */}
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#dcf1fb]/60 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full bg-[#dcf1fb]/70 blur-2xl"
        aria-hidden="true"
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left-aligned Header matching screenshot */}
        <div className="mb-8 flex flex-col items-start text-left sm:mb-10">
          <span className="mb-1 text-xs font-bold tracking-wider text-[#00a651] uppercase sm:text-sm">
            CONTACT US
          </span>
          <h2 className="mb-2 text-2xl font-black tracking-tight text-[#081839] sm:text-3xl lg:text-4xl">
            Get in Touch
          </h2>
          <p className="text-sm font-normal text-[#4a5f78] sm:text-base">
            We&apos;re here to help! Reach out to us through any of the following channels.
          </p>
        </div>

        {/* 3 Contact Cards */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          {/* Phone Card */}
          <article className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,112,186,0.06)] transition-all duration-300 hover:shadow-md sm:p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0070ba] text-white shadow-sm sm:h-16 sm:w-16">
              <Phone className="h-6 w-6 stroke-[2.2] fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0070ba] sm:text-sm">
                Phone
              </span>
              <a
                href={`tel:${settings.phoneTel}`}
                className="text-base font-extrabold text-[#081839] transition-colors hover:text-[#0070ba] sm:text-lg"
              >
                {settings.phoneDisplay}
              </a>
              <p className="mt-1 text-[11px] text-[#64748b] sm:text-xs">
                Call or WhatsApp us anytime.
              </p>
            </div>
          </article>

          {/* Email Card */}
          <article className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,112,186,0.06)] transition-all duration-300 hover:shadow-md sm:p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0070ba] text-white shadow-sm sm:h-16 sm:w-16">
              <Mail className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-xs font-bold text-[#0070ba] sm:text-sm">
                Email
              </span>
              <a
                href={`mailto:${settings.email}`}
                className="block truncate text-base font-extrabold text-[#081839] transition-colors hover:text-[#0070ba] sm:text-lg"
              >
                {settings.email}
              </a>
              <p className="mt-1 text-[11px] text-[#64748b] sm:text-xs">
                We typically respond within 24 hours.
              </p>
            </div>
          </article>

          {/* Location Card */}
          <article className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,112,186,0.06)] transition-all duration-300 hover:shadow-md sm:p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0070ba] text-white shadow-sm sm:h-16 sm:w-16">
              <MapPin className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0070ba] sm:text-sm">
                Location
              </span>
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-extrabold text-[#081839] transition-colors hover:text-[#0070ba] sm:text-lg"
              >
                {settings.address}
              </a>
              <p className="mt-1 text-[11px] text-[#64748b] sm:text-xs">
                Working hours: <br className="sm:hidden" />
                {settings.workingHours}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

