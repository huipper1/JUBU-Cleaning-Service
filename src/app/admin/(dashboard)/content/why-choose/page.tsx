import { prisma } from "@/lib/db/prisma";
import { WhyChooseClient } from "./WhyChooseClient";

export const dynamic = "force-dynamic";

export default async function AdminWhyChoosePage() {
  const dbItems = await prisma.whyChooseItem.findMany({
    orderBy: { order: "asc" }
  });

  const serialized = dbItems.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    icon: item.icon,
    order: item.order,
    isActive: item.isActive
  }));

  return <WhyChooseClient initialItems={serialized} />;
}
