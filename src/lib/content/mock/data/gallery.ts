import type { GalleryItem } from "@/types/content";

// DUMMY: 8 Mock gallery items matching design Part 2
export const mockGalleryData: GalleryItem[] = [
  {
    id: "gallery-villa-cleaning",
    title: "Villa Cleaning", // DUMMY
    caption: "Luxury villa exterior terrace and interior deep cleaning in Palm Jumeirah.", // DUMMY
    serviceId: "home-cleaning",
    serviceName: "Home Cleaning",
    image: {
      src: "/images/placeholder/gallery-villa.svg", // DUMMY
      alt: "Pristine luxury villa with pool in Palm Jumeirah",
      width: 800,
      height: 600
    },
    order: 1,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "gallery-office-cleaning",
    title: "Office Cleaning", // DUMMY
    caption: "Complete workspace cleaning and sanitation in Downtown Dubai.", // DUMMY
    serviceId: "office-cleaning",
    serviceName: "Office Cleaning",
    image: {
      src: "/images/placeholder/gallery-office.svg", // DUMMY
      alt: "Clean modern open plan office in Business Bay",
      width: 800,
      height: 600
    },
    order: 2,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "gallery-deep-cleaning",
    title: "Deep Cleaning", // DUMMY
    caption: "Intensive bathroom and grout restoration before and after cleaning.", // DUMMY
    serviceId: "deep-cleaning",
    serviceName: "Deep Cleaning",
    image: {
      src: "/images/placeholder/gallery-deep-after.svg", // DUMMY
      alt: "Sparkling clean luxury bathroom after deep treatment",
      width: 800,
      height: 600
    },
    beforeImage: {
      src: "/images/placeholder/gallery-deep-before.svg", // DUMMY
      alt: "Bathroom tile surfaces before deep cleaning",
      width: 800,
      height: 600
    },
    afterImage: {
      src: "/images/placeholder/gallery-deep-after.svg", // DUMMY
      alt: "Restored bathroom tile surfaces after deep cleaning",
      width: 800,
      height: 600
    },
    isBeforeAfter: true,
    order: 3,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "gallery-post-construction",
    title: "Post Construction", // DUMMY
    caption: "Commercial showroom handover dust removal and floor polishing.", // DUMMY
    serviceId: "post-construction-cleaning",
    serviceName: "Post Construction Cleaning",
    image: {
      src: "/images/placeholder/gallery-construction.svg", // DUMMY
      alt: "Post-construction dust extraction in new Dubai penthouse",
      width: 800,
      height: 600
    },
    order: 4,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "gallery-sofa-carpet",
    title: "Sofa & Carpet Cleaning", // DUMMY
    caption: "Deep steam shampooing of living room sectional sofa and rug.", // DUMMY
    serviceId: "sofa-carpet-cleaning",
    serviceName: "Sofa & Carpet Cleaning",
    image: {
      src: "/images/placeholder/gallery-sofa.svg", // DUMMY
      alt: "Freshly cleaned and sanitized fabric sofa and wool carpet",
      width: 800,
      height: 600
    },
    order: 5,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "gallery-home-cleaning",
    title: "Home Cleaning", // DUMMY
    caption: "Spotless modern kitchen counter and cabinetry sanitization.", // DUMMY
    serviceId: "home-cleaning",
    serviceName: "Home Cleaning",
    image: {
      src: "/images/placeholder/gallery-home.svg", // DUMMY
      alt: "Spotless modern kitchen island and living space in Dubai Hills",
      width: 800,
      height: 600
    },
    order: 6,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "gallery-move-in-out",
    title: "Move In / Move Out", // DUMMY
    caption: "Tenancy transition hallway and parquet floor cleaning before and after.", // DUMMY
    serviceId: "move-in-move-out-cleaning",
    serviceName: "Move In / Move Out Cleaning",
    image: {
      src: "/images/placeholder/gallery-move-after.svg", // DUMMY
      alt: "Empty polished apartment ready for tenant move-in",
      width: 800,
      height: 600
    },
    beforeImage: {
      src: "/images/placeholder/gallery-move-before.svg", // DUMMY
      alt: "Apartment flooring before move-out cleaning",
      width: 800,
      height: 600
    },
    afterImage: {
      src: "/images/placeholder/gallery-move-after.svg", // DUMMY
      alt: "Apartment flooring gleaming after move-out cleaning",
      width: 800,
      height: 600
    },
    isBeforeAfter: true,
    order: 7,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "gallery-commercial-cleaning",
    title: "Commercial Cleaning", // DUMMY
    caption: "Corporate head office recurring sanitization and desk disinfection.", // DUMMY
    serviceId: "office-cleaning",
    serviceName: "Office Cleaning",
    image: {
      src: "/images/placeholder/gallery-commercial.svg", // DUMMY
      alt: "Spotless corporate boardroom and executive desks",
      width: 800,
      height: 600
    },
    order: 8,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  }
];
