import { prisma } from "@/lib/db/prisma";
import { ServicesClient } from "./ServicesClient";
import { AdminPageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const dbServices = await prisma.service.findMany({
    orderBy: { order: "asc" },
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
    isActive: s.isActive,
  }));

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Services Management"
        description="Edit cleaning service titles, descriptions, display order, and live visibility."
      />
      <ServicesClient initialServices={serialized} />
    </div>
  );
}
