import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const seoConfig: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | JUBU Cleaning Service`
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  formatDetection: {
    telephone: true,
    email: true,
    address: true
  },
  icons: {
    icon: [
      { url: "/images/logo.png", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/images/logo.png",
    apple: "/images/logo.png"
  },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  openGraph: {
    type: "website",
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "JUBU Cleaning Service",
    locale: "en_AE",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "JUBU Cleaning Service Dubai"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  }
};
