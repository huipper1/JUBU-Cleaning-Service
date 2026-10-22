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

// Client-provided real marketing copy for area landing pages
export const mockAreaLandingPagesData: AreaLandingPage[] = [
  {
    "id": "dubai-marina",
    "slug": "dubai-marina",
    "areaName": "Dubai Marina",
    "metaTitle": "Top-Rated Home Cleaning & Maid Services in Dubai Marina | JUBU",
    "metaDescription": "JUBU Cleaning Service provides professional home, apartment and deep cleaning services for residents in Dubai Marina. Free custom quote via WhatsApp or phone.",
    "heroHeadline": "Top-Rated Home Cleaning & Maid Services in Dubai Marina",
    "heroIntro": "Need reliable home cleaning services in Dubai Marina? JUBU Cleaning Service provides professional home, apartment and deep cleaning services for residents in Dubai Marina. From regular home cleaning to detailed move-in and move-out cleaning, we can help keep your property clean and ready.",
    "servicesSectionTitle": "Our Cleaning Services in Dubai Marina",
    "servicesList": [
      "Home Cleaning",
      "Apartment Cleaning",
      "Deep Cleaning",
      "Move-In Cleaning",
      "Move-Out Cleaning",
      "Kitchen & Bathroom Cleaning",
      "Floor Cleaning",
      "Post-Construction Cleaning"
    ],
    "serviceIds": [],
    "featuredBlockTitle": "Move-In / Move-Out Deep Cleaning",
    "featuredBlockText": "Moving into a new apartment or preparing to leave your current home? Our move-in and move-out cleaning service focuses on the areas that need detailed attention, including kitchens, bathrooms, floors, surfaces and other accessible areas of the property.",
    "nearYouTitle": "Apartment Cleaning in Dubai Marina",
    "nearYouText": "JUBU Cleaning Service provides cleaning solutions for apartments and homes in Dubai Marina. Whether you need a one-time deep clean or regular cleaning, contact us with your requirements and property details.",
    "finalCtaTitle": "Need Home Cleaning in Dubai Marina?",
    "faqs": [
      {
        "answer": "Yes. We provide apartment cleaning and deep cleaning services in Dubai Marina.",
        "question": "Do you clean apartments in Dubai Marina?"
      },
      {
        "answer": "Yes. We provide detailed move-in and move-out cleaning.",
        "question": "Do you provide move-in and move-out cleaning?"
      },
      {
        "answer": "Yes. One-time deep cleaning is available depending on your requirements.",
        "question": "Can I book a one-time deep cleaning?"
      },
      {
        "answer": "Contact us through WhatsApp, phone or our online quotation form.",
        "question": "How do I request a quotation?"
      }
    ],
    "isActive": true,
    "order": 0
  },
  {
    "id": "jumeirah",
    "slug": "jumeirah",
    "areaName": "Jumeirah",
    "metaTitle": "Premium Villa Deep Cleaning Services in Jumeirah | JUBU",
    "metaDescription": "JUBU Cleaning Service provides detailed villa deep cleaning and move-in cleaning services for residential properties in Jumeirah, Dubai. Free custom quote.",
    "heroHeadline": "Premium Villa Deep Cleaning Services in Jumeirah",
    "heroIntro": "Looking for professional villa cleaning services in Jumeirah? JUBU Cleaning Service provides detailed villa deep cleaning and move-in cleaning services for residential properties in Jumeirah, Dubai. Our team can help prepare villas for move-in, after renovation or construction, or for a detailed one-time clean.",
    "servicesSectionTitle": "Our Villa Cleaning Services in Jumeirah",
    "servicesList": [
      "Villa Deep Cleaning",
      "Regular Villa Cleaning",
      "Move-In Cleaning",
      "Move-Out Cleaning",
      "Post-Construction Cleaning",
      "Kitchen & Bathroom Cleaning",
      "Floor Cleaning",
      "Interior Cleaning"
    ],
    "serviceIds": [],
    "featuredBlockTitle": "Post-Construction & Move-In Villa Deep Cleaning",
    "featuredBlockText": "After construction or renovation, villas may require detailed cleaning before they are ready for use. JUBU Cleaning Service can help remove construction dust and clean accessible surfaces, floors, kitchens, bathrooms and other areas according to the property's requirements.",
    "nearYouTitle": "Villa Cleaning in Jumeirah",
    "nearYouText": "Every villa can have different cleaning requirements. Tell us the villa size, condition and type of cleaning required so we can provide a suitable quotation.",
    "finalCtaTitle": "Need Villa Cleaning in Jumeirah?",
    "faqs": [
      {
        "answer": "Yes. We provide villa deep cleaning services in Jumeirah.",
        "question": "Do you provide villa deep cleaning in Jumeirah?"
      },
      {
        "answer": "Yes. Post-construction and post-renovation cleaning services are available.",
        "question": "Do you clean villas after construction or renovation?"
      },
      {
        "answer": "Yes. We provide move-in cleaning for villas and other residential properties.",
        "question": "Do you provide move-in cleaning?"
      },
      {
        "answer": "Contact JUBU through WhatsApp, phone or our online quotation form.",
        "question": "How can I get a quotation?"
      }
    ],
    "isActive": true,
    "order": 0
  },
  {
    "id": "downtown-dubai",
    "slug": "downtown-dubai",
    "areaName": "Downtown Dubai",
    "metaTitle": "Luxury Apartment & Penthouse Cleaning in Downtown Dubai | JUBU",
    "metaDescription": "JUBU Cleaning Service provides professional apartment, penthouse and deep cleaning services in Downtown Dubai. Request a free custom quote today.",
    "heroHeadline": "Luxury Apartment & Penthouse Cleaning in Downtown Dubai",
    "heroIntro": "JUBU Cleaning Service provides professional apartment, penthouse and deep cleaning services in Downtown Dubai. Whether you are preparing a property for move-in, moving out or need detailed cleaning after construction or renovation, our team can help.",
    "servicesSectionTitle": "Our Cleaning Services in Downtown Dubai",
    "servicesList": [
      "Apartment Cleaning",
      "Penthouse Cleaning",
      "Deep Cleaning",
      "Move-In Cleaning",
      "Move-Out Cleaning",
      "Post-Construction Cleaning",
      "Kitchen & Bathroom Cleaning",
      "Floor Cleaning"
    ],
    "serviceIds": [],
    "featuredBlockTitle": "Post-Construction & Move-In Apartment Cleaning",
    "featuredBlockText": "Newly completed or renovated apartments may require detailed cleaning before they are ready for occupancy. Our post-construction and move-in cleaning service focuses on removing construction dust and cleaning accessible floors, surfaces, kitchens, bathrooms and other areas according to the property's condition.",
    "nearYouTitle": "Apartment & Penthouse Cleaning in Downtown Dubai",
    "nearYouText": "We provide cleaning services for different types of residential properties in Downtown Dubai. For an accurate quotation, send us your property type, approximate size and cleaning requirements.",
    "finalCtaTitle": "Need Apartment or Penthouse Cleaning in Downtown Dubai?",
    "faqs": [
      {
        "answer": "Yes. We provide apartment cleaning and deep cleaning services.",
        "question": "Do you clean apartments in Downtown Dubai?"
      },
      {
        "answer": "Yes. Penthouse cleaning can be arranged based on the property's requirements.",
        "question": "Do you provide penthouse cleaning?"
      },
      {
        "answer": "Yes. We provide post-construction cleaning for residential properties.",
        "question": "Do you provide post-construction cleaning?"
      },
      {
        "answer": "Contact us through WhatsApp, phone or our online quotation form.",
        "question": "How can I request a quotation?"
      }
    ],
    "isActive": true,
    "order": 0
  },
  {
    "id": "jvc",
    "slug": "jvc",
    "areaName": "JVC",
    "metaTitle": "Professional Home & Apartment Cleaning Services in JVC | JUBU",
    "metaDescription": "Looking for reliable cleaning services in Jumeirah Village Circle (JVC)? JUBU Cleaning Service provides deep cleaning, move-in/out & post-construction cleaning.",
    "heroHeadline": "Professional Home & Apartment Cleaning Services in JVC",
    "heroIntro": "Looking for reliable cleaning services in Jumeirah Village Circle (JVC), Dubai? JUBU Cleaning Service provides professional home and apartment cleaning services in JVC, including deep cleaning, move-in and move-out cleaning, and post-construction cleaning. Whether you need a one-time deep clean or cleaning for a newly completed property, our team is ready to help.",
    "servicesSectionTitle": "Our Cleaning Services in JVC",
    "servicesList": [
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
    "serviceIds": [],
    "featuredBlockTitle": "Deep, Move-In & Post-Construction Cleaning in JVC",
    "featuredBlockText": [
      {
        "text": "Our deep cleaning service is suitable for apartments and homes that need more detailed cleaning than regular cleaning. We focus on accessible floors, surfaces, kitchens, bathrooms and other areas according to the property's condition and cleaning requirements.",
        "title": "Deep Cleaning Services in JVC"
      },
      {
        "text": "Moving into a new apartment or preparing your property for handover? JUBU Cleaning Service provides move-in and move-out cleaning to help prepare your property before moving in or after moving out.",
        "title": "Move-In & Move-Out Cleaning in JVC"
      },
      {
        "text": "Newly constructed or renovated properties may require detailed cleaning before they are ready for occupancy. Our post-construction cleaning service helps remove construction dust and clean accessible surfaces, floors, kitchens, bathrooms and other areas according to the property's condition.",
        "title": "Post-Construction Cleaning in JVC"
      }
    ],
    "nearYouTitle": "Apartment Cleaning in JVC",
    "nearYouText": "JUBU Cleaning Service provides cleaning solutions for apartments and homes throughout Jumeirah Village Circle. Tell us your property type, approximate size and cleaning requirements, and we will provide a quotation based on the work required.",
    "finalCtaTitle": "Need Cleaning Services in JVC?",
    "faqs": [
      {
        "answer": "Yes. We provide apartment cleaning and deep cleaning services throughout JVC.",
        "question": "Do you provide apartment cleaning in JVC?"
      },
      {
        "answer": "Yes. One-time deep cleaning can be arranged according to your property's requirements.",
        "question": "Do you provide one-time deep cleaning?"
      },
      {
        "answer": "Yes. We provide move-in and move-out cleaning for apartments and homes.",
        "question": "Do you provide move-in and move-out cleaning?"
      },
      {
        "answer": "Yes. We provide post-construction cleaning for newly completed or renovated properties.",
        "question": "Do you provide post-construction cleaning?"
      }
    ],
    "isActive": true,
    "order": 0
  },
  {
    "id": "jlt",
    "slug": "jlt",
    "areaName": "Jumeirah Late Towers",
    "metaTitle": "Professional Cleaning Services in J | JUBU",
    "metaDescription": "JUBU Cleaning Service provides residential, deep, and move-in cleaning in J, Dubai. Free quotes.",
    "heroHeadline": "Professional Cleaning Services in J",
    "heroIntro": "Looking for reliable, licensed cleaning services in J? JUBU Cleaning provides premium home and commercial cleaning solutions.",
    "servicesSectionTitle": "Our Cleaning Services in J",
    "servicesList": [
      "Deep Cleaning",
      "Apartment Cleaning",
      "Move In / Out Cleaning",
      "Office Cleaning"
    ],
    "serviceIds": [
      "home-cleaning",
      "office-cleaning",
      "deep-cleaning",
      "sofa-carpet-cleaning",
      "post-construction-cleaning",
      "move-in-move-out-cleaning"
    ],
    "featuredBlockTitle": "Specialized Cleaning for J Properties",
    "featuredBlockText": "Our trained crews understand the high standards expected in J. We deliver spotless sanitization for villas, apartments, and offices.",
    "nearYouTitle": "Cleaning Services Near You in J",
    "nearYouText": "Rapid cleaner dispatch to all buildings and communities across J, Dubai.",
    "finalCtaTitle": "Book Your Cleaning in J Today",
    "faqs": [
      {
        "answer": "Our dedicated mobile teams cover J daily with rapid same-day and scheduled dispatch available.",
        "question": "How fast can JUBU cleaners reach J?"
      }
    ],
    "isActive": true,
    "order": 0
  },
  {
    "id": "business-bay",
    "slug": "business-bay",
    "areaName": "Business Bay",
    "metaTitle": "Cleaning Services Business Bay | Same-Day Home & Deep Cleaning | JUBU",
    "metaDescription": "Top-rated cleaning company in Business Bay, Dubai. Professional maid service, apartment deep cleaning, move-out & office cleaning. Same-day booking from AED 35/hr.",
    "heroHeadline": "Professional Cleaning Services in Business Bay, Dubai",
    "heroIntro": "Looking for the best cleaning company in Business Bay? JUBU Cleaning Service provides licensed, 5-star home cleaning, apartment deep cleaning, and corporate office sanitization across Business Bay. Whether you need an affordable hourly maid service, an urgent same-day deep clean, or an end of tenancy handover, our vetted cleaners are ready to assist.",
    "servicesSectionTitle": "Professional Cleaning Services in Business Bay",
    "servicesList": [
      "Apartment & Flat Cleaning (Studio, 1-Bedroom & Penthouses)",
      "Deep Cleaning Services (Kitchen Degreasing & Bathroom Descaling)",
      "Move-In & Move-Out Handover Cleaning (Deposit Return Guarantee)",
      "Hourly Maid Service & Part-Time Maids (Weekly & Monthly Plans)",
      "Commercial & Office Cleaning for Business Bay Towers",
      "Sofa, Carpet & Mattress Steam Extraction",
      "Balcony Dust Scrubbing & Post-Renovation Cleaning",
      "Same-Day Urgent & After-Party Cleaning Dispatches"
    ],
    "serviceIds": [
      "home-cleaning",
      "deep-cleaning",
      "office-cleaning",
      "sofa-carpet-cleaning",
      "post-construction-cleaning"
    ],
    "featuredBlockTitle": "End of Tenancy & Post-Renovation Deep Cleaning in Business Bay",
    "featuredBlockText": [
      {
        "text": "Moving into or vacating an apartment in Business Bay? Our comprehensive end of tenancy deep cleaning targets hard-to-reach areas: oven chambers, kitchen cabinet interiors, bathroom grout descaling, and balcony sand extraction, ensuring you pass property inspections and recover your full security deposit.",
        "title": "Move-In & Move-Out Handover Cleaning"
      },
      {
        "text": "Freshly fitted out office or newly upgraded apartment? Fine gypsum dust, paint marks, and adhesive residue require industrial single-disc floor scrubbers and HEPA filtration. Our trained crew restores your Business Bay property to pristine move-in condition.",
        "title": "Post-Renovation Office & Apartment Cleaning"
      },
      {
        "text": "Need last-minute cleaning or after-party deep cleaning in Business Bay? We maintain mobile cleaning units near Executive Towers and Bay Square, ready to deploy to your residential flat or office suite within 60 to 90 minutes.",
        "title": "Urgent & Same-Day Deep Cleaning Dispatches"
      }
    ],
    "nearYouTitle": "Cleaning Services Near You Across Business Bay Towers",
    "nearYouText": "JUBU Cleaning Service operates across all major residential and commercial landmarks in Business Bay, Dubai. We hold building entry clearances for Executive Towers, Bay Square, Churchill Towers, The Opus, Ubora, DAMAC Maison, Marasi Bay, and Capital Bay. Contact our local dispatch team for transparent cleaning service prices and instant bookings.",
    "finalCtaTitle": "Need a Trusted Cleaning Service in Business Bay?",
    "faqs": [
      {
        "answer": "Yes. We offer urgent, same-day, and last-minute cleaning services throughout Business Bay. Depending on crew availability, a professional cleaner or deep cleaning team can arrive at your apartment or office within 60 to 90 minutes.",
        "question": "Can I book a same-day or urgent cleaning service in Business Bay?"
      },
      {
        "answer": "Our regular hourly maid service starts from an affordable AED 35/hour. Apartment deep cleaning rates are competitively priced based on layout (studio apartment, one-bedroom apartment, or two-bedroom+). Contact us via WhatsApp or phone for an instant quotation.",
        "question": "What is the typical cleaning service price in Business Bay?"
      },
      {
        "answer": "Our apartment deep cleaning service covers thorough kitchen degreasing (stovetops, hoods, oven interiors), complete bathroom descaling and steam sanitization, balcony power washing, floor machine scrubbing, and interior cabinet wiping.",
        "question": "What is included in an apartment deep cleaning in Business Bay?"
      },
      {
        "answer": "Yes. Our end of tenancy cleaning service is specifically tailored for tenant handovers in Business Bay. We inspect and sanitize interior cabinetry, oven interiors, exhaust hoods, bathroom tiles, and balcony areas to help secure 100% deposit return.",
        "question": "Do you provide move-in and move-out cleaning for tenancy handovers?"
      },
      {
        "answer": "Yes. We provide flexible regular home cleaning schedules, including weekly cleaning services and monthly cleaning packages, with vetted, background-checked part-time maids assigned to your home.",
        "question": "Can I hire a part-time maid on a weekly or monthly schedule?"
      },
      {
        "answer": "Yes. We provide scheduled commercial cleaning and corporate office sanitization for towers across Business Bay, including Executive Towers, Bay Square, and Ubora, available during regular hours, after-hours, or on weekends.",
        "question": "Do you provide commercial and office cleaning in Business Bay?"
      },
      {
        "answer": "Yes. We specialize in deep upholstery extraction, using commercial-grade steam machines and fabric shampooing to eradicate dust mites, stains, allergens, and desert sand from sofas, carpets, and mattresses.",
        "question": "Do you offer sofa, carpet, and mattress steam cleaning?"
      },
      {
        "answer": "JUBU Cleaning Service combines licensed professional cleaners, Dubai Municipality-approved eco-friendly materials, rapid same-day response times, transparent pricing with no hidden charges, and a 100% satisfaction guarantee.",
        "question": "Why is JUBU considered the best cleaning company near me in Business Bay?"
      }
    ],
    "isActive": true,
    "order": 1
  }
];
