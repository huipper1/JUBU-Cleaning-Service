# JUBU Cleaning Service: Supabase & Prisma CMS Implementation Plan

> **Goal:** Build an administrative dashboard and headless CMS layer backed by Supabase (Postgres, Auth, Storage) and Prisma ORM within this existing Next.js App Router repository, enabling the business owner to manage website copy, services, media assets, service areas, team profiles, testimonials, and customer leads directly without code edits or developer intervention.
>
> **Scope of this stage:** Architecture, data modeling, storage design, authentication, admin UI, revalidation mechanics, seed scripts, migration strategy, and phased delivery roadmap. No public frontend sections or visual layouts will be disrupted.
>
> **Companion Document:** Complements [`PLAN.md`](file:///c:/New%20folder/JUBU-Cleaning-Service/PLAN.md) (Frontend Foundation & Section Architecture). Adheres to all workspace standards set out in [`AGENTS.md`](file:///c:/New%20folder/JUBU-Cleaning-Service/AGENTS.md).

---

## 1. Decisions & Architectural Rationale

| Topic | Decision | Details & Justification |
| :--- | :--- | :--- |
| **Architecture** | **Unified Next.js Monorepo (App Router)** | Admin dashboard lives directly in the same Next.js repository under `src/app/admin/*`. Public site and admin share data contracts, Zod schemas, Tailwind tokens, and Prisma models. Zero secondary deployment pipelines or microservices. |
| **Database & Auth** | **Supabase Postgres + Supabase Auth** | Managed Postgres database with connection pooling, built-in GoTrue auth engine for administrative credentials, session cookies, and JWT handling. |
| **Data Access Layer** | **Prisma Client (`PrismaContentRepository` & `PrismaLeadService`)** | Provides compile-time TypeScript type safety, automated migrations (`prisma migrate`), relational model validations, and IDE autocomplete. Satisfies existing [`ContentRepository`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/repository.ts) and [`LeadService`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/leads/lead-service.ts) interfaces seamlessly. |
| **Security & RLS** | **Server-Only Access Architecture (Recommended)** | Direct database connections from Next.js server components, server actions, and route handlers execute via Prisma using elevated connection strings (`DATABASE_URL`). Postgres tables are kept internal (`REST` disabled on public schema). Supabase client-side access is restricted strictly to Auth and direct Storage uploads. |
| **Connection Pooling** | **Transaction Pooler (Supabase Supavisor / PgBouncer Port 6543)** | Serverless/edge Next.js environments spawn ephemeral instances. Prisma will connect to Supabase via pooled connection string (`?pgbouncer=true` / transaction mode) for runtime queries, and use `DIRECT_URL` (direct port 5432) for `prisma migrate`. |
| **Publish Model** | **Draft/Publish with Next.js On-Demand Revalidation** | Content rows retain `isActive` / `isPublished` flags. Admin saves trigger tag-based revalidation (`revalidateTag()`), immediately purging cached public reads without requiring site rebuilds or redeployments. |
| **Storage & Media** | **Supabase Storage + Direct Browser Upload** | Public storage bucket (`jubu-assets`) segmented into organized folders (`hero/`, `services/`, `team/`, `gallery/`, `about/`). Admin uploads directly to Supabase Storage via signed tokens/public keys; Prisma records the resulting public CDN URL and image metadata. |
| **Lead Flow** | **Dual Execution: WhatsApp Direct + Async Prisma DB Persistence** | The customer experience continues redirecting to WhatsApp immediately on quote submission. Concurrently, `/api/lead` records the full structured lead into Supabase Postgres via Prisma, feeding the admin leads inbox. |
| **Admin UI & Theming** | **100% shadcn/ui + Zero Hardcoded Theming + Mandatory Reusability** | The admin dashboard is constructed strictly with official shadcn/ui components (`components.json`), styled exclusively via CSS variables (`bg-background`, `text-foreground`, `border-border`, `bg-sidebar`, etc.) with zero hardcoded arbitrary colors/hex values. Reusable data tables, entity forms, and dialogs are mandatory. |
| **Forms & Validation** | **React Hook Form + Zod Resolvers + Inline Error Rendering** | All admin editing screens and forms use `react-hook-form` paired with `@hookform/resolvers/zod` and shared Zod schemas. Validation errors render inline via shadcn's `<FormMessage />` directly below the offending input with instant feedback on change/blur. |
| **Admin Sidebar** | **Official shadcn `sidebar-07` Pattern** | Uses shadcn's standard collapsible icon sidebar (`npx shadcn@latest add sidebar-07`), featuring responsive collapse to icons (`collapsible="icon"`), navigation groups, breadcrumbs, no team switcher, and no user profile popover. |

---

### 1.1 RLS vs. Server-Only Access Tradeoff Analysis

When using Supabase with Prisma in Next.js, two architectural patterns exist for data security:

1. **Option A: Postgres Row Level Security (RLS) with Supabase Client / PostgREST**
   * *How it works:* Postgres policies check `auth.uid()` on every query.
   * *Drawbacks:* Requires passing Supabase JWTs down into database connections, bypasses Prisma's typed ergonomics, forces dual schema definitions, or requires cumbersome session variable injection (`SET LOCAL request.jwt.claim.sub`) inside Prisma transactions.
2. **Option B: Server-Only Access Architecture via Prisma (Recommended)**
   * *How it works:* Public clients never query the Supabase database directly over the network. All database queries occur exclusively within Next.js Server Components, Server Actions, or API Route Handlers via Prisma Client. Supabase Postgres tables are not exposed via client-side Supabase PostgREST endpoints.
   * *Administrative Boundary:* Administrative authorization is verified at the Next.js boundary via HTTP-only session cookies and Next.js middleware using `@supabase/ssr`.
   * *Recommendation:* **Option B (Server-Only Access)**. It completely prevents SQL or schema leakage to the browser, guarantees end-to-end TypeScript type synchronization between Prisma and React components, and drastically simplifies operational complexity while maintaining security.

---

## 2. Prisma Schema Plan

The Prisma schema translates existing TypeScript entities into relational tables with strict constraints, automated timestamps, unique keys, and JSON support for composite attributes.

### 2.1 File Location: `prisma/schema.prisma`

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

enum LeadStatus {
  NEW
  CONTACTED
  QUOTED
  WON
  LOST
}

enum AdminRole {
  OWNER
  EDITOR
  STAFF
}

// -------------------------------------------------------------
// 1. ADMIN USER & AUTH EXTENSION (1:1 with Supabase Auth)
// -------------------------------------------------------------

model AdminUser {
  id        String    @id // Maps directly to auth.users.id in Supabase Auth
  email     String    @unique
  fullName  String
  role      AdminRole @default(OWNER)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  notes     LeadNote[]

  @@map("admin_users")
}

// -------------------------------------------------------------
// 2. SINGLETON MODELS (Enforced via Fixed ID = "singleton")
// -------------------------------------------------------------

model SiteSettings {
  id                     String   @id @default("singleton")
  businessName           String
  tagline                String
  badgeText              String
  phone                  String
  phoneDisplay           String
  phoneTel               String
  whatsapp               String
  whatsappNumber         String
  whatsappDefaultMessage String
  email                  String
  address                String
  mapUrl                 String
  workingHours           String
  copyrightText          String
  
  // Composite & structured fields stored as typed JSON
  logo                   Json     // { src: string, alt: string, width: number, height: number }
  socialLinks            Json     // SocialLinkItem[]: [{ platform, url, icon }]
  defaultSeo             Json     // SeoMetadata: { title, description, ogImage }
  licence                Json     // TradeLicence: { number, legalStructure, issuingAuthority, issueDate }

  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt

  @@map("site_settings")
}

model HeroContent {
  id             String   @id @default("singleton")
  badge          String
  headline       String
  subheadline    String
  floatingBadge  String
  primaryCta     Json     // LinkItem: { label: string, href: string }
  secondaryCta   Json     // LinkItem: { label: string, href: string }
  trustBadges    Json     // TrustBadgeItem[]: [{ id, label, icon }]
  heroImage      Json     // ImageItem: { src, alt, width, height }

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("hero_content")
}

model AboutContent {
  id             String   @id @default("singleton")
  badge          String
  heading        String
  taglineBadge   String?
  secondaryBadge String?
  paragraphs     String[] // Postgres native text array
  cta            Json     // LinkItem: { label, href }
  highlights     Json     // AboutHighlightItem[]: [{ id, title, description, icon }]
  images         Json     // ImageItem[]: [{ src, alt, width, height }]
  equipment      String[] // Postgres native text array (12 standard tools)

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("about_content")
}

// -------------------------------------------------------------
// 3. LIST / COLLECTION MODELS
// -------------------------------------------------------------

model Service {
  id               String   @id // e.g. "home-cleaning", "deep-cleaning"
  slug             String   @unique
  title            String
  shortDescription String
  longDescription  String?
  icon             String   // Lucide icon identifier
  image            Json     // ImageItem: { src, alt, width, height }
  order            Int      @default(0)
  isActive         Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  galleryItems     GalleryItem[]

  @@index([order])
  @@index([isActive])
  @@map("services")
}

model WhyChooseItem {
  id          String   @id // e.g. "licensed-in-dubai"
  title       String
  description String
  icon        String   // Lucide or SVG key
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([order])
  @@index([isActive])
  @@map("why_choose_items")
}

model TeamMember {
  id        String   @id // e.g. "ahmed-khan"
  name      String
  role      String
  bio       String?
  photo     Json     // ImageItem: { src, alt, width, height }
  order     Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([order])
  @@index([isActive])
  @@map("team_members")
}

model GalleryItem {
  id            String   @id // e.g. "gallery-villa-cleaning"
  title         String
  caption       String?
  serviceId     String
  serviceName   String?
  image         Json     // ImageItem: { src, alt, width, height }
  beforeImage   Json?    // Optional ImageItem
  afterImage    Json?    // Optional ImageItem
  isBeforeAfter Boolean  @default(false)
  order         Int      @default(0)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  service       Service  @relation(fields: [serviceId], references: [id], onDelete: Cascade)

  @@index([order])
  @@index([isActive])
  @@index([serviceId])
  @@map("gallery_items")
}

model ServiceArea {
  id        String   @id // e.g. "downtown-dubai"
  name      String
  slug      String   @unique
  lat       Float?
  lng       Float?
  order     Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([order])
  @@index([isActive])
  @@map("service_areas")
}

model Testimonial {
  id        String   @id @default(cuid())
  name      String
  role      String   @default("Resident")
  location  String?
  avatar    String   // URL or Supabase storage path
  rating    Int      @default(5)
  review    String
  service   String?
  order     Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([order])
  @@index([isActive])
  @@map("testimonials")
}

// -------------------------------------------------------------
// 4. LEADS & CONVERSIONS
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
  
  // Tracking & Attribution
  utmSource      String?
  utmMedium      String?
  utmCampaign    String?
  utmContent     String?
  fbclid         String?
  landingUrl     String?
  
  // Workflow Pipeline
  status         LeadStatus @default(NEW)
  internalNotes  String?    @db.Text
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  notesHistory   LeadNote[]

  @@index([status])
  @@index([createdAt])
  @@index([serviceId])
  @@map("leads")
}

