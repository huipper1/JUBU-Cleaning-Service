# JUBU Cleaning Service: Website Plan (Next.js)

> **Goal:** a simple, professional, lead-generating **one-page website** for a Dubai cleaning company, built to convert traffic from Facebook and Instagram ads.
>
> **Scope of this stage:** the complete frontend, running on **dummy data**, with a working lead form backed by a stubbed service.
>
> Follow the conventions in the existing boilerplate (folder structure, styling, linting, env handling, etc.). This plan describes _what_ to build and in what order; it does not override the boilerplate's rules.

---

## 1. Decisions

| Topic            | Decision                                                                                                         |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| Structure        | **One page** with anchor-scroll sections. About, Team and Gallery are sections on the page, not separate routes. |
| Data             | **Dummy data** in typed local files. No database, no external services, no real credentials.                     |
| Data access      | All business content is read through a **content layer** (see §3), never hard-coded in components.               |
| Services         | **6 services.** "Villa Cleaning" is covered under Home Cleaning (Villa / Apartment).                             |
| Contact channels | WhatsApp, direct call, and free-quote form. Every section leads to one of these.                                 |
| Language         | English.                                                                                                         |
| Copy             | Dummy copy stays realistic and free of inflated claims.                                                          |

**Services**

1. Home Cleaning (apartment / villa)
2. Office Cleaning
3. Deep Cleaning
4. Sofa & Carpet Cleaning
5. Post Construction Cleaning
6. Move In / Move Out Cleaning

---

## 2. Page Structure

Sections, top to bottom:

1. **Header (sticky):** logo, anchor nav (Services, Why Us, About, Gallery, Areas, Contact), **Call Now** and **WhatsApp** buttons.
2. **Hero:** "JUBU Cleaning Service", tagline "Dubai Cleaning Services", short supporting line, primary CTA **Get a Free Quote**, secondary CTAs WhatsApp and Call, hero image.
3. **Our Services:** 6 cards (icon/image, title, one-line description, "Get Quote" link that pre-selects the service in the form).
4. **Why Choose JUBU:** Professional Team, Affordable Price, Reliable Service (plus one or two more).
5. **About Us / Company Profile:** who we are, how we work, types of jobs, Dubai coverage.
6. **Our Team:** photo cards with name and role.
7. **Projects / Gallery:** finished-job and before/after photos in a grid with lightbox.
8. **Dubai Service Areas:** tag/grid list of areas, with a "Don't see your area? Message us" WhatsApp link.
9. **Get a Free Quote (Lead Form):** see §5.
10. **Contact Us:** phone, WhatsApp, email, location, working hours.
11. **Footer:** logo, quick links, contact, social links, copyright.
12. **Sticky mobile bar:** bottom bar with **Call**, **WhatsApp** and **Quote**, always visible on mobile.

---

## 3. Data Architecture

Every piece of business content (names, phone numbers, service text, images, areas, team, gallery, SEO defaults) comes from a single **content layer**. Components are purely presentational.

### 3.1 Rules

1. **Components never import data files directly.** Pages call the content layer and pass data down as props.
2. **The content layer functions are async** (`await getServices()`), even though the dummy data is synchronous. Callers never depend on where data comes from.
3. **One `ContentRepository` interface** defines every read. The dummy data implements it (`MockContentRepository`); `lib/content/index.ts` exports the active implementation.
4. **All content shapes are defined once** as TypeScript types with Zod schemas.
5. **Every list entity carries standard fields:** `id`, `slug` (where used for routing or anchors), `order`, `isActive`, `createdAt`, `updatedAt`.
6. **No business copy inside section components** (headlines, descriptions, contact details). Only UI labels (e.g. "Submit", "Close") live in components.
7. **Images are objects:** `{ src, alt, width, height }`. Icons are stored as a **name string** and mapped to a component in the UI.
8. **Fetches are tagged per entity** (`settings`, `services`, `areas`, `team`, `gallery`) so caching can be controlled per content type.

### 3.2 Entities

