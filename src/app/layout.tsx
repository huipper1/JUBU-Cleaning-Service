import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Caveat, Plus_Jakarta_Sans } from "next/font/google";

import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

import { seoConfig } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { env } from "@/env";

import { Toaster } from "@/ui";
import { Providers } from "@/providers";

import "@/tailwind";

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

import { getPublicImageUrl, getSettings } from "@/lib/content";

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
      icon: [
        { url: logoUrl, type: "image/png" },
        { url: "/favicon.ico" }
      ],
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
  const effectiveGtmId = settings?.gtmId?.trim();
  const effectiveGaId = settings?.gaId?.trim() || env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang={siteConfig.locale} className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${caveat.variable} flex min-h-screen w-full flex-col font-sans antialiased`}
      >
        {/* Google Tag Manager (noscript fallback) */}
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
          <main className="flex-1">{children}</main>
          <Toaster richColors />
        </Providers>

        {/* Global DataLayer Initialization (Ensures dataLayer exists before any GTM/GA/Pixel scripts load) */}
        <Script
          id="init-datalayer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: "window.dataLayer = window.dataLayer || [];"
          }}
        />

        {/* Google Tag Manager Container Script */}
        {effectiveGtmId && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${effectiveGtmId}');`
            }}
          />
        )}

        {/* Google Analytics 4 Script (Direct integration) */}
        {effectiveGaId && <GoogleAnalytics gaId={effectiveGaId} />}
      </body>
    </html>
  );
}
