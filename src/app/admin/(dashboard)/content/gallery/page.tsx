import { prisma } from "@/lib/db/prisma";

import { AdminPageHeader } from "@/components/admin/page-header";
import { SectionVisibilityToggle } from "@/components/admin/SectionVisibilityToggle";

import { GalleryClient } from "./GalleryClient";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const [dbItems, settings, services] = await Promise.all([
    prisma.galleryItem.findMany({
      include: { service: true },
      orderBy: { order: "asc" }
    }),
    prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: { showGallery: true }
    }),
    prisma.service.findMany({
      where: { isActive: true },
      select: { id: true, title: true },
      orderBy: { order: "asc" }
    })
  ]);

  const serialized = dbItems.map((item) => ({
    id: item.id,
    title: item.title,
    caption: item.caption ?? undefined,
    serviceId: item.serviceId,
    serviceName: item.service?.title,
    imageSrc: item.imageSrc,
    imageAlt: item.imageAlt,
    beforeImageSrc: item.beforeImageSrc ?? undefined,
    afterImageSrc: item.afterImageSrc ?? undefined,
    isBeforeAfter: item.isBeforeAfter,
    order: item.order,
    isActive: item.isActive
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
      <GalleryClient initialItems={serialized} services={services} />
    </div>
  );
}
