"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { trackPageView } from "@/lib/analytics";

function RouteTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedUrl = useRef<string>("");

  useEffect(() => {
    if (!pathname) return;

    const queryString = searchParams?.toString();
    const currentUrl = queryString ? `${pathname}?${queryString}` : pathname;

    // Avoid duplicate pushes for the exact same URL within the same route transition
    if (lastTrackedUrl.current === currentUrl) return;
    lastTrackedUrl.current = currentUrl;

    // Delay slightly to allow Next.js Head / document.title to settle
    const timer = setTimeout(() => {
      trackPageView(currentUrl, typeof document !== "undefined" ? document.title : "");
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsRouteTracker() {
  return (
    <Suspense fallback={null}>
      <RouteTrackerInner />
    </Suspense>
  );
}
