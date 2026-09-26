import { prisma } from "@/lib/db/prisma";
import { ServicesClient } from "./ServicesClient";
import { AdminPageHeader } from "@/components/admin/page-header";

import { SectionVisibilityToggle } from "@/components/admin/SectionVisibilityToggle";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const [dbServices, settings] = await Promise.all([
    prisma.service.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: { showServices: true },
    }),
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
    isActive: s.isActive,
  }));

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Services Management"
        description="Edit cleaning service titles, descriptions, display order, and live visibility."
      >
        <SectionVisibilityToggle
          sectionKey="showServices"
          label="Services Section"
          initialVisible={settings?.showServices ?? true}
        />
      </AdminPageHeader>
      <ServicesClient initialServices={serialized} />
    </div>
  );
}
