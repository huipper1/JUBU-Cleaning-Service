import type {
  AboutContent,
  AboutHighlightItem,
  AreaLandingPage,
  FaqItem,
  FeaturedContentBlock,
  GalleryItem,
  HeroContent,
  ImageItem,
  Service,
  ServiceArea,
  SiteSettings,
  SocialLinkItem,
  TeamMember,
  TrustBadgeItem,
  WhyChooseItem
} from "@/types/content";
import type { TestimonialItem } from "@/types/testimonial";
import type { ContentRepository } from "@/lib/content/repository";
import { prisma } from "@/lib/db/prisma";

export class PrismaContentRepository implements ContentRepository {
  async getSettings(): Promise<SiteSettings> {
    const s = await prisma.siteSettings.findUnique({
      where: { id: "default" }
    });

    if (!s) {
      throw new Error("SiteSettings not found in database. Please run database seed.");
    }

    return {
      businessName: s.businessName,
      tagline: s.tagline,
      badgeText: s.badgeText,
      logo: {
        src: s.logoSrc,
        alt: s.logoAlt,
        width: s.logoWidth,
        height: s.logoHeight
      },
      phone: s.phone,
      phoneDisplay: s.phoneDisplay,
      phoneTel: s.phoneTel,
      whatsapp: s.whatsapp,
      whatsappNumber: s.whatsappNumber,
      whatsappDefaultMessage: s.whatsappDefaultMessage,
      email: s.email,
      address: s.address,
      mapUrl: s.mapUrl,
      workingHours: s.workingHours,
      socialLinks: (s.socialLinks as unknown as SocialLinkItem[]) ?? [],
      defaultSeo: {
        title: s.seoTitle,
        description: s.seoDescription,
        ogImage: s.seoOgImage ?? undefined
      },
      copyrightText: s.copyrightText,
      licence: {
        number: s.licenceNumber,
        legalStructure: s.licenceStructure,
        issuingAuthority: s.licenceAuthority,
        issueDate: s.licenceIssueDate
      }
    };
  }

  async getHero(): Promise<HeroContent> {
    const h = await prisma.heroContent.findUnique({
      where: { id: "default" }
    });

    if (!h) {
      throw new Error("HeroContent not found in database. Please run database seed.");
    }

    return {
      badge: h.badge,
      headline: h.headline,
      subheadline: h.subheadline,
      primaryCta: {
        label: h.primaryCtaLabel,
        href: h.primaryCtaHref
      },
      secondaryCta: {
        label: h.secondaryCtaLabel,
        href: h.secondaryCtaHref
      },
      trustBadges: (h.trustBadges as unknown as TrustBadgeItem[]) ?? [],
      heroImage: {
        src: h.heroImageSrc,
        alt: h.heroImageAlt,
        width: h.heroImageWidth,
        height: h.heroImageHeight
      },
      floatingBadge: h.floatingBadge
    };
  }

