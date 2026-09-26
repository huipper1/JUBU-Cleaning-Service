import { prisma } from "@/lib/db/prisma";
import { AreasClient } from "./AreasClient";
import { AdminPageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminAreasPage() {
  const dbAreas = await prisma.serviceArea.findMany({
    orderBy: { order: "asc" },
  });

  const serialized = dbAreas.map((a) => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    lat: a.lat ?? undefined,
    lng: a.lng ?? undefined,
    order: a.order,
    isActive: a.isActive,
  }));

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Dubai Service Areas"
        description="Manage the 10 supported coverage areas and their interactive map coordinates."
      />
      <AreasClient initialAreas={serialized} />
    </div>
  );
}
