import type { AreaLandingPage } from "@/types/content";

export const VALID_AREA_SLUGS = [
  "business-bay",
  "dubai-marina",
  "jumeirah",
  "downtown-dubai",
  "jvc"
] as const;

export type ValidAreaSlug = (typeof VALID_AREA_SLUGS)[number];

export function isValidAreaSlug(slug: string): slug is ValidAreaSlug {
  return (VALID_AREA_SLUGS as readonly string[]).includes(slug);
}

// Client-provided real marketing copy for 5 area landing pages
export const mockAreaLandingPagesData: AreaLandingPage[] = [
  {
    id: "business-bay",
    slug: "business-bay",
    areaName: "Business Bay",
    metaTitle: "Professional Office & Apartment Cleaning Services in Business Bay | JUBU",
    metaDescription:
      "JUBU Cleaning Service provides professional cleaning solutions for apartments, offices and commercial properties in Business Bay, Dubai. Free custom quote.",
    heroHeadline: "Professional Office & Apartment Cleaning Services in Business Bay",
    heroIntro:
      "Looking for reliable cleaning services in Business Bay? JUBU Cleaning Service provides professional cleaning solutions for apartments, offices and commercial properties in Business Bay, Dubai. Whether you need regular cleaning, deep cleaning or post-construction cleaning, our team is ready to help.",
    servicesSectionTitle: "Our Cleaning Services in Business Bay",
    servicesList: [
      "Apartment Cleaning",
      "Office Cleaning",
      "Deep Cleaning",
      "Post-Construction Cleaning",
      "Move-In / Move-Out Cleaning",
      "Kitchen & Bathroom Cleaning",
      "Floor Cleaning",
      "Commercial Cleaning"
    ],
    featuredBlockTitle: "Post-Construction Office & Apartment Cleaning",
    featuredBlockText:
      "Moving into a newly completed office or apartment? Construction dust, paint marks and leftover debris can make the property difficult to use. JUBU Cleaning Service provides detailed post-construction cleaning to help prepare your property for move-in or business operations.",
    nearYouTitle: "Cleaning Services Near You in Business Bay",
    nearYouText:
      "We provide cleaning services for apartments, offices and commercial properties throughout Business Bay. Tell us about your property and cleaning requirements, and we will provide a quotation based on the work required.",
    finalCtaTitle: "Need Cleaning Services in Business Bay?",
    faqs: [
      {
        question: "Do you provide apartment cleaning in Business Bay?",
        answer: "Yes. We provide apartment cleaning and deep cleaning services in Business Bay."
      },
      {
        question: "Do you provide office cleaning?",
        answer: "Yes. Our services include office and commercial cleaning."
      },
      {
        question: "Do you provide post-construction cleaning?",
        answer: "Yes. We provide post-construction cleaning for offices and apartments."
      },
      {
        question: "How can I get a quotation?",
        answer: "Contact us through WhatsApp, phone or our quotation form."
      }
    ],
    isActive: true,
    order: 1
  },
  {
    id: "dubai-marina",
    slug: "dubai-marina",
    areaName: "Dubai Marina",
    metaTitle: "Top-Rated Home Cleaning & Maid Services in Dubai Marina | JUBU",
    metaDescription:
      "JUBU Cleaning Service provides professional home, apartment and deep cleaning services for residents in Dubai Marina. Free custom quote via WhatsApp or phone.",
    heroHeadline: "Top-Rated Home Cleaning & Maid Services in Dubai Marina",
    heroIntro:
      "Need reliable home cleaning services in Dubai Marina? JUBU Cleaning Service provides professional home, apartment and deep cleaning services for residents in Dubai Marina. From regular home cleaning to detailed move-in and move-out cleaning, we can help keep your property clean and ready.",
    servicesSectionTitle: "Our Cleaning Services in Dubai Marina",
    servicesList: [
      "Home Cleaning",
      "Apartment Cleaning",
      "Deep Cleaning",
      "Move-In Cleaning",
      "Move-Out Cleaning",
      "Kitchen & Bathroom Cleaning",
      "Floor Cleaning",
      "Post-Construction Cleaning"
    ],
    featuredBlockTitle: "Move-In / Move-Out Deep Cleaning",
    featuredBlockText:
      "Moving into a new apartment or preparing to leave your current home? Our move-in and move-out cleaning service focuses on the areas that need detailed attention, including kitchens, bathrooms, floors, surfaces and other accessible areas of the property.",
    nearYouTitle: "Apartment Cleaning in Dubai Marina",
    nearYouText:
      "JUBU Cleaning Service provides cleaning solutions for apartments and homes in Dubai Marina. Whether you need a one-time deep clean or regular cleaning, contact us with your requirements and property details.",
    finalCtaTitle: "Need Home Cleaning in Dubai Marina?",
    faqs: [
      {
        question: "Do you clean apartments in Dubai Marina?",
        answer: "Yes. We provide apartment cleaning and deep cleaning services in Dubai Marina."
      },
      {
        question: "Do you provide move-in and move-out cleaning?",
        answer: "Yes. We provide detailed move-in and move-out cleaning."
      },
      {
        question: "Can I book a one-time deep cleaning?",
        answer: "Yes. One-time deep cleaning is available depending on your requirements."
      },
      {
        question: "How do I request a quotation?",
        answer: "Contact us through WhatsApp, phone or our online quotation form."
      }
    ],
    isActive: true,
    order: 2
  },
  {
    id: "jumeirah",
    slug: "jumeirah",
    areaName: "Jumeirah",
    metaTitle: "Premium Villa Deep Cleaning Services in Jumeirah | JUBU",
    metaDescription:
      "JUBU Cleaning Service provides detailed villa deep cleaning and move-in cleaning services for residential properties in Jumeirah, Dubai. Free custom quote.",
    heroHeadline: "Premium Villa Deep Cleaning Services in Jumeirah",
    heroIntro:
      "Looking for professional villa cleaning services in Jumeirah? JUBU Cleaning Service provides detailed villa deep cleaning and move-in cleaning services for residential properties in Jumeirah, Dubai. Our team can help prepare villas for move-in, after renovation or construction, or for a detailed one-time clean.",
    servicesSectionTitle: "Our Villa Cleaning Services in Jumeirah",
    servicesList: [
      "Villa Deep Cleaning",
      "Regular Villa Cleaning",
      "Move-In Cleaning",
      "Move-Out Cleaning",
      "Post-Construction Cleaning",
      "Kitchen & Bathroom Cleaning",
      "Floor Cleaning",
      "Interior Cleaning"
    ],
    featuredBlockTitle: "Post-Construction & Move-In Villa Deep Cleaning",
    featuredBlockText:
      "After construction or renovation, villas may require detailed cleaning before they are ready for use. JUBU Cleaning Service can help remove construction dust and clean accessible surfaces, floors, kitchens, bathrooms and other areas according to the property's requirements.",
    nearYouTitle: "Villa Cleaning in Jumeirah",
    nearYouText:
      "Every villa can have different cleaning requirements. Tell us the villa size, condition and type of cleaning required so we can provide a suitable quotation.",
    finalCtaTitle: "Need Villa Cleaning in Jumeirah?",
    faqs: [
      {
        question: "Do you provide villa deep cleaning in Jumeirah?",
        answer: "Yes. We provide villa deep cleaning services in Jumeirah."
      },
      {
        question: "Do you clean villas after construction or renovation?",
        answer: "Yes. Post-construction and post-renovation cleaning services are available."
      },
      {
        question: "Do you provide move-in cleaning?",
        answer: "Yes. We provide move-in cleaning for villas and other residential properties."
      },
      {
        question: "How can I get a quotation?",
        answer: "Contact JUBU through WhatsApp, phone or our online quotation form."
      }
    ],
    isActive: true,
    order: 3
  },
  {
    id: "downtown-dubai",
    slug: "downtown-dubai",
    areaName: "Downtown Dubai",
    metaTitle: "Luxury Apartment & Penthouse Cleaning in Downtown Dubai | JUBU",
    metaDescription:
      "JUBU Cleaning Service provides professional apartment, penthouse and deep cleaning services in Downtown Dubai. Request a free custom quote today.",
    heroHeadline: "Luxury Apartment & Penthouse Cleaning in Downtown Dubai",
    heroIntro:
      "JUBU Cleaning Service provides professional apartment, penthouse and deep cleaning services in Downtown Dubai. Whether you are preparing a property for move-in, moving out or need detailed cleaning after construction or renovation, our team can help.",
    servicesSectionTitle: "Our Cleaning Services in Downtown Dubai",
    servicesList: [
      "Apartment Cleaning",
      "Penthouse Cleaning",
      "Deep Cleaning",
      "Move-In Cleaning",
      "Move-Out Cleaning",
      "Post-Construction Cleaning",
      "Kitchen & Bathroom Cleaning",
      "Floor Cleaning"
    ],
    featuredBlockTitle: "Post-Construction & Move-In Apartment Cleaning",
    featuredBlockText:
      "Newly completed or renovated apartments may require detailed cleaning before they are ready for occupancy. Our post-construction and move-in cleaning service focuses on removing construction dust and cleaning accessible floors, surfaces, kitchens, bathrooms and other areas according to the property's condition.",
    nearYouTitle: "Apartment & Penthouse Cleaning in Downtown Dubai",
    nearYouText:
      "We provide cleaning services for different types of residential properties in Downtown Dubai. For an accurate quotation, send us your property type, approximate size and cleaning requirements.",
    finalCtaTitle: "Need Apartment or Penthouse Cleaning in Downtown Dubai?",
    faqs: [
      {
        question: "Do you clean apartments in Downtown Dubai?",
        answer: "Yes. We provide apartment cleaning and deep cleaning services."
      },
      {
        question: "Do you provide penthouse cleaning?",
        answer: "Yes. Penthouse cleaning can be arranged based on the property's requirements."
      },
      {
        question: "Do you provide post-construction cleaning?",
        answer: "Yes. We provide post-construction cleaning for residential properties."
      },
      {
        question: "How can I request a quotation?",
        answer: "Contact us through WhatsApp, phone or our online quotation form."
      }
    ],
    isActive: true,
    order: 4
  },
  {
    id: "jvc",
    slug: "jvc",
    areaName: "JVC",
    metaTitle: "Professional Home & Apartment Cleaning Services in JVC | JUBU",
    metaDescription:
      "Looking for reliable cleaning services in Jumeirah Village Circle (JVC)? JUBU Cleaning Service provides deep cleaning, move-in/out & post-construction cleaning.",
    heroHeadline: "Professional Home & Apartment Cleaning Services in JVC",
    heroIntro:
      "Looking for reliable cleaning services in Jumeirah Village Circle (JVC), Dubai? JUBU Cleaning Service provides professional home and apartment cleaning services in JVC, including deep cleaning, move-in and move-out cleaning, and post-construction cleaning. Whether you need a one-time deep clean or cleaning for a newly completed property, our team is ready to help.",
    servicesSectionTitle: "Our Cleaning Services in JVC",
    servicesList: [
      "Apartment Cleaning",
      "Home Cleaning",
      "Deep Cleaning",
      "Move-In Cleaning",
      "Move-Out Cleaning",
      "Post-Construction Cleaning",
      "Kitchen & Bathroom Cleaning",
      "Floor Cleaning",
      "Interior Cleaning"
    ],
    featuredBlockTitle: "Deep, Move-In & Post-Construction Cleaning in JVC",
    featuredBlockText: [
      {
        title: "Deep Cleaning Services in JVC",
        text: "Our deep cleaning service is suitable for apartments and homes that need more detailed cleaning than regular cleaning. We focus on accessible floors, surfaces, kitchens, bathrooms and other areas according to the property's condition and cleaning requirements."
      },
      {
        title: "Move-In & Move-Out Cleaning in JVC",
        text: "Moving into a new apartment or preparing your property for handover? JUBU Cleaning Service provides move-in and move-out cleaning to help prepare your property before moving in or after moving out."
      },
      {
        title: "Post-Construction Cleaning in JVC",
        text: "Newly constructed or renovated properties may require detailed cleaning before they are ready for occupancy. Our post-construction cleaning service helps remove construction dust and clean accessible surfaces, floors, kitchens, bathrooms and other areas according to the property's condition."
      }
    ],
    nearYouTitle: "Apartment Cleaning in JVC",
    nearYouText:
      "JUBU Cleaning Service provides cleaning solutions for apartments and homes throughout Jumeirah Village Circle. Tell us your property type, approximate size and cleaning requirements, and we will provide a quotation based on the work required.",
    finalCtaTitle: "Need Cleaning Services in JVC?",
    faqs: [
      {
        question: "Do you provide apartment cleaning in JVC?",
        answer: "Yes. We provide apartment cleaning and deep cleaning services throughout JVC."
      },
      {
        question: "Do you provide one-time deep cleaning?",
        answer: "Yes. One-time deep cleaning can be arranged according to your property's requirements."
      },
      {
        question: "Do you provide move-in and move-out cleaning?",
        answer: "Yes. We provide move-in and move-out cleaning for apartments and homes."
      },
      {
        question: "Do you provide post-construction cleaning?",
        answer: "Yes. We provide post-construction cleaning for newly completed or renovated properties."
      }
    ],
    isActive: true,
    order: 5
  }
];