model LeadNote {
  id          String    @id @default(cuid())
  leadId      String
  adminUserId String
  note        String    @db.Text
  createdAt   DateTime  @default(now())

  lead        Lead      @relation(fields: [leadId], references: [id], onDelete: Cascade)
  admin       AdminUser @relation(fields: [adminUserId], references: [id], onDelete: Cascade)

  @@index([leadId])
  @@map("lead_notes")
}
```

### 2.2 Singleton Row Enforcement Strategy
For singletons (`SiteSettings`, `HeroContent`, `AboutContent`):
1. **Database Constraint:** Fixed primary key `@id @default("singleton")`. Any accidental second row insertion violates PK uniqueness.
2. **Repository Abstraction:** `PrismaContentRepository` executes `upsert({ where: { id: "singleton" }, update: data, create: { id: "singleton", ...data } })`, guaranteeing that zero or duplicate rows never exist.

---

## 3. Storage Architecture & Image Flow

Supabase Storage manages all user-uploaded digital assets, while Prisma stores the resulting public URLs and dimensions.

### 3.1 Bucket Hierarchy
Bucket Name: `jubu-assets` (Public bucket, cached on Supabase Global CDN)

```
jubu-assets/
├── branding/       # logo, trade licence badges, favicon
├── hero/           # hero cleaner cutout, background banners
├── services/       # service card preview photos
├── team/           # staff portrait cards (1:1 ratio)
├── gallery/        # before/after cleaning showcase photos
├── about/          # equipment showcase and team action photos
└── uploads/        # generic media library items
```

### 3.2 Direct Browser Upload Pipeline

```
[Admin Browser]
   │
   ├─► 1. File selected (Client validates size ≤ 5MB, format: jpg/png/webp)
   ├─► 2. Browser queries Next.js Server Action: `getStorageSignedUploadUrl(fileName, folder)`
   │       └─ Next.js checks admin session cookie via Supabase Admin SDK
   │       └─ Returns secure one-time upload token
   │
   ├─► 3. Browser uploads binary directly to Supabase Storage via `@supabase/supabase-js`
   │       └─ Bypasses Next.js server memory and Vercel payload limits (4.5MB limit avoided)
   │
   ├─► 4. Browser receives public CDN URL:
   │       `https://[project-ref].supabase.co/storage/v1/object/public/jubu-assets/services/[id]-[hash].webp`
   │
   └─► 5. Admin Form submits payload to Server Action:
           Prisma records `{ src: cdnUrl, alt, width, height }` into Postgres.
