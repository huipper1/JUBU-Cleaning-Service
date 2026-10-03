import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Caveat, Plus_Jakarta_Sans } from "next/font/google";

import { GoogleAnalytics } from "@next/third-parties/google";

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={siteConfig.locale} className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${caveat.variable} flex min-h-screen w-full flex-col font-sans antialiased`}
      >
        <Providers>
          <main className="flex-1">{children}</main>
          <Toaster richColors />
        </Providers>

        {env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}
