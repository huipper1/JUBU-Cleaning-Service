import type {
  AboutContent,
  AreaLandingPage,
  BlogPost,
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
  getAreaLandingPages(): Promise<AreaLandingPage[]>;
  getAreaLandingPage(slug: string): Promise<AreaLandingPage | null>;
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | null>;
  getRecentBlogPosts(limit?: number): Promise<BlogPost[]>;
}