| Entity          | Key fields                                                                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SiteSettings`  | businessName, tagline, logo, phone, whatsapp, whatsappDefaultMessage, email, address, mapUrl, workingHours, social links, default SEO (title, description, ogImage) |
| `HeroContent`   | headline, subheadline, primaryCta label, heroImage                                                                                                                  |
| `Service`       | id, slug, title, shortDescription, longDescription, icon, image, order, isActive                                                                                    |
| `WhyChooseItem` | id, title, description, icon, order                                                                                                                                 |
| `AboutContent`  | heading, paragraphs, highlights, image                                                                                                                              |
| `TeamMember`    | id, name, role, photo, bio, order                                                                                                                                   |
| `GalleryItem`   | id, title, caption, serviceId, image (or beforeImage/afterImage), order                                                                                             |
| `ServiceArea`   | id, name, slug, order, isActive                                                                                                                                     |
| `Lead`          | id, name, phone, serviceId, message, whatsappOptIn, utm fields, landingUrl, status, createdAt                                                                       |

### 3.3 Structure

```
lib/
  content/
    types.ts               // types + Zod schemas
    repository.ts          // ContentRepository interface
    index.ts               // exports active repository + helper functions
    mock/
      repository.ts        // MockContentRepository
      data/
        settings.ts
        hero.ts
        services.ts
        why-choose.ts
        about.ts
        team.ts
        gallery.ts
        areas.ts
  leads/
    lead-service.ts        // LeadService interface: create(lead)
    mock-lead-service.ts   // validates, logs, returns success
```

```ts
// Shape of the interface (illustrative)
interface ContentRepository {
  getSettings(): Promise<SiteSettings>;
  getHero(): Promise<HeroContent>;
  getServices(): Promise<Service[]>;
  getWhyChoose(): Promise<WhyChooseItem[]>;
  getAbout(): Promise<AboutContent>;
  getTeam(): Promise<TeamMember[]>;
  getGallery(): Promise<GalleryItem[]>;
  getAreas(): Promise<ServiceArea[]>;
}
```

### 3.4 Dummy data guidelines

- Mark every placeholder in the data files with a `// DUMMY` comment so it can be found by search.
- **Images:** local placeholders in `public/images/placeholder/`, served through `next/image` with consistent ratios (hero 16:9, service 4:3, team 1:1, gallery 4:3).
- **Contact details:** obviously fake (e.g. `+971 50 000 0000`, `info@example.com`).
- **Volume:** enough items to test layouts: 6 services, 15 areas, 4 team members, 8 to 12 gallery items, 4 why-choose items.
- Include some edge cases in the data (a long service title, an item with an optional field missing) to prove the layouts hold up.

### 3.5 Lead handling

- The form and `/api/lead` route are built fully: validation, UTM capture, states, success screen.
- The route calls `LeadService.create()`. `MockLeadService` validates the payload, `console.log`s it, and returns success.
- The form only knows the API contract, not the service behind it.

---

## 4. Tech Approach

Use the boilerplate's stack. Assumed defaults if it does not specify:

- **Next.js App Router**, TypeScript, server components by default, statically rendered pages.
- **Tailwind CSS**, mobile-first.
- **next/image** for every photo (proper `sizes`, `priority` on the hero only) and **next/font** for fonts.
- **Zod** for validation; **react-hook-form** optional.
- **lucide-react** (or similar) for icons, mapped from icon names.
- **Animation:** minimal, subtle reveal only.

**Component structure** (adapt naming to the boilerplate)

```
app/
  layout.tsx             // fonts, metadata, analytics scripts (env-gated)
  page.tsx               // fetches content via lib/content, composes sections
  api/lead/route.ts      // lead endpoint -> LeadService
  sitemap.ts, robots.ts
components/
  layout/    Header, Footer, StickyContactBar
  sections/  Hero, Services, WhyChooseUs, About, Team, Gallery,
             ServiceAreas, QuoteForm, Contact
  ui/        Button, Card, SectionHeading, Lightbox, WhatsAppButton, CallButton
lib/
  content/   (see §3.3)
  leads/     (see §3.3)
  validators.ts
  analytics.ts
```

---

## 5. Lead Form

**Fields**
| Field | Type | Rules |
|---|---|---|
| Full name | text | required, 2 to 60 chars |
| Mobile number | tel | required, UAE-friendly validation (+971 / 05x), normalized before submit |
| Service | select | required; options from `getServices()` plus "Other" |
| Message / details | textarea | optional (property size, location, date) |
| Contact via WhatsApp | checkbox | optional, default on |

**Behavior**

- One shared Zod schema for client and server validation.
- Service is pre-selected when arriving from a service card.
- States: idle, validating, submitting, success, error.
- Success: confirmation message plus a **Chat on WhatsApp now** button with a pre-filled message.
- Error: friendly message with a fallback ("Please call or WhatsApp us").
- Spam protection: honeypot field and a simple in-memory rate limit on the route.
- Hidden fields captured automatically: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `fbclid`, landing URL, timestamp.

---

## 6. WhatsApp and Call

- **WhatsApp:** `https://wa.me/<number>?text=<encoded message>`; the message varies by context (general vs. selected service).
- **Call:** `tel:<number>`.
- Present in: header, hero, sticky mobile bar, contact section, footer, form success state.
- Number, default message and email come from `SiteSettings`.
- Click events tracked (see §7).

