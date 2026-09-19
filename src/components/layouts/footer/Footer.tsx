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
  { label: "Why Us", href: "#why-choose" },
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
      className="relative overflow-hidden border-t border-white/10 bg-[#061833] pt-16 pb-12 text-white sm:pb-8"
      aria-label="Site Footer"
    >
      {/* Dubai City Skyline Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/images/placeholder/city-background.png"
          alt="Dubai skyline illuminated at night"
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
        {/* Navy Overlay to maintain high legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#061833]/94 via-[#071e3d]/82 to-[#040e1e]/90" />
        <div className="absolute inset-0 bg-[#05142b]/40 mix-blend-multiply" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-white/15 pb-14 md:grid-cols-12 lg:gap-14">
          {/* Column 1: Brand details & Socials */}
          <div className="flex flex-col items-start text-left md:col-span-5">
            <Link
              href="#top"
              className="mb-4 flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-brand-sky"
              aria-label={`${settings.businessName} Home`}
            >
              <figure className="relative m-0 flex items-center rounded-xl border border-white/10 bg-white/10 p-2 backdrop-blur-xs">
                <Image
                  src={settings.logo.src}
                  alt={settings.logo.alt}
                  width={settings.logo.width}
                  height={settings.logo.height}
                  className="h-10 w-auto object-contain brightness-110 sm:h-11"
                />
              </figure>
            </Link>

            <span className="mb-3 block text-xs font-bold tracking-widest text-brand-sky uppercase">
              {settings.tagline}
            </span>

            <p className="mb-6 max-w-sm text-xs leading-relaxed font-normal text-slate-300 sm:text-sm">
              JUBU Cleaning Service is a Dubai-based cleaning company dedicated to providing
              high-quality, reliable and affordable cleaning solutions for homes, offices, villas
              and commercial spaces.
            </p>

            {/* Social Links Row */}
            <div className="flex items-center gap-3">
              {settings.socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow JUBU on ${social.platform}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-brand-blue hover:text-white"
                >
                  <Icon name={social.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-start text-left md:col-span-3">
            <h3 className="mb-5 text-sm font-bold tracking-wider text-white uppercase sm:text-base">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-0.5 text-xs font-medium text-slate-300 transition-colors hover:text-brand-sky sm:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="flex flex-col items-start text-left md:col-span-4">
            <h3 className="mb-4 text-sm font-bold tracking-wider text-white uppercase sm:text-base">
              Newsletter
            </h3>
            <p className="mb-5 text-xs leading-relaxed font-normal text-slate-300 sm:text-sm">
              Subscribe to our newsletter for cleaning tips, special offers and latest updates.
            </p>

            {isSubscribed ? (
              <div className="flex w-full items-center gap-2 rounded-xl border border-brand-green/40 bg-brand-green/20 p-3 text-xs text-brand-green">
                <Check className="h-4 w-4 shrink-0" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex w-full items-center rounded-xl bg-white p-1.5 shadow-md">
                <div className="pl-3 pr-2 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 bg-transparent py-2 pr-2 text-xs text-brand-navy placeholder:text-slate-400 focus:outline-none sm:text-sm"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-brand-blue text-white shadow-sm transition-colors hover:bg-brand-blue-hover"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright and Tagline */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-slate-400 sm:flex-row">
          <p>{settings.copyrightText}</p>
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wider text-slate-300 uppercase">{settings.tagline}</span>
            <span className="inline-block h-0.5 w-8 rounded-full bg-brand-green" />
          </div>
        </div>
      </div>
    </footer>
  );
}
