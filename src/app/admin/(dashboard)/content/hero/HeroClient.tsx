"use client";

import { useState } from "react";

import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ImageCropUploader } from "@/components/admin/ImageCropUploader";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SectionVisibilityToggle } from "@/components/admin/SectionVisibilityToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { updateHeroAction, type UpdateHeroData } from "./actions";

interface HeroClientProps {
  initialHero: UpdateHeroData;
  initialShowHero?: boolean;
}

export function HeroClient({ initialHero, initialShowHero = true }: HeroClientProps) {
  const [formData, setFormData] = useState<UpdateHeroData>(initialHero);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof UpdateHeroData, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateHeroAction(formData);
      if (res.success) {
        toast.success("Hero section updated and published live!");
      } else {
        toast.error(res.error ?? "Failed to save hero section");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 pb-12">
      <AdminPageHeader
        title="Hero Section"
        description="Edit the main hero banner headlines, call-to-actions, and cutout cleaner photo."
      >
        <SectionVisibilityToggle
          sectionKey="showHero"
          label="Hero Section"
          initialVisible={initialShowHero}
        />
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="size-4" data-icon="inline-start" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </AdminPageHeader>

      {/* Copy and Headlines */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Copy & Badges</CardTitle>
          <CardDescription>
            Main value proposition and headline visible above the fold.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Top Pill Badge Text</label>
            <Input value={formData.badge} onChange={(e) => handleChange("badge", e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Main H1 Headline</label>
            <Input
              value={formData.headline}
              onChange={(e) => handleChange("headline", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Subheadline Description</label>
            <textarea
              rows={3}
              value={formData.subheadline}
              onChange={(e) => handleChange("subheadline", e.target.value)}
              className="w-full rounded-md border bg-background p-2.5 text-xs leading-relaxed text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Floating Badge Text</label>
            <Input
              value={formData.floatingBadge}
              onChange={(e) => handleChange("floatingBadge", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Hero Cleaner Photo */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Cutout Image</CardTitle>
          <CardDescription>
            Upload a transparent cutout image (WebP or PNG) with no fixed aspect ratio.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ImageCropUploader
            currentImageUrl={formData.heroImageSrc}
            folder="hero"
            label="Hero Cleaner Photo (No fixed aspect ratio)"
            onUploadComplete={(url) => setFormData((prev) => ({ ...prev, heroImageSrc: url }))}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Image Alt Text (SEO & Accessibility)
            </label>
            <Input
              value={formData.heroImageAlt}
              onChange={(e) => handleChange("heroImageAlt", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Call to Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Call-to-Action Buttons</CardTitle>
          <CardDescription>Destination buttons displayed under the hero headline.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Primary CTA Label</label>
              <Input
                value={formData.primaryCtaLabel}
                onChange={(e) => handleChange("primaryCtaLabel", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Primary CTA Link</label>
              <Input
                value={formData.primaryCtaHref}
                onChange={(e) => handleChange("primaryCtaHref", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Secondary CTA Label</label>
              <Input
                value={formData.secondaryCtaLabel}
                onChange={(e) => handleChange("secondaryCtaLabel", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Secondary CTA Link</label>
              <Input
                value={formData.secondaryCtaHref}
                onChange={(e) => handleChange("secondaryCtaHref", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