```

### 3.3 Image Optimization & Backward Compatibility
* Existing static placeholders (e.g. `/images/placeholder/hero-cleaner.png`) remain fully valid in Prisma seed data and are served directly by `next/image`.
* When an admin uploads a new photo, the new CDN URL replaces the placeholder in Prisma.
* `next.config.ts` must whitelist Supabase Storage hostnames in `images.remotePatterns`:

```ts
// In next.config.ts
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "*.supabase.co",
      pathname: "/storage/v1/object/public/**"
    }
  ]
}
```

---

## 4. Authentication & Authorization Plan

### 4.1 Authentication Stack
* Engine: **Supabase Auth** (email/password with secure session cookies).
* Session Handling: Handled in Next.js App Router using `@supabase/ssr`.
* Storage: Standard HTTP-only, SameSite=Lax cookies, encrypted by Supabase GoTrue.

### 4.2 Middleware Route Protection
A dedicated Next.js middleware ([`src/middleware.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/middleware.ts)) intercepts requests:

```
Request to /admin/*
       │
       ▼
Is route `/admin/login`? ──YES──► Allow access
       │ NO
       ▼
Read Supabase Session Cookie
       │
       ├─► No valid session? ──► Redirect to `/admin/login?next=/admin`
       │
       └─► Valid session? ────► Allow request & forward user context
```

### 4.3 Role Extension Design
* Current deployment: Exactly 1 administrator (the business owner).
* Future scalability: The `AdminUser` model in Prisma maps 1:1 to Supabase `auth.users.id`.
* When extending to multiple users (e.g. "STAFF" who can only view leads, or "EDITOR" who can only edit copy), a simple lookup in `AdminUser.role` inside Server Actions enforces granular role permissions without schema refactoring.

---

## 5. Repository Implementations

### 5.1 Prisma Singleton Pattern (`src/lib/db.ts`)
To prevent connection exhaustion during development (hot reloading), Prisma Client is instantiated as a global singleton:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

### 5.2 `PrismaContentRepository` Implementation
Located at `src/lib/content/prisma/repository.ts`, implements [`ContentRepository`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/repository.ts):

