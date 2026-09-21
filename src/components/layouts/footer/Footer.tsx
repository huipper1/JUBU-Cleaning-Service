"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import type { SiteSettings } from "@/types/content";

import { Icon } from "@/ui";

interface FooterProps {
  settings: SiteSettings;
}

const QUICK_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-choose" },
  { label: "About", href: "#about" },
  { label: "Our Team", href: "#team" },
  { label: "Gallery", href: "#gallery" },
  { label: "Service Areas", href: "#areas" },
  { label: "Free Quote", href: "#quote" },
  { label: "Contact", href: "#contact" }
] as const;

export function Footer({ settings }: FooterProps) {
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    settings.whatsappDefaultMessage
  )}`;

  return (
    <footer
      className="relative overflow-hidden text-white bg-white"
      aria-label="Site Footer"
    >
      {/* Dubai City Skyline Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/images/placeholder/city-background.png"
          alt="Dubai skyline illuminated at night"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Navy gradient wash matching the screenshot */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#051733]/40 via-[#061d40]/60 to-[#041126]/40" />
      </div>

      {/* Main Footer Content */}
      <div className="container relative z-10 mx-auto px-4 pt-48 pb-14 sm:px-6 sm:pt-60 sm:pb-16 lg:px-8 lg:pt-72">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-0">
          {/* Column 1: Brand & Bio & Socials */}
          <div className="flex flex-col items-start text-left md:col-span-5 md:pr-12 lg:pr-16">
            <Link
              href="#top"
              className="mb-5 block"
              aria-label={`${settings.businessName} Home`}
            >
              <Image
                src="/images/logo-white-transparent.png"
                alt="JUBU Cleaning Services Logo"
                width={180}
                height={180}
                className="h-28 w-auto object-contain drop-shadow-md sm:h-32"
              />
            </Link>

            <p className="mb-6 max-w-sm text-xs leading-relaxed font-normal text-slate-200 sm:text-sm">
              JUBU Cleaning Service is a Dubai-based LLC providing trusted, reliable residential and commercial cleaning solutions across Dubai with specialized machines and dedicated staff.
            </p>

            {/* Contact details list */}
            <div className="mb-6 flex flex-col gap-2 text-xs text-slate-200">
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-white transition-colors"
              >
                <MapPin className="h-4 w-4 shrink-0 text-[#34d399] mt-0.5" />
                <span>{settings.address}</span>
              </a>

              <a
                href={`tel:${settings.phoneTel}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0 text-[#38bdf8]" />
                <span>{settings.phoneDisplay}</span>
              </a>

              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0 text-[#38bdf8]" />
                <span>{settings.email}</span>
              </a>
            </div>

            {/* Circular Outline Social Media Icons (renders only platforms with valid URLs) */}
            <div className="flex items-center gap-3">
              {settings.socialLinks
                .filter((social) => Boolean(social.url))
                .map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow JUBU on ${social.platform}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/5 text-white backdrop-blur-xs transition-all duration-200 hover:border-white hover:bg-white hover:text-[#0070ba]"
                  >
                    <Icon name={social.icon} className="h-4 w-4 stroke-[2]" />
                  </a>
                ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-start text-left md:col-span-3 md:border-l md:border-white/15 md:pl-10 lg:pl-14">
            <h3 className="mb-5 text-base font-bold tracking-tight text-white sm:text-lg">
              Quick Links
            </h3>
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-1">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm text-slate-200 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Direct Quote & WhatsApp CTA */}
          <div className="flex flex-col items-start text-left md:col-span-4 md:border-l md:border-white/15 md:pl-10 lg:pl-14">
            <h3 className="mb-3 text-base font-bold tracking-tight text-white sm:text-lg">
              Get in Touch
            </h3>
            <p className="mb-5 text-xs leading-relaxed font-normal text-slate-200 sm:text-sm">
              Need cleaning for your apartment, villa, or office? Reach out to us directly for a free, custom quote.
            </p>

            <div className="flex w-full flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-5 py-3 text-xs font-bold text-white shadow-md transition-all duration-200 hover:bg-brand-green-hover sm:text-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <Link
                href="#quote"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white backdrop-blur-xs transition-colors hover:bg-white/20 sm:text-sm"
              >
                <span>Request Free Quote</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar with Trade Licence Trust Line */}
      <div className="relative z-10 border-t border-white/10 bg-[#030d1d]/75 backdrop-blur-xs">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-slate-300 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-1">
            <p>{settings.copyrightText}</p>
            <p className="text-[11px] text-slate-400">
              Licensed by {settings.licence.issuingAuthority} · Licence No. {settings.licence.number}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold tracking-widest text-slate-300 uppercase sm:text-xs">
              CLEANER SPACES &nbsp;•&nbsp; BRIGHTER LIVES
            </span>
            <span className="inline-block h-0.5 w-10 rounded-full bg-[#00a651]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
