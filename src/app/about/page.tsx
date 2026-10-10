import type { Metadata } from "next";
import Image from "next/image";

import { Award, CheckCircle2, FileText, Shield, Sparkles, Users } from "lucide-react";

import { env } from "@/env";

import { getAbout, getServices, getSettings, getTeam } from "@/lib/content";
import { getPublicImageUrl } from "@/lib/content/image-url";

import { Footer, Header, StickyBottomBar } from "@/components/layouts";
import { QuoteForm } from "@/components/sections";

import { AboutOfficeLink } from "./AboutOfficeLink";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "https://jubucleaning.com";
  const title = `About Us | ${settings.businessName} Dubai`;
  const description =
    "Learn about JUBU Cleaning Service LLC. Licensed under Dubai DET (Licence #1026183), providing certified residential, villa, and corporate cleaning excellence.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/about`
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/about`,
      siteName: settings.businessName,
      locale: "en_AE",
      type: "website"
    }
  };
}

export default async function AboutPage() {
  const [settings, about, team, services] = await Promise.all([
    getSettings(),
    getAbout(),
    getTeam(),
    getServices()
  ]);

  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "https://jubucleaning.com";

  // Schema.org AboutPage & Organization
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    mainEntity: {
      "@type": "CleaningService",
      url: `${baseUrl}/about`,
      name: settings.businessName,
      legalName: `${settings.businessName} LLC`,
      licence: settings.licence?.number || "1026183",
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address,
        addressLocality: "Dubai",
        addressCountry: "AE"
      },
      telephone: settings.phoneTel,
      email: settings.email
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="relative flex min-h-screen flex-col bg-[#020b18] font-sans text-slate-100 selection:bg-brand-sky selection:text-[#020b18]">
        <Header settings={settings} />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden border-b border-white/10 bg-radial-[at_top_center] from-[#0a316b] via-[#041633] to-[#020b18] pt-12 pb-20 lg:pt-16 lg:pb-28">
            <div className="relative z-10 container mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-300 backdrop-blur-md">
                <Shield className="size-3.5 text-sky-400" />
                <span>Licensed Dubai Cleaning Company</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                About JUBU Cleaning Service
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Setting the benchmark for hygiene, reliability, and precision cleaning in Dubai.
                Proudly serving villas, apartments, and corporate offices with licensed excellence.
              </p>
            </div>
          </section>

          {/* Mission & Story */}
          <section className="bg-[#030f24] py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-wider text-brand-sky uppercase">
                    <Sparkles className="size-4" />
                    <span>Our Commitment to Dubai</span>
                  </div>
                  <h2 className="text-2xl leading-tight font-extrabold text-white sm:text-4xl">
                    {about.heading || "Professional Cleaning You Can Depend On"}
                  </h2>

                  <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                    {about.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  {/* Highlights Grid */}
                  <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <Award className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                      <div>
                        <h4 className="text-sm font-bold text-white">German Equipment</h4>
                        <p className="mt-1 text-xs text-slate-400">
                          Kärcher steam extractors & rotary scrubbers
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <Users className="mt-0.5 size-5 shrink-0 text-sky-400" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Background Vetted Staff</h4>
                        <p className="mt-1 text-xs text-slate-400">
                          100% legal, trained and supervised personnel
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trade Licence Verification Card */}
                <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-[#082857] to-[#041633] p-8 shadow-2xl">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400">
                      <FileText className="size-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Government Registered</h3>
                      <p className="text-xs text-slate-400">
                        Dubai Department of Economy & Tourism (DET)
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 py-2 text-xs sm:text-sm">
                      <span className="text-slate-400">Licence Number:</span>
                      <span className="rounded-md bg-white/10 px-2.5 py-1 font-mono font-bold text-white">
                        {settings.licence?.number || "1026183"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 py-2 text-xs sm:text-sm">
                      <span className="text-slate-400">Legal Structure:</span>
                      <span className="font-medium text-white">
                        {settings.licence?.legalStructure || "Limited Liability Company (LLC)"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 py-2 text-xs sm:text-sm">
                      <span className="text-slate-400">Authority:</span>
                      <span className="font-medium text-white">
                        {settings.licence?.issuingAuthority || "DET Dubai"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 py-2 text-xs sm:text-sm">
                      <span className="text-slate-400">Registration Date:</span>
                      <span className="font-medium text-white">
                        {settings.licence?.issueDate || "25 January 2022"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 text-xs sm:text-sm">
                      <span className="text-slate-400">HQ Office:</span>
                      <span className="max-w-xs text-right font-medium text-white">
                        {settings.address}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 className="size-4" />
                      Verified & Active Status
                    </span>
                    <AboutOfficeLink />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Team Members Section */}
          {team && team.length > 0 && (
            <section className="bg-[#020b18] py-16 lg:py-24">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mb-14 max-w-2xl text-center">
                  <h2 className="text-2xl font-extrabold text-white sm:text-4xl">
                    Meet Our Leadership & Cleaning Crew
                  </h2>
                  <p className="mt-3 text-sm text-slate-300 sm:text-base">
                    Dedicated professionals committed to delivering spotless living spaces across
                    Dubai.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {team.map((member) => (
                    <div
                      key={member.id}
                      className="group rounded-3xl border border-white/10 bg-[#061e44] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/40"
                    >
                      <div className="relative mx-auto mb-4 size-32 overflow-hidden rounded-full border-2 border-sky-400/30">
                        <Image
                          src={getPublicImageUrl(
                            member.photo.src,
                            "/images/placeholder/team-1.png"
                          )}
                          alt={
                            member.photo.alt
                              ? member.photo.alt.toLowerCase().includes("dubai")
                                ? member.photo.alt
                                : `${member.photo.alt} - JUBU Cleaning Service Dubai`
                              : `${member.name} - ${member.role} at JUBU Cleaning Service Dubai`
                          }
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="text-base font-bold text-white">{member.name}</h3>
                      <p className="mt-1 text-xs font-medium text-sky-400">{member.role}</p>
                      {member.bio && (
                        <p className="mt-2 line-clamp-2 text-xs text-slate-400">{member.bio}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Quote Form */}
          <QuoteForm services={services} settings={settings} />
        </main>

        <Footer settings={settings} />
        <StickyBottomBar settings={settings} />
      </div>
    </>
  );
}
