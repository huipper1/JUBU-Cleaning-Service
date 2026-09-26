import { prisma } from "@/lib/db/prisma";
import { TeamClient } from "./TeamClient";
import { AdminPageHeader } from "@/components/admin/page-header";

import { SectionVisibilityToggle } from "@/components/admin/SectionVisibilityToggle";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const [dbMembers, settings] = await Promise.all([
    prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: { showTeam: true },
    }),
  ]);

  const serialized = dbMembers.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    bio: m.bio ?? undefined,
    photoSrc: m.photoSrc,
    photoAlt: m.photoAlt,
    order: m.order,
    isActive: m.isActive,
  }));

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Team Members"
        description="Manage staff profiles and 1:1 square portrait photos with client-side cropping."
      >
        <SectionVisibilityToggle
          sectionKey="showTeam"
          label="Team Section"
          initialVisible={settings?.showTeam ?? true}
        />
      </AdminPageHeader>
      <TeamClient initialMembers={serialized} />
    </div>
  );
}
