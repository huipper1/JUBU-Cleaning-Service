"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Globe2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createAreaLandingPageAction, type CreateAreaLandingPageInput } from "./create-action";
import { ImageCropUploader } from "@/components/admin/ImageCropUploader";

export function CreateAreaLandingPageDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [areaName, setAreaName] = useState("");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [heroHeadline, setHeroHeadline] = useState("");
  const [heroIntro, setHeroIntro] = useState("");
  const [heroImageSrc, setHeroImageSrc] = useState("");
  const [servicesSectionTitle, setServicesSectionTitle] = useState("");
  const [servicesList, setServicesList] = useState<string[]>([
    "Deep Cleaning",
    "Apartment Cleaning",
    "Move In / Out Cleaning",
    "Office Cleaning",
  ]);
  const [newService, setNewService] = useState("");

  const [featuredBlockTitle, setFeaturedBlockTitle] = useState("");
  const [featuredBlockText, setFeaturedBlockText] = useState("");

  const [nearYouTitle, setNearYouTitle] = useState("");
  const [nearYouText, setNearYouText] = useState("");
  const [finalCtaTitle, setFinalCtaTitle] = useState("");

  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([
    { question: "", answer: "" },
  ]);

  // Auto-generate slug and defaults when areaName changes
  const handleAreaNameChange = (val: string) => {
    setAreaName(val);
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setSlug(generatedSlug);
    if (!metaTitle) {
      setMetaTitle(`Professional Cleaning Services in ${val} | JUBU`);
    }
    if (!metaDescription) {
      setMetaDescription(
        `JUBU Cleaning Service provides residential, deep, and move-in cleaning in ${val}, Dubai. Free quotes.`
      );
    }
    if (!heroHeadline) {
      setHeroHeadline(`Professional Cleaning Services in ${val}`);
    }
    if (!heroIntro) {
      setHeroIntro(
        `Looking for reliable, licensed cleaning services in ${val}? JUBU Cleaning provides premium home and commercial cleaning solutions.`
      );
    }
    if (!servicesSectionTitle) {
      setServicesSectionTitle(`Our Cleaning Services in ${val}`);
    }
    if (!featuredBlockTitle) {
      setFeaturedBlockTitle(`Specialized Cleaning for ${val} Properties`);
    }
    if (!featuredBlockText) {
      setFeaturedBlockText(
        `Our trained crews understand the high standards expected in ${val}. We deliver spotless sanitization for villas, apartments, and offices.`
      );
    }
    if (!nearYouTitle) {
      setNearYouTitle(`Cleaning Services Near You in ${val}`);
    }
    if (!nearYouText) {
      setNearYouText(
        `Rapid cleaner dispatch to all buildings and communities across ${val}, Dubai.`
      );
    }
    if (!finalCtaTitle) {
      setFinalCtaTitle(`Book Your Cleaning in ${val} Today`);
    }
    if (faqs.length === 1 && !faqs[0].question) {
      setFaqs([
        {
          question: `How fast can JUBU cleaners reach ${val}?`,
          answer: `Our dedicated mobile teams cover ${val} daily with rapid same-day and scheduled dispatch available.`,
        },
      ]);
    }
  };

  const handleAddService = () => {
    if (!newService.trim()) return;
    setServicesList([...servicesList, newService.trim()]);
    setNewService("");
  };

  const handleRemoveService = (idx: number) => {
    setServicesList(servicesList.filter((_, i) => i !== idx));
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const handleUpdateFaq = (idx: number, field: "question" | "answer", val: string) => {
    const updated = [...faqs];
    updated[idx][field] = val;
    setFaqs(updated);
  };

  const handleRemoveFaq = (idx: number) => {
    if (faqs.length <= 1) {
      toast.error("At least one FAQ item is required.");
      return;
    }
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validations
    if (!areaName.trim()) {
      toast.error("Area Name is required.");
      return;
    }
    if (!slug.trim()) {
      toast.error("Valid URL slug is required.");
      return;
    }
    if (!metaTitle.trim()) {
      toast.error("SEO Meta Title is required.");
      return;
    }
    if (!metaDescription.trim()) {
      toast.error("SEO Meta Description is required.");
      return;
    }
    if (!heroHeadline.trim()) {
      toast.error("Hero H1 Headline is required.");
      return;
    }
    if (!heroIntro.trim()) {
      toast.error("Hero Intro description is required.");
      return;
    }
    if (servicesList.length === 0) {
      toast.error("Please add at least one service offered.");
      return;
    }
    if (!featuredBlockTitle.trim() || !featuredBlockText.trim()) {
      toast.error("Featured block title and description are required.");
      return;
    }
    if (!nearYouTitle.trim() || !nearYouText.trim()) {
      toast.error("Near You community section details are required.");
      return;
    }
    if (!finalCtaTitle.trim()) {
      toast.error("Final CTA Title is required.");
      return;
    }
    if (faqs.some((f) => !f.question.trim() || !f.answer.trim())) {
      toast.error("Please fill in both question and answer for all FAQs.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateAreaLandingPageInput = {
        areaName: areaName.trim(),
        slug: slug.trim().toLowerCase(),
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        heroHeadline: heroHeadline.trim(),
        heroIntro: heroIntro.trim(),
        heroImageSrc: heroImageSrc || undefined,
        servicesSectionTitle: servicesSectionTitle.trim(),
        servicesList,
        featuredBlockTitle: featuredBlockTitle.trim(),
        featuredBlockText: featuredBlockText.trim(),
        nearYouTitle: nearYouTitle.trim(),
        nearYouText: nearYouText.trim(),
        finalCtaTitle: finalCtaTitle.trim(),
        faqs,
        isActive: true,
      };

      const res = await createAreaLandingPageAction(payload);
      if (res.success) {
        toast.success(`Created landing page for ${areaName}!`);
        setOpen(false);
        router.refresh();
        router.push(`/admin/content/landing-pages/${res.slug}`);
      } else {
        toast.error(res.error ?? "Failed to create area page.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4 mr-1" />
          <span>Add Area Landing Page</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe2 className="size-5 text-primary" />
            <span>Create New Area Landing Page</span>
          </DialogTitle>
          <DialogDescription>
            All fields are mandatory to ensure complete SEO metadata, ads landing copy, and local schema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-2">
          {/* Basic Identity */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                Area Community Name *
              </label>
              <Input
                placeholder="e.g. Palm Jumeirah"
                value={areaName}
                onChange={(e) => handleAreaNameChange(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">
                URL Slug *
              </label>
              <Input
                placeholder="e.g. palm-jumeirah"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Hero Presentation */}
          <div className="flex flex-col gap-3 rounded-lg border p-4 bg-muted/20">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              1. Hero Presentation
            </span>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Hero H1 Headline *
              </label>
              <Input
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Hero Intro Description *
              </label>
              <textarea
                rows={3}
                value={heroIntro}
                onChange={(e) => setHeroIntro(e.target.value)}
                className="w-full rounded-md border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                required
              />
            </div>

            <ImageCropUploader
              currentImageUrl={heroImageSrc}
              folder="areas"
              label="Area Hero Cutout Image (Optional)"
              onUploadComplete={(url) => setHeroImageSrc(url)}
            />
          </div>

          {/* Services & Bullet Points */}
          <div className="flex flex-col gap-3 rounded-lg border p-4 bg-muted/20">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              2. Services Offered In Area
            </span>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Section Heading *
              </label>
              <Input
                value={servicesSectionTitle}
                onChange={(e) => setServicesSectionTitle(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-foreground">
                Services List *
              </label>
              <div className="flex flex-wrap gap-2">
                {servicesList.map((s, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1 px-2.5 py-1">
                    <span>{s}</span>
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

              <div className="flex items-center gap-2 mt-1">
                <Input
                  placeholder="e.g. Balcony Pressure Wash"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddService())}
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAddService}>
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Featured & Near You Block */}
          <div className="flex flex-col gap-3 rounded-lg border p-4 bg-muted/20">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              3. Community Content Blocks
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">
                  Featured Block Title *
                </label>
                <Input
                  value={featuredBlockTitle}
                  onChange={(e) => setFeaturedBlockTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">
                  Near You Title *
                </label>
                <Input
                  value={nearYouTitle}
                  onChange={(e) => setNearYouTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-foreground">
                  Featured Block Description *
                </label>
                <textarea
                  rows={2}
                  value={featuredBlockText}
                  onChange={(e) => setFeaturedBlockText(e.target.value)}
                  className="w-full rounded-md border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-foreground">
                  Near You Community Relevance *
                </label>
                <textarea
                  rows={2}
                  value={nearYouText}
                  onChange={(e) => setNearYouText(e.target.value)}
                  className="w-full rounded-md border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-foreground">
                  Final CTA Headline *
                </label>
                <Input
                  value={finalCtaTitle}
                  onChange={(e) => setFinalCtaTitle(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="flex flex-col gap-3 rounded-lg border p-4 bg-muted/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                4. Frequently Asked Questions *
              </span>
              <Button type="button" variant="secondary" size="sm" onClick={handleAddFaq}>
                <Plus className="size-3.5 mr-1" />
                Add FAQ
              </Button>
            </div>

            {faqs.map((faq, idx) => (
              <div key={idx} className="flex flex-col gap-2 rounded-md border bg-background p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    Question #{idx + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFaq(idx)}
                    className="size-7 p-0 text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
                <Input
                  placeholder="Question text..."
                  value={faq.question}
                  onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                  required
                />
                <textarea
                  rows={2}
                  placeholder="Answer..."
                  value={faq.answer}
                  onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                  className="w-full rounded-md border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  required
                />
              </div>
            ))}
          </div>

          {/* SEO Metadata */}
          <div className="flex flex-col gap-3 rounded-lg border p-4 bg-muted/20">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              5. SEO Metadata *
            </span>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Meta Title *
              </label>
              <Input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Meta Description *
              </label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full rounded-md border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1" />
                  <span>Creating Page...</span>
                </>
              ) : (
                <span>Save & Publish Area Page</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
