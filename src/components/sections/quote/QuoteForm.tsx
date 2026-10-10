"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";

import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  ExternalLink,
  Home,
  Loader2,
  Lock,
  MapPin,
  MessageSquare,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  Store,
  User
} from "lucide-react";
import { format } from "date-fns";

import type { Service, SiteSettings } from "@/types/content";
import type { CreateLeadInput } from "@/types/lead";
import { SERVICE_BASE_PRICES } from "@/constants/payment";
import { env } from "@/env";

import { trackFormStart, trackLeadGenerated, trackWhatsAppClick } from "@/lib/analytics";
import { createLeadInputSchema } from "@/lib/content/types";

import { WhatsAppIcon } from "@/components/icons";
import { Calendar as CalendarPicker, Icon, Popover, PopoverContent, PopoverTrigger } from "@/ui";

import { BookingPaymentModal } from "./BookingPaymentModal";
import { ServiceAddonsSelector } from "./ServiceAddonsSelector";

const PROPERTY_TYPES = [
  {
    id: "apartment",
    title: "Apartment",
    shortDescription: "Studio, flat, or residential penthouse",
    icon: Building2
  },
  {
    id: "villa",
    title: "Villa",
    shortDescription: "Detached or semi-detached private home",
    icon: Home
  },
  {
    id: "office",
    title: "Office",
    shortDescription: "Commercial workspace or corporate office",
    icon: Briefcase
  },
  {
    id: "shop",
    title: "Shop / Retail",
    shortDescription: "Retail store, restaurant, or boutique",
    icon: Store
  },
  {
    id: "other",
    title: "Other",
    shortDescription: "Warehouse, venue, or specialized property",
    icon: Sparkles
  }
] as const;

const TIME_SLOTS = [
  {
    group: "Morning",
    slots: ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM"]
  },
  {
    group: "Afternoon",
    slots: ["12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"]
  },
  {
    group: "Evening",
    slots: ["04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"]
  }
] as const;

