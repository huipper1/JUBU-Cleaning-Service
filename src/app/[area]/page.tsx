import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { env } from "@/env";
import {
  getAbout,
  getAreaLandingPage,
  getAreas,
  getGallery,
  getHero,
  getServices,
  getSettings,
  getTeam,
  getWhyChoose,
  isValidAreaSlug,
  VALID_AREA_SLUGS
} from "@/lib/content";

import { Footer, Header, StickyBottomBar } from "@/components/layouts";
import {
  About,
  Contact,
  Faq,
  FeaturedBlock,
  Gallery,
  Hero,
  QuoteForm,
  ServiceAreas,
  Services,
  Team,
  WhyChooseUs
} from "@/components/sections";

interface AreaPageProps {
  params: Promise<{
    area: string;
  }>;
}

// 1. Static generation for the 5 client-specified area slugs
export async function generateStaticParams() {
  return VALID_AREA_SLUGS.map((slug) => ({
    area: slug
  }));
}

// 2. SEO Metadata per area page
export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const { area } = await params;

  if (!isValidAreaSlug(area)) {
    return {};
  }

  const areaData = await getAreaLandingPage(area);
  if (!areaData || !areaData.isActive) {
    return {};
  }

  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "https://jebucleaning.netlify.app";
  const canonicalUrl = `${baseUrl}/${areaData.slug}`;

  return {
    title: areaData.metaTitle,
    description: areaData.metaDescription,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: areaData.metaTitle,
      description: areaData.metaDescription,
      url: canonicalUrl,
      siteName: "JUBU Cleaning Service",
      locale: "en_AE",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: areaData.metaTitle,
      description: areaData.metaDescription
    }
  };
}

// 3. Dynamic Area Landing Page Handler
export default async function AreaPage({ params }: AreaPageProps) {
  const { area } = await params;

  // Strict allow-list check: 404 cleanly on invalid slugs
  if (!isValidAreaSlug(area)) {
    notFound();
  }

  const areaData = await getAreaLandingPage(area);
  if (!areaData || !areaData.isActive) {
    notFound();
  }

  // Fetch shared site content exactly like the root page
  const [settings, hero, services, whyChoose, about, team, gallery, areas] =
    await Promise.all([
      getSettings(),
      getHero(),
      getServices(),
      getWhyChoose(),
      getAbout(),
      getTeam(),
      getGallery(),
      getAreas()
    ]);

  const defaultWhatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    settings.whatsappDefaultMessage
  )}`;

  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "https://jebucleaning.netlify.app";
  const pageCanonicalUrl = `${baseUrl}/${areaData.slug}`;

  // Structured Data (HouseCleaningService with specific areaServed + FAQPage)
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "HouseCleaningService",
      "@id": `${baseUrl}/${areaData.slug}#localbusiness`,
      name: `${settings.businessName} - ${areaData.areaName}`,
      alternateName: "JUBU Cleaning Service LLC",
      url: pageCanonicalUrl,
      logo: `${baseUrl}/images/logo.png`,
      image: `${baseUrl}/images/logo.png`,
      telephone: settings.phoneTel,
      email: settings.email,
      priceRange: "$$",
      paymentAccepted: "Cash, Card, Bank Transfer",
      currenciesAccepted: "AED",
      description: areaData.metaDescription,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Setadel Building, Office # 201, Al Quoz-4",
        addressLocality: "Dubai",
        addressRegion: "Dubai",
        addressCountry: "AE"
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 25.276987,
        longitude: 55.308253
      },
      areaServed: {
        "@type": "AdministrativeArea",
        name: areaData.areaName
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `Cleaning Services in ${areaData.areaName}`,
        itemListElement: services.map((service, index) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.shortDescription
          },
          position: index + 1
        }))
      },
      sameAs: settings.socialLinks
        .filter((s) => Boolean(s.url))
        .map((s) => s.url)
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: areaData.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer
        }
      }))
    }
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#041633] pb-16 md:pb-0">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 1. Header (sticky, anchor nav, actions) */}
      <Header settings={settings} />

      {/* 2. Hero Section (swapped headline, intro, and optional hero image) */}
      <Hero
        content={hero}
        phoneTel={settings.phoneTel}
        phoneDisplay={settings.phoneDisplay}
        headline={areaData.heroHeadline}
        intro={areaData.heroIntro}
        heroImage={areaData.heroImage}
        socialProofText={`Serving ${areaData.areaName} & premier residential areas across Dubai`}
      />

      {/* 3. Our Services (swapped heading per client brief) */}
      <Services
        services={services}
        title={areaData.servicesSectionTitle}
        description={`Professional, licensed cleaning solutions tailored for properties in ${areaData.areaName}, Dubai.`}
      />

      {/* 3.1 Featured Area Block (Specialized copy from client brief) */}
      <FeaturedBlock
        title={areaData.featuredBlockTitle}
        content={areaData.featuredBlockText}
      />

      {/* 4. Why Choose JUBU */}
      <WhyChooseUs items={whyChoose} />

      {/* 5. About Us / Company Profile */}
      <About content={about} />

      {/* 6. Our Team */}
      <Team members={team} />

      {/* 7. Projects / Gallery (with accessible lightbox) */}
      <Gallery items={gallery} />

      {/* 8. Frequently Asked Questions (Area-specific FAQ section) */}
      <Faq faqs={areaData.faqs} areaName={areaData.areaName} />

      {/* 9. Get a Free Quote (Lead Form with sourceArea tracking and area CTA heading) */}
      <QuoteForm
        services={services}
        settings={settings}
        sourceArea={areaData.slug}
        finalCtaTitle={areaData.finalCtaTitle}
      />

      {/* 10. Dubai Service Areas (with area pinned and near-you copy) */}
      <ServiceAreas
        areas={areas}
        whatsappUrl={defaultWhatsappUrl}
        settings={settings}
        initialActiveAreaId={areaData.slug}
        headline={areaData.nearYouTitle}
        nearYouText={areaData.nearYouText}
      />

      <div className="bg-white">
        {/* 11. Contact Us */}
        <Contact settings={settings} />

        {/* 12. Footer */}
        <Footer settings={settings} />
      </div>

      {/* 13. Sticky Mobile Bottom Bar */}
      <StickyBottomBar settings={settings} />
    </div>
  );
}