---

## 7. Tracking

- **Meta Pixel:** `PageView`; `Lead` on successful form submission; events for WhatsApp and Call clicks.
- **GA4:** page views, `form_submit`, `whatsapp_click`, `call_click`.
- **Env-gated:** if an ID is not set, the script does not load and event helpers are no-ops.
- Scripts load through `next/script` (`afterInteractive`).
- Ad-landing hygiene: headline matches the ad promise, and the CTA is visible without scrolling on a phone.

---

## 8. SEO and Metadata

- Title and meta description targeting "cleaning services Dubai", read from `SiteSettings`.
- Open Graph and Twitter images.
- JSON-LD `LocalBusiness` / `HouseCleaningService`, generated from settings, services and areas.
- One `h1`, logical heading hierarchy, descriptive image `alt` text.
- `sitemap.xml`, `robots.txt`, favicon set, canonical URL.
- `noindex` on any non-production deployment so placeholder content is never indexed.

---

## 9. Design Direction

- Clean, trustworthy, bright: whites and light neutrals, one strong brand color, one CTA accent.
- Large legible type, generous spacing.
- Consistent CTAs: **Get a Free Quote** (primary), **WhatsApp** (green), **Call Now** (outline).
- Accessible contrast, visible focus states, tap targets of at least 44px.
- Layouts must survive varied content: long titles, missing images, more or fewer items than the dummy set.

---

## 10. Dummy Dubai Service Areas

Dubai Marina, JLT, Downtown Dubai, Business Bay, Palm Jumeirah, JVC, Dubai Hills, Arabian Ranches, Al Barsha, Jumeirah, Mirdif, Deira, Bur Dubai, Dubai Silicon Oasis, Al Quoz.

---

## 11. Build Checklist

### Step 1: Setup

- [ ] Set up the project from the boilerplate; confirm dev server, lint and formatting work
- [ ] Define content types and Zod schemas (`lib/content/types.ts`)
- [ ] Create the `ContentRepository` interface, `MockContentRepository`, and `lib/content/index.ts`
- [ ] Add brand colors, fonts and the base layout

### Step 2: Dummy data

- [ ] Write mock data files for every entity (marked `// DUMMY`)
- [ ] Add placeholder images with consistent ratios
- [ ] Add the icon-name to component map

### Step 3: Sections

- [ ] Header and Footer
- [ ] Hero
- [ ] Services (6 cards, data-driven)
- [ ] Why Choose JUBU
- [ ] About / Company Profile
- [ ] Our Team
- [ ] Projects / Gallery with lightbox
- [ ] Dubai Service Areas
- [ ] Contact section
- [ ] Sticky mobile Call / WhatsApp / Quote bar
- [ ] Compose everything in `app/page.tsx` from content-layer data

### Step 4: Lead form

- [ ] Quote form UI with validation and all states
- [ ] `/api/lead` route calling `LeadService`
- [ ] `MockLeadService`
- [ ] Honeypot and rate limiting
- [ ] UTM / fbclid capture
- [ ] Success state with WhatsApp follow-up button
- [ ] Service card to form pre-select

### Step 5: Tracking and SEO

- [ ] Meta Pixel and GA4 helpers (env-gated, no-op when unset)
- [ ] Metadata, OG image, JSON-LD, sitemap, robots, favicons
- [ ] `noindex` for non-production

### Step 6: QA

- [ ] Responsive pass (320px, 375px, 768px, 1280px)
- [ ] Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95
- [ ] WhatsApp and call links tested on iOS and Android
- [ ] Layouts tested with stress content (very long text, missing optional fields)
- [ ] Cross-browser check (Safari iOS, Chrome Android, desktop Chrome/Safari)
- [ ] Content-layer check: temporarily point the app at a second mock repository with different data and confirm the page updates with zero component changes

---

## 12. Environment Variables

All optional:

```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_META_PIXEL_ID=      # empty = tracking disabled
NEXT_PUBLIC_GA_ID=              # empty = tracking disabled
```

(Adjust names to the boilerplate's env conventions. Never commit secrets.)

---

## 13. Acceptance Criteria

- The page renders fully from dummy data through the content layer. **No component imports a data file directly.**
- Swapping the repository implementation requires no component changes.
- WhatsApp, Call, and the quote form are reachable within one tap or scroll from anywhere on the page.
- The form validates on client and server, shows all states, captures UTM data, and passes a complete payload to `LeadService`.
- Layout is correct at 375px width, and the Lighthouse targets are met.
- Every placeholder is marked `// DUMMY`, and the deployment is `noindex`.
