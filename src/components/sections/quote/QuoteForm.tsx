"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";

import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Leaf,
  Loader2,
  Lock,
  MessageCircle,
  MessageSquare,
  Phone,
  RotateCcw,
  Settings,
  ShieldCheck,
  User
} from "lucide-react";

import type { Service, SiteSettings } from "@/types/content";
import type { CreateLeadInput } from "@/types/lead";

import { createLeadInputSchema } from "@/lib/content/types";

interface QuoteFormProps {
  services: Service[];
  settings: SiteSettings;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export function QuoteForm({ services, settings }: QuoteFormProps) {
  const [formData, setFormData] = useState<CreateLeadInput>(() => ({
    fullName: "",
    mobile: "",
    serviceId: services[0]?.id ?? "home-cleaning",
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
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    mobile: string;
    serviceName: string;
  } | null>(null);

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

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullPayload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus("error");
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setErrorMessage(
          data.message ||
          "Unable to submit your quote request right now. Please call or WhatsApp us."
        );
        return;
      }

      // Success
      const currentService =
        services.find((s) => s.id === formData.serviceId)?.title ??
        (formData.serviceId === "other" ? "Custom Cleaning" : "Cleaning Service");

      setSubmittedData({
        name: formData.fullName,
        mobile: formData.mobile,
        serviceName: currentService
      });

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(
        "Network error. Please check your internet connection or reach us directly via WhatsApp."
      );
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setFormData((prev) => ({
      ...prev,
      fullName: "",
      mobile: "",
      message: ""
    }));
  };

  // WhatsApp follow-up URL with pre-filled message
  const followUpMessage = submittedData
    ? `Hello JUBU Cleaning Service, I just requested a quote for ${submittedData.serviceName}. My phone number is ${submittedData.mobile}.`
    : settings.whatsappDefaultMessage;

  const followUpWhatsAppUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    followUpMessage
  )}`;

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
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">No Obligation</h3>
                  <p className="mt-0.5 text-xs text-slate-300">Get a quote with no commitment</p>
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
                <div className="relative -rotate-20 select-none">
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
            <div className="rounded-3xl border border-[#071933]/30 bg-[#071933]/20 backdrop-blur-xl p-6 text-brand-navy shadow-2xl sm:p-8 md:p-10">
              {status === "success" ? (
                /* Success Confirmation State */
                <div className="flex animate-in flex-col items-center py-6 text-center duration-300 zoom-in-95 fade-in">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-light text-brand-green">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="mb-2 text-2xl font-extrabold text-brand-navy">
                    Quote Request Received!
                  </h3>
                  <p className="mb-6 max-w-sm text-sm leading-relaxed text-brand-muted">
                    Thank you, <strong className="text-brand-navy">{submittedData?.name}</strong>.
                    Our cleaning team is reviewing your request for{" "}
                    <strong className="text-brand-navy">{submittedData?.serviceName}</strong> and
                    will get back to you shortly.
                  </p>

                  <div className="flex w-full flex-col gap-3">
                    <a
                      href={followUpWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-brand-green-hover"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>Chat on WhatsApp now</span>
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-border bg-brand-pale-blue/60 px-6 py-3 text-xs font-semibold text-brand-navy transition-colors hover:bg-brand-pale-blue"
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
                    <h3 className="text-2xl font-extrabold tracking-tight text-brand-navy">
                      Get Your Custom Quote
                    </h3>
                    <p className="mt-1 text-xs text-brand-muted sm:text-sm">
                      Fill in the details below and we&apos;ll get back to you shortly.
                    </p>
                  </div>

                  {/* Top Error Alert */}
                  {status === "error" && errorMessage && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
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
                      className="mb-1.5 block text-xs font-bold text-brand-navy"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-brand-muted">
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
                        className={`w-full rounded-xl border py-3 pr-4 pl-10 text-sm text-brand-navy transition-all placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 focus:outline-none ${fieldErrors.fullName
                          ? "border-red-500 bg-red-50/20"
                          : "border-brand-border"
                          }`}
                      />
                    </div>
                    {fieldErrors.fullName && (
                      <p className="mt-1 text-[11px] text-red-600">{fieldErrors.fullName[0]}</p>
                    )}
                  </div>

                  {/* Mobile Number with UAE format */}
                  <div>
                    <label
                      htmlFor="mobile"
                      className="mb-1.5 block text-xs font-bold text-brand-navy"
                    >
                      Mobile Number
                    </label>
                    <div className="flex gap-2">
                      <div className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-brand-border bg-brand-pale-blue/40 px-3 py-3 text-xs font-bold text-brand-navy">
                        <span>🇦🇪</span>
                        <span>+971</span>
                      </div>
                      <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-brand-muted">
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
                          placeholder="50 123 4567"
                          className={`w-full rounded-xl border py-3 pr-4 pl-10 text-sm text-brand-navy transition-all placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 focus:outline-none ${fieldErrors.mobile
                            ? "border-red-500 bg-red-50/20"
                            : "border-brand-border"
                            }`}
                        />
                      </div>
                    </div>
                    {fieldErrors.mobile && (
                      <p className="mt-1 text-[11px] text-red-600">{fieldErrors.mobile[0]}</p>
                    )}
                  </div>

                  {/* Select Cleaning Service */}
                  <div>
                    <label
                      htmlFor="serviceId"
                      className="mb-1.5 block text-xs font-bold text-brand-navy"
                    >
                      Select Cleaning Service
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-brand-muted">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <select
                        id="serviceId"
                        name="serviceId"
                        disabled={status === "submitting"}
                        value={formData.serviceId}
                        onChange={handleChange}
                        className="w-full cursor-pointer appearance-none rounded-xl border border-brand-border bg-white py-3 pr-8 pl-10 text-sm text-brand-navy transition-all focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
                      >
                        {services.map((svc) => (
                          <option key={svc.id} value={svc.id}>
                            {svc.title}
                          </option>
                        ))}
                        <option value="other">Other / Custom Service</option>
                      </select>
                    </div>
                  </div>

                  {/* Message / Details (Optional) */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1.5 block text-xs font-bold text-brand-navy"
                    >
                      Message / Details{" "}
                      <span className="font-normal text-brand-muted">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute top-3.5 left-3.5 text-brand-muted">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        disabled={status === "submitting"}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your cleaning needs, property size or date..."
                        className="w-full resize-none rounded-xl border border-brand-border py-3 pr-4 pl-10 text-sm text-brand-navy transition-all placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
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
                      className="h-4 w-4 cursor-pointer rounded-sm border-brand-border text-brand-green accent-brand-green focus:ring-brand-green"
                    />
                    <label
                      htmlFor="whatsappOptIn"
                      className="cursor-pointer text-xs font-semibold text-brand-navy select-none"
                    >
                      Contact me on WhatsApp
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-brand-green-hover hover:shadow-lg active:scale-98 disabled:cursor-not-allowed disabled:opacity-70"
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
                  <div className="mt-1 flex items-center justify-center gap-1.5 text-center text-[11px] text-brand-muted">
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
