import type { Metadata } from "next";

import { MapPin, Sparkles } from "lucide-react";

import { env } from "@/env";

import { getServices, getSettings } from "@/lib/content";

import { Footer, Header, StickyBottomBar } from "@/components/layouts";
import { QuoteForm } from "@/components/sections";

import { ContactCardsClient, ContactMapAction } from "./ContactCardsClient";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "https://jubucleaning.com";
  const title = `Contact Us | ${settings.businessName} Dubai`;
  const description =
    "Get in touch with JUBU Cleaning Service. Call or WhatsApp +971 54 299 5191. Visit our office in Al Quoz-4, Dubai, or request a free cleaning quote online.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/contact`
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/contact`,
      siteName: settings.businessName,
      locale: "en_AE",
      type: "website"
    }
  };
}

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "https://jubucleaning.com";

  const defaultWhatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    "Hello JUBU Cleaning Service, I would like to contact your Dubai office regarding cleaning services."
  )}`;

  // Schema.org ContactPage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntity: {
      "@type": "LocalBusiness",
      url: `${baseUrl}/contact`,
      name: settings.businessName,
      telephone: settings.phoneTel,
      email: settings.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address,
        addressLocality: "Dubai",
        addressCountry: "AE"
      },
      openingHours: "Sa-Th 08:00-20:00"
    }
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
          <section className="relative overflow-hidden border-b border-white/10 bg-radial-[at_top_center] from-[#09295a] via-[#041633] to-[#020b18] pt-12 pb-16 lg:pt-16 lg:pb-24">
            <div className="relative z-10 container mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-300 backdrop-blur-md">
                <Sparkles className="size-3.5 text-sky-400" />
                <span>Prompt & Dedicated Customer Support</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Contact JUBU Cleaning Service
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Have questions or need emergency same-day cleaning anywhere in Dubai? Reach out to
                our customer care team directly or book via our online quote form.
              </p>
            </div>
          </section>

          {/* Contact Methods Cards Grid */}
          <section className="bg-[#030f24] py-12 lg:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ContactCardsClient settings={settings} defaultWhatsappUrl={defaultWhatsappUrl} />

              {/* Office Location & Google Maps */}
              <div className="mt-12 overflow-hidden rounded-3xl border border-white/15 bg-[#061e44] shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  <div className="flex flex-col justify-between p-8 sm:p-10">
                    <div>
                      <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-wider text-brand-sky uppercase">
                        <MapPin className="size-4" />
                        <span>Corporate Office</span>
                      </div>
                      <h3 className="text-xl font-bold text-white sm:text-2xl">
                        JUBU Cleaning Service LLC
                      </h3>
                      <p className="mt-4 text-xs leading-relaxed text-slate-300 sm:text-sm">
                        {settings.address}
                      </p>

                      <div className="mt-6 space-y-2 text-xs text-slate-400">
                        <p>
                          <strong>Licence No:</strong> {settings.licence?.number || "1026183"} (DET
                          Dubai)
                        </p>
                        <p>
                          <strong>Service Zones:</strong> All areas across Dubai & Freezones
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
                      <ContactMapAction mapUrl={settings.mapUrl} />
                    </div>
                  </div>

                  {/* Google Maps Iframe */}
                  <div className="min-h-72 w-full border-t border-white/10 bg-slate-900 lg:col-span-2 lg:min-h-full lg:border-t-0 lg:border-l">
                    <iframe
                      title="JUBU Cleaning Service Location in Dubai"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14446.529068019056!2d55.2289658!3d25.1472851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69661664fb03%3A0x673dbb8939c39414!2sAl%20Quoz%20-%20Al%20Quoz%20Industrial%20Area%204%20-%20Dubai!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae"
                      width="100%"
                      height="100%"
                      style={{ border: 0, minHeight: "320px" }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-full w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Online Quote Form */}
          <QuoteForm services={services} settings={settings} />
        </main>

        <Footer settings={settings} />
        <StickyBottomBar settings={settings} />
      </div>
    </>
  );
}
