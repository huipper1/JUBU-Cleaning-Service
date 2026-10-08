import type {
  AboutContent,
  AboutHighlightItem,
  AreaGalleryItem,
  AreaLandingPage,
  BlogPost,
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

import { mockAboutData } from "../mock/data/about";
import { mockHeroData } from "../mock/data/hero";
import { mockSettingsData } from "../mock/data/settings";

export class PrismaContentRepository implements ContentRepository {
  async getSettings(): Promise<SiteSettings> {
    const s = await prisma.siteSettings.findUnique({
      where: { id: "default" }
    });

    if (!s) {
      return mockSettingsData;
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
      },
      showHero: s.showHero,
      showServices: s.showServices,
      showWhyChoose: s.showWhyChoose,
      showAbout: s.showAbout,
      showTeam: s.showTeam,
      showGallery: s.showGallery,
      showQuote: s.showQuote,
      showAreas: s.showAreas,
      showContact: s.showContact,
      homepageServiceIds: s.homepageServiceIds ?? [],
      gtmId: s.gtmId ?? "",
      gaId: s.gaId ?? "",
      bankName: s.bankName ?? undefined,
      bankIban: s.bankIban ?? undefined,
      bankAccountNumber: s.bankAccountNumber ?? undefined,
      bankSwiftCode: s.bankSwiftCode ?? undefined,
      bankRoutingNumber: s.bankRoutingNumber ?? undefined,
      bankAccountOpeningDate: s.bankAccountOpeningDate ?? undefined
    };
  }

  async getHero(): Promise<HeroContent> {
    const h = await prisma.heroContent.findUnique({
      where: { id: "default" }
    });

    if (!h) {
      return mockHeroData;
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
      basePrice: s.basePrice ?? 199,
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
      return mockAboutData;
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
    serviceIds?: string[];
    customGallery?: unknown;
    featuredBlockTitle: string;
    featuredBlockText: unknown;
    nearYouTitle: string;
    nearYouText: string;
    finalCtaTitle: string;
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
      serviceIds: p.serviceIds ?? [],
      customGallery: (p.customGallery as AreaGalleryItem[]) ?? [],
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

  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT * FROM "BlogPost" WHERE "status" = 'PUBLISHED' ORDER BY "publishedAt" DESC NULLS LAST, "createdAt" DESC`
      );
      return rows.map(this.mapBlogPost);
    } catch {
      return [];
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT * FROM "BlogPost" WHERE "slug" = $1 AND "status" = 'PUBLISHED' LIMIT 1`,
        slug
      );
      if (!rows || rows.length === 0) return null;
      return this.mapBlogPost(rows[0]);
    } catch {
      return null;
    }
  }

  async getRecentBlogPosts(limit = 3): Promise<BlogPost[]> {
    try {
      const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT * FROM "BlogPost" WHERE "status" = 'PUBLISHED' ORDER BY "publishedAt" DESC NULLS LAST, "createdAt" DESC LIMIT $1`,
        limit
      );
      return rows.map(this.mapBlogPost);
    } catch {
      return [];
    }
  }

  private mapBlogPost(row: Record<string, unknown>): BlogPost {
    return {
      id: String(row.id),
      title: String(row.title),
      slug: String(row.slug),
      excerpt: String(row.excerpt),
      content: String(row.content),
      coverImage: String(row.coverImage),
      coverImageAlt: String(row.coverImageAlt || row.title),
      category: String(row.category || "Cleaning Tips"),
      tags: Array.isArray(row.tags) ? row.tags : [],
      author: String(row.author || "JUBU Expert Team"),
      authorRole: row.authorRole ? String(row.authorRole) : undefined,
      status: row.status as "DRAFT" | "PUBLISHED",
      publishedAt: row.publishedAt ? new Date(String(row.publishedAt)).toISOString() : undefined,
      readTime: row.readTime ? String(row.readTime) : "5 min read",
      metaTitle: row.metaTitle ? String(row.metaTitle) : undefined,
      metaDescription: row.metaDescription ? String(row.metaDescription) : undefined,
      order: Number(row.order ?? 0),
      createdAt: new Date(String(row.createdAt)).toISOString(),
      updatedAt: new Date(String(row.updatedAt)).toISOString()
    };
  }
}

export const prismaContentRepository = new PrismaContentRepository();
