import type {
  AboutContent,
  GalleryItem,
  HeroContent,
  Service,
  ServiceArea,
  SiteSettings,
  TeamMember,
  WhyChooseItem
} from "@/types/content";

export interface ContentRepository {
  getSettings(): Promise<SiteSettings>;
  getHero(): Promise<HeroContent>;
  getServices(): Promise<Service[]>;
  getWhyChoose(): Promise<WhyChooseItem[]>;
  getAbout(): Promise<AboutContent>;
  getTeam(): Promise<TeamMember[]>;
  getGallery(): Promise<GalleryItem[]>;
  getAreas(): Promise<ServiceArea[]>;
  getTestimonials(): Promise<import("@/types/testimonial").TestimonialItem[]>;
}
