import { prisma } from "@/lib/db/prisma";

import { AdminPageHeader } from "@/components/admin/page-header";

import { ServicesListClient } from "./ServicesListClient";

export const dynamic = "force-dynamic";

export default async function ServicesCatalogPage() {
  const dbServices = await prisma.service.findMany({
    orderBy: { order: "asc" }
  });

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

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Services Catalog"
        description="Master catalog of all cleaning services. Add, edit, or remove services to make them available across the Homepage and Area Landing Pages."
      />
      <ServicesListClient initialServices={serialized} />
    </div>
  );
}
