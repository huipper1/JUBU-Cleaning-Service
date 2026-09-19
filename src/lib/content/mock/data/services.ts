import type { Service } from "@/types/content";

// DUMMY: 6 Mock services exactly matching design Part 1 and PLAN.md
export const mockServicesData: Service[] = [
  {
    id: "home-cleaning",
    slug: "home-cleaning",
    title: "Home Cleaning", // DUMMY
    shortDescription:
      "Complete cleaning for apartments and villas, with regular or one-time service.", // DUMMY
    longDescription:
      "Comprehensive residential cleaning services customized for Dubai apartments and luxury villas. We vacuum, sanitize, mop, and polish every room to pristine standards.", // DUMMY
    icon: "home",
    image: {
      src: "/images/placeholder/gallery-home.png", // DUMMY
      alt: "Home Cleaning in Dubai living room with sofa and plants",
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
    title: "Office Cleaning", // DUMMY
    shortDescription: "A clean and fresh workspace for a more productive team.", // DUMMY
    longDescription:
      "Keep your workplace hygienic and welcoming for staff and clients. Flexible daily, weekly, or after-hours commercial office cleaning schedules across Dubai.", // DUMMY
    icon: "building",
    image: {
      src: "/images/placeholder/gallery-office.png", // DUMMY
      alt: "Clean modern corporate office workspace in Dubai",
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
    title: "Deep Cleaning", // DUMMY
    shortDescription: "Thorough cleaning for a healthier and fresher environment.", // DUMMY
    longDescription:
      "Intensive sanitization reaching behind heavy furniture, kitchen appliances, grouting, ventilation ducts, and hard-to-reach areas.", // DUMMY
    icon: "sparkles",
    image: {
      src: "/images/placeholder/gallery-deep-cleaning.png", // DUMMY
      alt: "Deep steam extraction cleaning on living room carpet",
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
    title: "Sofa & Carpet Cleaning", // DUMMY
    shortDescription: "Professional cleaning for sofas, carpets and upholstery.", // DUMMY
    longDescription:
      "Specialized upholstery shampooing and stain extraction for sofas, mattresses, rugs, and curtains using fabric-safe eco detergents.", // DUMMY
    icon: "sofa",
    image: {
      src: "/images/placeholder/gallery-sofa.png", // DUMMY
      alt: "High-power upholstery cleaning on fabric sofa",
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
    title: "Post Construction Cleaning", // DUMMY (Edge case: longer title)
    shortDescription: "Remove dust, debris and make your space move-in ready.", // DUMMY
    // Edge case: optional longDescription omitted
    icon: "hard-hat",
    image: {
      src: "/images/placeholder/gallery-construction.png", // DUMMY
      alt: "Post-renovation dust extraction and clean-up in Dubai villa",
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
    title: "Move In / Move Out Cleaning", // DUMMY
    shortDescription: "Hassle-free cleaning for a smooth move, every time.", // DUMMY
    longDescription:
      "Make your property pristine for landlord inspections or fresh move-ins. Complete tenancy handover cleaning ensuring full deposit returns.", // DUMMY
    icon: "truck",
    image: {
      src: "/images/placeholder/gallery-move.png", // DUMMY
      alt: "Move-in ready apartment cleaning with packed boxes",
      width: 500,
      height: 500
    },
    order: 6,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  }
];
