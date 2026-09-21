import {
  getAbout,
  getAreas,
  getGallery,
  getHero,
  getServices,
  getSettings,
  getTeam,
  getWhyChoose
} from "@/lib/content";

import { Footer, Header, StickyBottomBar } from "@/components/layouts";
import {
  About,
  Contact,
  Gallery,
  Hero,
  QuoteForm,
  ServiceAreas,
  Services,
  Team,
  WhyChooseUs
} from "@/components/sections";

export default async function Home() {
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

  // JSON-LD LocalBusiness Structured Data strictly matching real client facts
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HouseCleaningService",
    name: settings.businessName,
    image: `${settings.defaultSeo.ogImage || "/images/logo.png"}`,
    telephone: settings.phoneTel,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office No. 95-804, Naif",
      addressLocality: "Dubai",
      addressRegion: "Dubai",
      addressCountry: "AE"
    },
    areaServed: areas.map((area) => ({
      "@type": "AdministrativeArea",
      name: area.name
    })),
    sameAs: settings.socialLinks
      .filter((s) => Boolean(s.url))
      .map((s) => s.url)
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#041633] pb-16 md:pb-0">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Header (sticky, anchor nav, actions) */}
      <Header settings={settings} />

      {/* 2. Hero Section */}
      <Hero content={hero} phoneTel={settings.phoneTel} phoneDisplay={settings.phoneDisplay} />

      {/* 3. Our Services (6 cards, data-driven) */}
      <Services services={services} />

      {/* 4. Why Choose JUBU */}
      <WhyChooseUs items={whyChoose} />

      {/* 5. About Us / Company Profile */}
      <About content={about} />

      {/* 6. Our Team */}
      <Team members={team} />

      {/* 7. Projects / Gallery (with accessible lightbox) */}
      <Gallery items={gallery} />

      {/* 8. Get a Free Quote (Lead Form) */}
      <QuoteForm services={services} settings={settings} />

      {/* 9. Dubai Service Areas */}
      <ServiceAreas areas={areas} whatsappUrl={defaultWhatsappUrl} />

      <div className="bg-white">
        {/* 10. Contact Us */}
        <Contact settings={settings} />

        {/* 11. Footer */}
        <Footer settings={settings} />
      </div>

      {/* 12. Sticky Mobile Bottom Bar */}
      <StickyBottomBar settings={settings} />
    </div>
  );
}
