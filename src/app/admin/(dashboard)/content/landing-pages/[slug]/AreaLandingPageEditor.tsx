"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Plus,
  Trash2,
  Loader2,
  Globe2,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { updateAreaLandingPageAction, type UpdateAreaLandingPageData } from "./actions";

interface AreaLandingPageEditorProps {
  pageData: {
    id: string;
    slug: string;
    areaName: string;
    metaTitle: string;
    metaDescription: string;
    heroHeadline: string;
    heroIntro: string;
    servicesSectionTitle: string;
    servicesList: string[];
    featuredBlockTitle: string;
    featuredBlockText: string | Array<{ title: string; text: string }>;
    nearYouTitle: string;
    nearYouText: string;
    finalCtaTitle: string;
    faqs: Array<{ question: string; answer: string }>;
    isActive: boolean;
  };
}

export function AreaLandingPageEditor({ pageData }: AreaLandingPageEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [isActive, setIsActive] = useState(pageData.isActive);
  const [metaTitle, setMetaTitle] = useState(pageData.metaTitle);
  const [metaDescription, setMetaDescription] = useState(pageData.metaDescription);
  const [heroHeadline, setHeroHeadline] = useState(pageData.heroHeadline);
  const [heroIntro, setHeroIntro] = useState(pageData.heroIntro);
  const [servicesSectionTitle, setServicesSectionTitle] = useState(pageData.servicesSectionTitle);
  const [servicesList, setServicesList] = useState<string[]>(pageData.servicesList);
  const [newServiceItem, setNewServiceItem] = useState("");

  const [featuredBlockTitle, setFeaturedBlockTitle] = useState(pageData.featuredBlockTitle);
  const isMultiBlock = Array.isArray(pageData.featuredBlockText);
  const [featuredText, setFeaturedText] = useState(
    typeof pageData.featuredBlockText === "string" ? pageData.featuredBlockText : ""
  );
  const [featuredBlocks, setFeaturedBlocks] = useState<Array<{ title: string; text: string }>>(
    Array.isArray(pageData.featuredBlockText) ? pageData.featuredBlockText : []
  );

  const [nearYouTitle, setNearYouTitle] = useState(pageData.nearYouTitle);
  const [nearYouText, setNearYouText] = useState(pageData.nearYouText);
  const [finalCtaTitle, setFinalCtaTitle] = useState(pageData.finalCtaTitle);

  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>(pageData.faqs);

  const handleAddService = () => {
    if (!newServiceItem.trim()) return;
    setServicesList([...servicesList, newServiceItem.trim()]);
    setNewServiceItem("");
  };

  const handleRemoveService = (index: number) => {
    setServicesList(servicesList.filter((_, i) => i !== index));
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const handleUpdateFaq = (index: number, field: "question" | "answer", value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: UpdateAreaLandingPageData = {
        metaTitle,
        metaDescription,
        heroHeadline,
        heroIntro,
        servicesSectionTitle,
        servicesList,
        featuredBlockTitle,
        featuredBlockText: isMultiBlock ? featuredBlocks : featuredText,
        nearYouTitle,
        nearYouText,
        finalCtaTitle,
        faqs,
        isActive
      };

      const result = await updateAreaLandingPageAction(pageData.slug, payload);

      if (result.success) {
        toast.success(`${pageData.areaName} page updated and published live!`);
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to save changes");
      }
    } catch {
      toast.error("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Bar with Navigation and Save Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/content/landing-pages"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 transition-colors hover:border-slate-700 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">{pageData.areaName}</h1>
              <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full ring-1 ring-emerald-500/20">
                /{pageData.slug}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit marketing copy, headlines, bullet points, and area FAQs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/${pageData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Live</span>
          </a>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Publish Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Settings Form Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Content Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Hero Section Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              1. Hero Presentation
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300">Hero H1 Headline</label>
                <input
                  type="text"
                  value={heroHeadline}
                  onChange={(e) => setHeroHeadline(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">Hero Intro Paragraph</label>
                <textarea
                  rows={3}
                  value={heroIntro}
                  onChange={(e) => setHeroIntro(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Services Section Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              2. Services Offered In Area
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300">Section Title</label>
                <input
                  type="text"
                  value={servicesSectionTitle}
                  onChange={(e) => setServicesSectionTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">Service Highlights Bullets</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {servicesList.map((service, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-200"
                    >
                      <span>{service}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(idx)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom service bullet (e.g. Balcony Sanitization)..."
                    value={newServiceItem}
                    onChange={(e) => setNewServiceItem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddService();
                      }
                    }}
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="rounded-xl border border-slate-800 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Marketing Block */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              3. Featured Specialized Block
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300">Featured Block Title</label>
                <input
                  type="text"
                  value={featuredBlockTitle}
                  onChange={(e) => setFeaturedBlockTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {!isMultiBlock ? (
                <div>
                  <label className="block text-xs font-medium text-slate-300">Featured Description</label>
                  <textarea
                    rows={3}
                    value={featuredText}
                    onChange={(e) => setFeaturedText(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-xs text-slate-400">3-Card Split Grid Blocks:</span>
                  {featuredBlocks.map((block, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
                      <input
                        type="text"
                        value={block.title}
                        onChange={(e) => {
                          const copy = [...featuredBlocks];
                          copy[idx].title = e.target.value;
                          setFeaturedBlocks(copy);
                        }}
                        placeholder="Block title"
                        className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
                      />
                      <textarea
                        rows={2}
                        value={block.text}
                        onChange={(e) => {
                          const copy = [...featuredBlocks];
                          copy[idx].text = e.target.value;
                          setFeaturedBlocks(copy);
                        }}
                        placeholder="Block description"
                        className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Near-You Section Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              4. Near-You Section
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300">Near-You Heading</label>
                <input
                  type="text"
                  value={nearYouTitle}
                  onChange={(e) => setNearYouTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">Near-You Text</label>
                <textarea
                  rows={2}
                  value={nearYouText}
                  onChange={(e) => setNearYouText(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* FAQs Manager Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                5. Area FAQ Accordion
              </h2>
              <button
                type="button"
                onClick={handleAddFaq}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20 hover:bg-emerald-500/20"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">Question #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                    placeholder="e.g. Do you provide apartment cleaning in this area?"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />

                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                    placeholder="Answer details..."
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Publishing & SEO Details */}
        <div className="space-y-6">
          {/* Status & Publishing Control */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Page Status
            </h2>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5">
              <div>
                <span className="text-xs font-semibold text-white">Live Status</span>
                <p className="text-[10px] text-slate-400">
                  {isActive ? "Page is visible to ad traffic" : "Page returns 404 when disabled"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isActive ? "bg-emerald-600" : "bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-300">Quote Band Title</label>
              <input
                type="text"
                value={finalCtaTitle}
                onChange={(e) => setFinalCtaTitle(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* SEO Metadata Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              SEO & Social Tags
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300">Meta Title Tag</label>
                  <span className="text-[10px] text-slate-500">{metaTitle.length} chars</span>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300">Meta Description</label>
                  <span className="text-[10px] text-slate-500">{metaDescription.length} chars</span>
                </div>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