  async getServices(): Promise<Service[]> {
    const items = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" }
    });

    return items.map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      shortDescription: s.shortDescription,
      longDescription: s.longDescription ?? undefined,
      icon: s.icon,
      image: {
        src: s.imageSrc,
        alt: s.imageAlt,
        width: s.imageWidth,
        height: s.imageHeight
      },
      order: s.order,
      isActive: s.isActive,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString()
    }));
  }

  async getWhyChoose(): Promise<WhyChooseItem[]> {
    const items = await prisma.whyChooseItem.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" }
    });

    return items.map((w) => ({
      id: w.id,
      title: w.title,
      description: w.description,
      icon: w.icon,
      order: w.order,
      isActive: w.isActive,
      createdAt: w.createdAt.toISOString(),
      updatedAt: w.updatedAt.toISOString()
    }));
  }

  async getAbout(): Promise<AboutContent> {
    const a = await prisma.aboutContent.findUnique({
      where: { id: "default" }
    });

    if (!a) {
      throw new Error("AboutContent not found in database. Please run database seed.");
    }

    return {
      badge: a.badge,
      heading: a.heading,
      paragraphs: a.paragraphs,
      cta: {
        label: a.ctaLabel,
        href: a.ctaHref
      },
      highlights: (a.highlights as unknown as AboutHighlightItem[]) ?? [],
      taglineBadge: a.taglineBadge ?? undefined,
      secondaryBadge: a.secondaryBadge ?? undefined,
      images: (a.images as unknown as ImageItem[]) ?? [],
      equipment: a.equipment
    };
  }

  async getTeam(): Promise<TeamMember[]> {
    const items = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" }
    });

    return items.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      bio: m.bio ?? undefined,
      photo: {
        src: m.photoSrc,
        alt: m.photoAlt,
        width: m.photoWidth,
        height: m.photoHeight
      },
      order: m.order,
      isActive: m.isActive,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString()
    }));
  }

  async getGallery(): Promise<GalleryItem[]> {
    const items = await prisma.galleryItem.findMany({
      where: { isActive: true },
      include: { service: true },
      orderBy: { order: "asc" }
    });

    return items.map((g) => ({
      id: g.id,
      title: g.title,
      caption: g.caption ?? undefined,
      serviceId: g.serviceId,
      serviceName: g.service?.title,
      image: {
        src: g.imageSrc,
        alt: g.imageAlt,
        width: g.imageWidth,
        height: g.imageHeight
      },
      beforeImage: g.beforeImageSrc
        ? {
            src: g.beforeImageSrc,
            alt: g.beforeImageAlt ?? g.title,
            width: g.imageWidth,
            height: g.imageHeight
          }
        : undefined,
      afterImage: g.afterImageSrc
        ? {
            src: g.afterImageSrc,
            alt: g.afterImageAlt ?? g.title,
            width: g.imageWidth,
            height: g.imageHeight
          }
        : undefined,
      isBeforeAfter: g.isBeforeAfter,
      order: g.order,
      isActive: g.isActive,
      createdAt: g.createdAt.toISOString(),
      updatedAt: g.updatedAt.toISOString()
    }));
  }

  async getAreas(): Promise<ServiceArea[]> {
    const items = await prisma.serviceArea.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" }
    });

    return items.map((area) => ({
      id: area.id,
      name: area.name,
      slug: area.slug,
      lat: area.lat ?? undefined,
      lng: area.lng ?? undefined,
      order: area.order,
      isActive: area.isActive,
      createdAt: area.createdAt.toISOString(),
      updatedAt: area.updatedAt.toISOString()
    }));
  }

  async getTestimonials(): Promise<TestimonialItem[]> {
    const items = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" }
    });

    return items.map((t) => ({
      id: t.id,
      name: t.name,
      role: "Client",
      location: t.location,
      avatar: t.avatarSrc ?? "/images/placeholder/avatar.png",
      rating: t.rating,
      review: t.quote,
      service: t.service
    }));
  }

  async getAreaLandingPages(): Promise<AreaLandingPage[]> {
    const pages = await prisma.areaLandingPage.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" }
    });

    return pages.map((p) => this.mapAreaLandingPage(p));
  }

  async getAreaLandingPage(slug: string): Promise<AreaLandingPage | null> {
    const p = await prisma.areaLandingPage.findUnique({
      where: { slug }
    });

    if (!p || !p.isActive) {
      return null;
    }

    return this.mapAreaLandingPage(p);
  }

  private mapAreaLandingPage(p: {
    id: string;
    slug: string;
    areaName: string;
    metaTitle: string;
    metaDescription: string;
    heroHeadline: string;
    heroIntro: string;
    heroImageSrc: string | null;
    heroImageAlt: string | null;
    heroImageWidth: number | null;
    heroImageHeight: number | null;
    servicesSectionTitle: string;
    servicesList: string[];
    featuredBlockTitle: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    featuredBlockText: unknown;
    nearYouTitle: string;
    nearYouText: string;
    finalCtaTitle: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    faqs: unknown;
    isActive: boolean;
    order: number;
  }): AreaLandingPage {
    return {
      id: p.id,
      slug: p.slug,
      areaName: p.areaName,
      metaTitle: p.metaTitle,
      metaDescription: p.metaDescription,
      heroHeadline: p.heroHeadline,
      heroIntro: p.heroIntro,
      heroImage:
        p.heroImageSrc && p.heroImageAlt && p.heroImageWidth && p.heroImageHeight
          ? {
              src: p.heroImageSrc,
              alt: p.heroImageAlt,
              width: p.heroImageWidth,
              height: p.heroImageHeight
            }
          : undefined,
      servicesSectionTitle: p.servicesSectionTitle,
      servicesList: p.servicesList,
      featuredBlockTitle: p.featuredBlockTitle,
      featuredBlockText: p.featuredBlockText as string | FeaturedContentBlock[],
      nearYouTitle: p.nearYouTitle,
      nearYouText: p.nearYouText,
      finalCtaTitle: p.finalCtaTitle,
      faqs: (p.faqs as unknown as FaqItem[]) ?? [],
      isActive: p.isActive,
      order: p.order
    };
  }
}

export const prismaContentRepository = new PrismaContentRepository();
