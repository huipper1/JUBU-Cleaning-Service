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

  // Enhanced JSON-LD Structured Data (LocalBusiness + Service Catalog + FAQPage) for SEO & AI SEO / GEO
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "HouseCleaningService",
      "@id": "https://jubucleaning.com/#localbusiness",
      name: settings.businessName,
      alternateName: "JUBU Cleaning Service LLC",
      url: "https://jubucleaning.com",
      logo: "https://jubucleaning.com/images/logo.png",
      image: "https://jubucleaning.com/images/logo.png",
      telephone: settings.phoneTel,
      email: settings.email,
      priceRange: "$$",
      paymentAccepted: "Cash, Card, Bank Transfer",
      currenciesAccepted: "AED",
      description:
        "Licensed Dubai cleaning service company offering residential, office, deep cleaning, sofa & carpet extraction, and move-in cleaning across Dubai.",
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
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
          opens: "08:00",
          closes: "20:00"
        }
      ],
      areaServed: areas.map((area) => ({
        "@type": "AdministrativeArea",
        name: area.name
      })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Cleaning Services in Dubai",
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
      mainEntity: [
        {
          "@type": "Question",
          name: "Which areas in Dubai does JUBU Cleaning Service cover?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "JUBU Cleaning Service covers 10 primary communities across Dubai including Downtown Dubai, Business Bay, Dubai Marina, Jumeirah Lake Towers (JLT), Jumeirah Beach Residence (JBR), Jumeirah, Palm Jumeirah, Al Barsha, Jumeirah Village Circle (JVC), and Dubai Hills Estate."
          }
        },
        {
          "@type": "Question",
          name: "Is JUBU Cleaning Service licensed in Dubai?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, JUBU Cleaning Service is an LLC licensed by the Dubai Department of Economy and Tourism under Trade Licence No. 1026183, active since 25 January 2022."
          }
        },
        {
          "@type": "Question",
          name: "What cleaning equipment does JUBU use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "JUBU Cleaning Service uses professional machines including Wet & Dry Vacuum Cleaners, Floor Scrubbers, Single Disc Machines, High Pressure Washers, Carpet and Sofa Extractor Machines, Steam Cleaners, and complete safety equipment."
          }
        },
        {
          "@type": "Question",
          name: "How can I request a quote for cleaning in Dubai?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can request a free custom cleaning quote online via our website form, call us at +971 54 299 5191, or send an instant message on WhatsApp at +971 54 299 5191."
          }
        }
      ]
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

      {/* 2. Hero Section */}
      {(settings.showHero ?? true) && (
        <Hero content={hero} phoneTel={settings.phoneTel} phoneDisplay={settings.phoneDisplay} />
      )}

      {/* 3. Our Services (6 cards, data-driven) */}
      {(settings.showServices ?? true) && <Services services={services} />}

      {/* 4. Why Choose JUBU */}
      {(settings.showWhyChoose ?? true) && <WhyChooseUs items={whyChoose} />}

      {/* 5. About Us / Company Profile */}
      {(settings.showAbout ?? true) && <About content={about} />}

      {/* 6. Our Team */}
      {(settings.showTeam ?? true) && <Team members={team} />}

      {/* 7. Projects / Gallery (with accessible lightbox) */}
      {(settings.showGallery ?? true) && <Gallery items={gallery} />}

      {/* 8. Get a Free Quote (Lead Form) */}
      {(settings.showQuote ?? true) && <QuoteForm services={services} settings={settings} />}

      {/* 9. Dubai Service Areas */}
      {(settings.showAreas ?? true) && (
        <ServiceAreas areas={areas} whatsappUrl={defaultWhatsappUrl} settings={settings} />
      )}

      <div className="bg-white">
        {/* 10. Contact Us */}
        {(settings.showContact ?? true) && <Contact settings={settings} />}

        {/* 11. Footer */}
        <Footer settings={settings} />
      </div>

      {/* 12. Sticky Mobile Bottom Bar */}
      <StickyBottomBar settings={settings} />
    </div>
  );
}
