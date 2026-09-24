"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";

import {
  ArrowRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Loader2,
  Lock,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  User
} from "lucide-react";

import type { Service, SiteSettings } from "@/types/content";
import type { CreateLeadInput } from "@/types/lead";

import { Icon } from "@/ui";
import { createLeadInputSchema } from "@/lib/content/types";
import { env } from "@/env";

interface QuoteFormProps {
  services: Service[];
  settings: SiteSettings;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export function QuoteForm({ services, settings }: QuoteFormProps) {
  const [formData, setFormData] = useState<CreateLeadInput>(() => ({
    fullName: "",
    mobile: "",
    whatsappNumber: "",
    serviceId: services[0]?.id ?? "home-cleaning",
    location: "",
    propertyType: "",
    preferredDate: "",
    message: "",
    whatsappOptIn: true,
    honeypot: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
    fbclid: "",
    landingUrl: ""
  }));

  const [status, setStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    mobile: string;
    serviceName: string;
  } | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close custom dropdown on outside click or escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Listen to hash change and custom service selection events
  useEffect(() => {
    const handleHashService = () => {
      const hash = window.location.hash;
      if (hash.includes("service=")) {
        const hashParams = new URLSearchParams(hash.substring(hash.indexOf("?") + 1));
        const serviceId = hashParams.get("service");
        if (serviceId) {
          setFormData((prev) => ({ ...prev, serviceId }));
        }
      }
    };

    const handleCustomServiceSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ serviceId: string }>;
      if (customEvent.detail?.serviceId) {
        setFormData((prev) => ({ ...prev, serviceId: customEvent.detail.serviceId }));
      }
    };

    window.addEventListener("hashchange", handleHashService);
    window.addEventListener("select-service", handleCustomServiceSelect);

    return () => {
      window.removeEventListener("hashchange", handleHashService);
      window.removeEventListener("select-service", handleCustomServiceSelect);
    };
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear error for edited field
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setErrorMessage("");

    // Capture latest UTM parameters and landing URL
    const searchParams =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const fullPayload: CreateLeadInput = {
      ...formData,
      utmSource: searchParams?.get("utm_source") ?? formData.utmSource,
      utmMedium: searchParams?.get("utm_medium") ?? formData.utmMedium,
      utmCampaign: searchParams?.get("utm_campaign") ?? formData.utmCampaign,
      utmContent: searchParams?.get("utm_content") ?? formData.utmContent,
      fbclid: searchParams?.get("fbclid") ?? formData.fbclid,
      landingUrl: typeof window !== "undefined" ? window.location.href : ""
    };

    // Client-side validation using shared Zod schema
    const validationResult = createLeadInputSchema.safeParse(fullPayload);
    if (!validationResult.success) {
      setFieldErrors(validationResult.error.flatten().fieldErrors);
      return;
    }

    setStatus("submitting");

    // Resolve service name
    const currentService =
      services.find((s) => s.id === formData.serviceId)?.title ??
      (formData.serviceId === "other" ? "Custom Cleaning" : "Cleaning Service");

    const submittedName = formData.fullName;
    const submittedMobile = formData.mobile;
    const submittedWhatsApp = formData.whatsappNumber?.trim() || submittedMobile;
    const submittedLocation = formData.location?.trim() || "N/A";
    const submittedPropertyType = formData.propertyType
      ? formData.propertyType.charAt(0).toUpperCase() + formData.propertyType.slice(1)
      : "N/A";
    const submittedPreferredDate = formData.preferredDate?.trim() || "N/A";
    const submittedMessage = formData.message?.trim() || "N/A";
    const contactPreference = formData.whatsappOptIn
      ? "Prefers WhatsApp contact"
      : "Prefers phone contact";

    // UTM / tracking values (already captured in fullPayload)
    const utmSource = fullPayload.utmSource || "Direct";
    const utmCampaign = fullPayload.utmCampaign || "N/A";
    const pageUrl =
      (env.NEXT_PUBLIC_SITE_URL ?? "") +
      (typeof window !== "undefined" ? window.location.pathname : "/");

    // Build plain-text WhatsApp message per spec
    const waMessage = [
      `New Quote Request - JUBU Cleaning Service`,
      `Name: ${submittedName}`,
      `Phone: ${submittedMobile}`,
      `WhatsApp: ${submittedWhatsApp}`,
      `Service: ${currentService}`,
      `Location: ${submittedLocation}`,
      `Property: ${submittedPropertyType}`,
      `Preferred Date: ${submittedPreferredDate}`,
      `Details: ${submittedMessage}`,
      `Contact: ${contactPreference}`,
      `Source: ${utmSource} / ${utmCampaign}`,
      `Page: ${pageUrl}`
    ].join("\n");

    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

    // Fire /api/lead in background (non-blocking) — preserves PLAN.md §3.5 architecture
    void fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullPayload)
    }).catch((err: unknown) => {
      console.error("[QuoteForm] Background lead log failed:", err);
    });

    // Show redirecting state then navigate (same tab — mobile-safe)
    setRedirectUrl(waUrl);
    setSubmittedData({
      name: submittedName,
      mobile: submittedMobile,
      serviceName: currentService
    });
    setStatus("success");

    const redirectTimer = setTimeout(() => {
      window.location.href = waUrl;
    }, 700);

    // Store timer id so resetForm can clear it if user clicks "Submit another"
    void redirectTimer;
  };

  const resetForm = () => {
    setStatus("idle");
    setRedirectUrl("");
    setFormData((prev) => ({
      ...prev,
      fullName: "",
      mobile: "",
      whatsappNumber: "",
      location: "",
      propertyType: "",
      preferredDate: "",
      message: ""
    }));
  };

  return (
    <section
      id="quote"
      className="relative overflow-hidden bg-[#071933] py-16 text-white sm:py-20 lg:py-24"
      aria-label="Request a Free Quote"
    >
      {/* Dubai City Skyline Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/images/placeholder/city-background.png"
          alt="Dubai city skyline illuminated at night"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Deep blue/navy gradient overlay matching the design mockup */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-[#061833]/92 via-[#071e3d]/78 to-[#061833]/70" /> */}
        <div className="absolute inset-0 bg-[#05142b]/40 mix-blend-multiply" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Value propositions & WhatsApp contact box */}
          <div className="flex flex-col items-start text-left lg:col-span-6">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-white backdrop-blur-xs">
              <span>CLEANER SPACES • BRIGHTER LIVES</span>
            </span>

            <h2 className="mb-4 flex flex-wrap items-center gap-2 text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              <span>Get a Free Quote</span>
              <span className="text-brand-sky">Today</span>
              <span className="inline-block h-1 w-12 rounded-full bg-brand-green sm:w-16" />
            </h2>

            <p className="mb-8 max-w-lg text-sm leading-relaxed font-normal text-slate-200 sm:text-base">
              Tell us your cleaning needs and we&apos;ll provide the best solution for your space,
              quickly and easily.
            </p>

            {/* 3 Benefits bullets with circular icons matching design */}
            <div className="mb-8 w-full max-w-md space-y-4 sm:mb-10">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Fast Response</h3>
                  <p className="mt-0.5 text-xs text-slate-300">We usually reply within minutes</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Customized Solutions</h3>
                  <p className="mt-0.5 text-xs text-slate-300">
                    Tailored to your specific needs
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">No Obligation</h3>
                  <p className="mt-0.5 text-xs text-slate-300">Free quotes with no commitment</p>
                </div>
              </div>
            </div>

            {/* Direct Call & WhatsApp row with cursive slogan */}
            <div className="flex w-full flex-col gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-green text-white shadow-lg">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-300">
                    Call / WhatsApp
                  </span>
                  <a
                    href={`tel:${settings.phoneTel}`}
                    className="text-xl font-extrabold tracking-tight text-white transition-colors hover:text-brand-sky sm:text-2xl"
                  >
                    {settings.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-1">
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                    settings.whatsappDefaultMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-3.5 text-xs font-bold text-white shadow-lg transition-all duration-200 hover:bg-brand-green-hover sm:text-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Contact Us on WhatsApp</span>
                  <ArrowRight className="h-4 w-4" />
                </a>

                {/* Cursive text accent "Cleaner Dubai Brighter Lives" */}
                <div className="relative -rotate-20 select-none hidden md:block">
                  <span className="block font-serif text-lg italic tracking-wide text-center text-white/90 sm:text-xl">
                    Cleaner<br /> Dubai<br /> Brighter<br /> Lives
                  </span>
                  <svg
                    className="mt-0.5 h-2 w-32 text-brand-green"
                    viewBox="0 0 100 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6C30 1 70 1 98 6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form Card */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-white/15 bg-[#071933]/40 p-6 text-white shadow-2xl backdrop-blur-xl sm:p-8 md:p-10">
              {status === "success" ? (
                /* Redirecting / Success State */
                <div className="flex animate-in flex-col items-center py-6 text-center duration-300 zoom-in-95 fade-in">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/20 text-brand-green border border-brand-green/30">
                    <MessageCircle className="h-10 w-10 animate-pulse" />
                  </div>
                  <h3 className="mb-2 text-2xl font-extrabold text-white">
                    Redirecting to WhatsApp…
                  </h3>
                  <p className="mb-6 max-w-sm text-sm leading-relaxed text-slate-200">
                    Your request for{" "}
                    <strong className="text-brand-sky font-bold">{submittedData?.serviceName}</strong>{" "}
                    is ready. Opening WhatsApp now to connect you with our team.
                  </p>

                  <div className="flex w-full flex-col gap-3">
                    {/* Fallback — in case browser blocks automatic redirect */}
                    <a
                      href={redirectUrl}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-brand-green-hover"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>Continue to WhatsApp</span>
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Submit another inquiry</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Interactive Form State */
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                  <div>
                    <span className="mb-1 block text-xs font-bold tracking-wider text-brand-green uppercase">
                      REQUEST A FREE QUOTE
                    </span>
                    <h3 className="text-2xl font-extrabold tracking-tight text-white">
                      Get Your Custom Quote
                    </h3>
                    <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                      Fill in the details below and we&apos;ll get back to you shortly.
                    </p>
                  </div>

                  {/* Top Error Alert */}
                  {status === "error" && errorMessage && (
                    <div className="rounded-xl border border-red-500/40 bg-red-950/60 p-3 text-xs text-red-200">
                      {errorMessage}
                    </div>
                  )}

                  {/* Honeypot hidden input for spam bots */}
                  <input
                    type="text"
                    name="honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.honeypot}
                    onChange={handleChange}
                    className="pointer-events-none sr-only absolute opacity-0"
                    aria-hidden="true"
                  />

                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-1.5 block text-xs font-bold text-slate-200"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        disabled={status === "submitting"}
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className={`w-full rounded-xl border bg-white/10 py-3 pr-4 pl-10 text-sm text-white transition-all placeholder:text-slate-400 focus:border-brand-sky focus:bg-white/15 focus:ring-2 focus:ring-brand-sky/30 focus:outline-none ${fieldErrors.fullName
                          ? "border-red-400 bg-red-950/30"
                          : "border-white/15 hover:border-white/30"
                          }`}
                      />
                    </div>
                    {fieldErrors.fullName && (
                      <p className="mt-1 text-[11px] text-red-300">{fieldErrors.fullName[0]}</p>
                    )}
                  </div>

                  {/* Mobile Number & WhatsApp Number — side by side */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="mobile"
                        className="mb-1.5 block text-xs font-bold text-slate-200"
                      >
                        Mobile Number
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <Phone className="h-4 w-4" />
                        </div>
                        <input
                          type="tel"
                          id="mobile"
                          name="mobile"
                          required
                          disabled={status === "submitting"}
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="e.g. +971 50 123 4567"
                          className={`w-full rounded-xl border bg-white/10 py-3 pr-4 pl-10 text-sm text-white transition-all placeholder:text-slate-400 focus:border-brand-sky focus:bg-white/15 focus:ring-2 focus:ring-brand-sky/30 focus:outline-none ${fieldErrors.mobile
                            ? "border-red-400 bg-red-950/30"
                            : "border-white/15 hover:border-white/30"
                            }`}
                        />
                      </div>
                      {fieldErrors.mobile && (
                        <p className="mt-1 text-[11px] text-red-300">{fieldErrors.mobile[0]}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="whatsappNumber"
                        className="mb-1.5 block text-xs font-bold text-slate-200"
                      >
                        WhatsApp Number{" "}
                        <span className="font-normal text-slate-400">(if different)</span>
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <MessageCircle className="h-4 w-4" />
                        </div>
                        <input
                          type="tel"
                          id="whatsappNumber"
                          name="whatsappNumber"
                          disabled={status === "submitting"}
                          value={formData.whatsappNumber}
                          onChange={handleChange}
                          placeholder="e.g. +971 55 987 6543"
                          className={`w-full rounded-xl border bg-white/10 py-3 pr-4 pl-10 text-sm text-white transition-all placeholder:text-slate-400 focus:border-brand-sky focus:bg-white/15 focus:ring-2 focus:ring-brand-sky/30 focus:outline-none ${fieldErrors.whatsappNumber
                            ? "border-red-400 bg-red-950/30"
                            : "border-white/15 hover:border-white/30"
                            }`}
                        />
                      </div>
                      {fieldErrors.whatsappNumber && (
                        <p className="mt-1 text-[11px] text-red-300">
                          {fieldErrors.whatsappNumber[0]}
                        </p>
                      )}
                    </div>
                  </div>


                  {/* Select Cleaning Service */}
                  <div className="relative" ref={dropdownRef}>
                    <label
                      id="service-select-label"
                      className="mb-1.5 block text-xs font-bold text-slate-200"
                    >
                      Select Cleaning Service
                    </label>

                    {/* Hidden input to maintain native form compatibility */}
                    <input
                      type="hidden"
                      name="serviceId"
                      value={formData.serviceId}
                    />

                    {/* Custom Dropdown Trigger Button */}
                    <button
                      type="button"
                      id="serviceId"
                      aria-haspopup="listbox"
                      aria-expanded={isDropdownOpen}
                      aria-labelledby="service-select-label serviceId"
                      disabled={status === "submitting"}
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                      className={`group relative flex w-full items-center justify-between rounded-xl border bg-[#0b2447]/90 px-3.5 py-3 text-left text-sm text-white shadow-sm backdrop-blur-md transition-all duration-200 hover:border-white/30 focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/30 focus:outline-none ${
                        isDropdownOpen
                          ? "border-brand-sky ring-2 ring-brand-sky/30 shadow-lg shadow-sky-950/40"
                          : "border-white/15"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-sky transition-colors group-hover:bg-brand-sky/20">
                          {formData.serviceId === "other" ? (
                            <Sparkles className="h-4 w-4" />
                          ) : (
                            <Icon
                              name={services.find((s) => s.id === formData.serviceId)?.icon || "calendar"}
                              className="h-4 w-4"
                            />
                          )}
                        </div>
                        <span className="truncate font-medium text-white">
                          {formData.serviceId === "other"
                            ? "Other / Custom Service"
                            : services.find((s) => s.id === formData.serviceId)?.title ?? "Select a service"}
                        </span>
                      </div>

                      <div className="flex items-center pl-2 text-slate-400 transition-colors group-hover:text-white">
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isDropdownOpen ? "rotate-180 text-brand-sky" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {/* Custom Dropdown Menu Panel */}
                    {isDropdownOpen && (
                      <div
                        role="listbox"
                        aria-labelledby="service-select-label"
                        className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-white/20 bg-[#081839]/95 p-1.5 shadow-2xl backdrop-blur-xl ring-1 ring-black/40 focus:outline-none scrollbar-thin scrollbar-thumb-white/20 animate-in fade-in zoom-in-95 duration-150"
                      >
                        <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Available Services
                        </div>

                        {services.map((svc) => {
                          const isSelected = formData.serviceId === svc.id;
                          return (
                            <div
                              key={svc.id}
                              role="option"
                              aria-selected={isSelected}
                              tabIndex={0}
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, serviceId: svc.id }));
                                setIsDropdownOpen(false);
                                if (fieldErrors.serviceId) {
                                  setFieldErrors((prev) => {
                                    const next = { ...prev };
                                    delete next.serviceId;
                                    return next;
                                  });
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  setFormData((prev) => ({ ...prev, serviceId: svc.id }));
                                  setIsDropdownOpen(false);
                                }
                              }}
                              className={`group/item flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 ${
                                isSelected
                                  ? "bg-brand-sky/20 text-white"
                                  : "text-slate-200 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                    isSelected
                                      ? "bg-brand-sky text-white shadow-sm"
                                      : "bg-white/10 text-brand-sky group-hover/item:bg-white/15"
                                  }`}
                                >
                                  <Icon name={svc.icon} className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="truncate text-sm font-semibold leading-tight text-white">
                                    {svc.title}
                                  </div>
                                  {svc.shortDescription && (
                                    <div className="truncate text-[11px] text-slate-400 group-hover/item:text-slate-300">
                                      {svc.shortDescription}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {isSelected && (
                                <Check className="h-4 w-4 shrink-0 text-brand-sky" />
                              )}
                            </div>
                          );
                        })}

                        <div className="my-1 border-t border-white/10" />

                        {/* Other / Custom Option */}
                        <div
                          role="option"
                          aria-selected={formData.serviceId === "other"}
                          tabIndex={0}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, serviceId: "other" }));
                            setIsDropdownOpen(false);
                            if (fieldErrors.serviceId) {
                              setFieldErrors((prev) => {
                                const next = { ...prev };
                                delete next.serviceId;
                                return next;
                              });
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setFormData((prev) => ({ ...prev, serviceId: "other" }));
                              setIsDropdownOpen(false);
                            }
                          }}
                          className={`group/item flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 ${
                            formData.serviceId === "other"
                              ? "bg-brand-sky/20 text-white"
                              : "text-slate-200 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                formData.serviceId === "other"
                                  ? "bg-brand-sky text-white shadow-sm"
                                  : "bg-white/10 text-brand-sky group-hover/item:bg-white/15"
                              }`}
                            >
                              <Sparkles className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold leading-tight text-white">
                                Other / Custom Service
                              </div>
                              <div className="text-[11px] text-slate-400 group-hover/item:text-slate-300">
                                Need specialized cleaning or multiple premises
                              </div>
                            </div>
                          </div>

                          {formData.serviceId === "other" && (
                            <Check className="h-4 w-4 shrink-0 text-brand-sky" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location / Area & Property Type — side by side */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="location"
                        className="mb-1.5 block text-xs font-bold text-slate-200"
                      >
                        Location / Area{" "}
                        <span className="font-normal text-slate-400">(Optional)</span>
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          disabled={status === "submitting"}
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g. Dubai Marina, JBR"
                          className={`w-full rounded-xl border bg-white/10 py-3 pr-4 pl-10 text-sm text-white transition-all placeholder:text-slate-400 focus:border-brand-sky focus:bg-white/15 focus:ring-2 focus:ring-brand-sky/30 focus:outline-none ${fieldErrors.location
                            ? "border-red-400 bg-red-950/30"
                            : "border-white/15 hover:border-white/30"
                            }`}
                        />
                      </div>
                      {fieldErrors.location && (
                        <p className="mt-1 text-[11px] text-red-300">{fieldErrors.location[0]}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="propertyType"
                        className="mb-1.5 block text-xs font-bold text-slate-200"
                      >
                        Property Type{" "}
                        <span className="font-normal text-slate-400">(Optional)</span>
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <select
                          id="propertyType"
                          name="propertyType"
                          disabled={status === "submitting"}
                          value={formData.propertyType}
                          onChange={handleChange}
                          className={`w-full appearance-none rounded-xl border bg-white/10 py-3 pr-10 pl-10 text-sm text-white transition-all focus:border-brand-sky focus:bg-white/15 focus:ring-2 focus:ring-brand-sky/30 focus:outline-none ${formData.propertyType
                            ? "text-white"
                            : "text-slate-400"
                          } ${fieldErrors.propertyType
                            ? "border-red-400 bg-red-950/30"
                            : "border-white/15 hover:border-white/30"
                          }`}
                        >
                          <option value="" className="bg-[#0b2447] text-slate-400">
                            Select property type
                          </option>
                          <option value="apartment" className="bg-[#0b2447] text-white">
                            Apartment
                          </option>
                          <option value="villa" className="bg-[#0b2447] text-white">
                            Villa
                          </option>
                          <option value="office" className="bg-[#0b2447] text-white">
                            Office
                          </option>
                          <option value="shop" className="bg-[#0b2447] text-white">
                            Shop
                          </option>
                          <option value="other" className="bg-[#0b2447] text-white">
                            Other
                          </option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                      {fieldErrors.propertyType && (
                        <p className="mt-1 text-[11px] text-red-300">
                          {fieldErrors.propertyType[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label
                      htmlFor="preferredDate"
                      className="mb-1.5 block text-xs font-bold text-slate-200"
                    >
                      Preferred Date{" "}
                      <span className="font-normal text-slate-400">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        disabled={status === "submitting"}
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className={`w-full rounded-xl border bg-white/10 py-3 pr-4 pl-10 text-sm text-white transition-all placeholder:text-slate-400 focus:border-brand-sky focus:bg-white/15 focus:ring-2 focus:ring-brand-sky/30 focus:outline-none [color-scheme:dark] ${fieldErrors.preferredDate
                          ? "border-red-400 bg-red-950/30"
                          : "border-white/15 hover:border-white/30"
                          }`}
                      />
                    </div>
                    {fieldErrors.preferredDate && (
                      <p className="mt-1 text-[11px] text-red-300">
                        {fieldErrors.preferredDate[0]}
                      </p>
                    )}
                  </div>

                  {/* Additional Details (Optional) */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1.5 block text-xs font-bold text-slate-200"
                    >
                      Additional Details{" "}
                      <span className="font-normal text-slate-400">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute top-3.5 left-3.5 text-slate-400">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        disabled={status === "submitting"}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Any special requirements, preferred time, number of rooms, etc."
                        className="w-full resize-none rounded-xl border border-white/15 bg-white/10 py-3 pr-4 pl-10 text-sm text-white transition-all placeholder:text-slate-400 hover:border-white/30 focus:border-brand-sky focus:bg-white/15 focus:ring-2 focus:ring-brand-sky/30 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* WhatsApp Opt-in Checkbox */}
                  <div className="flex items-center gap-2.5 py-1">
                    <input
                      type="checkbox"
                      id="whatsappOptIn"
                      name="whatsappOptIn"
                      checked={formData.whatsappOptIn}
                      onChange={handleChange}
                      disabled={status === "submitting"}
                      className="h-4 w-4 cursor-pointer rounded-sm border-white/30 bg-white/10 text-brand-green accent-brand-green focus:ring-brand-green"
                    />
                    <label
                      htmlFor="whatsappOptIn"
                      className="cursor-pointer text-xs font-medium text-slate-200 select-none"
                    >
                      Contact me on WhatsApp
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:bg-brand-green-hover hover:shadow-brand-green/30 active:scale-98 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Request Free Quote</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  {/* Privacy note */}
                  <div className="mt-1 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
                    <Lock className="h-3.5 w-3.5 shrink-0" />
                    <span>Your information is safe with us. We never share your details with third parties.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
