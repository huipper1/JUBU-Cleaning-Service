"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowDown,
  ArrowLeft,
  ArrowLeftRight,
  ArrowUp,
  Check,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

import type { AreaGalleryItem } from "@/types/content";

import { ImageCropUploader } from "@/components/admin/ImageCropUploader";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ServiceSelector, type ServiceOption } from "@/components/admin/ServiceSelector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
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
    customGallery?: AreaGalleryItem[];
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

  // Gallery State
  const [inheritMainGallery, setInheritMainGallery] = useState<boolean>(
    !pageData.customGallery || pageData.customGallery.length === 0
  );
  const [customGallery, setCustomGallery] = useState<AreaGalleryItem[]>(
    pageData.customGallery ?? []
  );
  const [previewBeforeIndices, setPreviewBeforeIndices] = useState<Record<number, boolean>>({});

  // Gallery Modal State
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoIsBeforeAfter, setPhotoIsBeforeAfter] = useState(false);
  const [photoStandardImageSrc, setPhotoStandardImageSrc] = useState("");
  const [photoBeforeImageSrc, setPhotoBeforeImageSrc] = useState("");
  const [photoAfterImageSrc, setPhotoAfterImageSrc] = useState("");

  const handleOpenAddPhoto = () => {
    setEditingPhotoIndex(null);
    setPhotoTitle("");
    setPhotoCaption("");
    setPhotoIsBeforeAfter(false);
    setPhotoStandardImageSrc("");
    setPhotoBeforeImageSrc("");
    setPhotoAfterImageSrc("");
    setIsPhotoModalOpen(true);
  };

  const handleOpenEditPhoto = (idx: number) => {
    const item = customGallery[idx];
    setEditingPhotoIndex(idx);
    setPhotoTitle(item.title);
    setPhotoCaption(item.caption ?? "");
    setPhotoIsBeforeAfter(item.isBeforeAfter);
    setPhotoStandardImageSrc(item.imageSrc);
    setPhotoBeforeImageSrc(item.beforeImageSrc ?? "");
    setPhotoAfterImageSrc(item.afterImageSrc ?? item.imageSrc);
    setIsPhotoModalOpen(true);
  };

  const handleSavePhotoModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) {
      toast.error("Photo title is required.");
      return;
    }
    if (photoIsBeforeAfter) {
      if (!photoBeforeImageSrc) {
        toast.error("Please upload the Before photo.");
        return;
      }
      if (!photoAfterImageSrc) {
        toast.error("Please upload the After photo.");
        return;
      }
    } else if (!photoStandardImageSrc) {
      toast.error("Please upload the project photo.");
      return;
    }

    const mainSrc = photoIsBeforeAfter ? photoAfterImageSrc : photoStandardImageSrc;

    if (editingPhotoIndex !== null) {
      const updated = [...customGallery];
      updated[editingPhotoIndex] = {
        ...updated[editingPhotoIndex],
        title: photoTitle.trim(),
        caption: photoCaption.trim() || undefined,
        imageSrc: mainSrc,
        beforeImageSrc: photoIsBeforeAfter ? photoBeforeImageSrc : undefined,
        afterImageSrc: photoIsBeforeAfter ? photoAfterImageSrc : undefined,
        isBeforeAfter: photoIsBeforeAfter
      };
      setCustomGallery(updated);
      toast.success("Area photo updated.");
    } else {
      const newItem: AreaGalleryItem = {
        id: `area-gallery-${Date.now()}`,
        title: photoTitle.trim(),
        caption: photoCaption.trim() || undefined,
        imageSrc: mainSrc,
        beforeImageSrc: photoIsBeforeAfter ? photoBeforeImageSrc : undefined,
        afterImageSrc: photoIsBeforeAfter ? photoAfterImageSrc : undefined,
        isBeforeAfter: photoIsBeforeAfter,
        order: customGallery.length + 1
      };
      setCustomGallery([...customGallery, newItem]);
      toast.success("Area photo added.");
    }

    setIsPhotoModalOpen(false);
  };

  const handleRemovePhoto = (idx: number) => {
    setCustomGallery(customGallery.filter((_, i) => i !== idx));
  };

  const handleMovePhotoUp = (idx: number) => {
    if (idx <= 0) return;
    const updated = [...customGallery];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    setCustomGallery(updated.map((item, i) => ({ ...item, order: i + 1 })));
  };

  const handleMovePhotoDown = (idx: number) => {
    if (idx >= customGallery.length - 1) return;
    const updated = [...customGallery];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    setCustomGallery(updated.map((item, i) => ({ ...item, order: i + 1 })));
  };

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
        customGallery: inheritMainGallery ? [] : customGallery,
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

          {/* Project Gallery Section */}
          <Card>
            <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>5. Project Gallery</CardTitle>
                  <Badge
                    variant={inheritMainGallery ? "outline" : "secondary"}
                    className="text-[11px]"
                  >
                    {inheritMainGallery
                      ? "Inheriting Main Gallery"
                      : `${customGallery.length} Custom Photos`}
                  </Badge>
                </div>
                <CardDescription>
                  Showcase cleaning projects and before/after comparisons for {pageData.areaName}.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Button
                  type="button"
                  variant={inheritMainGallery ? "default" : "outline"}
                  size="sm"
                  onClick={() => setInheritMainGallery(!inheritMainGallery)}
                  className="text-xs"
                >
                  {inheritMainGallery ? "Customize Area Gallery" : "Inherit Main Gallery"}
                </Button>

                {!inheritMainGallery && (
                  <Button type="button" size="sm" onClick={handleOpenAddPhoto} className="text-xs">
                    <Plus className="mr-1 size-3.5" />
                    <span>Add Area Photo</span>
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {inheritMainGallery ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-4 py-8 text-center">
                  <span className="text-xs font-semibold text-foreground">
                    Currently Displaying Shared Main Gallery
                  </span>
                  <p className="mt-1 max-w-md text-[11px] leading-relaxed text-muted-foreground">
                    This area page automatically displays the projects and before/after cards from
                    the main website gallery. Click &quot;Customize Area Gallery&quot; above if you
                    want to feature photos taken specifically in {pageData.areaName}.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {customGallery.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/10 px-4 py-8 text-center">
                      <p className="text-xs font-medium text-foreground">
                        No area-specific photos added yet
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Click &quot;Add Area Photo&quot; to upload your first project or
                        before/after comparison.
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={handleOpenAddPhoto}
                        className="mt-3 text-xs"
                      >
                        <Plus className="mr-1 size-3.5" />
                        <span>Add First Photo</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {customGallery.map((photo, idx) => (
                        <div
                          key={photo.id || idx}
                          className="flex flex-col justify-between rounded-lg border bg-card p-3 shadow-xs transition-colors hover:border-primary/40"
                        >
                          <div className="flex flex-col gap-2.5">
                            {/* Photo Preview */}
                            {(() => {
                              const isShowingBefore = previewBeforeIndices[idx] ?? false;
                              const activeImageSrc =
                                photo.isBeforeAfter && isShowingBefore && photo.beforeImageSrc
                                  ? photo.beforeImageSrc
                                  : photo.afterImageSrc || photo.imageSrc;

                              return (
                                <div
                                  className={`group/img relative aspect-[4/3] w-full overflow-hidden rounded-md border bg-muted ${
                                    photo.isBeforeAfter && photo.beforeImageSrc
                                      ? "cursor-pointer"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    if (photo.isBeforeAfter && photo.beforeImageSrc) {
                                      setPreviewBeforeIndices((prev) => ({
                                        ...prev,
                                        [idx]: !prev[idx]
                                      }));
                                    }
                                  }}
                                  title={
                                    photo.isBeforeAfter && photo.beforeImageSrc
                                      ? "Click to switch between Before & After preview"
                                      : undefined
                                  }
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={activeImageSrc}
                                    alt={photo.title}
                                    className="h-full w-full object-cover transition-all duration-300"
                                  />

                                  {photo.isBeforeAfter && (
                                    <>
                                      <Badge
                                        variant={isShowingBefore ? "default" : "secondary"}
                                        className={`absolute top-2 left-2 z-10 gap-1 text-[10px] backdrop-blur-md transition-colors ${
                                          isShowingBefore
                                            ? "border-amber-500/30 bg-amber-500 text-white hover:bg-amber-600"
                                            : "bg-white/90 text-foreground"
                                        }`}
                                      >
                                        <ArrowLeftRight className="size-3" />
                                        <span>{isShowingBefore ? "Before" : "Before / After"}</span>
                                      </Badge>

                                      {/* Center Dual-Arrow Badge (matching Reference Image 2) */}
                                      <div className="pointer-events-none absolute top-1/2 left-1/2 z-10 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0066cc] shadow-md transition-transform duration-200 group-hover/img:scale-110">
                                        <ArrowLeftRight className="size-4" />
                                      </div>
                                    </>
                                  )}

                                  <Badge
                                    variant="secondary"
                                    className="absolute right-2 bottom-2 font-mono text-[10px]"
                                  >
                                    #{idx + 1}
                                  </Badge>
                                </div>
                              );
                            })()}

                            <div>
                              <h4 className="truncate text-xs font-semibold text-foreground">
                                {photo.title}
                              </h4>
                              {photo.caption && (
                                <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                                  {photo.caption}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between border-t pt-2">
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={idx === 0}
                                onClick={() => handleMovePhotoUp(idx)}
                                className="size-7 p-0"
                                title="Move up in order"
                              >
                                <ArrowUp className="size-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={idx === customGallery.length - 1}
                                onClick={() => handleMovePhotoDown(idx)}
                                className="size-7 p-0"
                                title="Move down in order"
                              >
                                <ArrowDown className="size-3.5" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenEditPhoto(idx)}
                                className="h-7 px-2 text-xs"
                              >
                                <Pencil className="mr-1 size-3" />
                                <span>Edit</span>
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePhoto(idx)}
                                className="size-7 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                title="Remove photo"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Area FAQs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>6. Area Frequently Asked Questions</CardTitle>
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

      {/* Area Photo Add/Edit Dialog */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPhotoIndex !== null ? "Edit Area Photo" : "Add Photo to Area Gallery"}
            </DialogTitle>
            <DialogDescription>
              Upload project photos or before & after comparisons specifically for{" "}
              {pageData.areaName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSavePhotoModal} className="flex flex-col gap-4 py-2">
            {/* Mode Switcher */}
            <div className="flex flex-col gap-2 rounded-lg border bg-muted/20 p-3">
              <label className="text-xs font-semibold text-foreground">Project Display Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoIsBeforeAfter(false)}
                  className={`flex items-center justify-center gap-2 rounded-md border p-2 text-xs font-medium transition-all ${
                    !photoIsBeforeAfter
                      ? "border-primary bg-primary text-primary-foreground shadow-xs"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span>Standard Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPhotoIsBeforeAfter(true)}
                  className={`flex items-center justify-center gap-2 rounded-md border p-2 text-xs font-medium transition-all ${
                    photoIsBeforeAfter
                      ? "border-primary bg-primary text-primary-foreground shadow-xs"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <ArrowLeftRight className="size-3.5" />
                  <span>Before & After</span>
                </button>
              </div>
            </div>

            {/* Photo Uploaders */}
            {!photoIsBeforeAfter ? (
              <ImageCropUploader
                currentImageUrl={photoStandardImageSrc}
                folder="gallery"
                aspectRatio={4 / 3}
                label="Project Photo (4:3 Aspect Ratio)"
                onUploadComplete={(url) => setPhotoStandardImageSrc(url)}
              />
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                  <Badge
                    variant="outline"
                    className="w-fit border-amber-500/30 text-[10px] text-amber-500"
                  >
                    1. Before Photo
                  </Badge>
                  <ImageCropUploader
                    currentImageUrl={photoBeforeImageSrc}
                    folder="gallery"
                    aspectRatio={4 / 3}
                    label="Upload 'Before' Image"
                    onUploadComplete={(url) => setPhotoBeforeImageSrc(url)}
                  />
                </div>

                <div className="flex flex-col gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <Badge
                    variant="outline"
                    className="w-fit border-emerald-500/30 text-[10px] text-emerald-500"
                  >
                    2. After Photo (Main Preview)
                  </Badge>
                  <ImageCropUploader
                    currentImageUrl={photoAfterImageSrc}
                    folder="gallery"
                    aspectRatio={4 / 3}
                    label="Upload 'After' Image"
                    onUploadComplete={(url) => setPhotoAfterImageSrc(url)}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Photo Title *</label>
              <Input
                placeholder="e.g. Balcony Deep Wash in Marina Gate"
                value={photoTitle}
                onChange={(e) => setPhotoTitle(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Caption / Note (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Pressure wash and tile grime removal completed in 90 minutes."
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                className="w-full rounded-md border bg-background p-2 text-xs leading-relaxed text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
              />
            </div>

            <DialogFooter className="border-t pt-2">
              <Button type="button" variant="outline" onClick={() => setIsPhotoModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingPhotoIndex !== null ? "Update Photo" : "Add to Area Gallery"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