interface QuoteFormProps {
  services: Service[];
  settings: SiteSettings;
  sourceArea?: string;
  areaName?: string;
  finalCtaTitle?: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export function QuoteForm({
  services,
  settings,
  sourceArea = "main-page",
  areaName,
  finalCtaTitle
}: QuoteFormProps) {
  const [formData, setFormData] = useState<CreateLeadInput>(() => ({
    fullName: "",
    mobile: "",
    whatsappNumber: "",
    serviceId: services[0]?.id ?? "home-cleaning",
    location: areaName ?? "",
    propertyType: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
    whatsappOptIn: true,
    honeypot: "",
    sourceArea,
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

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const hasTrackedFormStart = useRef(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const propertyDropdownRef = useRef<HTMLDivElement>(null);

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  // Selected add-on quantities per service
  const [selectedAddonQuantities, setSelectedAddonQuantities] = useState<Record<string, number>>(
    {}
  );

  // Reset or initialize add-on quantities when service changes
  useEffect(() => {
    const activeService = services.find((s) => s.id === formData.serviceId);
    if (!activeService || !activeService.addons || activeService.addons.length === 0) {
      setSelectedAddonQuantities({});
      return;
    }
    const initial: Record<string, number> = {};
    activeService.addons.forEach((addon) => {
      if (addon.defaultQty && addon.defaultQty > 0) {
        initial[addon.id] = addon.defaultQty;
      }
    });
    setSelectedAddonQuantities(initial);
  }, [formData.serviceId, services]);

  // Dynamic pricing calculations
  const selectedServiceObj = services.find((s) => s.id === formData.serviceId);
  const currentServiceTitle =
    selectedServiceObj?.title ??
    (formData.serviceId === "other" ? "Custom Cleaning" : "Cleaning Service");
  const activeBasePrice =
    selectedServiceObj?.basePrice ?? SERVICE_BASE_PRICES[formData.serviceId]?.basePrice ?? 199;
  const availableAddons = selectedServiceObj?.addons ?? [];

  const addonsTotalPrice = availableAddons.reduce((sum, addon) => {
    const qty = selectedAddonQuantities[addon.id] ?? 0;
    return sum + addon.price * qty;
  }, 0);

  const totalCalculatedPrice = activeBasePrice + addonsTotalPrice;

  const activeAddonsBreakdown = availableAddons
    .filter((addon) => (selectedAddonQuantities[addon.id] ?? 0) > 0)
    .map((addon) => ({
      id: addon.id,
      name: addon.name,
      quantity: selectedAddonQuantities[addon.id] ?? 0,
      unitPrice: addon.price,
      total: addon.price * (selectedAddonQuantities[addon.id] ?? 0)
    }));

  // Close custom dropdowns on outside click or escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (propertyDropdownRef.current && !propertyDropdownRef.current.contains(e.target as Node)) {
        setIsPropertyDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
        setIsPropertyDropdownOpen(false);
        setIsDatePickerOpen(false);
        setIsTimePickerOpen(false);
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
    if (!hasTrackedFormStart.current) {
      hasTrackedFormStart.current = true;
      trackFormStart(sourceArea);
    }

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

  const validateCurrentForm = (): CreateLeadInput | null => {
    setFieldErrors({});
    setErrorMessage("");

    const searchParams =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const fullPayload: CreateLeadInput = {
      ...formData,
      amount: totalCalculatedPrice,
      addonsBreakdown: activeAddonsBreakdown.length > 0 ? activeAddonsBreakdown : undefined,
      sourceArea: formData.sourceArea || sourceArea,
      utmSource: searchParams?.get("utm_source") ?? formData.utmSource,
      utmMedium: searchParams?.get("utm_medium") ?? formData.utmMedium,
      utmCampaign: searchParams?.get("utm_campaign") ?? formData.utmCampaign,
      utmContent: searchParams?.get("utm_content") ?? formData.utmContent,
      fbclid: searchParams?.get("fbclid") ?? formData.fbclid,
      landingUrl: typeof window !== "undefined" ? window.location.href : ""
    };

    const validationResult = createLeadInputSchema.safeParse(fullPayload);
    if (!validationResult.success) {
      setFieldErrors(validationResult.error.flatten().fieldErrors);
      return null;
    }

    return fullPayload;
  };

  const handleOpenBookingModal = () => {
    const validData = validateCurrentForm();
    if (!validData) {
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fullPayload = validateCurrentForm();
    if (!fullPayload) {
      return;
    }

    const searchParams =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

    setStatus("submitting");

    // Resolve service name
    const currentService =
      services.find((s) => s.id === formData.serviceId)?.title ??
      (formData.serviceId === "other" ? "Custom Cleaning" : "Cleaning Service");

    // Standard UAE mobile format with +971
    const rawCleanMobile = formData.mobile.replace(/[^\d]/g, "");
    const formattedUaeMobile = rawCleanMobile.startsWith("971")
      ? `+${rawCleanMobile}`
      : rawCleanMobile.startsWith("05")
        ? `+971${rawCleanMobile.slice(1)}`
        : `+971${rawCleanMobile}`;

    const submittedName = formData.fullName.trim();
    const submittedMobile = formattedUaeMobile;
    const submittedWhatsApp = formData.whatsappNumber?.trim() || "";
    const submittedLocation = formData.location?.trim() || "N/A";
    const submittedPropertyType = formData.propertyType
      ? formData.propertyType.charAt(0).toUpperCase() + formData.propertyType.slice(1)
      : "N/A";
    const submittedPreferredDate = formData.preferredDate?.trim() || "N/A";
    const submittedPreferredTime = formData.preferredTime?.trim() || "N/A";
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
    const activeSourceArea = fullPayload.sourceArea || sourceArea || "main-page";

    // Build plain-text WhatsApp message per spec
    const addonsWaText =
      activeAddonsBreakdown.length > 0
        ? `Personalized Items:\n` +
          activeAddonsBreakdown
            .map((a) => `• ${a.name}: ${a.quantity} (+${a.total} AED)`)
            .join("\n")
        : "";

    const waMessage = [
      `New Quote Request - JUBU Cleaning Service`,
      `Name: ${submittedName}`,
      `Phone: ${submittedMobile}`,
      `WhatsApp: ${submittedWhatsApp || submittedMobile}`,
      `Service: ${currentService}`,
      `Estimated Total: ${totalCalculatedPrice} AED (Base: ${activeBasePrice} AED${addonsTotalPrice > 0 ? ` + ${addonsTotalPrice} AED Extras` : ""})`,
      ...(addonsWaText ? [addonsWaText] : []),
      `Location: ${submittedLocation}`,
      `Property: ${submittedPropertyType}`,
      `Preferred Date: ${submittedPreferredDate}`,
      `Preferred Time: ${submittedPreferredTime}`,
      `Details: ${submittedMessage}`,
      `Contact: ${contactPreference}`,
      `Source: ${activeSourceArea} (${utmSource} / ${utmCampaign})`,
      `Page: ${pageUrl}`
    ]
      .filter(Boolean)
      .join("\n");

    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

    // Show submitting state
    setSubmittedData({
      name: submittedName,
      mobile: submittedMobile,
      serviceName: currentService
    });
    setRedirectUrl(waUrl);

    // Save lead to database before redirecting to WhatsApp (with keepalive: true so browser navigation doesn't cancel it)
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullPayload),
        keepalive: true
      });
    } catch (err: unknown) {
      console.error("[QuoteForm] Lead submission save failed:", err);
    }

    // Trigger GA4, Google Ads Enhanced Conversions, and Meta Advanced Matching DataLayer Event
    trackLeadGenerated({
      serviceId: formData.serviceId,
      serviceName: currentService,
      propertyType: formData.propertyType || "other",
      locationArea: submittedLocation,
      preferredDate: submittedPreferredDate,
      preferredTime: submittedPreferredTime,
      fullName: submittedName,
      mobile: submittedMobile,
      whatsappNumber: submittedWhatsApp || undefined,
      sourceArea: activeSourceArea,
      trafficSource: {
        utm_source: fullPayload.utmSource,
        utm_medium: fullPayload.utmMedium,
        utm_campaign: fullPayload.utmCampaign,
        utm_content: fullPayload.utmContent,
        fbclid: fullPayload.fbclid,
        gclid: searchParams?.get("gclid") ?? undefined
      }
    });

    // Mark as success and redirect to WhatsApp
    setStatus("success");

    const redirectTimer = setTimeout(() => {
      window.location.href = waUrl;
    }, 600);

    // Store timer id so resetForm can clear it if user clicks "Submit another"
    void redirectTimer;
  };

  const resetForm = () => {
    setStatus("idle");
    setRedirectUrl("");
    setSelectedDate(undefined);
    setFormData((prev) => ({
      ...prev,
      fullName: "",
      mobile: "",
      whatsappNumber: "",
      location: areaName ?? "",
      propertyType: "",
      preferredDate: "",
      preferredTime: "",
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
          alt="Dubai city skyline illuminated at night - JUBU Cleaning Service coverage across residential and commercial communities in Dubai"
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

            {finalCtaTitle ? (
              <h2 className="mb-4 flex flex-wrap items-center gap-2 text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                <span>{finalCtaTitle}</span>
                <span className="inline-block h-1 w-12 rounded-full bg-brand-green sm:w-16" />
              </h2>
            ) : (
              <h2 className="mb-4 flex flex-wrap items-center gap-2 text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                <span>Get a Free Quote</span>
                <span className="text-brand-sky">Today</span>
                <span className="inline-block h-1 w-12 rounded-full bg-brand-green sm:w-16" />
              </h2>
            )}

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
                  <p className="mt-0.5 text-xs text-slate-300">Tailored to your specific needs</p>
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
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-lg">
                  <WhatsAppIcon className="h-full w-full" />
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-300">Call / WhatsApp</span>
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
                  onClick={() => trackWhatsAppClick("quote_section_cta")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-3.5 text-xs font-bold text-white shadow-lg transition-all duration-200 hover:bg-brand-green-hover sm:text-sm"
                >
                  <WhatsAppIcon monochrome className="h-4 w-4" />
                  <span>Book via WhatsApp</span>
                  <ArrowRight className="h-4 w-4" />
                </a>

                {/* Cursive text accent "Cleaner Dubai Brighter Lives" */}
                <div className="relative hidden -rotate-20 select-none md:block">
                  <span className="block text-center font-serif text-lg tracking-wide text-white/90 italic sm:text-xl">
                    Cleaner
                    <br /> Dubai
                    <br /> Brighter
                    <br /> Lives
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
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-brand-green/30 bg-brand-green/20 text-brand-green">
                    <WhatsAppIcon className="h-10 w-10 animate-pulse" />
                  </div>
                  <h3 className="mb-2 text-2xl font-extrabold text-white">
                    Redirecting to WhatsApp…
                  </h3>
                  <p className="mb-6 max-w-sm text-sm leading-relaxed text-slate-200">
                    Your request for{" "}
                    <strong className="font-bold text-brand-sky">
                      {submittedData?.serviceName}
                    </strong>{" "}
                    is ready. Opening WhatsApp now to connect you with our team.
                  </p>

                  <div className="flex w-full flex-col gap-3">
                    {/* Fallback — in case browser blocks automatic redirect */}
                    <a
                      href={redirectUrl}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-brand-green-hover"
                    >
                      <WhatsAppIcon monochrome className="h-5 w-5" />
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
                        className={`w-full rounded-xl border bg-white/10 py-3 pr-4 pl-10 text-sm text-white transition-all placeholder:text-slate-400 focus:border-brand-sky focus:bg-white/15 focus:ring-2 focus:ring-brand-sky/30 focus:outline-none ${
                          fieldErrors.fullName
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
                        className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-200"
                      >
                        <span>Mobile Number</span>
                        <span className="text-[10px] font-normal text-slate-400">UAE (Dubai)</span>
                      </label>
                      <div className="relative flex rounded-xl border border-white/15 bg-white/10 transition-all focus-within:border-brand-sky focus-within:bg-white/15 focus-within:ring-2 focus-within:ring-brand-sky/30">
                        {/* Static UAE Flag & Dial Code Badge */}
                        <div className="flex shrink-0 items-center gap-1.5 border-r border-white/15 bg-white/5 px-3 py-3 text-xs font-bold text-white">
                          <span className="text-sm">🇦🇪</span>
                          <span>+971</span>
                        </div>
                        <input
                          type="tel"
                          id="mobile"
                          name="mobile"
                          required
                          disabled={status === "submitting"}
                          value={formData.mobile}
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^\d\s]/g, "");
                            // Auto-clean if user pastes +971 or starts with 0
                            if (val.startsWith("971")) val = val.slice(3);
                            handleChange({
                              ...e,
                              target: {
                                ...e.target,
                                name: "mobile",
                                value: val
                              }
                            });
                          }}
                          placeholder="50 123 4567"
                          className={`w-full bg-transparent px-3 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none ${
                            fieldErrors.mobile ? "text-red-300" : ""
                          }`}
                        />
                      </div>
                      {fieldErrors.mobile ? (
                        <p className="mt-1 text-[11px] text-red-300">{fieldErrors.mobile[0]}</p>
                      ) : (
                        <p className="mt-1 text-[10px] text-slate-400">
                          e.g. 054 299 5191 or 50 123 4567
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="whatsappNumber"
                        className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-200"
                      >
                        <span>
                          WhatsApp Number{" "}
                          <span className="font-normal text-slate-400">(if different)</span>
                        </span>
                        <span className="text-[10px] font-normal text-slate-400">Any Country</span>
                      </label>
                      <div className="relative flex rounded-xl border border-white/15 bg-white/10 transition-all focus-within:border-brand-sky focus-within:bg-white/15 focus-within:ring-2 focus-within:ring-brand-sky/30">
                        <div className="pointer-events-none flex shrink-0 items-center pl-3 text-slate-400">
                          <WhatsAppIcon className="h-4 w-4" />
                        </div>
                        <input
                          type="tel"
                          id="whatsappNumber"
                          name="whatsappNumber"
                          disabled={status === "submitting"}
                          value={formData.whatsappNumber}
                          onChange={handleChange}
                          placeholder="+44... or 050 123 4567"
                          className={`w-full bg-transparent px-3 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none ${
                            fieldErrors.whatsappNumber ? "text-red-300" : ""
                          }`}
                        />
                      </div>
                      {fieldErrors.whatsappNumber ? (
                        <p className="mt-1 text-[11px] text-red-300">
                          {fieldErrors.whatsappNumber[0]}
                        </p>
                      ) : (
                        <p className="mt-1 text-[10px] text-slate-400">
                          Include country code if outside UAE
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
                    <input type="hidden" name="serviceId" value={formData.serviceId} />

                    {/* Custom Dropdown Trigger Button */}
                    <button
                      type="button"
                      id="serviceId"
                      aria-haspopup="listbox"
                      aria-expanded={isDropdownOpen}
                      aria-labelledby="service-select-label serviceId"
                      disabled={status === "submitting"}
                      onClick={() => {
                        setIsDropdownOpen((prev) => !prev);
                        setIsPropertyDropdownOpen(false);
                      }}
                      className={`group relative flex w-full items-center justify-between rounded-xl border bg-[#0b2447]/90 px-3.5 py-3 text-left text-sm text-white shadow-sm backdrop-blur-md transition-all duration-200 hover:border-white/30 focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/30 focus:outline-none ${
                        isDropdownOpen
                          ? "border-brand-sky shadow-lg ring-2 shadow-sky-950/40 ring-brand-sky/30"
                          : "border-white/15"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-sky transition-colors group-hover:bg-brand-sky/20">
                          {formData.serviceId === "other" ? (
                            <Sparkles className="h-4 w-4" />
                          ) : (
                            <Icon
                              name={
                                services.find((s) => s.id === formData.serviceId)?.icon ||
                                "calendar"
                              }
                              className="h-4 w-4"
                            />
                          )}
                        </div>
                        <span className="truncate font-medium text-white">
                          {formData.serviceId === "other"
                            ? "Other / Custom Service"
                            : (services.find((s) => s.id === formData.serviceId)?.title ??
                              "Select a service")}
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
                        className="scrollbar-thin scrollbar-thumb-white/20 absolute z-50 mt-2 max-h-72 w-full animate-in overflow-y-auto rounded-2xl border border-white/20 bg-[#081839]/95 p-1.5 shadow-2xl ring-1 ring-black/40 backdrop-blur-xl duration-150 zoom-in-95 fade-in focus:outline-none"
                      >
                        <div className="px-2.5 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
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
                                  <div className="truncate text-sm leading-tight font-semibold text-white">
                                    {svc.title}
                                  </div>
                                  {svc.shortDescription && (
                                    <div className="truncate text-[11px] text-slate-400 group-hover/item:text-slate-300">
                                      {svc.shortDescription}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {isSelected && <Check className="h-4 w-4 shrink-0 text-brand-sky" />}
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
                              <div className="text-sm leading-tight font-semibold text-white">
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

                  {/* Dynamic Service Personalization & Add-ons Stepper */}
                  {availableAddons.length > 0 && (
                    <div className="mt-2">
                      <ServiceAddonsSelector
                        addons={availableAddons}
                        selectedQuantities={selectedAddonQuantities}
                        onChangeQuantity={(addonId: string, newQty: number) => {
                          setSelectedAddonQuantities((prev) => ({
                            ...prev,
                            [addonId]: newQty
                          }));
                        }}
                        onReset={() => setSelectedAddonQuantities({})}
                        basePrice={activeBasePrice}
                        serviceTitle={currentServiceTitle}
                      />
                    </div>
                  )}

                  {/* Location / Area & Property Type — side by side */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="location"
                        className="mb-1.5 block text-xs font-bold text-slate-200"
                      >
                        Location / Area
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
                          placeholder={areaName ? `e.g. ${areaName}` : "e.g. Dubai Marina, JBR"}
                          className={`w-full rounded-xl border bg-white/10 py-3 pr-4 pl-10 text-sm text-white transition-all placeholder:text-slate-400 focus:border-brand-sky focus:bg-white/15 focus:ring-2 focus:ring-brand-sky/30 focus:outline-none ${
                            fieldErrors.location
                              ? "border-red-400 bg-red-950/30"
                              : "border-white/15 hover:border-white/30"
                          }`}
                        />
                      </div>
                      {fieldErrors.location && (
                        <p className="mt-1 text-[11px] text-red-300">{fieldErrors.location[0]}</p>
                      )}
                    </div>

                    {/* Property Type Custom Dropdown matching Service UI-UX */}
                    <div className="relative" ref={propertyDropdownRef}>
                      <label
                        id="property-type-label"
                        className="mb-1.5 block text-xs font-bold text-slate-200"
                      >
                        Property Type
                      </label>

                      {/* Hidden input to maintain native form compatibility */}
                      <input type="hidden" name="propertyType" value={formData.propertyType} />

                      <button
                        type="button"
                        id="propertyType"
                        aria-haspopup="listbox"
                        aria-expanded={isPropertyDropdownOpen}
                        aria-labelledby="property-type-label propertyType"
                        disabled={status === "submitting"}
                        onClick={() => {
                          setIsPropertyDropdownOpen((prev) => !prev);
                          setIsDropdownOpen(false);
                          setIsDatePickerOpen(false);
                          setIsTimePickerOpen(false);
                        }}
                        className={`group relative flex w-full items-center justify-between rounded-xl border bg-[#0b2447]/90 px-3.5 py-3 text-left text-sm text-white shadow-sm backdrop-blur-md transition-all duration-200 hover:border-white/30 focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/30 focus:outline-none ${
                          isPropertyDropdownOpen
                            ? "border-brand-sky shadow-lg ring-2 shadow-sky-950/40 ring-brand-sky/30"
                            : fieldErrors.propertyType
                              ? "border-red-400 bg-red-950/30"
                              : "border-white/15"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-sky transition-colors group-hover:bg-brand-sky/20">
                            {(() => {
                              const activeProp = PROPERTY_TYPES.find(
                                (p) => p.id === formData.propertyType
                              );
                              const IconComp = activeProp?.icon || Building2;
                              return <IconComp className="h-4 w-4" />;
                            })()}
                          </div>
                          <span
                            className={`truncate font-medium ${
                              formData.propertyType ? "text-white" : "text-slate-400"
                            }`}
                          >
                            {PROPERTY_TYPES.find((p) => p.id === formData.propertyType)?.title ??
                              "Select property type"}
                          </span>
                        </div>

                        <div className="flex items-center pl-2 text-slate-400 transition-colors group-hover:text-white">
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isPropertyDropdownOpen ? "rotate-180 text-brand-sky" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Custom Property Type Menu Panel */}
                      {isPropertyDropdownOpen && (
                        <div
                          role="listbox"
                          aria-labelledby="property-type-label"
                          className="scrollbar-thin scrollbar-thumb-white/20 absolute z-50 mt-2 max-h-72 w-full animate-in overflow-y-auto rounded-2xl border border-white/20 bg-[#081839]/95 p-1.5 shadow-2xl ring-1 ring-black/40 backdrop-blur-xl duration-150 zoom-in-95 fade-in focus:outline-none"
                        >
                          <div className="px-2.5 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                            Available Property Types
                          </div>

                          {PROPERTY_TYPES.map((prop) => {
                            const isSelected = formData.propertyType === prop.id;
                            const IconComponent = prop.icon;
                            return (
                              <div
                                key={prop.id}
                                role="option"
                                aria-selected={isSelected}
                                tabIndex={0}
                                onClick={() => {
                                  setFormData((prev) => ({ ...prev, propertyType: prop.id }));
                                  setIsPropertyDropdownOpen(false);
                                  if (fieldErrors.propertyType) {
                                    setFieldErrors((prev) => {
                                      const next = { ...prev };
                                      delete next.propertyType;
                                      return next;
                                    });
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setFormData((prev) => ({ ...prev, propertyType: prop.id }));
                                    setIsPropertyDropdownOpen(false);
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
                                    <IconComponent className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="truncate text-sm leading-tight font-semibold text-white">
                                      {prop.title}
                                    </div>
                                    <div className="truncate text-[11px] text-slate-400 group-hover/item:text-slate-300">
                                      {prop.shortDescription}
                                    </div>
                                  </div>
                                </div>

                                {isSelected && (
                                  <Check className="h-4 w-4 shrink-0 text-brand-sky" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {fieldErrors.propertyType && (
                        <p className="mt-1 text-[11px] text-red-300">
                          {fieldErrors.propertyType[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Preferred Date & Preferred Time — side by side */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Preferred Date with Shadcn Popover + Calendar */}
                    <div>
                      <label
                        htmlFor="preferredDate"
                        className="mb-1.5 block text-xs font-bold text-slate-200"
                      >
                        Preferred Date
                      </label>

                      {/* Hidden input to maintain native form compatibility */}
                      <input type="hidden" name="preferredDate" value={formData.preferredDate} />

                      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            id="preferredDate"
                            disabled={status === "submitting"}
                            className={`group relative flex w-full items-center justify-between rounded-xl border bg-white/10 py-3 pr-4 pl-10 text-left text-sm transition-all hover:border-white/30 focus:border-brand-sky focus:bg-white/15 focus:ring-2 focus:ring-brand-sky/30 focus:outline-none ${
                              selectedDate ? "text-white" : "text-slate-400"
                            } ${
                              fieldErrors.preferredDate
                                ? "border-red-400 bg-red-950/30"
                                : "border-white/15 hover:border-white/30"
                            }`}
                          >
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                              <CalendarIcon className="h-4 w-4" />
                            </div>
                            <span>
                              {selectedDate
                                ? format(selectedDate, "dd MMMM yyyy")
                                : "Pick a preferred date"}
                            </span>
                            <div className="flex items-center text-slate-400 transition-colors group-hover:text-white">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          className="w-auto overflow-hidden rounded-2xl border border-white/20 bg-[#081839]/98 p-0 text-white shadow-2xl backdrop-blur-xl"
                        >
                          <CalendarPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date);
                              setFormData((prev) => ({
                                ...prev,
                                preferredDate: date ? format(date, "yyyy-MM-dd") : ""
                              }));
                              setIsDatePickerOpen(false);
                              if (fieldErrors.preferredDate) {
                                setFieldErrors((prev) => {
                                  const next = { ...prev };
                                  delete next.preferredDate;
                                  return next;
                                });
                              }
                            }}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>

                      {fieldErrors.preferredDate && (
                        <p className="mt-1 text-[11px] text-red-300">
                          {fieldErrors.preferredDate[0]}
                        </p>
                      )}
                    </div>

                    {/* Preferred Time with Shadcn Popover + Slot Grid */}
                    <div>
                      <label
                        htmlFor="preferredTime"
                        className="mb-1.5 block text-xs font-bold text-slate-200"
                      >
                        Preferred Time
                      </label>

                      {/* Hidden input to maintain native form compatibility */}
                      <input type="hidden" name="preferredTime" value={formData.preferredTime} />

                      <Popover open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            id="preferredTime"
                            disabled={status === "submitting"}
                            className={`group relative flex w-full items-center justify-between rounded-xl border bg-white/10 py-3 pr-4 pl-10 text-left text-sm transition-all hover:border-white/30 focus:border-brand-sky focus:bg-white/15 focus:ring-2 focus:ring-brand-sky/30 focus:outline-none ${
                              formData.preferredTime ? "text-white" : "text-slate-400"
                            } ${
                              fieldErrors.preferredTime
                                ? "border-red-400 bg-red-950/30"
                                : "border-white/15 hover:border-white/30"
                            }`}
                          >
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                              <Clock className="h-4 w-4" />
                            </div>
                            <span className="truncate">
                              {formData.preferredTime || "Select arrival time"}
                            </span>
                            <div className="flex items-center text-slate-400 transition-colors group-hover:text-white">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          className="w-72 overflow-hidden rounded-2xl border border-white/20 bg-[#081839]/98 p-3 text-white shadow-2xl backdrop-blur-xl sm:w-80"
                        >
                          <div className="mb-2.5 flex items-center justify-between border-b border-white/10 pb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-brand-sky" />
                              <span className="text-xs font-semibold text-white">
                                Select Arrival Time
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">08:00 AM – 08:00 PM</span>
                          </div>

                          <div className="flex flex-col gap-3">
                            {TIME_SLOTS.map((group) => (
                              <div key={group.group} className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                  {group.group}
                                </span>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {group.slots.map((slot) => {
                                    const isSelected = formData.preferredTime === slot;
                                    return (
                                      <button
                                        key={slot}
                                        type="button"
                                        onClick={() => {
                                          setFormData((prev) => ({
                                            ...prev,
                                            preferredTime: slot
                                          }));
                                          setIsTimePickerOpen(false);
                                          if (fieldErrors.preferredTime) {
                                            setFieldErrors((prev) => {
                                              const next = { ...prev };
                                              delete next.preferredTime;
                                              return next;
                                            });
                                          }
                                        }}
                                        className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-all ${
                                          isSelected
                                            ? "bg-brand-sky font-semibold text-white shadow-xs"
                                            : "bg-white/5 text-slate-200 hover:bg-white/15 hover:text-white"
                                        }`}
                                      >
                                        <span>{slot}</span>
                                        {isSelected && <Check className="h-3 w-3 shrink-0" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>

                      {fieldErrors.preferredTime && (
                        <p className="mt-1 text-[11px] text-red-300">
                          {fieldErrors.preferredTime[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1.5 block text-xs font-bold text-slate-200"
                    >
                      Additional Details
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
                        placeholder="Please describe your cleaning requirements (e.g. number of bedrooms/bathrooms, balcony washing, specific focus areas...)"
                        className={`w-full resize-none rounded-xl border bg-white/10 py-3 pr-4 pl-10 text-sm text-white transition-all placeholder:text-slate-400 focus:border-brand-sky focus:bg-white/15 focus:ring-2 focus:ring-brand-sky/30 focus:outline-none ${
                          fieldErrors.message
                            ? "border-red-400 bg-red-950/30"
                            : "border-white/15 hover:border-white/30"
                        }`}
                      />
                    </div>
                    {fieldErrors.message && (
                      <p className="mt-1 text-[11px] text-red-300">{fieldErrors.message[0]}</p>
                    )}
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

                  {/* Action Buttons: 1. Request Free Quote (original) & 2. Book & Pay with Dynamic Price */}
                  <div className="mt-2 flex flex-col gap-2.5">
                    {/* Primary Button 1: Original Request Free Quote */}
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:bg-brand-green-hover hover:shadow-brand-green/30 active:scale-98 disabled:cursor-not-allowed disabled:opacity-70"
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

                    {/* Secondary Button 2: Book & Pay Online / Cash with Dynamic Price */}
                    <button
                      type="button"
                      disabled={status === "submitting"}
                      onClick={handleOpenBookingModal}
                      className="group relative inline-flex cursor-pointer items-center justify-between overflow-hidden rounded-full border-2 border-emerald-400/60 bg-gradient-to-r from-blue-700 via-sky-600 to-blue-800 px-6 py-4 text-sm font-extrabold text-white shadow-xl shadow-sky-950/40 transition-all duration-200 hover:border-emerald-300 hover:from-blue-600 hover:via-sky-500 hover:to-blue-700 hover:shadow-2xl hover:shadow-sky-500/30 active:scale-98 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xs transition-transform group-hover:scale-110">
                          <CreditCard className="size-4 text-emerald-300" />
                        </div>
                        <span className="text-sm tracking-wide sm:text-base">Book & Pay Now</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/50 bg-emerald-500/90 px-3.5 py-1 text-xs font-black tracking-wide text-white shadow-md shadow-emerald-950/30 sm:text-sm">
                          <span className="text-[10px] font-bold text-emerald-100 uppercase">
                            {addonsTotalPrice > 0 ? "Total" : "From"}
                          </span>
                          <span>{totalCalculatedPrice} AED</span>
                        </span>
                        <div className="flex size-7 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-1">
                          <ArrowRight className="size-4 text-white" />
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Privacy note */}
                  <div className="mt-1 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
                    <Lock className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      Your information is safe with us. We never share your details with third
                      parties.
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking & Payment Modal (Cash or Bank Transfer) */}
      <BookingPaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        serviceId={formData.serviceId}
        serviceName={currentServiceTitle}
        basePrice={activeBasePrice}
        calculatedTotalAmount={totalCalculatedPrice}
        addonsBreakdown={activeAddonsBreakdown}
        bankDetails={{
          bankName: settings.bankName,
          iban: settings.bankIban,
          accountNumber: settings.bankAccountNumber,
          swiftCode: settings.bankSwiftCode,
          routingNumber: settings.bankRoutingNumber,
          accountOpeningDate: settings.bankAccountOpeningDate
        }}
        leadFormData={{
          ...formData,
          amount: totalCalculatedPrice,
          addonsBreakdown: activeAddonsBreakdown.length > 0 ? activeAddonsBreakdown : undefined
        }}
        whatsappNumber={settings.whatsappNumber}
        onSuccessSubmit={(payload, waUrl) => {
          setIsPaymentModalOpen(false);
          setSubmittedData({
            name: payload.fullName,
            mobile: payload.mobile,
            serviceName:
              services.find((s) => s.id === payload.serviceId)?.title ??
              (payload.serviceId === "other" ? "Custom Cleaning" : "Cleaning Service")
          });
          setRedirectUrl(waUrl);
          setStatus("success");
          setTimeout(() => {
            window.location.href = waUrl;
          }, 800);
        }}
      />
    </section>
  );
}
