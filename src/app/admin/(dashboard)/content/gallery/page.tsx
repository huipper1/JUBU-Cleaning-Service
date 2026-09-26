import { prisma } from "@/lib/db/prisma";
import { GalleryClient } from "./GalleryClient";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const dbItems = await prisma.galleryItem.findMany({
    include: { service: true },
    orderBy: { order: "asc" }
  });

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
    isActive: item.isActive
  }));

  return <GalleryClient initialItems={serialized} />;
}