* `getSettings()`: Queries `db.siteSettings.findUnique({ where: { id: "singleton" } })`. Fallbacks to seed defaults if uninitialized.
* `getHero()`: Queries `db.heroContent.findUnique({ where: { id: "singleton" } })`.
* `getServices()`: Queries `db.service.findMany({ where: { isActive: true }, orderBy: { order: "asc" } })`.
* `getWhyChoose()`: Queries `db.whyChooseItem.findMany({ where: { isActive: true }, orderBy: { order: "asc" } })`.
* `getAbout()`: Queries `db.aboutContent.findUnique({ where: { id: "singleton" } })`.
* `getTeam()`: Queries `db.teamMember.findMany({ where: { isActive: true }, orderBy: { order: "asc" } })`.
* `getGallery()`: Queries `db.galleryItem.findMany({ where: { isActive: true }, orderBy: { order: "asc" } })`.
* `getAreas()`: Queries `db.serviceArea.findMany({ where: { isActive: true }, orderBy: { order: "asc" } })`.
* `getTestimonials()`: Queries `db.testimonial.findMany({ where: { isActive: true }, orderBy: { order: "asc" } })`.

### 5.3 `PrismaLeadService` Implementation
Located at `src/lib/leads/prisma-lead-service.ts`, implements [`LeadService`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/leads/lead-service.ts):
* Validates payload with [`createLeadInputSchema`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/types.ts).
* Executes `db.lead.create(...)` persisting customer contact details, service requested, preferred date, property type, location, and all UTM attribution parameters.
* Returns `{ success: true, id: lead.id, message: "..." }`.

### 5.4 Dynamic Source Switching (`CONTENT_SOURCE`)
In [`src/lib/content/index.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/index.ts) and [`src/lib/leads/index.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/leads/index.ts):

```ts
import { mockContentRepository } from "./mock/repository";
import { PrismaContentRepository } from "./prisma/repository";
import type { ContentRepository } from "./repository";

const isDatabaseMode = process.env.CONTENT_SOURCE === "prisma";

export const contentRepository: ContentRepository = isDatabaseMode
  ? new PrismaContentRepository()
  : mockContentRepository;
```

---

## 6. Admin Dashboard UI Specification

The administrative dashboard will be built with **100% shadcn/ui components**, enforcing a strictly modular, **mandatory reusable component architecture**, and **zero hardcoded theming**. 

### 6.1 Design Principles & UI Constraints

