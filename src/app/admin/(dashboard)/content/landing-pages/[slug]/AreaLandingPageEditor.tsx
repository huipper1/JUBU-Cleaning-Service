"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft, Check, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ImageCropUploader } from "@/components/admin/ImageCropUploader";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ServiceSelector, type ServiceOption } from "@/components/admin/ServiceSelector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
    heroImageSrc?: string;
    heroImageAlt?: string;
    servicesSectionTitle: string;
    servicesList: string[];
    serviceIds?: string[];
    featuredBlockTitle: string;
    featuredBlockText: string | Array<{ title: string; text: string }>;
    nearYouTitle: string;
    nearYouText: string;
    finalCtaTitle: string;
    faqs: Array<{ question: string; answer: string }>;
    isActive: boolean;
  };
  availableServices?: ServiceOption[];
}

export function AreaLandingPageEditor({
  pageData,
  availableServices = []
}: AreaLandingPageEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [isActive, setIsActive] = useState(pageData.isActive);
  const [metaTitle, setMetaTitle] = useState(pageData.metaTitle);
  const [metaDescription, setMetaDescription] = useState(pageData.metaDescription);
  const [heroHeadline, setHeroHeadline] = useState(pageData.heroHeadline);
  const [heroIntro, setHeroIntro] = useState(pageData.heroIntro);
  const [heroImageSrc, setHeroImageSrc] = useState(pageData.heroImageSrc || "");
  const [heroImageAlt, setHeroImageAlt] = useState(pageData.heroImageAlt || "");
  const [servicesSectionTitle, setServicesSectionTitle] = useState(pageData.servicesSectionTitle);
  const [servicesList, setServicesList] = useState<string[]>(pageData.servicesList);
  const [serviceIds, setServiceIds] = useState<string[]>(
    pageData.serviceIds && pageData.serviceIds.length > 0
      ? pageData.serviceIds
      : availableServices.filter((s) => s.isActive).map((s) => s.id)
  );
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
        heroImageSrc: heroImageSrc || undefined,
        heroImageAlt: heroImageAlt || undefined,
        servicesSectionTitle,
        servicesList,
        serviceIds,
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
    <div className="flex flex-col gap-6 pb-12">
      <AdminPageHeader
        title={`${pageData.areaName} Landing Page`}
        description={`Customize ad landing headlines, images, local copy, services list, and FAQs for /${pageData.slug}`}
      >
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/content/landing-pages">
            <ArrowLeft className="size-4" data-icon="inline-start" />
            Back to Areas
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={`/${pageData.slug}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-4" data-icon="inline-start" />
            View Live
          </a>
        </Button>
        <Button size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="size-4" data-icon="inline-start" />
              <span>Publish Changes</span>
            </>
          )}
        </Button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content Columns (2 cols) */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>1. Hero Presentation</CardTitle>
              <CardDescription>
                Primary headline and introduction banner tailored for this area.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Hero H1 Headline</label>
                <Input value={heroHeadline} onChange={(e) => setHeroHeadline(e.target.value)} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Hero Intro Paragraph</label>
                <textarea
                  rows={3}
                  value={heroIntro}
                  onChange={(e) => setHeroIntro(e.target.value)}
                  className="w-full rounded-md border bg-background p-2 text-xs leading-relaxed text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                />
              </div>

              {/* Area Cutout/Hero Image */}
              <div className="flex flex-col gap-3 border-t pt-3">
                <ImageCropUploader
                  currentImageUrl={heroImageSrc}
                  folder="areas"
                  label="Area Hero Cleaner Photo / Cutout (Leave empty to use main default)"
                  onUploadComplete={(url) => setHeroImageSrc(url)}
                />

                {heroImageSrc && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Hero Image Alt Text
                    </label>
                    <Input
                      value={heroImageAlt}
                      onChange={(e) => setHeroImageAlt(e.target.value)}
                      placeholder="e.g. Professional cleaners in Business Bay Dubai"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Services Offered Section */}
          <Card>
            <CardHeader>
              <CardTitle>2. Services Offered In Area</CardTitle>
              <CardDescription>
                Bullet list of specific cleaning solutions highlighted on this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Section Title</label>
                <Input
                  value={servicesSectionTitle}
                  onChange={(e) => setServicesSectionTitle(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-foreground">Active Service Badges</label>
                <div className="flex flex-wrap gap-2">
                  {servicesList.map((service, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="flex items-center gap-1.5 px-2.5 py-1"
                    >
                      <span>{service}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(idx)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        &times;
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <Input
                    placeholder="Add service (e.g. Move In Deep Cleaning)"
                    value={newServiceItem}
                    onChange={(e) => setNewServiceItem(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddService())}
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={handleAddService}>
                    <Plus className="mr-1 size-4" />
                    Add
                  </Button>
                </div>
              </div>

              {availableServices.length > 0 && (
                <div className="border-t pt-3">
                  <ServiceSelector
                    availableServices={availableServices}
                    selectedIds={serviceIds}
                    onChange={setServiceIds}
                    title="Select Services from Master Catalog"
                    description="Choose which service cards from your catalog will be displayed on this area landing page and order them."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Featured Community Highlight Block */}
          <Card>
            <CardHeader>
              <CardTitle>3. Featured Community Highlight Block</CardTitle>
              <CardDescription>
                Specialized copy explaining why JUBU is tailored for properties in this community.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Featured Block Title</label>
                <Input
                  value={featuredBlockTitle}
                  onChange={(e) => setFeaturedBlockTitle(e.target.value)}
                />
              </div>

              {isMultiBlock ? (
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-medium text-foreground">Content Highlights</label>
                  {featuredBlocks.map((block, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-2 rounded-md border bg-muted/20 p-3"
                    >
                      <Input
                        value={block.title}
                        onChange={(e) => {
                          const updated = [...featuredBlocks];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setFeaturedBlocks(updated);
                        }}
                        placeholder="Highlight Title"
                      />
                      <textarea
                        rows={2}
                        value={block.text}
                        onChange={(e) => {
                          const updated = [...featuredBlocks];
                          updated[idx] = { ...updated[idx], text: e.target.value };
                          setFeaturedBlocks(updated);
                        }}
                        className="w-full rounded-md border bg-background p-2 text-xs leading-relaxed text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                        placeholder="Highlight description text..."
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Featured Block Description
                  </label>
                  <textarea
                    rows={3}
                    value={featuredText}
                    onChange={(e) => setFeaturedText(e.target.value)}
                    className="w-full rounded-md border bg-background p-2 text-xs leading-relaxed text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Local Content Section */}
          <Card>
            <CardHeader>
              <CardTitle>4. Community Relevance Block</CardTitle>
              <CardDescription>
                Details highlighting proximity, rapid dispatch, and local landmarks.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Near You Title</label>
                <Input value={nearYouTitle} onChange={(e) => setNearYouTitle(e.target.value)} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Near You Description</label>
                <textarea
                  rows={3}
                  value={nearYouText}
                  onChange={(e) => setNearYouText(e.target.value)}
                  className="w-full rounded-md border bg-background p-2 text-xs leading-relaxed text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Area FAQs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>5. Area Frequently Asked Questions</CardTitle>
                <CardDescription>Custom FAQs answering local client questions.</CardDescription>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={handleAddFaq}>
                <Plus className="mr-1 size-4" />
                Add Question
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {faqs.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No FAQs added yet. Click &quot;Add Question&quot; to add one.
                </div>
              ) : (
                faqs.map((faq, idx) => (
                  <div key={idx} className="relative flex flex-col gap-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">
                        Question #{idx + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFaq(idx)}
                        className="size-7 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                    <Input
                      placeholder="e.g. How fast can cleaners reach Dubai Marina?"
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                    />
                    <textarea
                      rows={2}
                      placeholder="Detailed answer for the client..."
                      value={faq.answer}
                      onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                      className="w-full rounded-md border bg-background p-2 text-xs leading-relaxed text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings (1 col) */}
        <div className="flex flex-col gap-6">
          {/* Status & Final CTA */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Page Publishing Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status</span>
                <Button
                  type="button"
                  variant={isActive ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setIsActive(!isActive)}
                >
                  {isActive ? "Active (Live)" : "Disabled (Draft)"}
                </Button>
              </div>

              <div className="flex flex-col gap-1.5 border-t pt-2">
                <label className="text-xs font-medium text-foreground">Final CTA Headline</label>
                <Input value={finalCtaTitle} onChange={(e) => setFinalCtaTitle(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          {/* SEO Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Target Area SEO</CardTitle>
              <CardDescription>Search engine title and snippet preview for Google.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Meta Title</label>
                <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Meta Description</label>
                <textarea
                  rows={4}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full rounded-md border bg-background p-2 text-xs leading-relaxed text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
