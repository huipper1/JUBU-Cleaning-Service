import { prisma } from "@/lib/db/prisma";
import { WhyChooseClient } from "./WhyChooseClient";
import { AdminPageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminWhyChoosePage() {
  const dbItems = await prisma.whyChooseItem.findMany({
    orderBy: { order: "asc" },
  });

  const serialized = dbItems.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    icon: item.icon,
    order: item.order,
    isActive: item.isActive,
  }));

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Why Choose Us Highlights"
        description="Edit the 4 core trust pillars displayed across the website."
      />
      <WhyChooseClient initialItems={serialized} />
    </div>
  );
}
