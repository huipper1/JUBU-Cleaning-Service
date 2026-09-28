import { prisma } from "@/lib/db/prisma";

import { AdminPageHeader } from "@/components/admin/page-header";
import { SectionVisibilityToggle } from "@/components/admin/SectionVisibilityToggle";

import { ServicesClient } from "./ServicesClient";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const [dbServices, settings] = await Promise.all([
    prisma.service.findMany({
      orderBy: { order: "asc" }
    }),
    prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: { showServices: true, homepageServiceIds: true }
    })
  ]);

  const serialized = dbServices.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    shortDescription: s.shortDescription,
    longDescription: s.longDescription ?? undefined,
    icon: s.icon,
    imageSrc: s.imageSrc,
    imageAlt: s.imageAlt,
    order: s.order,
    isActive: s.isActive
  }));

  const defaultHomepageIds =
    settings?.homepageServiceIds && settings.homepageServiceIds.length > 0
      ? settings.homepageServiceIds
      : serialized.filter((s) => s.isActive).map((s) => s.id);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Homepage Services Section"
        description="Select which cleaning services appear in the Services section on the main homepage and customize their display order."
      >
        <SectionVisibilityToggle
          sectionKey="showServices"
          label="Services Section"
          initialVisible={settings?.showServices ?? true}
        />
      </AdminPageHeader>
      <ServicesClient allServices={serialized} initialSelectedIds={defaultHomepageIds} />
    </div>
  );
}
