# JUBU Cleaning Service: Supabase & Prisma CMS Implementation Plan

> **Goal:** Build an administrative dashboard and headless CMS layer backed by Supabase (Postgres, Auth, Storage) and Prisma ORM within this existing Next.js App Router repository, enabling the business owner to manage website copy, services, media assets, service areas, landing pages, team profiles, and customer leads directly without code edits or developer intervention.
>
> **Scope of this stage:** Architecture, data modeling, storage design with image cropping/aspect ratio enforcement, authentication, admin UI, revalidation mechanics, seed scripts, migration strategy, and phased delivery roadmap. No public frontend sections or visual layouts will be disrupted.
>
> **Companion Document:** Complements [`PLAN.md`](file:///c:/New%20folder/JUBU-Cleaning-Service/PLAN.md) (Frontend Foundation & Section Architecture). Adheres to all workspace standards set out in [`AGENTS.md`](file:///c:/New%20folder/JUBU-Cleaning-Service/AGENTS.md).

---

## 1. Decisions & Architectural Rationale

| Topic | Decision | Details & Justification |
| :--- | :--- | :--- |
| **Architecture** | **Unified Next.js Monorepo (App Router)** | Admin dashboard lives directly in the same Next.js repository under `src/app/admin/*`. Public site and admin share data contracts, Zod schemas, Tailwind tokens, and Prisma models. Zero secondary deployment pipelines or microservices. |
| **Database & Auth** | **Supabase Postgres + Supabase Auth** | Managed Postgres database with connection pooling, built-in GoTrue auth engine for administrative credentials, session cookies, and JWT handling. |
| **Data Access Layer** | **Prisma Client (`PrismaContentRepository` & `PrismaLeadService`)** | Provides compile-time TypeScript type safety, automated migrations (`prisma migrate`), relational model validations, and IDE autocomplete. Satisfies existing [`ContentRepository`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/repository.ts) and [`LeadService`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/leads/lead-service.ts) interfaces seamlessly. Section components remain 100% untouched. |
| **Security & RLS** | **Server-Only Access Architecture (Recommended)** | Direct database connections from Next.js server components, server actions, and route handlers execute via Prisma using elevated connection strings (`DATABASE_URL`). Postgres tables are kept internal (`REST` disabled on public schema). Supabase client-side access is restricted strictly to Auth and direct Storage uploads. |
| **Connection Pooling** | **Transaction Pooler (Supabase Supavisor / PgBouncer Port 6543)** | Serverless/edge Next.js environments spawn ephemeral instances. Prisma will connect to Supabase via pooled connection string (`?pgbouncer=true` / transaction mode) for runtime queries, and use `DIRECT_URL` (direct port 5432) for `prisma migrate`. |
| **Publishing Workflow** | **Direct Publish + Cache Revalidation** | Changes saved in the admin immediately update database records and trigger on-demand tag revalidation (`revalidateTag`). No draft/preview complexity needed for a single business owner. |
| **Lead Routing** | **Dual Pipeline (WhatsApp Redirect + DB Inbox)** | Quote requests preserve instant WhatsApp conversation redirect for customers while asynchronously persisting to Supabase Postgres via `PrismaLeadService` for admin inbox triage. No email notification overhead. |
| **Image Management** | **Direct Supabase Storage with Admin Cropper & Aspect Ratio Locking** | Uploads happen directly from browser to Supabase Storage via `@supabase/supabase-js`. Admin UI provides an interactive modal cropper enforcing exact section ratios before upload. Public URLs saved in Prisma. |
| **Role Modeling** | **Single Admin with Extensible Enum** | Single administrative account initially (`role: ADMIN`), modeled with an extensible enum in database for future expansion (`EDITOR`, `STAFF`) without schema rebuilds. |

### 1.1 Tradeoff Analysis: Row Level Security (RLS) vs. Server-Only Access

In Supabase, two data access patterns exist:

1. **Client-Facing RLS Pattern (PostgREST / Supabase JS API):**
   - The browser directly queries Postgres tables using the anonymous key (`anonKey`). Postgres policies (`CREATE POLICY`) evaluate every row based on `auth.uid()`.
   - *Downside:* Duplicates business validation logic between TypeScript and SQL, complicates relational joins, and bypasses Prisma ORM's typed client.
2. **Server-Only Access via Prisma (Recommended & Selected):**
   - Database operations are restricted to Next.js Server Components, Server Actions, and Route Handlers using Prisma Client.
   - Connections use `DATABASE_URL` (which uses Postgres service credentials / direct connection string). Public access via PostgREST is disabled or locked down with a default deny (`ALTER TABLE "..." ENABLE ROW LEVEL SECURITY;` with no public policies).
   - Authentication is strictly checked at the Next.js boundary via Middleware (`src/middleware.ts`) and Server Action session validation using `@supabase/ssr`.
   - *Advantage:* Full TypeScript type inference, zero policy maintenance overhead in SQL, immune to client-side data scraping, and complete reuse of existing Zod schemas.

---

## 2. Prisma Data Models & Schema Design

File: `prisma/schema.prisma`

All models map directly to the existing content contracts defined in [`src/lib/content/types.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/types.ts) and [`src/types/content.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/types/content.ts).

### 2.1 Complete Prisma Schema (`prisma/schema.prisma`)

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

// -------------------------------------------------------------
// ENUMS
// -------------------------------------------------------------

enum AdminRole {
  ADMIN
  EDITOR
  STAFF
}

enum LeadStatus {
  pending
  contacted
  closed
}

// -------------------------------------------------------------
// AUTH & ADMIN MODELS
// -------------------------------------------------------------

model AdminUser {
  id           String    @id @default(cuid())
  supabaseUid  String    @unique // Maps 1:1 with auth.users.id in Supabase Auth
  email        String    @unique
  fullName     String
  role         AdminRole @default(ADMIN)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@index([supabaseUid])
}

// -------------------------------------------------------------
// SINGLETON CONFIGURATION ENTITIES
// Enforced via fixed ID "default" in repository & DB constraint
// -------------------------------------------------------------

model SiteSettings {
  id                      String   @id @default("default")
  businessName            String   @default("JUBU Cleaning Service")
  tagline                 String   @default("Cleaner Spaces, Brighter Lives")
  badgeText               String   @default("Licensed Cleaning Services in Dubai")
  
  // Embedded Logo
  logoSrc                 String   @default("/images/logo.png")
  logoAlt                 String   @default("JUBU Cleaning Service Logo")
  logoWidth               Int      @default(180)
  logoHeight              Int      @default(60)

  phone                   String   @default("+971 54 299 5191")
  phoneDisplay            String   @default("+971 54 299 5191")
  phoneTel                String   @default("+971542995191")
  whatsapp                String   @default("+971 54 299 5191")
  whatsappNumber          String   @default("971542995191")
  whatsappDefaultMessage  String   @default("Hello JUBU Cleaning Service, I would like to inquire about a free quote for your cleaning services in Dubai.")
  email                   String   @default("sajibulislam679@gmail.com")
  address                 String   @default("Setadel Building, Office # 201, Al Quoz-4, Dubai, United Arab Emirates")
  mapUrl                  String   @default("https://www.google.com/maps/search/?api=1&query=Setadel+Building+Al+Quoz+4+Dubai")
  workingHours            String   @default("Sat to Thu, 8:00 AM - 8:00 PM")

  // Social Links JSON: Array of { platform: string, url: string, icon: string }
  socialLinks             Json     @default("[]")

  // SEO Metadata
  seoTitle                String   @default("JUBU Cleaning Service | Professional Cleaning Company in Dubai")
  seoDescription          String   @default("Licensed Dubai cleaning company providing deep cleaning, residential cleaning, office cleaning, and move-in sanitization across Dubai.")
  seoOgImage              String?  @default("/images/logo.png")

  copyrightText           String   @default("© 2026 JUBU Cleaning Service LLC. All rights reserved.")

  // Trade Licence
  licenceNumber           String   @default("1026183")
  licenceStructure        String   @default("Limited Liability Company (LLC)")
  licenceAuthority        String   @default("Dubai Department of Economy and Tourism (DET)")
  licenceIssueDate        String   @default("25 January 2022")

  updatedAt               DateTime @updatedAt
}

model HeroContent {
  id             String   @id @default("default")
  badge          String   @default("Professional Cleaning Services in Dubai")
  headline       String   @default("Professional Cleaning Services in Dubai")
  subheadline    String   @default("Home, Villa, Office, Deep Cleaning & Post-Construction Cleaning. Reliable service with professional equipment.")
  
  primaryCtaLabel   String @default("Get a Free Quote")
  primaryCtaHref    String @default("#quote")
  secondaryCtaLabel String @default("WhatsApp Us")
  secondaryCtaHref  String @default("https://wa.me/971542995191")

  // Trust Badges JSON: Array of { id: string, label: string, icon: string }
  trustBadges    Json     @default("[]")

  // Hero Cutout Image
  heroImageSrc   String   @default("/images/placeholder/hero-cleaner.png")
  heroImageAlt   String   @default("JUBU Professional Cleaner in uniform with spray bottle and cloth")
  heroImageWidth  Int      @default(800)
  heroImageHeight Int      @default(950)

  floatingBadge  String   @default("Cleaner Spaces Brighter Lives")
  updatedAt      DateTime @updatedAt
}

model AboutContent {
  id             String   @id @default("default")
  badge          String   @default("ABOUT JUBU CLEANING SERVICE")
  heading        String   @default("Professional Cleaning in Dubai")
  paragraphs     String[] // Postgres text array
  ctaLabel       String   @default("Get a Free Quote")
  ctaHref        String   @default("#quote")
  
  // Highlights JSON: Array of { id: string, title: string, description?: string, icon: string }
  highlights     Json     @default("[]")

  taglineBadge   String?  @default("Quality Cleaning")
  secondaryBadge String?  @default("Verified Equipment")

  // Images JSON: Array of ImageItem { src, alt, width, height }
  images         Json     @default("[]")

  // Equipment Checklist Array
  equipment      String[]

  updatedAt      DateTime @updatedAt
}

// -------------------------------------------------------------
// COLLECTION LIST ENTITIES
// -------------------------------------------------------------

model Service {
  id               String        @id // e.g. "home-cleaning"
  slug             String        @unique // e.g. "home-cleaning"
  title            String
  shortDescription String
  longDescription  String?
  icon             String        // lucide icon identifier
  
  imageSrc         String
  imageAlt         String
  imageWidth       Int           @default(800)
  imageHeight      Int           @default(600)

  order            Int           @default(0)
  isActive         Boolean       @default(true)
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  galleryItems     GalleryItem[]

  @@index([isActive, order])
}

model WhyChooseItem {
  id          String   @id // e.g. "trained-team"
  title       String
  description String
  icon        String   // icon identifier
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([isActive, order])
}

model TeamMember {
  id        String   @id @default(cuid())
  name      String
  role      String
  bio       String?
  
  photoSrc  String
  photoAlt  String
  photoWidth Int     @default(400)
  photoHeight Int    @default(400)

  order     Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([isActive, order])
}

model GalleryItem {
  id            String   @id @default(cuid())
  title         String
  caption       String?
  serviceId     String
  service       Service  @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  
  imageSrc      String
  imageAlt      String
  imageWidth    Int      @default(800)
  imageHeight   Int      @default(600)

  beforeImageSrc String?
  beforeImageAlt String?
  afterImageSrc  String?
  afterImageAlt  String?
  isBeforeAfter Boolean  @default(false)

  order         Int      @default(0)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([serviceId])
  @@index([isActive, order])
}

model ServiceArea {
  id        String   @id // e.g. "business-bay"
  name      String   // e.g. "Business Bay"
  slug      String   @unique
  lat       Float?
  lng       Float?
  order     Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([isActive, order])
}

model AreaLandingPage {
  id                   String   @id // matches slug, e.g. "business-bay"
  slug                 String   @unique
  areaName             String   // "Business Bay"
  metaTitle            String
  metaDescription      String
  heroHeadline         String
  heroIntro            String
  
  heroImageSrc         String?
  heroImageAlt         String?
  heroImageWidth       Int?
  heroImageHeight      Int?

  servicesSectionTitle String
  servicesList         String[] // Descriptive bullet strings

  featuredBlockTitle   String
  // Stored as JSON: string | Array<{ title: string, text: string }>
  featuredBlockText    Json

  nearYouTitle         String
  nearYouText          String
  finalCtaTitle        String

  // FAQs JSON: Array<{ question: string, answer: string }>
  faqs                 Json

  order                Int      @default(0)
  isActive             Boolean  @default(true)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  @@index([isActive, order])
}

model Testimonial {
  id         String   @id @default(cuid())
  name       String
  location   String
  service    String
  rating     Int      @default(5)
  quote      String
  avatarSrc  String?
  order      Int      @default(0)
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([isActive, order])
}

// -------------------------------------------------------------
// LEAD MANAGEMENT
// -------------------------------------------------------------

model Lead {
  id             String     @id @default(cuid())
  fullName       String
  mobile         String
  whatsappNumber String?
  serviceId      String
  location       String?
  propertyType   String?
  preferredDate  String?
  message        String?
  whatsappOptIn  Boolean    @default(true)
  sourceArea     String?    @default("main-page")
  
  // Campaign & Tracking
  utmSource      String?
  utmMedium      String?
  utmCampaign    String?
  utmContent     String?
  fbclid         String?
  landingUrl     String?

  status         LeadStatus @default(pending)
  adminNotes     String?    // Internal CRM remarks
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  @@index([status, createdAt])
  @@index([sourceArea])
  @@index([serviceId])
}
```

---

## 3. Storage Architecture & Image Optimization

### 3.1 Bucket Hierarchy & Permissions

Supabase Storage will host all uploaded assets in a single public bucket named `cms-media`:

```
cms-media/
  ├── branding/     (logos, favicons, site badges)
  ├── hero/         (cutout transparent PNGs, hero banners)
  ├── services/     (service split cards)
  ├── gallery/      (portfolio jobs & before/after comparisons)
  ├── team/         (staff portraits)
  └── areas/        (area landing page banners)
```

- **Bucket Policy:** Public read (`SELECT` allowed for all users/anons). Write/Update/Delete (`INSERT`, `UPDATE`, `DELETE`) restricted strictly to authenticated users with role `authenticated`.
- **CDN Caching:** Default Cache-Control header `max-age=31536000, public, immutable`.

### 3.2 Upload & Interactive Cropper Workflow

Per user requirement, administrators must be able to crop and resize images to the required aspect ratio before upload:

```mermaid
graph TD
    A[Admin Selects Image File] --> B[Client-side Aspect Ratio Modal]
    B -->|Aspect Ratio Enforced| C[HTML5 Canvas Crop & Compression]
    C -->|Optimized WebP Blob| D[Supabase Storage Direct Upload]
    D -->|Returns Public URL| E[Write Image Object to Prisma DB]
    E --> F[Next.js Image Component Renders with Responsive Srcset]
```

1. **Section Aspect Ratio Constraints:**
   - **Hero Cutout:** Transparent WebP/PNG, max width 1000px (unconstrained vertical ratio).
   - **Services:** `4:3` aspect ratio (minimum 800x600px).
   - **Team:** `1:1` square aspect ratio (minimum 500x500px).
   - **Gallery & Before/After:** `4:3` aspect ratio (minimum 1200x900px).
   - **Branding / Logo:** PNG/SVG with transparency preserved.
2. **Implementation:**
   - UI primitive `ImageCropperModal.tsx` using `react-image-crop` or canvas-based crop tool.
   - Client-side compression via browser native `canvas.toBlob("image/webp", 0.85)`.
   - Direct browser upload to Supabase Storage via `supabase.storage.from('cms-media').upload(path, fileBlob)`.
   - Resulting CDN URL string stored in Prisma along with width, height, and user-defined `alt` text.

---

## 4. Authentication & Security Design

### 4.1 Supabase Auth with Cookie Sessions

- **Authentication Provider:** Supabase Auth (email + password).
- **Session Transport:** Managed via `@supabase/ssr` with HttpOnly, Secure, SameSite cookies.
- **Middleware Guard (`src/middleware.ts`):**
  - Intercepts all requests matching `/admin/:path*` (except `/admin/login`).
  - Calls `supabase.auth.getUser()`. If unauthenticated or token expired, redirects immediately to `/admin/login?redirect=...`.
  - Verifies that the authenticated user exists in `AdminUser` table with an active role.

### 4.2 Role Extensibility

The `AdminUser` model links `auth.users.id` from Supabase to an application role (`ADMIN`, `EDITOR`, `STAFF`):

- In Phase 3, the initial migration scripts create the business owner's profile with `role: ADMIN`.
- Server actions enforce permission helpers:
  ```ts
  export async function assertAdmin() {
    const user = await getCurrentAdminUser();
    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized: Administrator privileges required.");
    }
    return user;
  }
  ```
- Adding future team members is supported by adding rows in `AdminUser` without modifying table schemas or component code.

---

## 5. Content Repository & Lead Service Integration

### 5.1 Repository Implementation Pattern

To preserve the zero-breakage rule, `PrismaContentRepository` implements [`ContentRepository`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/repository.ts) exactly:

```
src/
  lib/
    db/
      prisma.ts                    // Singleton PrismaClient instance
    content/
      repository.ts                // Unchanged interface
      prisma/
        repository.ts              // PrismaContentRepository implementation
      mock/
        repository.ts              // Existing MockContentRepository
      index.ts                     // Switched via CONTENT_SOURCE flag
    leads/
      lead-service.ts              // Unchanged interface
      prisma-lead-service.ts       // PrismaLeadService implementation
      mock-lead-service.ts         // Existing MockLeadService
      index.ts                     // Switched via CONTENT_SOURCE flag
