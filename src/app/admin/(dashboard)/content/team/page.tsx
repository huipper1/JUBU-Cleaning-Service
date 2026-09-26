import { prisma } from "@/lib/db/prisma";
import { TeamClient } from "./TeamClient";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const dbMembers = await prisma.teamMember.findMany({
    orderBy: { order: "asc" }
  });

  const serialized = dbMembers.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    bio: m.bio ?? undefined,
    photoSrc: m.photoSrc,
    photoAlt: m.photoAlt,
    order: m.order,
    isActive: m.isActive
  }));

  return <TeamClient initialMembers={serialized} />;
}
