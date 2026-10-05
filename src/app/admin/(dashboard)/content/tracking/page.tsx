import { prisma } from "@/lib/db/prisma";
import { TrackingClient } from "./TrackingClient";

export const dynamic = "force-dynamic";

export default async function AdminTrackingPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
    select: {
      gtmId: true,
      gaId: true
    }
  });

  return (
    <TrackingClient
      initialTracking={{
        gtmId: settings?.gtmId ?? "",
        gaId: settings?.gaId ?? ""
      }}
    />
  );
}
