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

import type { ContentRepository } from "@/lib/content/repository";

import { mockAboutData } from "./data/about";
import { mockAreaLandingPagesData } from "./data/area-landing-pages";
import { mockAreasData } from "./data/areas";
import { mockBlogPostsData } from "./data/blog";
import { mockGalleryData } from "./data/gallery";
import { mockHeroData } from "./data/hero";
import { mockServicesData } from "./data/services";
import { mockSettingsData } from "./data/settings";
import { mockTeamData } from "./data/team";
import { mockTestimonialsData } from "./data/testimonials";
import { mockWhyChooseData } from "./data/why-choose";

export class MockContentRepository implements ContentRepository {
  async getSettings(): Promise<SiteSettings> {
    return Promise.resolve(mockSettingsData);
  }

  async getHero(): Promise<HeroContent> {
    return Promise.resolve(mockHeroData);
  }

  async getServices(): Promise<Service[]> {
    return Promise.resolve(
      mockServicesData.filter((s) => s.isActive).sort((a, b) => a.order - b.order)
    );
  }

  async getWhyChoose(): Promise<WhyChooseItem[]> {
    return Promise.resolve(
      mockWhyChooseData.filter((item) => item.isActive).sort((a, b) => a.order - b.order)
    );
  }

  async getAbout(): Promise<AboutContent> {
    return Promise.resolve(mockAboutData);
  }

  async getTeam(): Promise<TeamMember[]> {
    return Promise.resolve(
      mockTeamData.filter((m) => m.isActive).sort((a, b) => a.order - b.order)
    );
  }

  async getGallery(): Promise<GalleryItem[]> {
    return Promise.resolve(
      mockGalleryData.filter((item) => item.isActive).sort((a, b) => a.order - b.order)
    );
  }

  async getAreas(): Promise<ServiceArea[]> {
    return Promise.resolve(
      mockAreasData.filter((a) => a.isActive).sort((a, b) => a.order - b.order)
    );
  }

  async getTestimonials(): Promise<import("@/types/testimonial").TestimonialItem[]> {
    return Promise.resolve(mockTestimonialsData);
  }

  async getAreaLandingPages(): Promise<AreaLandingPage[]> {
    return Promise.resolve(
      mockAreaLandingPagesData.filter((page) => page.isActive).sort((a, b) => a.order - b.order)
    );
  }

  async getAreaLandingPage(slug: string): Promise<AreaLandingPage | null> {
    const page = mockAreaLandingPagesData.find((p) => p.slug === slug && p.isActive);
    return Promise.resolve(page ?? null);
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return Promise.resolve(
      mockBlogPostsData
        .filter((post) => post.status === "PUBLISHED")
        .sort(
          (a, b) =>
            new Date(b.publishedAt || b.createdAt).getTime() -
            new Date(a.publishedAt || a.createdAt).getTime()
        )
    );
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const post = mockBlogPostsData.find((p) => p.slug === slug && p.status === "PUBLISHED");
    return Promise.resolve(post ?? null);
  }

  async getRecentBlogPosts(limit = 3): Promise<BlogPost[]> {
    return Promise.resolve(
      mockBlogPostsData
        .filter((post) => post.status === "PUBLISHED")
        .sort(
          (a, b) =>
            new Date(b.publishedAt || b.createdAt).getTime() -
            new Date(a.publishedAt || a.createdAt).getTime()
        )
        .slice(0, limit)
    );
  }
}

export const mockContentRepository = new MockContentRepository();
