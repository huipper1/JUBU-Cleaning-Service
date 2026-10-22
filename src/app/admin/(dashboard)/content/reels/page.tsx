import { prisma } from "@/lib/db/prisma";

import { AdminPageHeader } from "@/components/admin/page-header";
import { SectionVisibilityToggle } from "@/components/admin/SectionVisibilityToggle";

import { ReelsClient } from "./ReelsClient";
import { parseConfig } from "./utils";

export const dynamic = "force-dynamic";

export default async function AdminReelsPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
    select: {
      showVideoReels: true,
      videoReels: true
    }
  });

  const config = parseConfig(settings?.videoReels);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Work Reels & Video Samples"
        description="Showcase real vertical (9:16) video samples of your cleaning team in action on the website."
      >
        <SectionVisibilityToggle
          sectionKey="showVideoReels"
          label="Reels Section"
          initialVisible={settings?.showVideoReels ?? true}
        />
      </AdminPageHeader>

      <ReelsClient initialConfig={config} />
    </div>
  );
}
