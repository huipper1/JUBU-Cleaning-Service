"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";

import type { SiteSettings } from "@/types/content";

import {
  trackCtaClick,
  trackEmailClick,
  trackPhoneClick,
  trackWhatsAppClick
} from "@/lib/analytics";

import { WhatsAppIcon } from "@/components/icons";

interface ContactCardsClientProps {
  settings: SiteSettings;
  defaultWhatsappUrl: string;
}

export function ContactCardsClient({ settings, defaultWhatsappUrl }: ContactCardsClientProps) {
  return (
    <>
      {/* Contact Methods Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Phone Call */}
        <a
          href={`tel:${settings.phoneTel}`}
          onClick={() => trackPhoneClick("contact_page_phone_card", settings.phoneTel)}
          className="group flex flex-col items-center rounded-3xl border border-white/10 bg-[#061e44] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:shadow-xl hover:shadow-sky-950/40"
        >
          <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400 transition-transform group-hover:scale-110">
            <Phone className="size-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-white">Direct Phone Call</h3>
          <p className="mt-1 text-xs text-slate-400">Speak with our booking agent</p>
          <span className="mt-3 font-mono text-xs font-black text-sky-300 sm:text-sm">
            {settings.phoneDisplay}
          </span>
        </a>

        {/* WhatsApp */}
        <a
          href={defaultWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackWhatsAppClick("contact_page_whatsapp_card", undefined, settings.whatsappNumber)
          }
          className="group flex flex-col items-center rounded-3xl border border-white/10 bg-[#061e44] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-xl hover:shadow-emerald-950/40"
        >
          <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 transition-transform group-hover:scale-110">
            <WhatsAppIcon className="size-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-white">WhatsApp Chat</h3>
          <p className="mt-1 text-xs text-slate-400">Instant response & photo quotes</p>
          <span className="mt-3 font-mono text-xs font-black text-emerald-400 sm:text-sm">
            Chat on WhatsApp
          </span>
        </a>

        {/* Email Inquiries */}
        <a
          href={`mailto:${settings.email}`}
          onClick={() => trackEmailClick("contact_page_email_card", settings.email)}
          className="group flex flex-col items-center rounded-3xl border border-white/10 bg-[#061e44] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:shadow-xl hover:shadow-sky-950/40"
        >
          <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400 transition-transform group-hover:scale-110">
            <Mail className="size-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-white">Email Inquiries</h3>
          <p className="mt-1 text-xs text-slate-400">Contracts & vendor tenders</p>
          <span className="mt-3 max-w-full truncate text-xs font-medium text-sky-300">
            {settings.email}
          </span>
        </a>

        {/* Working Hours */}
        <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-[#061e44] p-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
            <Clock className="size-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-white">Operating Hours</h3>
          <p className="mt-1 text-xs text-slate-400">Emergency teams available</p>
          <span className="mt-3 text-xs font-semibold text-amber-300">
            {settings.workingHours || "Sat to Thu, 8:00 AM - 8:00 PM"}
          </span>
        </div>
      </div>
    </>
  );
}

export function ContactMapAction({ mapUrl }: { mapUrl?: string }) {
  const targetUrl = mapUrl || "https://maps.google.com";

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackCtaClick("open_google_maps", "contact_page_map_card", { target_url: targetUrl })
      }
      className="inline-flex items-center gap-2 rounded-full bg-brand-sky px-5 py-2.5 text-xs font-bold text-[#020b18] transition-all hover:bg-sky-300"
    >
      <MapPin className="size-3.5" />
      <span>Open in Google Maps</span>
    </a>
  );
}
