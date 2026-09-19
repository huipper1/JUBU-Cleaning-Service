import { Mail, MapPin, Phone } from "lucide-react";

import type { SiteSettings } from "@/types/content";

import { SectionHeading } from "@/ui";

interface ContactProps {
  settings: SiteSettings;
}

export function Contact({ settings }: ContactProps) {
  return (
    <section
      id="contact"
      className="bg-brand-pale-blue/30 py-16 sm:py-20 lg:py-24"
      aria-label="Contact JUBU Cleaning Service"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="CONTACT US"
          title="Get in Touch"
          description="We're here to help! Reach out to us through any of the following channels."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {/* Phone Card */}
          <article className="group flex transform items-start gap-4 rounded-2xl border border-brand-border bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-xs transition-transform group-hover:scale-105">
              <Phone className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="mb-1 text-xs font-bold tracking-wider text-brand-muted uppercase">
                Phone
              </span>
              <a
                href={`tel:${settings.phoneTel}`}
                className="text-lg font-extrabold text-brand-navy transition-colors hover:text-brand-blue sm:text-xl"
              >
                {settings.phoneDisplay}
              </a>
              <p className="mt-1.5 text-xs font-normal text-brand-muted">
                Call or WhatsApp us anytime.
              </p>
            </div>
          </article>

          {/* Email Card */}
          <article className="group flex transform items-start gap-4 rounded-2xl border border-brand-border bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-xs transition-transform group-hover:scale-105">
              <Mail className="h-6 w-6" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="mb-1 text-xs font-bold tracking-wider text-brand-muted uppercase">
                Email
              </span>
              <a
                href={`mailto:${settings.email}`}
                className="block truncate text-lg font-extrabold text-brand-navy transition-colors hover:text-brand-blue sm:text-xl"
              >
                {settings.email}
              </a>
              <p className="mt-1.5 text-xs font-normal text-brand-muted">
                We typically respond within 24 hours.
              </p>
            </div>
          </article>

          {/* Location Card */}
          <article className="group flex transform items-start gap-4 rounded-2xl border border-brand-border bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-xs transition-transform group-hover:scale-105">
              <MapPin className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="mb-1 text-xs font-bold tracking-wider text-brand-muted uppercase">
                Location
              </span>
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-extrabold text-brand-navy transition-colors hover:text-brand-blue sm:text-xl"
              >
                {settings.address}
              </a>
              <p className="mt-1.5 text-xs font-normal text-brand-muted">
                Working hours: {settings.workingHours}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
