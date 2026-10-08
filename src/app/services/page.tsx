import type { Metadata } from "next";

import { Clock, ShieldCheck, Sparkles, Star } from "lucide-react";

import { env } from "@/env";

import { getServices, getSettings } from "@/lib/content";

import { Footer, Header, StickyBottomBar } from "@/components/layouts";
import { QuoteForm } from "@/components/sections";

import { ServicesCatalogClient, ServicesHeroActions } from "./ServicesCatalogClient";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "https://jubucleaning.com";
  const title = "Professional Cleaning Services in Dubai | Rates From 199 AED | JUBU";
  const description =
    "Explore our complete range of certified cleaning services in Dubai: Home, Office, Deep Cleaning, Sofa & Carpet, Post-Construction & Move-In sanitization. Book online today.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/services`
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/services`,
      siteName: settings.businessName,
      locale: "en_AE",
      type: "website",
      images: [
        {
          url: `${baseUrl}/images/logo.png`,
          width: 1200,
          height: 630,
          alt: "JUBU Cleaning Services Dubai"
        }
      ]
    }
  };
}

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "https://jubucleaning.com";

  const defaultWhatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    "Hello JUBU Cleaning Service, I would like to inquire about your cleaning services in Dubai."
  )}`;

  // JSON-LD Service Catalog
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, idx) => ({
      "@type": "Service",
      position: idx + 1,
      name: s.title,
      url: `${baseUrl}/services`,
      description: s.shortDescription,
      offers: {
        "@type": "Offer",
        price: s.basePrice || 199,
        priceCurrency: "AED"
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="relative flex min-h-screen flex-col bg-[#020b18] font-sans text-slate-100 selection:bg-brand-sky selection:text-[#020b18]">
        <Header settings={settings} />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden border-b border-white/10 bg-radial-[at_top_center] from-[#082b5e] via-[#041633] to-[#020b18] pt-12 pb-20 lg:pt-16 lg:pb-28">
            <div className="relative z-10 container mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-300 backdrop-blur-md">
                <Sparkles className="size-3.5 text-sky-400" />
                <span>Certified Dubai Cleaning Catalog</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Premium Cleaning Services in Dubai
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Tailored residential, commercial, and intensive deep cleaning solutions across
                Dubai. Fully vetted staff, hospital-grade sanitizers, and fixed transparent pricing.
              </p>

              <ServicesHeroActions
                whatsappUrl={defaultWhatsappUrl}
                whatsappNumber={settings.whatsappNumber}
              />
            </div>
          </section>

          {/* Services Grid */}
          <section className="bg-[#030f24] py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto mb-14 max-w-2xl text-center">
                <h2 className="text-2xl font-extrabold text-white sm:text-4xl">
                  Our Comprehensive Cleaning Services
                </h2>
                <p className="mt-3 text-sm text-slate-300 sm:text-base">
                  Every service is delivered by trained background-verified professionals with
                  state-of-the-art European equipment.
                </p>
              </div>

              <ServicesCatalogClient services={services} whatsappNumber={settings.whatsappNumber} />
            </div>
          </section>

          {/* Service Guarantee Banner */}
          <section className="border-y border-white/10 bg-[#020b18] py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
                <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6">
                  <ShieldCheck className="mb-3 size-8 text-sky-400" />
                  <h4 className="text-base font-bold text-white">DET Licensed & Insured</h4>
                  <p className="mt-1.5 text-xs text-slate-400">
                    Official Dubai Trade Licence #1026183 with full public liability coverage.
                  </p>
                </div>
                <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6">
                  <Star className="mb-3 size-8 text-amber-400" />
                  <h4 className="text-base font-bold text-white">100% Satisfaction Guarantee</h4>
                  <p className="mt-1.5 text-xs text-slate-400">
                    If any spot is missed, we re-clean within 24 hours at zero extra charge.
                  </p>
                </div>
                <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6">
                  <Clock className="mb-3 size-8 text-emerald-400" />
                  <h4 className="text-base font-bold text-white">Same-Day Availability</h4>
                  <p className="mt-1.5 text-xs text-slate-400">
                    Mobile teams deployed across Dubai with prompt arrival within 60–90 minutes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quote Form Section */}
          <QuoteForm services={services} settings={settings} />
        </main>

        <Footer settings={settings} />
        <StickyBottomBar settings={settings} />
      </div>
    </>
  );
}
