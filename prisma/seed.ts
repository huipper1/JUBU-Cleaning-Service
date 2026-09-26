import { Prisma, PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { mockSettingsData } from "../src/lib/content/mock/data/settings";
import { mockHeroData } from "../src/lib/content/mock/data/hero";
import { mockAboutData } from "../src/lib/content/mock/data/about";
import { mockServicesData } from "../src/lib/content/mock/data/services";
import { mockWhyChooseData } from "../src/lib/content/mock/data/why-choose";
import { mockTeamData } from "../src/lib/content/mock/data/team";
import { mockGalleryData } from "../src/lib/content/mock/data/gallery";
import { mockAreasData } from "../src/lib/content/mock/data/areas";
import { mockAreaLandingPagesData } from "../src/lib/content/mock/data/area-landing-pages";
import { mockTestimonialsData } from "../src/lib/content/mock/data/testimonials";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting JUBU Cleaning Service database seed...");

  // 1. Site Settings (Singleton)
  console.log("Seeding SiteSettings...");
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      businessName: mockSettingsData.businessName,
      tagline: mockSettingsData.tagline,
      badgeText: mockSettingsData.badgeText,
      logoSrc: mockSettingsData.logo.src,
      logoAlt: mockSettingsData.logo.alt,
      logoWidth: mockSettingsData.logo.width,
      logoHeight: mockSettingsData.logo.height,
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
      socialLinks: mockSettingsData.socialLinks as unknown as Prisma.InputJsonValue,
      seoTitle: mockSettingsData.defaultSeo.title,
      seoDescription: mockSettingsData.defaultSeo.description,
      seoOgImage: mockSettingsData.defaultSeo.ogImage ?? "/images/logo.png",
      copyrightText: mockSettingsData.copyrightText,
      licenceNumber: mockSettingsData.licence.number,
      licenceStructure: mockSettingsData.licence.legalStructure,
      licenceAuthority: mockSettingsData.licence.issuingAuthority,
      licenceIssueDate: mockSettingsData.licence.issueDate
    }
  });

  // 2. Hero Content (Singleton)
  console.log("Seeding HeroContent...");
  await prisma.heroContent.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      badge: mockHeroData.badge,
      headline: mockHeroData.headline,
      subheadline: mockHeroData.subheadline,
      primaryCtaLabel: mockHeroData.primaryCta.label,
      primaryCtaHref: mockHeroData.primaryCta.href,
      secondaryCtaLabel: mockHeroData.secondaryCta.label,
      secondaryCtaHref: mockHeroData.secondaryCta.href,
      trustBadges: mockHeroData.trustBadges as unknown as Prisma.InputJsonValue,
      heroImageSrc: mockHeroData.heroImage.src,
      heroImageAlt: mockHeroData.heroImage.alt,
      heroImageWidth: mockHeroData.heroImage.width,
      heroImageHeight: mockHeroData.heroImage.height,
      floatingBadge: mockHeroData.floatingBadge
    }
  });

  // 3. About Content (Singleton)
  console.log("Seeding AboutContent...");
  await prisma.aboutContent.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      badge: mockAboutData.badge,
      heading: mockAboutData.heading,
      paragraphs: mockAboutData.paragraphs,
      ctaLabel: mockAboutData.cta.label,
      ctaHref: mockAboutData.cta.href,
      highlights: mockAboutData.highlights as unknown as Prisma.InputJsonValue,
      taglineBadge: mockAboutData.taglineBadge ?? "Licensed & Reliable",
      secondaryBadge: mockAboutData.secondaryBadge ?? "Dubai-Wide Service",
      images: mockAboutData.images as unknown as Prisma.InputJsonValue,
      equipment: mockAboutData.equipment
    }
  });

  // 4. Services
  console.log("Seeding Services...");
  for (const s of mockServicesData) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        slug: s.slug,
        title: s.title,
        shortDescription: s.shortDescription,
        longDescription: s.longDescription ?? null,
        icon: s.icon,
        imageSrc: s.image.src,
        imageAlt: s.image.alt,
        imageWidth: s.image.width,
        imageHeight: s.image.height,
        order: s.order,
        isActive: s.isActive
      }
    });
  }

  // 5. Why Choose Us
  console.log("Seeding WhyChoose items...");
  for (const item of mockWhyChooseData) {
    await prisma.whyChooseItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        title: item.title,
        description: item.description,
        icon: item.icon,
        order: item.order,
        isActive: item.isActive
      }
    });
  }

  // 6. Team Members
  console.log("Seeding Team members...");
  for (const t of mockTeamData) {
    await prisma.teamMember.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        name: t.name,
        role: t.role,
        bio: t.bio ?? null,
        photoSrc: t.photo.src,
        photoAlt: t.photo.alt,
        photoWidth: t.photo.width,
        photoHeight: t.photo.height,
        order: t.order,
        isActive: t.isActive
      }
    });
  }

  // 7. Gallery Items
  console.log("Seeding Gallery items...");
  for (const g of mockGalleryData) {
    await prisma.galleryItem.upsert({
      where: { id: g.id },
      update: {},
      create: {
        id: g.id,
        title: g.title,
        caption: g.caption ?? null,
        serviceId: g.serviceId,
        imageSrc: g.image.src,
        imageAlt: g.image.alt,
        imageWidth: g.image.width,
        imageHeight: g.image.height,
        beforeImageSrc: g.beforeImage?.src ?? null,
        beforeImageAlt: g.beforeImage?.alt ?? null,
        afterImageSrc: g.afterImage?.src ?? null,
        afterImageAlt: g.afterImage?.alt ?? null,
        isBeforeAfter: g.isBeforeAfter ?? false,
        order: g.order,
        isActive: g.isActive
      }
    });
  }

  // 8. Service Areas
  console.log("Seeding Service Areas...");
  for (const a of mockAreasData) {
    await prisma.serviceArea.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id,
        name: a.name,
        slug: a.slug,
        lat: a.lat ?? null,
        lng: a.lng ?? null,
        order: a.order,
        isActive: a.isActive
      }
    });
  }

  // 9. Area Landing Pages (5 ad targets)
  console.log("Seeding Area Landing Pages...");
  for (const page of mockAreaLandingPagesData) {
    await prisma.areaLandingPage.upsert({
      where: { id: page.id },
      update: {},
      create: {
        id: page.id,
        slug: page.slug,
        areaName: page.areaName,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        heroHeadline: page.heroHeadline,
        heroIntro: page.heroIntro,
        heroImageSrc: page.heroImage?.src ?? null,
        heroImageAlt: page.heroImage?.alt ?? null,
        heroImageWidth: page.heroImage?.width ?? null,
        heroImageHeight: page.heroImage?.height ?? null,
        servicesSectionTitle: page.servicesSectionTitle,
        servicesList: page.servicesList ?? [],
        featuredBlockTitle: page.featuredBlockTitle,
        featuredBlockText: page.featuredBlockText as unknown as Prisma.InputJsonValue,
        nearYouTitle: page.nearYouTitle,
        nearYouText: page.nearYouText,
        finalCtaTitle: page.finalCtaTitle,
        faqs: page.faqs as unknown as Prisma.InputJsonValue,
        order: 0,
        isActive: true
      }
    });
  }

  // 10. Testimonials
  console.log("Seeding Testimonials...");
  for (const [idx, t] of mockTestimonialsData.entries()) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        name: t.name,
        location: t.location ?? "Dubai",
        service: t.service ?? "Deep Cleaning",
        rating: t.rating,
        quote: t.review,
        avatarSrc: t.avatar ?? null,
        order: idx + 1,
        isActive: true
      }
    });
  }

  // 11. Admin User Seeding (Credentials from .env)
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@jubucleaning.ae").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@JubuCleaning2026!";

  console.log(`Seeding Admin User (${adminEmail})...`);

  // Remove any stale admin users from Prisma and Supabase auth to ensure clean credentials
  await prisma.adminUser.deleteMany();

  // Create confirmed Supabase Auth user directly via PostgreSQL with crypt()
  await prisma.$executeRawUnsafe(`
    DELETE FROM auth.users WHERE LOWER(email) = LOWER('${adminEmail}');
  `);

  const users: Array<{ id: string }> = await prisma.$queryRawUnsafe(`
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      '${adminEmail}',
      crypt('${adminPassword}', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"JUBU Admin"}'::jsonb,
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    )
    RETURNING id;
  `);

  const supabaseUid = users[0]?.id;

  if (!supabaseUid) {
    throw new Error("Failed to insert user into auth.users");
  }

  // Also add identity row if auth.identities exists
  try {
    await prisma.$executeRawUnsafe(`
      DELETE FROM auth.identities WHERE user_id = '${supabaseUid}'::uuid;
    `);
    await prisma.$executeRawUnsafe(`
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        '${supabaseUid}'::uuid,
        json_build_object('sub', '${supabaseUid}', 'email', '${adminEmail}'),
        'email',
        '${supabaseUid}',
        NOW(),
        NOW(),
        NOW()
      );
    `);
  } catch (identErr) {
    console.warn("Notice on auth.identities:", identErr);
  }

  await prisma.adminUser.create({
    data: {
      email: adminEmail,
      supabaseUid,
      fullName: "JUBU Admin",
      role: "ADMIN"
    }
  });

  console.log(`✅ Admin user seeded: ${adminEmail}`);
  console.log(`🔑 Password ready from .env: ${adminPassword}`);
  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
