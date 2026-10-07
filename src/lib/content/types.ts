import { z } from "zod";

import type {
  AboutContent,
  AboutHighlightItem,
  AreaLandingPage,
  FaqItem,
  FeaturedContentBlock,
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
  licence: tradeLicenceSchema,
  gtmId: z.string().optional(),
  gaId: z.string().optional(),
  bankName: z.string().optional(),
  bankIban: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankSwiftCode: z.string().optional(),
  bankRoutingNumber: z.string().optional(),
  bankAccountOpeningDate: z.string().optional()
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
  basePrice: z.number().positive().optional(),
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

// FAQ Item Schema
export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1)
});

// Featured Content Block Schema
export const featuredContentBlockSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1)
});

// Area Landing Page Schema
export const areaLandingPageSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  areaName: z.string().min(1),
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  heroHeadline: z.string().min(1),
  heroIntro: z.string().min(1),
  heroImage: imageSchema.optional(),
  servicesSectionTitle: z.string().min(1),
  servicesList: z.array(z.string().min(1)).optional(),
  featuredBlockTitle: z.string().min(1),
  featuredBlockText: z.union([z.string().min(1), z.array(featuredContentBlockSchema).min(1)]),
  nearYouTitle: z.string().min(1),
  nearYouText: z.string().min(1),
  finalCtaTitle: z.string().min(1),
  faqs: z.array(faqItemSchema),
  isActive: z.boolean(),
  order: z.number().int().nonnegative()
});

// UAE Mobile Number regex: allows 05x, 5x, or +9715x / 009715x followed by 7 digits
// e.g., 0501234567, 501234567, +971542995191
export function isValidUaeMobile(val: string): boolean {
  if (!val) return false;
  const digits = val.replace(/\D/g, "");
  // If starts with 9715 (country code + 5x): total length must be 11 digits (971 + 5 + 7 digits)
  if (digits.startsWith("9715") && digits.length === 12) return true;
  // If local format starting with 05: total 10 digits (050xxxxxxx ... 058xxxxxxx)
  if (/^05[024568]\d{7}$/.test(digits)) return true;
  // If local format starting with 5 (without 0): total 9 digits (50xxxxxxx ... 58xxxxxxx)
  if (/^5[024568]\d{7}$/.test(digits)) return true;
  // If with country code: 971 5[024568] + 7 digits (total 12 digits)
  if (/^9715[024568]\d{7}$/.test(digits)) return true;
  return false;
}

// Global / International WhatsApp validator:
// Accepts UAE format OR international E.164 (8-15 digits starting with + or valid country code)
export function isValidWhatsAppNumber(val: string): boolean {
  if (!val || val.trim() === "") return true; // optional
  const digits = val.replace(/\D/g, "");
  // Must have between 8 and 15 digits
  if (digits.length < 8 || digits.length > 15) return false;
  // Disallow obvious fake repeated/consecutive patterns like 11111111 or 12345678
  if (/^(\d)\1+$/.test(digits)) return false;
  return true;
}

// Lead Creation Input Schema (for Lead Form and /api/lead)
export const createLeadInputSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(60, "Full name must be under 60 characters"),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .refine((val) => isValidUaeMobile(val), {
      message: "Please enter a valid UAE mobile number (e.g. 054 299 5191 or 50 123 4567)"
    }),
  whatsappNumber: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || isValidWhatsAppNumber(val), {
      message: "Please enter a valid WhatsApp number with country code (e.g. +44... or 05x...)"
    }),
  serviceId: z.string().min(1, "Please select a cleaning service"),
  location: z
    .string()
    .trim()
    .min(1, "Please enter your location or area")
    .max(120, "Location must be under 120 characters"),
  propertyType: z.enum(["apartment", "villa", "office", "shop", "other"], {
    message: "Please select your property type"
  }),
  preferredDate: z
    .string()
    .trim()
    .min(1, "Please select a preferred date")
    .max(30, "Preferred date is too long"),
  preferredTime: z
    .string()
    .trim()
    .min(1, "Please select a preferred time")
    .max(30, "Preferred time is too long"),
  message: z
    .string()
    .trim()
    .min(1, "Please provide additional details about your cleaning requirements")
    .max(1000, "Message is too long"),
  whatsappOptIn: z.boolean().default(true),
  honeypot: z.string().max(0, "Bot detected").optional(),
  sourceArea: z.string().optional(),

  // Booking & Payment Information
  requestType: z.enum(["quote", "booking"]).default("quote"),
  paymentMethod: z.enum(["cash", "bank_transfer"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "cash_on_delivery", "cancelled"]).optional(),
  amount: z.number().positive().optional(),
  currency: z.string().default("AED").optional(),
  transactionRef: z.string().max(120).optional(),
  bankDetails: z.record(z.string(), z.unknown()).optional(),

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
  AreaLandingPage,
  CreateLeadInput,
  FaqItem,
  FeaturedContentBlock,
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
