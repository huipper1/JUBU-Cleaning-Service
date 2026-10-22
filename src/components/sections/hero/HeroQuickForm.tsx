"use client";

import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Loader2,
  User,
  Phone,
  Clock
} from "lucide-react";

import type { Service, SiteSettings } from "@/types/content";
import type { CreateLeadInput } from "@/types/lead";
import { trackFormStart, trackLeadGenerated } from "@/lib/analytics";
import { isValidUaeMobile } from "@/lib/content/types";
import { env } from "@/env";
import { WhatsAppIcon } from "@/components/icons";

interface HeroQuickFormProps {
  services?: Service[];
  settings?: SiteSettings;
  sourceArea?: string;
  areaName?: string;
}

const DEFAULT_SERVICES: Array<{ id: string; title: string }> = [
  { id: "home-cleaning", title: "Home Cleaning" },
  { id: "deep-cleaning", title: "Deep Cleaning" },
  { id: "move-in-out-cleaning", title: "Move In / Move Out Cleaning" },
  { id: "office-cleaning", title: "Commercial / Office Cleaning" },
  { id: "sofa-carpet-cleaning", title: "Sofa & Carpet Cleaning" },
  { id: "ac-cleaning", title: "AC Cleaning Service" }
];

export function HeroQuickForm({
  services,
  settings,
  sourceArea = "hero-quick-form",
  areaName
}: HeroQuickFormProps) {
  const availableServices =
    services && services.length > 0
      ? services.map((s) => ({ id: s.id, title: s.title }))
      : DEFAULT_SERVICES;

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    serviceId: availableServices[0]?.id || "home-cleaning"
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const hasTrackedFormStart = useRef(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!hasTrackedFormStart.current) {
      hasTrackedFormStart.current = true;
      trackFormStart(sourceArea);
    }
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedName = formData.fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage("Please enter your name (at least 2 characters).");
      return;
    }

    if (!isValidUaeMobile(formData.mobile)) {
      setErrorMessage("Please enter a valid UAE mobile number (e.g. 054 299 5191 or 50 123 4567).");
      return;
    }

    const rawCleanMobile = formData.mobile.replace(/[^\d]/g, "");
    const formattedUaeMobile = rawCleanMobile.startsWith("971")
      ? `+${rawCleanMobile}`
      : rawCleanMobile.startsWith("05")
        ? `+971${rawCleanMobile.slice(1)}`
        : `+971${rawCleanMobile}`;

    const currentService =
      availableServices.find((s) => s.id === formData.serviceId)?.title || "Cleaning Service";
    const submittedLocation = areaName || "Dubai";

    setStatus("submitting");

    const searchParams =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

    const fullPayload: CreateLeadInput = {
      fullName: trimmedName,
      mobile: formattedUaeMobile,
      whatsappNumber: formattedUaeMobile,
      serviceId: formData.serviceId,
      location: submittedLocation,
      propertyType: "other",
      preferredDate: "Flexible",
      preferredTime: "Flexible",
      message: `Quick quote inquiry from Hero for ${currentService}`,
      whatsappOptIn: true,
      sourceArea,
      utmSource: searchParams?.get("utm_source") || "Direct",
      utmMedium: searchParams?.get("utm_medium") || "",
      utmCampaign: searchParams?.get("utm_campaign") || "",
      utmContent: searchParams?.get("utm_content") || "",
      fbclid: searchParams?.get("fbclid") || "",
      landingUrl: typeof window !== "undefined" ? window.location.href : ""
    };

    // 1. Save lead to Database via /api/lead (Prisma connection)
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullPayload),
        keepalive: true
      });
      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        console.warn("[HeroQuickForm] /api/lead returned error response:", errorJson);
      }
    } catch (err) {
      console.error("[HeroQuickForm] DB Lead Save Error:", err);
    }

    // 2. DataLayer Event (Exact same tracking parameters for GA4, Google Ads, Meta CAPI)
    trackLeadGenerated({
      serviceId: formData.serviceId,
      serviceName: currentService,
      propertyType: "other",
      locationArea: submittedLocation,
      preferredDate: "Flexible",
      preferredTime: "Flexible",
      fullName: trimmedName,
      mobile: formattedUaeMobile,
      whatsappNumber: formattedUaeMobile,
      sourceArea,
      trafficSource: {
        utm_source: fullPayload.utmSource,
        utm_medium: fullPayload.utmMedium,
        utm_campaign: fullPayload.utmCampaign,
        utm_content: fullPayload.utmContent,
        fbclid: fullPayload.fbclid,
        gclid: searchParams?.get("gclid") ?? undefined
      }
    });

    // 3. Redirect to WhatsApp with personalized message
    const siteUrl = env?.NEXT_PUBLIC_SITE_URL || "";
    const pageUrl =
      siteUrl + (typeof window !== "undefined" ? window.location.pathname : "/");
    const targetWhatsapp = settings?.whatsappNumber || "971542995191";

    const waMessage = [
      `New Quick Quote Request - JUBU Cleaning Service`,
      `Name: ${trimmedName}`,
      `Phone: ${formattedUaeMobile}`,
      `Service: ${currentService}`,
      `Location: ${submittedLocation}`,
      `Source: Hero Quick Form`,
      `Page: ${pageUrl}`
    ].join("\n");

    const waUrl = `https://wa.me/${targetWhatsapp}?text=${encodeURIComponent(waMessage)}`;

    setStatus("success");
    setTimeout(() => {
      window.location.href = waUrl;
    }, 600);
  };

  return (
    <section
      aria-label="Instant Free Cleaning Quote"
      className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 mb-8 sm:mb-14"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-linear-to-r from-[#061836]/95 via-[#0a234a]/95 to-[#061836]/95 p-5 shadow-2xl backdrop-blur-xl sm:p-7 lg:p-8">
        {/* Top radiant accent bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-sky-400 via-brand-green to-emerald-400" />

        {/* Card Header */}
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/15 px-3 py-0.5 text-[11px] font-bold tracking-wide text-sky-300">
                <Sparkles className="h-3 w-3 text-sky-400" />
                INSTANT FREE QUOTE
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Online Now • 5-Min Reply
              </span>
            </div>
            <h3 className="mt-1.5 text-lg font-extrabold tracking-tight text-white sm:text-2xl">
              Get an Instant Cleaning Quote
            </h3>
          </div>
          <p className="max-w-md text-xs text-slate-300 sm:text-right">
            Fill 3 quick fields to receive direct WhatsApp pricing with zero obligation.
          </p>
        </div>

        {/* Quick Form: Responsive 4-Column Grid on Large Screens */}
        <form onSubmit={handleSubmit} className="mt-2 space-y-3">
          <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Full Name */}
            <div>
              <label htmlFor="quick-fullName" className="mb-1 block text-xs font-semibold text-slate-200">
                Full Name <span className="text-brand-sky">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="quick-fullName"
                  type="text"
                  name="fullName"
                  required
                  autoComplete="name"
                  placeholder="e.g. John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={status === "submitting" || status === "success"}
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pr-4 pl-10 text-sm text-white placeholder-slate-400 transition-all focus:border-sky-400 focus:bg-[#092348] focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              </div>
            </div>

            {/* 2. UAE Mobile Number */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="quick-mobile" className="block text-xs font-semibold text-slate-200">
                  Mobile Number <span className="text-brand-sky">*</span>
                </label>
                <span className="text-[10px] text-slate-400">UAE (Dubai)</span>
              </div>
              <div className="flex">
                <span className="inline-flex items-center gap-1.5 rounded-l-xl border border-r-0 border-white/15 bg-white/10 px-3 text-xs font-bold text-white">
                  <span className="text-[13px]">🇦🇪</span> +971
                </span>
                <input
                  id="quick-mobile"
                  type="tel"
                  name="mobile"
                  required
                  autoComplete="tel"
                  placeholder="50 123 4567"
                  value={formData.mobile}
                  onChange={handleChange}
                  disabled={status === "submitting" || status === "success"}
                  className="w-full rounded-r-xl border border-white/15 bg-white/5 py-2.5 pr-4 pl-3 text-sm text-white placeholder-slate-400 transition-all focus:border-sky-400 focus:bg-[#092348] focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              </div>
            </div>

            {/* 3. Cleaning Service Dropdown */}
            <div>
              <label htmlFor="quick-serviceId" className="mb-1 block text-xs font-semibold text-slate-200">
                Cleaning Service <span className="text-brand-sky">*</span>
              </label>
              <div className="relative">
                <select
                  id="quick-serviceId"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  disabled={status === "submitting" || status === "success"}
                  className="w-full appearance-none rounded-xl border border-white/15 bg-white/5 py-2.5 pr-10 pl-3.5 text-sm font-medium text-white transition-all focus:border-sky-400 focus:bg-[#092348] focus:outline-none focus:ring-1 focus:ring-sky-400"
                >
                  {availableServices.map((svc) => (
                    <option key={svc.id} value={svc.id} className="bg-[#071933] py-2 text-white">
                      {svc.title}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-300">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 4. Action Button */}
            <div>
              <button
                type="submit"
                disabled={status === "submitting" || status === "success"}
                className="group relative flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-green/30 transition-all duration-200 hover:bg-brand-green-hover hover:shadow-xl active:scale-98 disabled:opacity-85 sm:text-base"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-white" />
                    <span>Opening WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <WhatsAppIcon monochrome className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                    <span className="whitespace-nowrap">Get Free Quote</span>
                    <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Validation / Error Message */}
          {errorMessage && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {errorMessage}
            </div>
          )}

          {/* Micro Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] text-slate-300 sm:gap-6">
            <span className="inline-flex items-center gap-1 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
              Dubai Licensed LLC (DET #1026183)
            </span>
            <span className="hidden text-slate-500 sm:inline">•</span>
            <span className="inline-flex items-center gap-1 font-medium">
              <Clock className="h-3.5 w-3.5 text-emerald-400" />
              Response in &lt; 5 Minutes
            </span>
            <span className="hidden text-slate-500 sm:inline">•</span>
            <span className="inline-flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-brand-sky" />
              No Hidden Fees • 100% Free
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}
