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
    <header className="sticky top-0 z-50 w-full border-b border-brand-border/80 bg-white/95 shadow-xs backdrop-blur-md">
      <div className="container mx-auto flex h-18 items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="#top"
          className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-brand-blue"
          aria-label={`${settings.businessName} Home`}
        >
          <figure className="relative m-0 flex items-center">
            <Image
              src={settings.logo.src}
              alt={settings.logo.alt}
              width={settings.logo.width}
              height={settings.logo.height}
              priority
              className="h-11 w-auto object-contain sm:h-12"
            />
          </figure>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-1 text-sm font-semibold text-brand-navy transition-colors hover:text-brand-blue"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 sm:flex lg:gap-6">
          {/* Direct Call / WhatsApp Link */}
          <a
            href={`tel:${settings.phoneTel}`}
            className="group flex items-center gap-2.5 rounded-md text-left focus-visible:outline-2 focus-visible:outline-brand-blue"
            aria-label={`Call us at ${settings.phoneDisplay}`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
              <Phone className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-brand-navy transition-colors group-hover:text-brand-blue">
                {settings.phoneDisplay}
              </span>
              <span className="text-[11px] leading-tight font-medium text-brand-muted">
                Call / WhatsApp
              </span>
            </div>
          </a>

          {/* Quote Button */}
          <Link
            href="#quote"
            className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-green-hover hover:shadow-md sm:text-sm"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Get a Free Quote</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border text-brand-navy hover:bg-brand-pale-blue focus-visible:outline-2 focus-visible:outline-brand-blue lg:hidden"
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-18 z-40 animate-in border-b border-brand-border bg-white shadow-xl duration-200 slide-in-from-top-2 sm:top-20 lg:hidden">
          <div className="container mx-auto flex flex-col gap-4 px-4 py-6">
            <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-2.5 text-base font-semibold text-brand-navy transition-colors hover:bg-brand-pale-blue hover:text-brand-blue"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 border-t border-brand-border pt-4">
              <a
                href={`tel:${settings.phoneTel}`}
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-lg border border-brand-blue bg-white py-3 text-sm font-bold text-brand-blue transition-colors hover:bg-brand-blue-light"
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
                className="flex items-center justify-center gap-2 rounded-lg bg-brand-green py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-green-hover"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <Link
                href="#quote"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-lg bg-brand-navy py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-navy-light"
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
