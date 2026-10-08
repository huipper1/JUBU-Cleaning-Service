import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Caveat, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";

import { GoogleAnalytics } from "@next/third-parties/google";

import { seoConfig } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { env } from "@/env";

import { AnalyticsRouteTracker } from "@/components/analytics";
import { Toaster } from "@/ui";
import { Providers } from "@/providers";

import "@/tailwind";

import { getPublicImageUrl, getSettings } from "@/lib/content";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap"
});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap"
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings?.defaultSeo?.title || siteConfig.name;
  const description = settings?.defaultSeo?.description || siteConfig.description;
  const ogImageUrl = getPublicImageUrl(
    settings?.defaultSeo?.ogImage || settings?.logo?.src,
    "/images/logo.png"
  );
  const logoUrl = getPublicImageUrl(settings?.logo?.src, "/images/logo.png");

  return {
    ...seoConfig,
    title: {
      default: title,
      template: `%s | ${settings?.businessName || "JUBU Cleaning Service"}`
    },
    description,
    icons: {
      icon: [{ url: logoUrl, type: "image/png" }, { url: "/favicon.ico" }],
      shortcut: logoUrl,
      apple: logoUrl
    },
    openGraph: {
      ...seoConfig.openGraph,
      title,
      description,
      siteName: settings?.businessName || "JUBU Cleaning Service",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: settings?.businessName || "JUBU Cleaning Service Dubai"
        }
      ]
    },
    twitter: {
      ...seoConfig.twitter,
      title,
      description,
      images: [ogImageUrl]
    }
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  const rawGtmId = settings?.gtmId?.trim();
  const rawGaId = settings?.gaId?.trim() || env.NEXT_PUBLIC_GA_ID?.trim();

  // Validate format to prevent malformed or dummy placeholder IDs from breaking Tag Assistant
  const effectiveGtmId =
    rawGtmId && /^GTM-[A-Z0-9]+$/i.test(rawGtmId) ? rawGtmId.toUpperCase() : undefined;
  const effectiveGaId =
    rawGaId && /^G-[A-Z0-9]+$/i.test(rawGaId) ? rawGaId.toUpperCase() : undefined;

  return (
    <html lang={siteConfig.locale} className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Global DataLayer Initialization (Must run synchronously as high as possible in <head>) */}
        <Script
          id="init-datalayer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: "window.dataLayer = window.dataLayer || [];"
          }}
        />

        {/* Official Google Tag Manager container script (Placed in <head> for proper Google Tag Assistant recognition) */}
        {effectiveGtmId && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${effectiveGtmId}');`
            }}
          />
        )}
      </head>
      <body
        className={`${plusJakartaSans.variable} ${caveat.variable} flex min-h-screen w-full flex-col font-sans antialiased`}
      >
        {/* Google Tag Manager (noscript fallback placed immediately after <body> opening tag) */}
        {effectiveGtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${effectiveGtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        <Providers>
          <AnalyticsRouteTracker />
          <main className="flex-1">{children}</main>
          <Toaster richColors />
        </Providers>

        {/* Google Analytics 4 Script (Direct GA4 fallback if not managed inside GTM) */}
        {effectiveGaId && <GoogleAnalytics gaId={effectiveGaId} />}
      </body>
    </html>
  );
}
