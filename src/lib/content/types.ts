import { z } from "zod";

import type {
  AboutContent,
  AboutHighlightItem,
  GalleryItem,
  HeroContent,
  ImageItem,
  LinkItem,
  SeoMetadata,
  Service,
  ServiceArea,
  SiteSettings,
  SocialLinkItem,
  TeamMember,
  TradeLicence,
  TrustBadgeItem,
  WhyChooseItem
} from "@/types/content";
import type { CreateLeadInput, Lead, LeadServiceResult, LeadStatus } from "@/types/lead";

// Image Schema
export const imageSchema = z.object({
  src: z.string().min(1, "Image source is required"),
  alt: z.string().min(1, "Image alt text is required"),
  width: z.number().positive(),
  height: z.number().positive()
});

// Link Schema
export const linkSchema = z.object({
  label: z.string().min(1, "Link label is required"),
  href: z.string().min(1, "Link href is required")
});

// Trade Licence Schema
export const tradeLicenceSchema = z.object({
  number: z.string().min(1),
  legalStructure: z.string().min(1),
  issuingAuthority: z.string().min(1),
  issueDate: z.string().min(1)
});

// Social Link Schema
export const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url("Invalid social URL").optional(),
  icon: z.string().min(1)
});

// SEO Metadata Schema
export const seoMetadataSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  ogImage: z.string().optional()
});

// Site Settings Schema
export const siteSettingsSchema = z.object({
  businessName: z.string().min(1),
  tagline: z.string().min(1),
  badgeText: z.string().min(1),
  logo: imageSchema,
  phone: z.string().min(1),
  phoneDisplay: z.string().min(1),
  phoneTel: z.string().min(1),
  whatsapp: z.string().min(1),
  whatsappNumber: z.string().min(1),
  whatsappDefaultMessage: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  mapUrl: z.string().min(1),
  workingHours: z.string().min(1),
  socialLinks: z.array(socialLinkSchema),
  defaultSeo: seoMetadataSchema,
  copyrightText: z.string().min(1),
  licence: tradeLicenceSchema
});

// Trust Badge Schema
export const trustBadgeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().min(1)
});

// Hero Content Schema
export const heroContentSchema = z.object({
  badge: z.string().min(1),
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  primaryCta: linkSchema,
  secondaryCta: linkSchema,
  trustBadges: z.array(trustBadgeSchema),
  heroImage: imageSchema,
  floatingBadge: z.string().min(1)
});

// Service Schema
export const serviceSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  shortDescription: z.string().min(1),
  longDescription: z.string().optional(),
  icon: z.string().min(1),
  image: imageSchema,
  order: z.number().int().nonnegative(),
  isActive: z.boolean(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1)
});

// Why Choose Us Item Schema
export const whyChooseItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  order: z.number().int().nonnegative(),
  isActive: z.boolean(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1)
});

// About Highlight Schema
export const aboutHighlightSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().min(1)
});

// About Content Schema
export const aboutContentSchema = z.object({
  badge: z.string().min(1),
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  cta: linkSchema,
  highlights: z.array(aboutHighlightSchema),
  taglineBadge: z.string().optional(),
  secondaryBadge: z.string().optional(),
  images: z.array(imageSchema).min(1),
  equipment: z.array(z.string().min(1))
});

// Team Member Schema
export const teamMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  photo: imageSchema,
  bio: z.string().optional(),
  order: z.number().int().nonnegative(),
  isActive: z.boolean(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1)
});

// Gallery Item Schema
export const galleryItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  caption: z.string().optional(),
  serviceId: z.string().min(1),
  serviceName: z.string().optional(),
  image: imageSchema,
  beforeImage: imageSchema.optional(),
  afterImage: imageSchema.optional(),
  isBeforeAfter: z.boolean().optional(),
  order: z.number().int().nonnegative(),
  isActive: z.boolean(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1)
});

// Service Area Schema
export const serviceAreaSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  order: z.number().int().nonnegative(),
  isActive: z.boolean(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1)
});

// International phone regex: accepts 7-15 digits, optional +, spaces, dashes, parentheses
export const phoneRegex = /^[+]?[\d\s\-().]{7,20}$/;

// Lead Creation Input Schema (for Lead Form and /api/lead)
export const createLeadInputSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(60, "Full name must be under 60 characters"),
  mobile: z
    .string()
    .min(7, "Mobile number is required")
    .transform((val) => val.replace(/[\s\-()\u200e]/g, ""))
    .refine((val) => phoneRegex.test(val), {
      message: "Please enter a valid mobile number"
    }),
  whatsappNumber: z
    .string()
    .max(20, "WhatsApp number is too long")
    .optional()
    .or(z.literal("")),
  serviceId: z.string().min(1, "Please select a cleaning service"),
  location: z
    .string()
    .max(120, "Location must be under 120 characters")
    .optional()
    .or(z.literal("")),
  propertyType: z
    .enum(["apartment", "villa", "office", "shop", "other", ""])
    .optional(),
  preferredDate: z
    .string()
    .max(30, "Preferred date is too long")
    .optional()
    .or(z.literal("")),
  message: z.string().max(1000, "Message is too long").optional(),
  whatsappOptIn: z.boolean().default(true),
  honeypot: z.string().max(0, "Bot detected").optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  fbclid: z.string().optional(),
  landingUrl: z.string().optional()
});

// Export inferred types and interfaces
export type {
  AboutContent,
  AboutHighlightItem,
  CreateLeadInput,
  GalleryItem,
  HeroContent,
  ImageItem,
  Lead,
  LeadServiceResult,
  LeadStatus,
  LinkItem,
  SeoMetadata,
  Service,
  ServiceArea,
  SiteSettings,
  SocialLinkItem,
  TeamMember,
  TradeLicence,
  TrustBadgeItem,
  WhyChooseItem
};
