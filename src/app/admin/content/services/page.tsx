import { prisma } from "@/lib/db/prisma";
import { ServicesClient } from "./ServicesClient";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
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

  return <ServicesClient initialServices={serialized} />;
}
