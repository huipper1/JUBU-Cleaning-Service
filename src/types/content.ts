export interface ImageItem {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface TradeLicence {
  number: string;
  legalStructure: string;
  issuingAuthority: string;
  issueDate: string;
}

export interface SocialLinkItem {
  platform: string;
  url?: string;
  icon: string;
}

export interface SeoMetadata {
  title: string;
  description: string;
  ogImage?: string;
}

export interface SiteSettings {
  businessName: string;
  tagline: string;
  badgeText: string;
  logo: ImageItem;
  phone: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsapp: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  email: string;
  address: string;
  mapUrl: string;
  workingHours: string;
  socialLinks: SocialLinkItem[];
  defaultSeo: SeoMetadata;
  copyrightText: string;
  licence: TradeLicence;
  showHero?: boolean;
  showServices?: boolean;
  showWhyChoose?: boolean;
  showAbout?: boolean;
  showTeam?: boolean;
  showGallery?: boolean;
  showQuote?: boolean;
  showAreas?: boolean;
  showContact?: boolean;
}

export interface TrustBadgeItem {
  id: string;
  label: string;
  icon: string;
}

export interface HeroContent {
  badge: string;
  headline: string;
  subheadline: string;
  primaryCta: LinkItem;
  secondaryCta: LinkItem;
  trustBadges: TrustBadgeItem[];
  heroImage: ImageItem;
  floatingBadge: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription?: string;
  icon: string;
  image: ImageItem;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AboutHighlightItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
}

export interface AboutContent {
  badge: string;
  heading: string;
  paragraphs: string[];
  cta: LinkItem;
  highlights: AboutHighlightItem[];
  taglineBadge?: string;
  secondaryBadge?: string;
  images: ImageItem[];
  equipment: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: ImageItem;
  bio?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption?: string;
  serviceId: string;
  serviceName?: string;
  image: ImageItem;
  beforeImage?: ImageItem;
  afterImage?: ImageItem;
  isBeforeAfter?: boolean;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceArea {
  id: string;
  name: string;
  slug: string;
  lat?: number;
  lng?: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FeaturedContentBlock {
  title: string;
  text: string;
}

export interface AreaLandingPage {
  id: string;
  slug: string;
  areaName: string;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroIntro: string;
  heroImage?: ImageItem;
  servicesSectionTitle: string;
  servicesList?: string[];
  featuredBlockTitle: string;
  featuredBlockText: string | FeaturedContentBlock[];
  nearYouTitle: string;
  nearYouText: string;
  finalCtaTitle: string;
  faqs: FaqItem[];
  isActive: boolean;
  order: number;
}