1. **100% shadcn/ui Architecture:** Every interface element must use official shadcn primitives registered in `components.json`:
   * `Sidebar`, `SidebarContent`, `SidebarHeader`, `SidebarFooter`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarTrigger` (from `sidebar-07`)
   * `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
   * `Table`, `TableHeader`, `TableBody`, `TableHead`, `TableRow`, `TableCell`
   * `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `Sheet`
   * `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`
   * `Button`, `Input`, `Textarea`, `Select`, `Switch`, `Badge`, `Avatar`, `DropdownMenu`, `Separator`, `Tooltip`, `Breadcrumb`
2. **Zero Hardcoded Theming:**
   * Absolute ban on hardcoded arbitrary colors (e.g., `#041633`, `#00a651`, `bg-[#0a1e3b]`, `text-[#34d399]`) inside the admin dashboard.
   * All theming must strictly consume Tailwind CSS semantic system tokens defined in [`src/styles/tailwind.css`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/styles/tailwind.css): `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `border-border`, `bg-muted`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, `bg-sidebar`, `text-sidebar-foreground`, `border-sidebar-border`, `ring-sidebar-ring`.
   * The dashboard respects system themes and is dark/light mode compatible out-of-the-box via CSS variables.
3. **React Hook Form + Zod Architecture & Inline Validation:**
   * All admin forms are powered by `react-hook-form` coupled with `@hookform/resolvers/zod`.
   * Each content entity has a dedicated Zod schema (e.g., `serviceAdminSchema`, `siteSettingsAdminSchema`, `leadNoteSchema`) exported from `src/lib/content/types.ts` or `src/schemas/`.
   * **Inline Error Rendering:** Validation errors must appear **inline directly beneath the specific field** via shadcn's `<FormMessage />` primitive (styled with `text-destructive text-sm font-medium`).
   * **Real-time Feedback:** Forms use `mode: "onTouched"` or `mode: "onChange"` to provide immediate visual feedback (e.g., red field border via `aria-invalid` and matching inline error message) as the admin interacts with fields.
   * Server actions return field-specific error maps (`errors?: Record<string, string[]>`) matching the Zod tree, enabling `form.setError(fieldName, { message })` to display server-side validation issues inline without full-page reloads.
4. **Mandatory Reusable Dashboard Components (`src/components/admin/ui/`):**
   * **`AdminDataTable<TData, TValue>`:** Generic TanStack Table wrapper using shadcn `Table` with pagination, sorting, search filtering, and column visibility toggles.
   * **`AdminPageHeader`:** Reusable page header with title, subtitle, breadcrumb trail, and action slot (e.g. "Save Changes", "Add New", "Open Live Page").
   * **`AdminFormSection`:** Reusable card container grouping related form fields with unified validation states.
   * **`AdminStatusBadge`:** Reusable status indicator for leads (`NEW`, `CONTACTED`, `QUOTED`, `WON`, `LOST`) and entities (`ACTIVE`, `INACTIVE`).
   * **`AdminConfirmDialog`:** Reusable alert dialog for destructive actions (deleting team member, deleting gallery item).
   * **`AdminImageUpload`:** Reusable drag-and-drop file upload zone backed by Supabase Storage with preview and progress.

### 6.2 Admin Route Map (`src/app/admin/*`)

| Route | View / Functionality | Data Entity |
| :--- | :--- | :--- |
| `/admin/login` | Minimal secure login form using shadcn `Card`, `Input`, and `Button`. | Supabase Auth |
| `/admin` | Overview dashboard: Lead metrics counters, recent 5 leads, quick publish status. | Aggregates |
| `/admin/leads` | Interactive Leads Inbox: `AdminDataTable`, search, status filter, CSV export. | `Lead`, `LeadNote` |
| `/admin/leads/[id]` | Lead detail view: full message, customer history, status updater, internal notes. | `Lead` |
| `/admin/settings` | Site-wide settings editor: phone, WhatsApp, email, address, working hours, license. | `SiteSettings` |
| `/admin/hero` | Hero copy, CTAs, headline styling, and hero cleaner cutout image selector. | `HeroContent` |
| `/admin/services` | Service catalog list: drag/reorder, active toggles, edit modal, icon picker. | `Service` |
| `/admin/areas` | Dubai service area list: coordinates, slug, order, active status. | `ServiceArea` |
| `/admin/why-choose` | 4 value badges: title, description, icon selection. | `WhyChooseItem` |
| `/admin/about` | Company profile: paragraphs, highlights, 12 equipment checklist items, images. | `AboutContent` |
| `/admin/team` | Team member roster: photos, roles, bios, ordering. | `TeamMember` |
| `/admin/gallery` | Project showcase: before/after toggle images, service tagging, lightbox preview. | `GalleryItem` |
| `/admin/testimonials` | Review manager: customer quote, stars rating, reviewer location, avatar. | `Testimonial` |
| `/admin/media` | Media Asset Library: file browser for Supabase Storage bucket, copy CDN URL. | Supabase Storage |

### 6.3 Collapsible Sidebar (`sidebar-07` Pattern)

The admin shell layout (`src/app/admin/layout.tsx`) adopts official shadcn block **`sidebar-07`** (a sidebar that collapses into icons):

* **Installation Command:**
  ```bash
  npx shadcn@latest add sidebar-07
  ```
* **Structural Architecture:**
  * Uses `SidebarProvider` wrapping the admin layout with persistent cookie-based state (`sidebar:state`).
  * `Sidebar` component configured with `collapsible="icon"`. In expanded mode, labels and badges are visible; in collapsed mode, navigation contracts smoothly to icon-only rails with floating tooltips.
  * **Sidebar Header:** Company switcher / brand identity (`JUBU Admin Suite`).
  * **Sidebar Content:** Grouped navigation:
    * **Group 1: Overview & Pipeline**
      * Dashboard (`LayoutDashboard` icon)
      * Leads Inbox (`Inbox` icon + unread counter `Badge`)
    * **Group 2: Content Management**
      * Services (`Sparkles` icon)
      * Dubai Areas (`MapPin` icon)
      * Hero & Trust (`Flag` icon)
      * About & Equipment (`Info` icon)
      * Team Members (`Users` icon)
      * Gallery Showcase (`Image` icon)
      * Testimonials (`Quote` icon)
    * **Group 3: System & Assets**
      * Media Library (`FolderOpen` icon)
      * Site Settings (`Settings` icon)
  * **Sidebar Footer (`NavUser`):** Logged-in admin user popover with avatar, email, and clean `Logout` button trigger.
  * **Header & Breadcrumbs:** `SidebarTrigger` toggle button paired with shadcn `Breadcrumb` and a direct link to the live public site.

---

## 7. Leads Inbox Specification

The leads inbox converts incoming inquiries into an organized sales pipeline for the business owner.

### 7.1 Pipeline Stages (`LeadStatus`)
1. **New (Pending):** Default stage when customer submits form. Highlighted in emerald badge.
2. **Contacted:** Admin reached out via WhatsApp or phone.
3. **Quoted:** Price quote submitted to client.
4. **Won:** Job confirmed and scheduled.
5. **Lost:** Inactive or rejected quote.

### 7.2 Table & Filter Controls
* **Search:** Free text search across customer name, mobile number, or notes.
* **Filter by Service:** Select dropdown populated from active services.
* **Filter by Date:** Quick filters (Today, Past 7 Days, This Month, All Time).
* **Attribution Viewer:** Quick popover showing `utm_source`, `utm_campaign`, `fbclid`, and landing page URL.
* **One-Click Actions:**
  * Direct WhatsApp button: Opens `https://wa.me/[customerWhatsApp]` with pre-filled greeting.
  * Direct Call button: `tel:[customerMobile]`.
* **Internal Notes Feed:** Owner can append notes (e.g. *"Offered 150 AED for 3-hour deep cleaning, awaiting response"*).

---

## 8. Publishing & On-Demand Revalidation Plan

To achieve sub-second content updates without triggering expensive Next.js rebuilds or deployments:

### 8.1 Tagged Data Cache Architecture
Public data fetching in [`src/lib/content/prisma/repository.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/) wraps Prisma queries inside Next.js `unstable_cache`:

```ts
import { unstable_cache } from "next/cache";

export class PrismaContentRepository implements ContentRepository {
  async getSettings() {
    return unstable_cache(
      async () => db.siteSettings.findUnique({ where: { id: "singleton" } }),
      ["site-settings"],
      { tags: ["content:settings"] }
    )();
  }

  async getServices() {
    return unstable_cache(
      async () => db.service.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      ["services-list"],
      { tags: ["content:services"] }
    )();
  }
  // ... similar tags for areas, hero, about, team, gallery, testimonials
}
```

### 8.2 Revalidation Triggers in Admin Server Actions
When the owner saves any content screen, the server action calls `revalidateTag(...)`:

```ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function updateServicesAction(data: UpdateServiceInput) {
  await db.service.update({ where: { id: data.id }, data });
  
  // Instantly invalidate public site cache
  revalidateTag("content:services");
  revalidatePath("/"); // Ensures root page updates immediately
  
  return { success: true };
}
```

---

## 9. Seed Data Plan

The seed script will ingest all existing mock files directly so that initializing the Supabase database recreates the website with 100% fidelity.

### 9.1 Seed Script Structure (`prisma/seed.ts`)
* Reuses existing mock arrays from `src/lib/content/mock/data/*` directly without manual duplication:
  * [`src/lib/content/mock/data/settings.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/mock/data/settings.ts)
  * [`src/lib/content/mock/data/hero.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/mock/data/hero.ts)
  * [`src/lib/content/mock/data/services.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/mock/data/services.ts)
  * [`src/lib/content/mock/data/why-choose.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/mock/data/why-choose.ts)
  * [`src/lib/content/mock/data/about.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/mock/data/about.ts)
  * [`src/lib/content/mock/data/team.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/mock/data/team.ts)
  * [`src/lib/content/mock/data/gallery.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/mock/data/gallery.ts)
  * [`src/lib/content/mock/data/areas.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/mock/data/areas.ts)
  * [`src/lib/content/mock/data/testimonials.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/mock/data/testimonials.ts)

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
import { mockTestimonialsData } from "../src/lib/content/mock/data/testimonials";

const prisma = new PrismaClient();

async function main() {
  console.info("🌱 Seeding database from existing mock data...");

  // 1. Site Settings (Singleton)
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
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
      copyrightText: mockSettingsData.copyrightText,
      logo: mockSettingsData.logo as any,
      socialLinks: mockSettingsData.socialLinks as any,
      defaultSeo: mockSettingsData.defaultSeo as any,
      licence: mockSettingsData.licence as any
    }
  });

  // 2. Services
  for (const s of mockServicesData) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        slug: s.slug,
        title: s.title,
        shortDescription: s.shortDescription,
        longDescription: s.longDescription,
        icon: s.icon,
        image: s.image as any,
        order: s.order,
        isActive: s.isActive
      }
    });
  }

  // 3. Repeat for WhyChoose, About, Team, Gallery, Areas, Testimonials
  console.info("✅ Database successfully seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

* Registered in `package.json`:
  ```json
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
  ```

---

## 10. Database Migrations Workflow

1. **Local Development:**
   * Run `npx prisma migrate dev --name init_cms`
   * Applies changes to local/dev Supabase Postgres and generates SQL migration files under `prisma/migrations/`.
2. **Production / CI Deployment:**
   * Run `npx prisma migrate deploy`
   * Executed during the build phase or deployment step before Next.js compiles. Connects via `DIRECT_URL` to apply unapplied migrations safely.

---

## 11. Environment Variables Specification

All environment variables adhere to [`src/env.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/env.ts) and [`AGENTS.md`](file:///c:/New%20folder/JUBU-Cleaning-Service/AGENTS.md) validation standards:

| Variable Name | Exposure | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | **Server-Only** | Supabase pooled connection string (port 6543, transaction mode `?pgbouncer=true`) for Next.js runtime queries. |
| `DIRECT_URL` | **Server-Only** | Direct Postgres connection string (port 5432) for running `prisma migrate` and schema pushes. |
| `CONTENT_SOURCE` | **Server-Only** | Flag to toggle between `mock` and `prisma` (`mock` by default until cutover). |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-Only** | Elevated key used exclusively by server actions to generate signed storage upload tokens. |
| `NEXT_PUBLIC_SUPABASE_URL` | **Client-Safe** | Supabase project URL (`https://[project-ref].supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Client-Safe** | Supabase publishable anonymous key for browser auth session management and storage reads. |

---

## 12. Verification & Rollback Safety

To guarantee zero downtime and prevent visual regressions:

1. **Dual Repository Parity Check:**
   Before flipping `CONTENT_SOURCE="prisma"`, run an automated comparison script asserting that `PrismaContentRepository` outputs data structures identical to `MockContentRepository`.
2. **Zero Component Touch Rule:**
   The presentation layer ([`src/components/sections/*`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/components/sections)) must consume only types defined in [`src/types/content.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/types/content.ts).
3. **Instant Rollback Switch:**
   If any database connectivity issue occurs in production, switching `CONTENT_SOURCE="mock"` in the environment variables instantly reverts the entire public website back to local static mock data within seconds without requiring a code commit.

---

## 13. Phased Implementation Checklist

### Phase 1: Supabase Setup, Prisma Connection & Database Seeding
*Objective: Connect Prisma to Supabase, create database tables, and seed existing mock data without touching the public frontend.*

- [ ] Create Supabase project (select Frankfurt or Middle East / Bahrain / UAE region if available)
- [ ] Install dependencies: `prisma`, `@prisma/client`, `@supabase/supabase-js`, `@supabase/ssr`, `tsx`
- [ ] Configure `DATABASE_URL` and `DIRECT_URL` in `.env` and validate in [`src/env.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/env.ts)
- [ ] Write `prisma/schema.prisma` with all 9 entities + Lead & Admin models
- [ ] Execute initial migration: `npx prisma migrate dev --name init_cms`
- [ ] Create `prisma/seed.ts` importing existing mock data from [`src/lib/content/mock/data/*`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/mock/data)
- [ ] Run `npx prisma db seed` and verify all records populate in Supabase Table Editor
- [ ] **Verification:** Database tables contain all 6 services, 10 service areas, 4 team members, 8 gallery items, 8 testimonials, and complete client trade license settings.

### Phase 2: Repository Swap Behind Environment Flag
*Objective: Build `PrismaContentRepository` and verify public page renders identically.*

- [ ] Create `src/lib/db.ts` with global Prisma Client singleton
- [ ] Implement `PrismaContentRepository` in `src/lib/content/prisma/repository.ts` satisfying [`ContentRepository`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/repository.ts)
- [ ] Implement `PrismaLeadService` in `src/lib/leads/prisma-lead-service.ts` satisfying [`LeadService`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/leads/lead-service.ts)
- [ ] Wire `CONTENT_SOURCE` toggle in [`src/lib/content/index.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/index.ts) and [`src/lib/leads/index.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/leads/index.ts)
- [ ] Fix section component hardcoded props (see §14 findings below) so all sections read strictly from props
- [ ] Toggle `CONTENT_SOURCE="prisma"` locally
- [ ] **Verification:** `npm run build` exits 0. Public site renders identically to mock data. Quote form submission logs lead to Supabase database.

### Phase 3: Supabase Auth, shadcn `sidebar-07` & Reusable Admin Shell
*Objective: Secure `/admin` routes with Supabase Auth, install `sidebar-07`, and construct the 100% shadcn admin layout with zero hardcoded theming.*

- [ ] Create Supabase Storage bucket `jubu-assets` with public read permissions
- [ ] Create initial administrative user in Supabase Auth console
- [ ] Implement Supabase server client helper in `src/lib/supabase/server.ts`
- [ ] Implement Supabase browser client helper in `src/lib/supabase/client.ts`
- [ ] Create Next.js middleware in [`src/middleware.ts`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/middleware.ts) protecting `/admin/*` routes (redirecting unauthenticated users to `/admin/login`)
- [ ] Install shadcn sidebar block: `npx shadcn@latest add sidebar-07`
- [ ] Install necessary supporting shadcn UI primitives: `npx shadcn@latest add breadcrumb button card input dialog sheet form table badge avatar dropdown-menu separator tooltip switch`
- [ ] Build reusable UI primitives under `src/components/admin/ui/`:
  - `AdminPageHeader` (title, breadcrumbs, actions)
  - `AdminDataTable` (reusable TanStack table wrapper with pagination & search)
  - `AdminFormSection` (semantic card wrapper for field groups)
  - `AdminStatusBadge` (lead & entity active status badges)
  - `AdminConfirmDialog` (destructive action alerts)
- [ ] Build minimal, branded Admin Login page at `src/app/admin/login/page.tsx` using 100% shadcn `Card`, `Input`, and `Button`
- [ ] Build Admin Layout at `src/app/admin/layout.tsx` using `SidebarProvider` and `sidebar-07` (collapses into icons, styled strictly via `bg-sidebar`, `text-sidebar-foreground`, `border-sidebar-border`, zero hardcoded hex codes)
- [ ] Build Admin Dashboard Overview at `src/app/admin/page.tsx` showing lead stats and quick links
- [ ] **Verification:** Visiting `/admin` redirects to `/admin/login`. Logging in displays the `sidebar-07` collapsible shell with breadcrumbs. Collapsing sidebar shrinks navigation to icon-only rails.

### Phase 4: Content Management Screens (Entity by Entity)
*Objective: Give owner full control over high-priority business content first, built 100% with shadcn `Form`, `react-hook-form`, and Zod resolvers with inline `<FormMessage />` error feedback.*

- [ ] **Step 4A: Site Settings & Contact Info (`/admin/settings`)**
  - Form built with `react-hook-form` + `zodResolver(siteSettingsSchema)` editing phone, WhatsApp, email, address, working hours, license details, and SEO metadata.
  - Inline error validation under every field using `<FormMessage />`.
  - Server action to update `SiteSettings` and trigger `revalidateTag("content:settings")`.
- [ ] **Step 4B: Dubai Service Areas (`/admin/areas`)**
  - Table showing 10 areas with active status toggles, map coordinates, and ordering.
  - Modal form using `react-hook-form` + Zod for adding/editing service areas with inline coordinate validation.
- [ ] **Step 4C: Cleaning Services Catalog (`/admin/services`)**
  - List and edit screens for the 6 services (title, short/long description, icon picker, image URL) using `react-hook-form` + Zod with inline validation.
- [ ] **Step 4D: Why Choose Badges (`/admin/why-choose`)**
  - Manage 4 trust badges, titles, and descriptions.
- [ ] **Step 4E: Hero Section (`/admin/hero`)**
  - Edit hero headline, subheadline, primary/secondary CTA links, and trust badges.
- [ ] **Step 4F: About Us & Equipment Checklist (`/admin/about`)**
  - Edit story paragraphs, 12 equipment checklist items, and company highlights.
- [ ] **Step 4G: Team Members & Projects Gallery (`/admin/team`, `/admin/gallery`)**
  - Team member CRUD (photo, role, bio, order).
  - Gallery items CRUD with before/after photo toggles.
- [ ] **Step 4H: Customer Testimonials (`/admin/testimonials`)**
  - Manage customer reviews, star ratings, and locations.
- [ ] **Verification:** Modifying any value in the admin immediately updates the public page upon refresh.

### Phase 5: Media Library & Supabase Storage Direct Upload
*Objective: Replace all placeholder image paths with owner-uploaded media.*

- [ ] Create Server Action `getSignedUploadUrlAction` for generating pre-authenticated Supabase Storage upload requests
- [ ] Build reusable `ImageUploadField` UI component with drag-and-drop, preview, and progress bar
- [ ] Integrate `ImageUploadField` into Services, Gallery, Team, and Hero editing forms
- [ ] Build `/admin/media` gallery browser allowing direct image uploads and clipboard URL copying
- [ ] Update `next.config.ts` remote patterns to allow Supabase Storage CDN URLs
- [ ] **Verification:** Admin can upload a JPEG/PNG/WebP image from desktop; image appears in Supabase Storage and renders on the public site via `next/image`.

### Phase 6: Leads Inbox & Sales Pipeline
*Objective: Wire the customer inquiry funnel to a dedicated management inbox.*

- [ ] Build Leads Inbox table at `/admin/leads` using TanStack Table (sort by date, filter by status and service)
- [ ] Implement Lead Detail Drawer / Page (`/admin/leads/[id]`) showing complete customer payload, UTM attribution, and submission timestamp
- [ ] Add Status Pipeline selector (`NEW` → `CONTACTED` → `QUOTED` → `WON` / `LOST`)
- [ ] Add Internal Notes textarea for customer call logs
- [ ] Add Quick Action buttons: "Chat on WhatsApp" and "Call Customer"
- [ ] Add "Export Leads to CSV" button
- [ ] **Verification:** Submitting the quote form on the public site immediately surfaces the new lead in the admin inbox without breaking the WhatsApp customer redirect.

### Phase 7: Caching, Production Go-Live & Handover
*Objective: Full end-to-end verification, production database deployment, and owner onboarding.*

- [ ] Audit cache tags across all entities ensuring `revalidateTag` invalidates public reads cleanly
- [ ] Add `prisma migrate deploy` to the production build / CI script
- [ ] Run production migration on Supabase production database instance
- [ ] Seed production database with verified client data
- [ ] Set `CONTENT_SOURCE="prisma"` in production environment variables
- [ ] Perform end-to-end QA: test quote form submission, WhatsApp redirect, admin login, content editing, and image upload on mobile and desktop
- [ ] **Verification:** Complete site runs 100% on Supabase + Prisma; owner can log in and manage all content independently.

---

## 14. Codebase Audit: Findings & Prerequisites for Phase 2

During inspection of the current section components, several hardcoded values and deviations were discovered that would prevent a clean data swap if not addressed before Phase 2:

| Component | Current Issue | Required Adjustment for Phase 2 |
| :--- | :--- | :--- |
| [`src/components/sections/about/About.tsx`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/components/sections/about/About.tsx) (Lines 78, 92) | Hardcodes `/images/placeholder/about-cleaner.png` and `about-team.png` directly in JSX instead of using `content.images[0].src` and `content.images[1].src`. | Update component to bind `src={content.images[0]?.src}` and `src={content.images[1]?.src}` so admin-uploaded images render. |
| [`src/components/sections/hero/Hero.tsx`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/components/sections/hero/Hero.tsx) (Line 180) | Hardcodes `/images/placeholder/hero-cleaner.png` instead of using `content.heroImage.src`. | Bind `src={content.heroImage.src}`. |
| [`src/components/sections/contact/Contact.tsx`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/components/sections/contact/Contact.tsx) (Line 104) | Hardcodes `/images/placeholder/contact-cleaner.png`. | Add an optional `contactImage` field to `SiteSettings` or pass as prop. |
| [`src/app/page.tsx`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/app/page.tsx) (Lines 42–139) | JSON-LD Structured Data hardcodes phone, license number, and area names instead of mapping dynamically from `settings`, `services`, and `areas`. | Interpolate fields dynamically from the repository data models. |
| [`src/components/sections/testimonials/Testimonials.tsx`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/components/sections/testimonials/Testimonials.tsx) | Component exists in the codebase and is supported in [`MockContentRepository`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/lib/content/mock/repository.ts), but was omitted from the root [`src/app/page.tsx`](file:///c:/New%20folder/JUBU-Cleaning-Service/src/app/page.tsx) render tree. | Include `Testimonial` in `schema.prisma` and wire into `page.tsx` when client desires. |

---

## 15. Open Questions for Owner Alignment

1. **Email Backup for Leads:** Currently, leads redirect to WhatsApp and persist to the database. Should an automated email notification (via Resend or Supabase Edge Functions) also be sent to `sajibulislam679@gmail.com` whenever a new lead arrives?
2. **Direct Publish vs. Draft Mode:** Is immediate publishing upon clicking "Save" in the admin dashboard preferred, or does the business require a two-stage "Draft" and "Publish" workflow? *(Recommendation: Direct Publish is simpler and ideal for a single owner).*
3. **Automated Image Optimization:** Should we configure client-side WebP compression in the browser before uploading to Supabase Storage to conserve storage quota and speed up mobile page load times?
4. **Supabase Hosting Region:** Since JUBU operates exclusively in Dubai, United Arab Emirates, should the Supabase project be provisioned in the **Middle East (UAE / Bahrain)** region or **Frankfurt (EU)** for optimal latency?
