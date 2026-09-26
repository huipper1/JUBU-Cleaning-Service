import { prisma } from "@/lib/db/prisma";
import { AreasClient } from "./AreasClient";

export const dynamic = "force-dynamic";

export default async function AdminAreasPage() {
  const dbAreas = await prisma.serviceArea.findMany({
    orderBy: { order: "asc" }
  });

  const serialized = dbAreas.map((a) => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    lat: a.lat ?? undefined,
    lng: a.lng ?? undefined,
    order: a.order,
    isActive: a.isActive
  }));

  return <AreasClient initialAreas={serialized} />;
}