```

### 5.2 Dynamic Source Switching (`src/lib/content/index.ts`)

```ts
import { mockContentRepository } from "./mock/repository";
import { prismaContentRepository } from "./prisma/repository";
import type { ContentRepository } from "./repository";

// Controlled via environment variable: CONTENT_SOURCE="prisma" | "mock"
const isPrismaEnabled = process.env.CONTENT_SOURCE === "prisma";

export const contentRepository: ContentRepository = isPrismaEnabled
  ? prismaContentRepository
  : mockContentRepository;
```

Public section components (`Hero`, `Services`, `WhyChooseUs`, `About`, `Team`, `Gallery`, `ServiceAreas`, `QuoteForm`) consume data only through these exported async functions and require zero modifications.

---

## 6. Admin Dashboard UI & Navigation Architecture

The admin dashboard lives at `src/app/admin/*` and uses the project's existing UI primitives ([`src/components/ui/*`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/components/ui/index.ts)) styled with Tailwind CSS tokens.

### 6.1 Route Structure

```
src/app/admin/
  ├── layout.tsx                  // Admin Shell: Sidebar, TopBar, UserProfile, Breadcrumbs
  ├── login/
  │   └── page.tsx                // Clean, responsive email/password login screen
  ├── page.tsx                    // Dashboard overview: KPI counters, recent leads, quick links
  ├── leads/
  │   ├── page.tsx                // Leads inbox with filters, search, and status pipeline
  │   └── [id]/
  │       └── page.tsx            // Lead detail: client details, campaign UTMs, status updater, notes
  ├── content/
  │   ├── settings/page.tsx       // Business contact info, phone, WhatsApp, trade licence, SEO
  │   ├── hero/page.tsx           // Hero headline, subheadline, CTAs, trust badges, cutout photo
  │   ├── services/
  │   │   ├── page.tsx            // Reorderable list of services, active toggle
  │   │   └── [id]/page.tsx       // Service editor: title, slug, icon, short/long description, 4:3 photo
  │   ├── areas/
  │   │   └── page.tsx            // 10 Dubai service areas list, map coordinates & active status
  │   ├── landing-pages/
  │   │   ├── page.tsx            // Dedicated Area Landing Pages Hub (5 Google/FB ad target areas)
  │   │   └── [slug]/page.tsx     // Area Page Editor: H1 headline, intro, services title/bullets,
  │   │                           // featured blocks (single/multi-block layout), near-you copy,
  │   │                           // custom FAQs accordion manager, final CTA title, and SEO tags
  │   ├── why-choose/page.tsx     // Why Choose US 4 feature cards
  │   ├── about/page.tsx          // Company profile, paragraphs, equipment checklist
  │   ├── team/page.tsx           // Team members list, add/edit modal, 1:1 portrait cropper
  │   └── gallery/page.tsx        // Projects gallery, 4:3 image uploader, before/after toggle
  └── media/
      └── page.tsx                // Supabase Storage visual asset explorer & file uploader
```

### 6.2 Dedicated Area Landing Pages Management Specification

Because the 5 ad landing pages (`/business-bay`, `/dubai-marina`, `/jumeirah`, `/downtown-dubai`, `/jvc`) have specific marketing roles, the admin dashboard provides a dedicated editor at `/admin/content/landing-pages/[slug]`:

1. **Header & Metadata:**
   - Live URL preview chip (e.g. `https://jebucleaning.netlify.app/business-bay` with direct link).
   - Page Title (`<title>`) and Meta Description inputs with character count indicators.
   - Active status toggle (disabling sets `isActive: false`, turning the public route into an immediate 404).
2. **Hero Customization:**
   - H1 Headline input (pre-filled with client marketing copy).
   - Intro paragraph textarea.
   - Hero cutout/banner image picker (falls back to default hero cleaner cutout).
3. **Services Section Customization:**
   - Section Heading (e.g. *"Our Cleaning Services in Business Bay"*).
   - Descriptive service bullet list (dynamic tag/chips editor).
4. **Featured Secondary Block(s):**
   - Block Title (e.g. *"Post-Construction Office & Apartment Cleaning"*).
   - Layout selector: **Single Content Card** (Business Bay, Dubai Marina, Jumeirah, Downtown) vs. **3-Card Split Grid** (JVC).
   - Card title & description editor.
5. **Near-You Section:**
   - Near-You Heading (e.g. *"Cleaning Services Near You in Business Bay"*).
   - Introductory paragraph.
6. **FAQ Accordion Manager:**
   - Drag-and-drop reorderable list of question and answer pairs.
   - Add/Remove FAQ buttons (pre-populated with client's 4 verified Q&As).
7. **Final CTA:**
   - Custom quote band heading (e.g. *"Need Cleaning Services in Business Bay?"*).
8. **Cache Purge on Save:**
   - Submitting the form calls `updateAreaLandingPageAction(slug, data)`, purging `tags: ["content-areas", `content-area-${slug}`]` and `revalidatePath("/[area]", "page")` for immediate live reflection.


---

## 7. Leads Inbox Specification

The admin's Lead Inbox directly addresses the business owner's day-to-day operations:

- **Metrics Bar:** Total Leads, New Leads (Today), Contacted, Quoted, Closed.
- **Filter Controls:**
  - Status tab pills: `All`, `Pending`, `Contacted`, `Closed`.
  - Service filter dropdown (Home Cleaning, Deep Cleaning, Office Cleaning, etc.).
  - Source Area filter (Business Bay, Dubai Marina, Main Page, etc.).
  - Date range picker.
- **Table View:**
  - Client Full Name, Mobile (with one-click `tel:` link), WhatsApp icon (direct `https://wa.me/...` chat opener).
  - Selected Service badge & Property Type (`Apartment`, `Villa`, `Office`).
  - Source tag (`business-bay`, `main-page`, `jvc`).
  - Time elapsed (`10m ago`, `2h ago`).
  - Status pill with quick inline status switcher.
- **Detail Modal / Drawer:**
  - Full client message and preferred date.
  - Acquisition tracking details: `utm_source`, `utm_campaign`, `utm_medium`, `fbclid`, and `landingUrl`.
  - Admin Internal Notes textarea with auto-save for operational remarks (e.g. *"Quoted 450 AED for 2-bedroom deep clean on Thursday"*).

---

## 8. Cache Revalidation & Publishing Mechanics

Since **Direct Publish** was selected:

1. **Tag Architecture:**
   - Every fetch in `PrismaContentRepository` tags its Next.js cache:
     - `getSettings()` -> `tags: ["content-settings"]`
     - `getServices()` -> `tags: ["content-services"]`
     - `getAreaLandingPage(slug)` -> `tags: ["content-areas", `content-area-${slug}`]`
     - `getHero()`, `getAbout()`, `getWhyChoose()`, `getTeam()`, `getGallery()` -> corresponding tags.
2. **Server Action Invalidation:**
   - On saving an entity in the admin dashboard:
     ```ts
     "use server";
     import { revalidateTag, revalidatePath } from "next/cache";

     export async function updateServiceAction(id: string, data: UpdateServiceInput) {
       await assertAdmin();
       await prismaContentRepository.updateService(id, data);
       
       // Instant cache purge
       revalidateTag("content-services");
       revalidatePath("/");
       revalidatePath("/[area]", "page");
       
       return { success: true };
     }
     ```
3. **Outcome:** Changes appear on the live website within milliseconds without restarting the server or triggering a Netlify/Vercel build deployment.

---

## 9. Seed Data Plan

File: `prisma/seed.ts`

To ensure zero content degradation or missing copy during rollout, the database will be seeded using the real client data already established in the codebase:

```ts
import { PrismaClient } from "@prisma/client";
import { mockSettingsData } from "../src/lib/content/mock/data/settings";
import { mockHeroData } from "../src/lib/content/mock/data/hero";
import { mockServicesData } from "../src/lib/content/mock/data/services";
import { mockWhyChooseData } from "../src/lib/content/mock/data/why-choose";
import { mockAboutData } from "../src/lib/content/mock/data/about";
import { mockTeamData } from "../src/lib/content/mock/data/team";
import { mockGalleryData } from "../src/lib/content/mock/data/gallery";
import { mockAreasData } from "../src/lib/content/mock/data/areas";
import { mockAreaLandingPagesData } from "../src/lib/content/mock/data/area-landing-pages";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding JUBU Cleaning Service database...");

  // 1. Site Settings (with verified Al Quoz-4 address & client contacts)
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      businessName: mockSettingsData.businessName,
      tagline: mockSettingsData.tagline,
      badgeText: mockSettingsData.badgeText,
      phone: mockSettingsData.phone,
      phoneDisplay: mockSettingsData.phoneDisplay,
      phoneTel: mockSettingsData.phoneTel,
      whatsapp: mockSettingsData.whatsapp,
      whatsappNumber: mockSettingsData.whatsappNumber,
      whatsappDefaultMessage: mockSettingsData.whatsappDefaultMessage,
      email: mockSettingsData.email,
      address: mockSettingsData.address,
      mapUrl: mockSettingsData.mapUrl,
      workingHours: mockSettingsData.workingHours,
      socialLinks: mockSettingsData.socialLinks,
      seoTitle: mockSettingsData.defaultSeo.title,
      seoDescription: mockSettingsData.defaultSeo.description,
      copyrightText: mockSettingsData.copyrightText,
      licenceNumber: mockSettingsData.licence.number,
      licenceStructure: mockSettingsData.licence.legalStructure,
      licenceAuthority: mockSettingsData.licence.issuingAuthority,
      licenceIssueDate: mockSettingsData.licence.issueDate
    }
  });

  // 2. Services, Why Choose, About, Team, Gallery, Areas, Area Landing Pages...
  // (Iterate and upsert all collections by id)
}
```

Command configured in `package.json`:
```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

---

## 10. Database Migrations & Deployment Strategy

- **Development:** Developers run `npx prisma migrate dev --name <migration_name>` to generate clean, version-controlled SQL files in `prisma/migrations/`.
- **Production Pipeline:** The Netlify/Vercel build script will execute `npx prisma migrate deploy` prior to `next build`.
- **Safety Guarantee:** Migrations run transactionally. If an issue occurs, the database rolls back, and build fails safely before swapping production traffic.

---

## 11. Environment Variables Configuration

The following variables will be defined in `.env` and `.env.example`:

| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | **Server-only** | Pooled Supabase connection string (`postgresql://postgres:[PASSWORD]@aws-0-me-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true`) |
| `DIRECT_URL` | **Server-only** | Direct Supabase connection string for schema migrations (`postgresql://postgres:[PASSWORD]@aws-0-me-central-1.pooler.supabase.com:5432/postgres`) |
| `NEXT_PUBLIC_SUPABASE_URL` | **Public** | Supabase project API endpoint (`https://[PROJECT-REF].supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Public** | Client-side key for Auth and Storage uploads |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only** | Elevated privileges for admin server tasks |
| `CONTENT_SOURCE` | **Server-only** | Feature flag: `"mock"` (default) or `"prisma"` |

---

## 12. Verification & Rollback Procedure

Before toggling `CONTENT_SOURCE="prisma"` in production:

1. **Seed Parity Check:** Execute automated parity test asserting that `PrismaContentRepository.getServices()` returns identical objects and order as `MockContentRepository.getServices()`.
2. **Visual & Responsive Comparison:** Compare `/` and all 5 landing pages (`/business-bay`, `/dubai-marina`, etc.) side-by-side.
3. **Lead Flow Verification:** Submit a test quote request on an area page. Confirm:
   - Immediate redirect to WhatsApp occurs with correct pre-filled message and `Source: {area}`.
   - Lead appears instantaneously in `/admin/leads` with all UTM tags preserved.
4. **Instant Rollback:** If any unexpected edge case arises, changing `CONTENT_SOURCE="mock"` in environment variables instantly restores the previous mock data state with zero downtime.

---

## 13. Phased Implementation Roadmap

### Phase 1: Supabase Setup & Prisma Data Layer (No Public Site Impact)
- [ ] Create Supabase project in `me-central-1` (UAE / Middle East region for lowest latency).
- [ ] Install Prisma dependencies (`prisma`, `@prisma/client`, `tsx`).
- [ ] Configure `DATABASE_URL` and `DIRECT_URL` in `.env` and `src/env.ts`.
- [ ] Write `prisma/schema.prisma` with all models specified in §2.
- [ ] Run initial migration `npx prisma migrate dev --name init_cms_models`.
- [ ] Write `prisma/seed.ts` importing existing mock datasets and execute `npx prisma db seed`.
- [ ] Verify database tables and seed rows in Supabase Studio.
- *Done when:* The database is populated with current site content and `prisma studio` displays all records accurately.

### Phase 2: Repository Swap Behind Flag (`PrismaContentRepository`)
- [ ] Create Prisma client singleton in `src/lib/db/prisma.ts`.
- [ ] Implement `PrismaContentRepository` fulfilling [`ContentRepository`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/repository.ts).
- [ ] Implement `PrismaLeadService` fulfilling [`LeadService`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/leads/lead-service.ts).
- [ ] Add `CONTENT_SOURCE` toggle to [`src/lib/content/index.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/index.ts) and [`src/lib/leads/index.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/leads/index.ts).
- [ ] Test toggling `CONTENT_SOURCE="prisma"` locally.
- [ ] Verify `/` and all 5 area pages render byte-identical DOM and pass all tests.
- *Done when:* Public site runs off Supabase Postgres with zero visual or layout regressions.

### Phase 3: Supabase Auth & Admin Shell Layout
- [ ] Install `@supabase/supabase-js` and `@supabase/ssr`.
- [ ] Create Supabase client factories (`src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`).
- [ ] Implement Next.js middleware in `src/middleware.ts` guarding `/admin/*`.
- [ ] Build `/admin/login` page with clean branding and error handling.
- [ ] Build `/admin/layout.tsx` (sidebar navigation, breadcrumbs, user dropdown, sign out button).
- [ ] Seed initial `AdminUser` row linking to the business owner's credentials.
- *Done when:* Business owner can securely log in, navigate the admin shell, and unauthenticated requests are blocked.

### Phase 4: Core Content Management Screens
- [ ] **Site Settings Screen (`/admin/content/settings`):** Edit phone, WhatsApp, email, address, working hours, trade licence, social links, SEO tags.
- [ ] **Services Manager (`/admin/content/services`):** Reorder, edit titles, descriptions, icon picker, toggle active/inactive.
- [ ] **Dubai Service Areas (`/admin/content/areas`):** Manage 10 core service areas, map coordinates, and active visibility.
- [ ] **Area Landing Pages Hub & Editor (`/admin/content/landing-pages` & `[slug]`):** Dedicated manager for the 5 dynamic ad routes (`/business-bay`, `/dubai-marina`, `/jumeirah`, `/downtown-dubai`, `/jvc`). Edit H1 headlines, intros, services headings/bullets, featured blocks (supporting single card & JVC 3-block layouts), near-you paragraphs, accordion FAQs, final CTA titles, and on-page SEO meta tags.
- [ ] **Why Choose & About Screens:** Edit value proposition cards and company profile equipment list.
- [ ] **Team & Gallery Screens:** Manage staff members and project before/after entries.
- *Done when:* Business owner can update any text or list item across the entire website and all 5 area landing pages directly from the browser.

### Phase 5: Media Library & Pre-Upload Aspect Ratio Cropper
- [ ] Create public `cms-media` bucket and security policies in Supabase Storage.
- [ ] Build reusable `ImageUploadField.tsx` with crop modal enforcing section-specific aspect ratios (1:1, 4:3, etc.).
- [ ] Integrate client-side canvas compression to WebP.
- [ ] Integrate Supabase Storage direct upload and preview.
- [ ] Wire image uploader to Hero cutout, Service cards, Gallery, and Team profiles.
- *Done when:* Admin can upload, crop to exact ratios, and swap any image on the site effortlessly.

### Phase 6: Leads Inbox & CRM Pipeline
- [ ] Update `/api/lead` and `QuoteForm` background submission to use `PrismaLeadService`.
- [ ] Build `/admin/leads` data table with status tabs (`Pending`, `Contacted`, `Closed`), search, and service filters.
- [ ] Build Lead detail drawer displaying contact details, one-click WhatsApp/Call actions, and campaign UTM metadata.
- [ ] Add internal admin notes field with auto-save.
- *Done when:* Every customer inquiry is logged in the admin inbox and can be triaged through its lifecycle.

### Phase 7: Publish Revalidation, Production Deployment & Handover
- [ ] Implement tag-based cache revalidation on all server actions.
- [ ] Configure CI/CD build command to execute `npx prisma migrate deploy && next build`.
- [ ] Set production environment variables in Netlify/Vercel dashboard.
- [ ] Toggle `CONTENT_SOURCE="prisma"` in production.
- [ ] Complete end-to-end QA walkthrough on live domain with the business owner.
- *Done when:* Public site is 100% database-driven and business owner has active dashboard access.

---

## 14. Codebase Audit: Potential Friction Points in Phase 1 & 2

During audit of the current components, two minor hardcoded items were identified that should be aligned in Phase 1:

1. **`Hero.tsx` Avatars Array:**
   - In [`src/components/sections/hero/Hero.tsx`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/components/sections/hero/Hero.tsx#L19-L40), `SOCIAL_PROOF_AVATARS` (4 customer thumbnails) is currently declared as an inline constant inside the component file rather than passed via `HeroContent`.
   - *Recommendation:* Keep as default fallback in `Hero.tsx` for now, or add an optional `socialProofAvatars` column to `HeroContent` so the owner can swap them later if desired.
2. **`ServiceAreas.tsx` Zone Cards:**
   - In [`src/components/sections/areas/ServiceAreas.tsx`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/components/sections/areas/ServiceAreas.tsx#L63-L87), `AREA_ZONES` (the 4 grouping cards: Central Dubai, Marina & Coastal, etc.) is currently declared locally inside the component.
   - *Recommendation:* Keep the 4 zone descriptions static in the component while reading the individual 10 service areas from Prisma, or add a `ServiceAreaZone` model in Phase 4.
3. **Zero Component Breakage Guarantee:**
   - Every public section component already expects props passed from `src/app/page.tsx` and `src/app/[area]/page.tsx`. Because `PrismaContentRepository` outputs the exact same TypeScript structures, the repository swap in Phase 2 requires **zero changes** to section components.
