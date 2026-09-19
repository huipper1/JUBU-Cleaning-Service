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
      src: "/images/placeholder/gallery-home.png", // DUMMY
      alt: "Pristine luxury villa cleaned by JUBU in Dubai",
      width: 500,
      height: 500
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
      src: "/images/placeholder/gallery-office.png", // DUMMY
      alt: "Clean modern open plan office in Business Bay",
      width: 500,
      height: 500
    },
    order: 2,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "gallery-deep-cleaning",
    title: "Deep Cleaning", // DUMMY
    caption: "Intensive deep cleaning and sanitization for healthier spaces.", // DUMMY
    serviceId: "deep-cleaning",
    serviceName: "Deep Cleaning",
    image: {
      src: "/images/placeholder/gallery-deep-cleaning.png", // DUMMY
      alt: "Deep cleaning for healthier and fresher environment",
      width: 500,
      height: 500
    },
    beforeImage: {
      src: "/images/placeholder/gallery-deep-cleaning.png", // DUMMY
      alt: "Surfaces before deep cleaning",
      width: 500,
      height: 500
    },
    afterImage: {
      src: "/images/placeholder/gallery-deep-cleaning.png", // DUMMY
      alt: "Restored pristine surfaces after deep cleaning",
      width: 500,
      height: 500
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
      src: "/images/placeholder/gallery-construction.png", // DUMMY
      alt: "Post-construction dust extraction in new Dubai property",
      width: 500,
      height: 500
    },
    order: 4,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "gallery-sofa-carpet",
    title: "Sofa & Carpet Cleaning", // DUMMY
    caption: "Deep steam shampooing of living room sectional sofa and upholstery.", // DUMMY
    serviceId: "sofa-carpet-cleaning",
    serviceName: "Sofa & Carpet Cleaning",
    image: {
      src: "/images/placeholder/gallery-sofa.png", // DUMMY
      alt: "Freshly cleaned and sanitized fabric sofa and upholstery",
      width: 500,
      height: 500
    },
    order: 5,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "gallery-home-cleaning",
    title: "Home Cleaning", // DUMMY
    caption: "Spotless modern living room and apartment sanitization in Dubai.", // DUMMY
    serviceId: "home-cleaning",
    serviceName: "Home Cleaning",
    image: {
      src: "/images/placeholder/gallery-home.png", // DUMMY
      alt: "Spotless modern living space in Dubai",
      width: 500,
      height: 500
    },
    order: 6,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "gallery-move-in-out",
    title: "Move In / Move Out", // DUMMY
    caption: "Tenancy transition handover cleaning for a stress-free move.", // DUMMY
    serviceId: "move-in-move-out-cleaning",
    serviceName: "Move In / Move Out Cleaning",
    image: {
      src: "/images/placeholder/gallery-move.png", // DUMMY
      alt: "Empty polished apartment ready for tenant move-in",
      width: 500,
      height: 500
    },
    beforeImage: {
      src: "/images/placeholder/gallery-move.png", // DUMMY
      alt: "Apartment before move-out cleaning",
      width: 500,
      height: 500
    },
    afterImage: {
      src: "/images/placeholder/gallery-move.png", // DUMMY
      alt: "Apartment gleaming after move-out cleaning",
      width: 500,
      height: 500
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
      src: "/images/placeholder/gallery-office.png", // DUMMY
      alt: "Spotless corporate office workspaces",
      width: 500,
      height: 500
    },
    order: 8,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  }
];
