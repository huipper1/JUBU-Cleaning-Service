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

import type { ContentRepository } from "@/lib/content/repository";

import { mockAboutData } from "./data/about";
import { mockAreasData } from "./data/areas";
import { mockGalleryData } from "./data/gallery";
import { mockHeroData } from "./data/hero";
import { mockServicesData } from "./data/services";
import { mockSettingsData } from "./data/settings";
import { mockTeamData } from "./data/team";
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
}

export const mockContentRepository = new MockContentRepository();
