import type { Service } from "@/types/content";

// 6 Mock services with dynamic starting base prices and configurable sub add-ons
export const mockServicesData: Service[] = [
  {
    id: "home-cleaning",
    slug: "home-cleaning",
    title: "Home Cleaning",
    shortDescription:
      "Complete cleaning for apartments and villas, with regular or one-time service.",
    longDescription:
      "Comprehensive residential cleaning services customized for Dubai apartments and luxury villas. We vacuum, sanitize, mop, and polish every room to pristine standards.",
    icon: "home",
    basePrice: 199,
    addons: [
      {
        id: "bedrooms",
        name: "Bedrooms",
        icon: "bed",
        price: 40,
        unitLabel: "room",
        min: 0,
        max: 8,
        defaultQty: 0
      },
      {
        id: "washrooms",
        name: "Washrooms / Bathrooms",
        icon: "bath",
        price: 35,
        unitLabel: "bath",
        min: 0,
        max: 6,
        defaultQty: 0
      },
      {
        id: "living-sofa",
        name: "Living Room Sofa Clean",
        icon: "sofa",
        price: 60,
        unitLabel: "sofa",
        min: 0,
        max: 4,
        defaultQty: 0
      },
      {
        id: "balcony",
        name: "Balcony Jet Pressure Wash",
        icon: "sun",
        price: 50,
        unitLabel: "balcony",
        min: 0,
        max: 3,
        defaultQty: 0
      },
      {
        id: "oven-degrease",
        name: "Oven Deep Degreasing",
        icon: "flame",
        price: 60,
        unitLabel: "appliance",
        min: 0,
        max: 2,
        defaultQty: 0
      },
      {
        id: "fridge-sanitization",
        name: "Interior Fridge Sanitization",
        icon: "snowflake",
        price: 45,
        unitLabel: "fridge",
        min: 0,
        max: 2,
        defaultQty: 0
      }
    ],
    image: {
      src: "/images/placeholder/gallery-home.png",
      alt: "Professional Home Cleaning in Dubai - Apartment living room sanitization and vacuuming by JUBU Cleaning",
      width: 500,
      height: 500
    },
    order: 1,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "office-cleaning",
    slug: "office-cleaning",
    title: "Office Cleaning",
    shortDescription: "A clean and fresh workspace for a more productive team.",
    longDescription:
      "Keep your workplace hygienic and welcoming for staff and clients. Flexible daily, weekly, or after-hours commercial office cleaning schedules across Dubai.",
    icon: "building",
    basePrice: 299,
    addons: [
      {
        id: "workstations",
        name: "Office Desks & Workstations",
        icon: "monitor",
        price: 25,
        unitLabel: "desk",
        min: 0,
        max: 30,
        defaultQty: 0
      },
      {
        id: "executive-cabin",
        name: "Executive / Boss Cabin",
        icon: "crown",
        price: 60,
        unitLabel: "cabin",
        min: 0,
        max: 6,
        defaultQty: 0
      },
      {
        id: "meeting-room",
        name: "Conference & Meeting Room",
        icon: "users",
        price: 80,
        unitLabel: "room",
        min: 0,
        max: 4,
        defaultQty: 0
      },
      {
        id: "pantry-kitchenette",
        name: "Pantry & Coffee Station",
        icon: "coffee",
        price: 50,
        unitLabel: "pantry",
        min: 0,
        max: 3,
        defaultQty: 0
      },
      {
        id: "office-washroom",
        name: "Commercial Washroom Sanitization",
        icon: "bath",
        price: 45,
        unitLabel: "washroom",
        min: 0,
        max: 6,
        defaultQty: 0
      }
    ],
    image: {
      src: "/images/placeholder/gallery-office.png",
      alt: "Commercial Office Cleaning in Dubai - Modern corporate workspace and desk sanitization by JUBU Cleaning",
      width: 500,
      height: 500
    },
    order: 2,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "deep-cleaning",
    slug: "deep-cleaning",
    title: "Deep Cleaning",
    shortDescription: "Thorough cleaning for a healthier and fresher environment.",
    longDescription:
      "Intensive sanitization reaching behind heavy furniture, kitchen appliances, grouting, ventilation ducts, and hard-to-reach areas.",
    icon: "sparkles",
    basePrice: 349,
    addons: [
      {
        id: "extra-deep-room",
        name: "Extra Bedroom Deep Scrub",
        icon: "bed",
        price: 65,
        unitLabel: "room",
        min: 0,
        max: 6,
        defaultQty: 0
      },
      {
        id: "floor-scrubbing",
        name: "Single-Disc Machine Floor Scrubbing",
        icon: "disc",
        price: 90,
        unitLabel: "area",
        min: 0,
        max: 5,
        defaultQty: 0
      },
      {
        id: "kitchen-hood-degrease",
        name: "Commercial Kitchen Exhaust Hood Cleaning",
        icon: "flame",
        price: 80,
        unitLabel: "hood",
        min: 0,
        max: 2,
        defaultQty: 0
      },
      {
        id: "window-panes",
        name: "Full Glass Window Panes Steam Shine",
        icon: "sparkles",
        price: 70,
        unitLabel: "set",
        min: 0,
        max: 5,
        defaultQty: 0
      },
      {
        id: "grout-whitening",
        name: "Bathroom Tile Grout Whitening & Steam",
        icon: "bath",
        price: 55,
        unitLabel: "bath",
        min: 0,
        max: 5,
        defaultQty: 0
      }
    ],
    image: {
      src: "/images/placeholder/gallery-deep-cleaning.png",
      alt: "Deep Cleaning and Intensive Steam Sanitization in Dubai - Carpet extraction by JUBU Cleaning",
      width: 500,
      height: 500
    },
    order: 3,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "sofa-carpet-cleaning",
    slug: "sofa-carpet-cleaning",
    title: "Sofa & Carpet Cleaning",
    shortDescription: "Professional cleaning for sofas, carpets and upholstery.",
    longDescription:
      "Specialized upholstery shampooing and stain extraction for sofas, mattresses, rugs, and curtains using fabric-safe eco detergents.",
    icon: "sofa",
    basePrice: 249,
    addons: [
      {
        id: "sofa-1-seater",
        name: "1-Seater Armchair",
        icon: "armchair",
        price: 45,
        unitLabel: "chair",
        min: 0,
        max: 8,
        defaultQty: 0
      },
      {
        id: "sofa-2-3-seater",
        name: "2 or 3-Seater Living Sofa",
        icon: "sofa",
        price: 90,
        unitLabel: "sofa",
        min: 0,
        max: 5,
        defaultQty: 0
      },
      {
        id: "sofa-l-shape",
        name: "L-Shape / Sectional Sofa",
        icon: "sofa",
        price: 160,
        unitLabel: "sectional",
        min: 0,
        max: 3,
        defaultQty: 0
      },
      {
        id: "carpet-rug",
        name: "Carpet / Area Rug Steam Shampoo",
        icon: "layers",
        price: 70,
        unitLabel: "rug",
        min: 0,
        max: 6,
        defaultQty: 0
      },
      {
        id: "mattress-sanitization",
        name: "Bed Mattress Steam Extraction",
        icon: "bed",
        price: 85,
        unitLabel: "mattress",
        min: 0,
        max: 5,
        defaultQty: 0
      },
      {
        id: "dining-chairs",
        name: "Dining Chairs Fabric Wash",
        icon: "chair",
        price: 25,
        unitLabel: "chair",
        min: 0,
        max: 12,
        defaultQty: 0
      }
    ],
    image: {
      src: "/images/placeholder/gallery-sofa.png",
      alt: "Sofa and Carpet Steam Cleaning in Dubai - Upholstery stain extraction by JUBU Cleaning",
      width: 500,
      height: 500
    },
    order: 4,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "post-construction-cleaning",
    slug: "post-construction-cleaning",
    title: "Post Construction Cleaning",
    shortDescription: "Remove dust, debris and make your space move-in ready.",
    icon: "hard-hat",
    basePrice: 499,
    addons: [
      {
        id: "villa-large-hall",
        name: "Extra Large Hall / Living Area",
        icon: "building",
        price: 120,
        unitLabel: "hall",
        min: 0,
        max: 4,
        defaultQty: 0
      },
      {
        id: "paint-cement-film",
        name: "Paint Splatter & Cement Film Removal",
        icon: "brush",
        price: 100,
        unitLabel: "zone",
        min: 0,
        max: 5,
        defaultQty: 0
      },
      {
        id: "balcony-jet-wash",
        name: "Terrace & Balcony Jet Wash",
        icon: "droplets",
        price: 80,
        unitLabel: "balcony",
        min: 0,
        max: 4,
        defaultQty: 0
      },
      {
        id: "ac-duct-diffuser",
        name: "AC Vent Grills & Diffusers Dusting",
        icon: "wind",
        price: 60,
        unitLabel: "room",
        min: 0,
        max: 6,
        defaultQty: 0
      }
    ],
    image: {
      src: "/images/placeholder/gallery-construction.png",
      alt: "Post Construction Dust Extraction and Handover Cleaning in Dubai Villas - JUBU Cleaning",
      width: 500,
      height: 500
    },
    order: 5,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "move-in-move-out-cleaning",
    slug: "move-in-move-out-cleaning",
    title: "Move In / Move Out Cleaning",
    shortDescription: "Hassle-free cleaning for a smooth move, every time.",
    longDescription:
      "Make your property pristine for landlord inspections or fresh move-ins. Complete tenancy handover cleaning ensuring full deposit returns.",
    icon: "truck",
    basePrice: 399,
    addons: [
      {
        id: "handover-room",
        name: "Extra Tenancy Handover Room",
        icon: "door-closed",
        price: 70,
        unitLabel: "room",
        min: 0,
        max: 6,
        defaultQty: 0
      },
      {
        id: "cabinet-interiors",
        name: "All Wardrobes & Cabinet Interiors Wipe",
        icon: "archive",
        price: 80,
        unitLabel: "flat",
        min: 0,
        max: 3,
        defaultQty: 0
      },
      {
        id: "appliance-clean",
        name: "Kitchen Built-in Appliances Deep Clean",
        icon: "flame",
        price: 75,
        unitLabel: "set",
        min: 0,
        max: 2,
        defaultQty: 0
      },
      {
        id: "balcony-wash",
        name: "Balcony Tile Scrubber & Wash",
        icon: "droplets",
        price: 55,
        unitLabel: "balcony",
        min: 0,
        max: 3,
        defaultQty: 0
      }
    ],
    image: {
      src: "/images/placeholder/gallery-move.png",
      alt: "Move In and Move Out Tenancy Handover Cleaning in Dubai - Inspection-ready apartment cleaning by JUBU Cleaning",
      width: 500,
      height: 500
    },
    order: 6,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  }
];
