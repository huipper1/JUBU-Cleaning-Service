"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Check, Mail } from "lucide-react";

import type { SiteSettings } from "@/types/content";

import { Icon } from "@/ui";

interface FooterProps {
  settings: SiteSettings;
}

const QUICK_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Areas", href: "#areas" },
  { label: "Contact", href: "#contact" }
] as const;

export function Footer({ settings }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setNewsletterEmail("");
    }
  };

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

      {/* Main Footer Content - Generous top padding so the overlapping Contact card doesn't cover any footer content */}
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

            <p className="mb-8 max-w-sm text-xs leading-relaxed font-normal text-slate-200 sm:text-sm">
              JUBU Cleaning Service is a Dubai-based cleaning company dedicated to providing high-quality, reliable and affordable cleaning solutions for homes, offices, villas and commercial spaces.
            </p>

            {/* Circular Outline Social Media Icons */}
            <div className="flex items-center gap-3">
              {settings.socialLinks.map((social) => (
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

          {/* Column 2: Quick Links (with left border on desktop) */}
          <div className="flex flex-col items-start text-left md:col-span-3 md:border-l md:border-white/15 md:pl-10 lg:pl-14">
            <h3 className="mb-5 text-base font-bold tracking-tight text-white sm:text-lg">
              Quick Links
            </h3>
            <ul className="space-y-3">
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

          {/* Column 3: Newsletter (with left border on desktop) */}
          <div className="flex flex-col items-start text-left md:col-span-4 md:border-l md:border-white/15 md:pl-10 lg:pl-14">
            <h3 className="mb-3 text-base font-bold tracking-tight text-white sm:text-lg">
              Newsletter
            </h3>
            <p className="mb-6 text-xs leading-relaxed font-normal text-slate-200 sm:text-sm">
              Subscribe to our newsletter for cleaning tips, special offers and latest updates.
            </p>

            {isSubscribed ? (
              <div className="flex w-full items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/20 p-3 text-xs font-semibold text-emerald-200">
                <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex w-full max-w-md items-center overflow-hidden rounded-xl bg-white shadow-lg"
              >
                <div className="pl-3.5 pr-2 text-[#081839]">
                  <Mail className="h-5 w-5 text-slate-700" />
                </div>
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 bg-transparent py-3 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-sm"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="flex h-11 w-12 shrink-0 cursor-pointer items-center justify-center rounded-r-xl bg-[#0070ba] text-white transition-colors hover:bg-[#005e9e] sm:h-12 sm:w-14"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar with subtle navy shade */}
      <div className="relative z-10 border-t border-white/10 bg-[#030d1d]/60 backdrop-blur-xs">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-slate-300 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 JUBU Cleaning Service. All rights reserved.</p>
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

