import { prisma } from "@/lib/db/prisma";
import { WhyChooseClient } from "./WhyChooseClient";
import { AdminPageHeader } from "@/components/admin/page-header";

import { SectionVisibilityToggle } from "@/components/admin/SectionVisibilityToggle";

export const dynamic = "force-dynamic";

export default async function AdminWhyChoosePage() {
  const [dbItems, settings] = await Promise.all([
    prisma.whyChooseItem.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: { showWhyChoose: true },
    }),
  ]);

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
      >
        <SectionVisibilityToggle
          sectionKey="showWhyChoose"
          label="Why Choose Us Section"
          initialVisible={settings?.showWhyChoose ?? true}
        />
      </AdminPageHeader>
      <WhyChooseClient initialItems={serialized} />
    </div>
  );
}
