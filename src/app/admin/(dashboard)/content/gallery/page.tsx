import { prisma } from "@/lib/db/prisma";
import { GalleryClient } from "./GalleryClient";
import { AdminPageHeader } from "@/components/admin/page-header";

import { SectionVisibilityToggle } from "@/components/admin/SectionVisibilityToggle";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const [dbItems, settings] = await Promise.all([
    prisma.galleryItem.findMany({
      include: { service: true },
      orderBy: { order: "asc" },
    }),
    prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: { showGallery: true },
    }),
  ]);

  const serialized = dbItems.map((item) => ({
    id: item.id,
    title: item.title,
    caption: item.caption ?? undefined,
    serviceId: item.serviceId,
    serviceName: item.service?.title,
    imageSrc: item.imageSrc,
    imageAlt: item.imageAlt,
    isBeforeAfter: item.isBeforeAfter,
    order: item.order,
    isActive: item.isActive,
  }));

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Projects Gallery"
        description="Showcase real cleaning jobs and before/after comparisons with 4:3 standard cropper."
      >
        <SectionVisibilityToggle
          sectionKey="showGallery"
          label="Gallery Section"
          initialVisible={settings?.showGallery ?? true}
        />
      </AdminPageHeader>
      <GalleryClient initialItems={serialized} />
    </div>
  );
}
