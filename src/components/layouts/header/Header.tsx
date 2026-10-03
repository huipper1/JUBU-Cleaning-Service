"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronDown, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";

import type { ServiceArea, SiteSettings } from "@/types/content";
import { AREA_NAV_ITEMS, MAIN_NAV_ITEMS } from "@/constants/navigation";
import { getPublicImageUrl } from "@/lib/content/image-url";

interface HeaderProps {
  settings: SiteSettings;
  areas?: ServiceArea[];
}

export function Header({ settings, areas }: HeaderProps) {
  const pathname = usePathname();
  const isRoot = pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileAreasOpen, setIsMobileAreasOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileAreasOpen(false);
  };

  const navAreas =
    areas && areas.length > 0
      ? areas.map((a) => ({
          name: a.name,
          href: `/${a.slug}`,
          subtitle: "Cleaning Services"
        }))
      : AREA_NAV_ITEMS;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#041633]/90 shadow-lg backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href={isRoot ? "#top" : "/"}
          className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-brand-sky"
          aria-label={`${settings.businessName} Home`}
        >
          <figure className="relative m-0 flex items-center">
            <Image
              src={getPublicImageUrl(settings.logo?.src, "/images/logo-white-transparent.png")}
              alt={settings.logo?.alt || `${settings.businessName} Logo`}
              width={settings.logo?.width || 160}
              height={settings.logo?.height || 56}
              priority
              className="h-10 w-auto object-contain sm:h-12"
            />
          </figure>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main Navigation">
          {MAIN_NAV_ITEMS.map((link, idx) => {
            const isHome = link.label === "Home";
            const linkHref = isHome ? (isRoot ? "#top" : "/") : link.href;

            if (link.label === "Areas") {
              return (
                <div key={link.label} className="group/areas relative">
                  <Link
                    href={linkHref}
                    className="relative flex items-center gap-1.5 py-2 text-sm font-medium text-slate-300 transition-colors group-hover/areas:text-white hover:text-white"
                    aria-haspopup="true"
                  >
                    <span>{link.label}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-hover/areas:rotate-180 group-hover/areas:text-white" />
                  </Link>

                  {/* Dropdown Card */}
                  <div
                    className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-focus-within/areas:pointer-events-auto group-focus-within/areas:opacity-100 group-hover/areas:pointer-events-auto group-hover/areas:opacity-100"
                    role="menu"
                    aria-orientation="vertical"
                    aria-label="Service Areas Submenu"
                  >
                    <div className="w-[520px] rounded-2xl border border-white/15 bg-[#041633]/95 p-3.5 shadow-2xl backdrop-blur-xl">
                      <div className="grid grid-cols-2 gap-2">
                        {navAreas.map((area) => (
                          <Link
                            key={area.href}
                            href={area.href}
                            role="menuitem"
                            className="group/item flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition-all duration-150 hover:border-white/10 hover:bg-white/10"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-brand-sky transition-colors group-hover/item:bg-brand-sky/20">
                              <MapPin className="h-4 w-4" />
                            </div>
                            <div className="flex min-w-0 flex-col">
                              <span className="truncate text-xs font-bold text-white transition-colors group-hover/item:text-brand-sky">
                                {area.name}
                              </span>
                              <span className="truncate text-[11px] text-slate-400">
                                {area.subtitle}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                href={linkHref}
                className={`relative py-1 text-sm font-medium transition-colors hover:text-white ${
                  idx === 0 && isRoot
                    ? "font-semibold text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-brand-sky"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
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
              {MAIN_NAV_ITEMS.map((link) => {
                const isHome = link.label === "Home";
                const linkHref = isHome ? (isRoot ? "#top" : "/") : link.href;

                if (link.label === "Areas") {
                  return (
                    <div key={link.label} className="flex flex-col">
                      <div className="flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white">
                        <Link href={linkHref} onClick={closeMobileMenu} className="flex-1">
                          {link.label}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setIsMobileAreasOpen((prev) => !prev)}
                          aria-expanded={isMobileAreasOpen}
                          aria-label="Toggle Service Areas sub-navigation"
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isMobileAreasOpen ? "rotate-180 text-brand-sky" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {isMobileAreasOpen && (
                        <div className="mt-1 ml-4 flex flex-col gap-1 border-l border-white/10 pl-3">
                          <Link
                            href="#areas"
                            onClick={closeMobileMenu}
                            className="flex items-center gap-2.5 rounded-lg py-2 text-xs font-semibold text-brand-sky hover:text-white"
                          >
                            <MapPin className="h-3.5 w-3.5" />
                            <span>All Dubai Service Areas</span>
                          </Link>
                          {navAreas.map((area) => (
                            <Link
                              key={area.href}
                              href={area.href}
                              onClick={closeMobileMenu}
                              className="flex items-center gap-2.5 rounded-lg py-1.5 text-xs text-slate-300 hover:text-white"
                            >
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              <div className="flex flex-col">
                                <span className="font-medium">{area.name}</span>
                                <span className="text-[10px] text-slate-400">{area.subtitle}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={linkHref}
                    onClick={closeMobileMenu}
                    className="rounded-lg px-3 py-2.5 text-base font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {link.label}
                  </Link>
                );
              })}
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
