import { prisma } from "@/lib/db/prisma";
import { AreasClient } from "./AreasClient";
import { AdminPageHeader } from "@/components/admin/page-header";

import { SectionVisibilityToggle } from "@/components/admin/SectionVisibilityToggle";

export const dynamic = "force-dynamic";

export default async function AdminAreasPage() {
  const [dbAreas, settings] = await Promise.all([
    prisma.serviceArea.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: { showAreas: true },
    }),
  ]);

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
      >
        <SectionVisibilityToggle
          sectionKey="showAreas"
          label="Areas Section"
          initialVisible={settings?.showAreas ?? true}
        />
      </AdminPageHeader>
      <AreasClient initialAreas={serialized} />
    </div>
  );
}
