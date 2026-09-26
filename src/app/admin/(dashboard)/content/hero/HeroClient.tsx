"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2, Sparkles } from "lucide-react";
import { ImageCropUploader } from "@/components/admin/ImageCropUploader";
import { updateHeroAction, type UpdateHeroData } from "./actions";

interface HeroClientProps {
  initialHero: UpdateHeroData;
}

export function HeroClient({ initialHero }: HeroClientProps) {
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
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl pb-12">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Hero Section</h1>
          <p className="mt-1 text-sm text-slate-400">
            Edit the main hero banner headlines, call-to-actions, and cutout cleaner photo.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Copy and Headlines */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
          Hero Copy & Badges
        </h2>

        <div>
          <label className="block text-xs font-medium text-slate-300">Top Pill Badge Text</label>
          <input
            type="text"
            value={formData.badge}
            onChange={(e) => handleChange("badge", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300">Main H1 Headline</label>
          <input
            type="text"
            value={formData.headline}
            onChange={(e) => handleChange("headline", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300">Subheadline Description</label>
          <textarea
            rows={3}
            value={formData.subheadline}
            onChange={(e) => handleChange("subheadline", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300">Floating Badge Text</label>
          <input
            type="text"
            value={formData.floatingBadge}
            onChange={(e) => handleChange("floatingBadge", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Hero Cleaner Photo */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-400">
          Hero Cutout Image
        </h2>
        <p className="text-xs text-slate-400">
          Upload an image with transparency (PNG or WebP) or professional cutout photo.
        </p>

        <ImageCropUploader
          currentImageUrl={formData.heroImageSrc}
          folder="hero"
          label="Hero Cleaner Photo"
          onUploadComplete={(url) => setFormData((prev) => ({ ...prev, heroImageSrc: url }))}
        />

        <div>
          <label className="block text-xs font-medium text-slate-300">Image Alt Text (Accessibility & SEO)</label>
          <input
            type="text"
            value={formData.heroImageAlt}
            onChange={(e) => handleChange("heroImageAlt", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Call to Action Buttons */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-purple-400">
          Call-to-Action Buttons
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-300">Primary CTA Label</label>
            <input
              type="text"
              value={formData.primaryCtaLabel}
              onChange={(e) => handleChange("primaryCtaLabel", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">Primary CTA Href</label>
            <input
              type="text"
              value={formData.primaryCtaHref}
              onChange={(e) => handleChange("primaryCtaHref", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">Secondary CTA Label</label>
            <input
              type="text"
              value={formData.secondaryCtaLabel}
              onChange={(e) => handleChange("secondaryCtaLabel", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">Secondary CTA Href</label>
            <input
              type="text"
              value={formData.secondaryCtaHref}
              onChange={(e) => handleChange("secondaryCtaHref", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
