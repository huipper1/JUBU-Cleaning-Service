# JUBU Cleaning Service: Area Landing Pages Plan (Next.js)

> **Goal:** turn the existing one-page site (deployed at https://jebucleaning.netlify.app/) into a template that also generates **5 area-specific landing pages**, one per Google/Facebook ad campaign area, so each ad can point to a URL that matches the visitor's area in the headline, copy and FAQ — without maintaining 5 separate designs.
>
> **Scope of this stage:** routing, content model and copy for the 5 area pages only. **No redesign.** Every area page must look and behave exactly like the existing root page (`/`) — same components, same layout, same styling, same section order — with only the area-specific text (and, where noted, FAQ) swapped in.
>
> Read `.agent/AGENT.md` and the existing `PLAN.md` first and follow their conventions (content layer pattern, no hard-coded business copy in components, etc.). This plan extends that architecture; it does not replace it.

---

## 1. Areas and Routes

| # | Area | Route | Ad focus |
|---|---|---|---|
| 1 | Business Bay | `/business-bay` | Office & apartment cleaning, post-construction |
| 2 | Dubai Marina | `/dubai-marina` | Home cleaning & maid services, move-in/move-out |
| 3 | Jumeirah | `/jumeirah` | Villa deep cleaning, post-construction & move-in villa cleaning |
| 4 | Downtown Dubai | `/downtown-dubai` | Luxury apartment & penthouse cleaning, post-construction & move-in |
| 5 | Jumeirah Village Circle (JVC) | `/jvc` | Home & apartment cleaning, deep cleaning, move-in/out, post-construction |

Decision: use **`/[area]`** as a single dynamic route at the root level (not `/areas/[area]`), matching the client's preferred flat URL structure, and not 5 separate page files, so all 5 pages share one template.

**Route-collision rule (important):** Next.js gives statically-defined routes priority over a dynamic `[area]` segment automatically, so existing/future top-level routes such as `/admin`, `/api/*`, `/sitemap.xml`, `/robots.txt`, `/favicon.ico` are never intercepted by `[area]`. Even so:
- Maintain an explicit allow-list of valid area slugs (the 5 in the table above) inside the route handler. Any request to `/[area]` where the slug is not in that list must render Next's standard `not-found` (404), not attempt a partial render.
- Before adding any new top-level static route in the future (e.g. `/about`, `/pricing`), check it doesn't collide with a current or planned area slug.
- The main one-page site at `/` is untouched and keeps working exactly as it does today.

---

## 2. Page Structure (per area page) — identical structure to `/`

Each area page renders **the exact same sections, in the exact same order, using the exact same components**, as the root page:

1. Header
2. Hero
3. Our Services
4. Why Choose JUBU
5. About Us / Company Profile
6. Our Team
7. Projects / Gallery
8. Dubai Service Areas
9. Get a Free Quote (Lead Form)
10. Contact Us
11. Footer
12. Sticky mobile bar

**What changes per area (content only, not layout):**
- Hero headline and intro paragraph
- The services section's heading/subheading and, where the client's copy lists a different service order/emphasis, its bullet list (still rendered by the same `Services` component)
- One featured/secondary content block (the second headline from the client's brief, e.g. "Post-Construction Office & Apartment Cleaning") — inserted using the same visual card/band style already used elsewhere on the page for a secondary content block, not a new custom layout
- A short "near you" paragraph
- FAQ content (new section, since the root page doesn't currently have one — see §2.1)
- The final CTA band's heading (e.g. "Need Cleaning Services in Business Bay?")
- Meta title/description, H1, canonical URL, JSON-LD `areaServed`, image `alt` text

**What does NOT change per area** (rendered byte-for-byte identical to `/`):
- Why Choose JUBU content
- About Us / Company Profile content
- Our Team content
- Gallery content
- Dubai Service Areas list
- Contact Us content
- Footer
- WhatsApp number, phone number, all button behavior

### 2.1 FAQ section
The root page has no FAQ section today. Since the client's copy includes one per area, add a single new `Faq` component, styled to match the existing design system (same card/accordion look already used elsewhere, e.g. matching the corner radius, spacing and color tokens already defined in the project — do not invent a new visual style for it). This component is:
- Used on all 5 area pages
- Also safe to reuse on `/` later if desired, but **do not add it to `/` in this stage** unless explicitly asked — keep this stage's change to the area pages only, so the root page's current, approved design is not touched.

---

## 3. Content Architecture

Follow the existing content-layer pattern: **no area copy hard-coded inside components.** Add area content as a new typed entity, delivered the same way the rest of the site's content is delivered. Components stay generic — they accept the same props whether they're rendered on `/` or on `/[area]`; the only difference is which data is passed in.

### 3.1 New entity: `AreaLandingPage`

| Field | Type | Notes |
|---|---|---|
| `id` | string | e.g. `business-bay` |
| `slug` | string | matches the route segment, e.g. `business-bay` |
| `areaName` | string | display name, e.g. "Business Bay" |
| `metaTitle` | string | for `<title>` |
| `metaDescription` | string | for meta description |
| `heroHeadline` | string | H1, passed into the existing `Hero` component's headline prop |
| `heroIntro` | string | short paragraph, passed into the existing `Hero` component's intro/subheadline prop |
| `heroImage` | ImageRef | optional override; falls back to the root page's default hero image if not set |
| `servicesSectionTitle` | string | passed into the existing `Services` component's heading prop |
| `servicesList` | string[] | bullet list of services for this area; if the existing `Services` component renders from the global `Service[]` list rather than a plain string list, keep using that global list and only override the heading — do not fork the services data model per area unless the copy genuinely requires a different service set to display (see implementer note below) |
| `featuredBlockTitle` | string | secondary headline, e.g. "Post-Construction Office & Apartment Cleaning" |
| `featuredBlockText` | string \| { title: string; text: string }[] | most areas: one block. JVC: three blocks (see §4.5) |
| `nearYouTitle` | string | e.g. "Cleaning Services Near You in Business Bay" |
| `nearYouText` | string | paragraph |
| `finalCtaTitle` | string | passed into the existing quote-band component's heading prop, e.g. "Need Cleaning Services in Business Bay?" |
| `faqs` | `{ question: string; answer: string }[]` | 4 items, rendered by the new `Faq` component |
| `isActive` | boolean | so a page can be turned off without deleting it |
| `order` | number | for any future listing/index of area pages |

> **Implementer note on `servicesList`:** the client's per-area service bullet lists are largely the same 8 items as the site's existing 6 core services, just phrased slightly differently and reordered per area (e.g. "Apartment Cleaning" vs. "Home Cleaning", "Kitchen & Bathroom Cleaning" and "Floor Cleaning" as extra line items not currently separate services on the root page). Two acceptable approaches — pick whichever requires the smaller, safer change to the existing `Services` component, and note the choice in your summary when this step is done:
> (a) Keep rendering the existing global `Service[]` list unchanged (same 6 cards, same order) and only swap the section heading/subheading per area, treating the client's bullet lists as descriptive copy rather than a literal 1:1 re-list — the safer, more "no redesign" option; or
> (b) Extend the `Services` component to optionally accept an override list of plain strings (rendered as simple list items, not full cards) so the exact client-provided bullets appear — only do this if it can be added as a non-breaking optional prop with a sensible default that reproduces today's `/` output exactly when the prop is omitted.

Why Choose JUBU content is **not** duplicated per area — it's read from the existing `WhyChooseItem[]` already in the content layer, same as the root page.

### 3.2 Structure

```
lib/
  content/
    types.ts                    // add AreaLandingPage type + Zod schema
    repository.ts               // add getAreaLandingPages(): Promise<AreaLandingPage[]>
                                 // add getAreaLandingPage(slug): Promise<AreaLandingPage | null>
    mock/
      repository.ts             // implement the two methods above
      data/
        area-landing-pages.ts   // the 5 entries, real copy from the client (not dummy —
                                 // this is real, client-provided marketing copy, use as-is)
app/
  [area]/
    page.tsx                    // validates params.area against the allow-list of 5 slugs,
                                 // 404s via notFound() if not found/inactive,
                                 // fetches AreaLandingPage + shared content (WhyChoose, About,
                                 // Team, Gallery, ServiceAreas, SiteSettings) exactly like app/page.tsx does,
                                 // and renders the SAME section components as app/page.tsx,
                                 // passing area-specific props where they differ
components/
  sections/
    Faq.tsx                     // new; the only new component in this stage
    // Hero, Services, WhyChooseUs, About, Team, Gallery, ServiceAreas,
    // QuoteForm/CTA band, Contact — all REUSED, unmodified except for
    // any small optional-prop additions noted in §3.1's implementer note
```

`generateStaticParams` in `app/[area]/page.tsx` returns the 5 slugs so all pages are statically generated at build time.

`generateMetadata` in the same file builds `<title>` and meta description from `metaTitle`/`metaDescription`, plus per-page Open Graph tags and canonical URL (`https://jebucleaning.netlify.app/[area]` or the final production domain, whichever is current at build time).

**To avoid duplicating the page composition logic**, factor the shared "assemble all sections in order" logic out of `app/page.tsx` into a single shared function/component (e.g. `components/LandingPageLayout.tsx` or a `renderLandingPage(content)` helper) that both `app/page.tsx` and `app/[area]/page.tsx` call, passing root-page content or area-page content respectively. This guarantees the two can never visually drift apart — a change to section order or a shared section on one page automatically applies to the other, and there is only one place to maintain the "same design" the client asked for. If `app/page.tsx` is currently short enough that this refactor is riskier than helpful, an acceptable alternative is: build `app/[area]/page.tsx` by copying `app/page.tsx`'s JSX structure exactly, section by section, and add a code comment at the top of both files noting that any structural change must be mirrored in the other file until they're unified.

---

## 4. Content Data (from the client — use exactly as provided, lightly cleaned for consistent formatting)

> This is **real marketing copy**, not placeholder/dummy data. Insert it into `area-landing-pages.ts` largely as-is; only reformat into the fields in §3.1 and keep phrasing intact. Do not shorten or rewrite it.

### 4.1 Business Bay (`business-bay`)
- **Hero headline:** Professional Office & Apartment Cleaning Services in Business Bay
- **Hero intro:** Looking for reliable cleaning services in Business Bay? JUBU Cleaning Service provides professional cleaning solutions for apartments, offices and commercial properties in Business Bay, Dubai. Whether you need regular cleaning, deep cleaning or post-construction cleaning, our team is ready to help.
- **Services section title:** Our Cleaning Services in Business Bay
- **Services (descriptive list):** Apartment Cleaning; Office Cleaning; Deep Cleaning; Post-Construction Cleaning; Move-In / Move-Out Cleaning; Kitchen & Bathroom Cleaning; Floor Cleaning; Commercial Cleaning
- **Featured block title:** Post-Construction Office & Apartment Cleaning
- **Featured block text:** Moving into a newly completed office or apartment? Construction dust, paint marks and leftover debris can make the property difficult to use. JUBU Cleaning Service provides detailed post-construction cleaning to help prepare your property for move-in or business operations.
- **Near-you title:** Cleaning Services Near You in Business Bay
- **Near-you text:** We provide cleaning services for apartments, offices and commercial properties throughout Business Bay. Tell us about your property and cleaning requirements, and we will provide a quotation based on the work required.
- **FAQs:**
  1. Do you provide apartment cleaning in Business Bay? — Yes. We provide apartment cleaning and deep cleaning services in Business Bay.
  2. Do you provide office cleaning? — Yes. Our services include office and commercial cleaning.
  3. Do you provide post-construction cleaning? — Yes. We provide post-construction cleaning for offices and apartments.
  4. How can I get a quotation? — Contact us through WhatsApp, phone or our quotation form.
- **Final CTA title:** Need Cleaning Services in Business Bay?

### 4.2 Dubai Marina (`dubai-marina`)
- **Hero headline:** Top-Rated Home Cleaning & Maid Services in Dubai Marina
- **Hero intro:** Need reliable home cleaning services in Dubai Marina? JUBU Cleaning Service provides professional home, apartment and deep cleaning services for residents in Dubai Marina. From regular home cleaning to detailed move-in and move-out cleaning, we can help keep your property clean and ready.
- **Services section title:** Our Cleaning Services in Dubai Marina
- **Services (descriptive list):** Home Cleaning; Apartment Cleaning; Deep Cleaning; Move-In Cleaning; Move-Out Cleaning; Kitchen & Bathroom Cleaning; Floor Cleaning; Post-Construction Cleaning
- **Featured block title:** Move-In / Move-Out Deep Cleaning
- **Featured block text:** Moving into a new apartment or preparing to leave your current home? Our move-in and move-out cleaning service focuses on the areas that need detailed attention, including kitchens, bathrooms, floors, surfaces and other accessible areas of the property.
- **Near-you title:** Apartment Cleaning in Dubai Marina
- **Near-you text:** JUBU Cleaning Service provides cleaning solutions for apartments and homes in Dubai Marina. Whether you need a one-time deep clean or regular cleaning, contact us with your requirements and property details.
- **FAQs:**
  1. Do you clean apartments in Dubai Marina? — Yes. We provide apartment cleaning and deep cleaning services in Dubai Marina.
  2. Do you provide move-in and move-out cleaning? — Yes. We provide detailed move-in and move-out cleaning.
  3. Can I book a one-time deep cleaning? — Yes. One-time deep cleaning is available depending on your requirements.
  4. How do I request a quotation? — Contact us through WhatsApp, phone or our online quotation form.
- **Final CTA title:** Need Home Cleaning in Dubai Marina?

### 4.3 Jumeirah (`jumeirah`)
- **Hero headline:** Premium Villa Deep Cleaning Services in Jumeirah
- **Hero intro:** Looking for professional villa cleaning services in Jumeirah? JUBU Cleaning Service provides detailed villa deep cleaning and move-in cleaning services for residential properties in Jumeirah, Dubai. Our team can help prepare villas for move-in, after renovation or construction, or for a detailed one-time clean.
- **Services section title:** Our Villa Cleaning Services in Jumeirah
- **Services (descriptive list):** Villa Deep Cleaning; Regular Villa Cleaning; Move-In Cleaning; Move-Out Cleaning; Post-Construction Cleaning; Kitchen & Bathroom Cleaning; Floor Cleaning; Interior Cleaning
- **Featured block title:** Post-Construction & Move-In Villa Deep Cleaning
- **Featured block text:** After construction or renovation, villas may require detailed cleaning before they are ready for use. JUBU Cleaning Service can help remove construction dust and clean accessible surfaces, floors, kitchens, bathrooms and other areas according to the property's requirements.
- **Near-you title:** Villa Cleaning in Jumeirah
- **Near-you text:** Every villa can have different cleaning requirements. Tell us the villa size, condition and type of cleaning required so we can provide a suitable quotation.
- **FAQs:**
  1. Do you provide villa deep cleaning in Jumeirah? — Yes. We provide villa deep cleaning services in Jumeirah.
  2. Do you clean villas after construction or renovation? — Yes. Post-construction and post-renovation cleaning services are available.
  3. Do you provide move-in cleaning? — Yes. We provide move-in cleaning for villas and other residential properties.
  4. How can I get a quotation? — Contact JUBU through WhatsApp, phone or our online quotation form.
- **Final CTA title:** Need Villa Cleaning in Jumeirah?

### 4.4 Downtown Dubai (`downtown-dubai`)
- **Hero headline:** Luxury Apartment & Penthouse Cleaning in Downtown Dubai
- **Hero intro:** JUBU Cleaning Service provides professional apartment, penthouse and deep cleaning services in Downtown Dubai. Whether you are preparing a property for move-in, moving out or need detailed cleaning after construction or renovation, our team can help.
- **Services section title:** Our Cleaning Services in Downtown Dubai
- **Services (descriptive list):** Apartment Cleaning; Penthouse Cleaning; Deep Cleaning; Move-In Cleaning; Move-Out Cleaning; Post-Construction Cleaning; Kitchen & Bathroom Cleaning; Floor Cleaning
- **Featured block title:** Post-Construction & Move-In Apartment Cleaning
- **Featured block text:** Newly completed or renovated apartments may require detailed cleaning before they are ready for occupancy. Our post-construction and move-in cleaning service focuses on removing construction dust and cleaning accessible floors, surfaces, kitchens, bathrooms and other areas according to the property's condition.
- **Near-you title:** Apartment & Penthouse Cleaning in Downtown Dubai
- **Near-you text:** We provide cleaning services for different types of residential properties in Downtown Dubai. For an accurate quotation, send us your property type, approximate size and cleaning requirements.
- **FAQs:**
  1. Do you clean apartments in Downtown Dubai? — Yes. We provide apartment cleaning and deep cleaning services.
  2. Do you provide penthouse cleaning? — Yes. Penthouse cleaning can be arranged based on the property's requirements.
  3. Do you provide post-construction cleaning? — Yes. We provide post-construction cleaning for residential properties.
  4. How can I request a quotation? — Contact us through WhatsApp, phone or our online quotation form.
- **Final CTA title:** Need Apartment or Penthouse Cleaning in Downtown Dubai?

### 4.5 JVC (`jvc`)
- **Hero headline:** Professional Home & Apartment Cleaning Services in JVC
- **Hero intro:** Looking for reliable cleaning services in Jumeirah Village Circle (JVC), Dubai? JUBU Cleaning Service provides professional home and apartment cleaning services in JVC, including deep cleaning, move-in and move-out cleaning, and post-construction cleaning. Whether you need a one-time deep clean or cleaning for a newly completed property, our team is ready to help.
- **Services section title:** Our Cleaning Services in JVC
- **Services (descriptive list):** Apartment Cleaning; Home Cleaning; Deep Cleaning; Move-In Cleaning; Move-Out Cleaning; Post-Construction Cleaning; Kitchen & Bathroom Cleaning; Floor Cleaning; Interior Cleaning
- **Featured blocks (3, in order — this area has three instead of one):**
  1. Deep Cleaning Services in JVC — Our deep cleaning service is suitable for apartments and homes that need more detailed cleaning than regular cleaning. We focus on accessible floors, surfaces, kitchens, bathrooms and other areas according to the property's condition and cleaning requirements.
  2. Move-In & Move-Out Cleaning in JVC — Moving into a new apartment or preparing your property for handover? JUBU Cleaning Service provides move-in and move-out cleaning to help prepare your property before moving in or after moving out.
  3. Post-Construction Cleaning in JVC — Newly constructed or renovated properties may require detailed cleaning before they are ready for occupancy. Our post-construction cleaning service helps remove construction dust and clean accessible surfaces, floors, kitchens, bathrooms and other areas according to the property's condition.
- **Near-you title:** Apartment Cleaning in JVC
- **Near-you text:** JUBU Cleaning Service provides cleaning solutions for apartments and homes throughout Jumeirah Village Circle. Tell us your property type, approximate size and cleaning requirements, and we will provide a quotation based on the work required.
- **FAQs:**
  1. Do you provide apartment cleaning in JVC? — Yes. We provide apartment cleaning and deep cleaning services throughout JVC.
  2. Do you provide one-time deep cleaning? — Yes. One-time deep cleaning can be arranged according to your property's requirements.
  3. Do you provide move-in and move-out cleaning? — Yes. We provide move-in and move-out cleaning for apartments and homes.
  4. Do you provide post-construction cleaning? — Yes. We provide post-construction cleaning for newly completed or renovated properties.
- **Final CTA title:** Need Cleaning Services in JVC?

> Note the mismatch: the client's intro message names 4 target areas, but the copy supplied covers **5** pages including JVC. Build all 5 — flag this to the client to confirm all 5 should go live (see §10, open question 1).

---

## 5. Shared Elements Across All 5 Pages (per client's instruction)

- **WhatsApp button** and **Call Now button**: identical destination and behavior on every area page and on the root page — same phone/WhatsApp number from `SiteSettings`, not area-specific.
- **"Get a Free Quote" is prioritized over "Book Now"** everywhere, per the client's explicit note that pricing varies by property size/condition, so a fixed price should never be shown. Verify no area copy implies a fixed price.
- **Lead form**: same fields, same validation, same WhatsApp-redirect-on-submit behavior as the root page (see existing `PLAN.md` §5 and the WhatsApp-submit change already implemented). Only addition: a hidden `source_area` field (e.g. `"business-bay"`, or `"main-page"` on `/`) included in the WhatsApp message text and in the payload sent to the lead service, so leads are traceable to the campaign/page they came from.

---

## 6. SEO and Tracking (per-page requirements)

Each of the 5 pages must have, independently:
- Unique `<title>` and meta description (from `metaTitle`/`metaDescription`)
- Unique H1 (`heroHeadline`, rendered by the same `Hero` component used on `/`)
- Unique FAQ content (new `Faq` section, area pages only)
- Unique image `alt` text (area name included, on any overridden hero image)
- Canonical URL pointing to its own `/[area]` path (not to `/`)
- `JSON-LD` `LocalBusiness` (or `Service`) structured data with `areaServed` set to that specific area, extending the same JSON-LD approach already used on the root page
- **FAQPage JSON-LD** for the FAQ section on each page (helps Google Ads Quality Score and can earn FAQ rich results)
- Internal link back to the root page (e.g. in the footer or near the FAQ) so these pages aren't orphaned for SEO — the shared `Footer` component already does this if it links to `/`
- All 5 routes included in `sitemap.ts`
- Meta Pixel / GA4 `PageView` fires per area page, same as the root page; consider adding the area slug as an event parameter so ad performance can be split by area, if the existing analytics helper already supports custom event parameters

Google/Facebook Ads destination URLs (to hand back to the client once deployed):
```
https://jebucleaning.netlify.app/business-bay
https://jebucleaning.netlify.app/dubai-marina
https://jebucleaning.netlify.app/jumeirah
https://jebucleaning.netlify.app/downtown-dubai
https://jebucleaning.netlify.app/jvc
```
(Replace with the production domain if one is set up before launch.)

---

## 7. Images (optional polish, not blocking)

The client mentioned swapping 1–2 images per area. Treat this as optional and non-blocking for this stage:
- If distinct area photos exist already in the project's gallery/service images, map one relevant image to each area's hero via the optional `heroImage` field (e.g. a villa photo for Jumeirah, an apartment/tower photo for Downtown and Dubai Marina, an office photo for Business Bay).
- If no distinct images are available, all 5 pages use the same existing hero image as `/` and this is acceptable for launch — copy and headline differentiation matters far more for Quality Score than the photo does.
- Do not block the whole build on new photography.

---

## 8. Build Checklist

### Step 1: Data and types
- [ ] Add `AreaLandingPage` type + Zod schema to `lib/content/types.ts`
- [ ] Add `getAreaLandingPages()` and `getAreaLandingPage(slug)` to the `ContentRepository` interface
- [ ] Implement both in `MockContentRepository`
- [ ] Create `lib/content/mock/data/area-landing-pages.ts` with all 5 entries from §4, entered as real content (not marked `// DUMMY`, since this is real client copy)
- [ ] Define and export the allow-list of the 5 valid slugs in one place (used by both the route's `generateStaticParams` and its runtime validity check)

### Step 2: Route and shared layout
- [ ] Decide and apply the approach from §3.2 for sharing page composition between `app/page.tsx` and `app/[area]/page.tsx` (extract a shared layout/helper, or mirror the JSX with a linking comment)
- [ ] Create `app/[area]/page.tsx`; validate `params.area` against the allow-list, call `notFound()` if invalid or inactive
- [ ] Implement `generateStaticParams` returning the 5 slugs
- [ ] Implement `generateMetadata` (title, description, OG, canonical) per area
- [ ] Confirm every section on `/[area]` uses the SAME component as `/` — no new section components created except `Faq`
- [ ] Add small, optional, backward-compatible props to `Hero` / the quote-band component / (optionally) `Services` only as needed per §3.1's implementer note, with defaults that reproduce today's `/` output exactly when the prop is omitted
- [ ] Build the new `Faq` component matching the existing design system, used only on the 5 area pages in this stage

### Step 3: Lead form area tracking
- [ ] Add optional `sourceArea` prop to the lead form, defaulting to `"main-page"` when not provided
- [ ] Include `Source: {sourceArea}` in the WhatsApp message text (matching the existing message template)
- [ ] Confirm the background call to the lead service (mock or real) also receives `sourceArea`

### Step 4: SEO and tracking
- [ ] Add JSON-LD (`LocalBusiness`/`Service` with area-specific `areaServed`) per page
- [ ] Add FAQPage JSON-LD per page from the `faqs` array
- [ ] Add all 5 routes to `sitemap.ts`
- [ ] Confirm Meta Pixel / GA4 `PageView` fires per area page, with the area slug attached as an event parameter if supported

### Step 5: QA
- [ ] Visit all 5 pages and confirm: correct H1, correct services section heading, correct featured block(s), correct FAQ, working WhatsApp/Call/Quote buttons, working form submission with the correct `source_area`
- [ ] Side-by-side visual check: every area page matches `/`'s layout, spacing, colors and component styling exactly, aside from the area-specific text and the new FAQ section
- [ ] Confirm `/` (root page) is completely unaffected — same DOM structure, same content, no FAQ section added to it
- [ ] Confirm a request to an invalid slug (e.g. `/some-random-page`) 404s cleanly and does not collide with any existing route
- [ ] Confirm each page's `<title>`, meta description and canonical URL are unique and correct
- [ ] Run lint, typecheck and build; fix all errors
- [ ] Test responsiveness at 375px and 1280px on at least 2 of the 5 area pages (they share components, so a full re-test of all 5 isn't required, but check at least one from each distinct featured-block layout: single block vs. JVC's 3-block layout)
- [ ] Deploy and manually click through all 5 live URLs before sending them back to the client

---

## 9. Acceptance Criteria

- All 5 URLs in §6 are live and each shows area-correct headline, services section heading, featured content and FAQ.
- Every area page is visually and structurally identical to `/` except for: the area-specific text fields listed in §2, the optional hero image override, and the new FAQ section.
- WhatsApp and Call buttons behave identically to the root page on every area page.
- The lead form works identically to the root page (validation, WhatsApp redirect, background lead logging) and additionally tags the lead with the source area.
- No fixed prices appear on any area page; "Get a Free Quote" is the primary CTA everywhere, "Book Now"/"Call Now" secondary.
- No area copy, FAQ, or image is hard-coded into a shared component — everything area-specific comes from `AreaLandingPage` data through the content layer.
- No new top-level route collides with an area slug, and an invalid `/[area]` request 404s cleanly.
- Adding a 6th area in the future requires only a new data entry (and, if desired, a new ad URL) — no component or routing code changes.
- Root page (`/`) remains unchanged and unaffected, with no FAQ section added to it in this stage.

---

## 10. Open Questions for the Client

1. The intro message names 4 target areas, but 5 sets of landing copy (including JVC) were provided — please confirm all 5 should go live, or if JVC should wait.
2. Should each area page have a distinct hero photo, or is reusing the current site photography acceptable for launch?
3. Is the final production domain still `jebucleaning.netlify.app`, or will a custom domain be connected before ads go live (this affects canonical URLs and the ad destination URLs)?
4. Should Google Ads and Facebook Ads use the same 5 URLs, or does the client want separate UTM parameters per platform (e.g. `?utm_source=google` vs `?utm_source=facebook`) appended to the same URLs for cleaner tracking?
