"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Menu, MessageCircle, Phone, X } from "lucide-react";

import type { SiteSettings } from "@/types/content";

interface HeaderProps {
  settings: SiteSettings;
}

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-choose" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Areas", href: "#areas" },
  { label: "Contact", href: "#contact" }
] as const;

export function Header({ settings }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#041633]/90 shadow-lg backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="#top"
          className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-brand-sky"
          aria-label={`${settings.businessName} Home`}
        >
          <figure className="relative m-0 flex items-center">
            <Image
              src="/images/logo-white-transparent.png"
              alt="JUBU Cleaning Services Logo"
              width={160}
              height={56}
              priority
              className="h-10 w-auto object-contain sm:h-12"
            />
          </figure>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main Navigation">
          {NAV_LINKS.map((link, idx) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-1 text-sm font-medium transition-colors hover:text-white ${idx === 0
                  ? "font-semibold text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-brand-sky"
                  : "text-slate-300 hover:text-white"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 lg:flex lg:gap-6">
          {/* Direct Call / WhatsApp Link */}
          <a
            href={`tel:${settings.phoneTel}`}
            className="group flex items-center gap-3 rounded-full text-left transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-brand-sky"
            aria-label={`Call us at ${settings.phoneDisplay}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a2852] text-[#38bdf8] shadow-inner transition-colors group-hover:bg-brand-blue group-hover:text-white">
              <Phone className="h-4 w-4 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-tight text-white transition-colors group-hover:text-brand-sky">
                {settings.phoneDisplay}
              </span>
              <span className="text-[11px] leading-tight font-medium text-slate-400">
                Call / WhatsApp
              </span>
            </div>
          </a>

          {/* Quote Button */}
          <Link
            href="#quote"
            className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-green/25 transition-all hover:bg-brand-green-hover hover:shadow-lg active:scale-98 sm:text-sm"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Get a Free Quote</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-brand-sky lg:hidden"
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-20 z-40 animate-in border-b border-white/10 bg-[#041633]/98 shadow-2xl backdrop-blur-xl duration-200 slide-in-from-top-2 lg:hidden">
          <div className="container mx-auto flex flex-col gap-4 px-4 py-6">
            <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
              <a
                href={`tel:${settings.phoneTel}`}
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                <Phone className="h-4 w-4" />
                <span>Call {settings.phoneDisplay}</span>
              </a>

              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                  settings.whatsappDefaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand-green py-3 text-sm font-bold text-white shadow-md shadow-brand-green/20 transition-colors hover:bg-brand-green-hover"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <Link
                href="#quote"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand-blue py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-blue-hover"
              >
                <span>Get a Free Quote</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
