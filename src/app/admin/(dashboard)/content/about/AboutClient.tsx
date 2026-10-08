"use client";

import { useState } from "react";

import { Check, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { ImageCropUploader } from "@/components/admin/ImageCropUploader";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SectionVisibilityToggle } from "@/components/admin/SectionVisibilityToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateAboutAction, type UpdateAboutData } from "./actions";

interface AboutClientProps {
  initialAbout: UpdateAboutData;
  initialShowAbout?: boolean;
}

export function AboutClient({ initialAbout, initialShowAbout = true }: AboutClientProps) {
  const [formData, setFormData] = useState<UpdateAboutData>(initialAbout);
  const [paragraphsText, setParagraphsText] = useState(initialAbout.paragraphs.join("\n\n"));
  const [newEquipment, setNewEquipment] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAddEquipment = () => {
    const trimmed = newEquipment.trim();
    if (!trimmed) return;
    if (formData.equipment.includes(trimmed)) {
      toast.error("Item already in checklist.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      equipment: [...prev.equipment, trimmed]
    }));
    setNewEquipment("");
  };

  const handleRemoveEquipment = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const parsedParagraphs = paragraphsText
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean);

      const payload: UpdateAboutData = {
        ...formData,
        paragraphs: parsedParagraphs.length > 0 ? parsedParagraphs : formData.paragraphs
      };

      const res = await updateAboutAction(payload);
      if (res.success) {
        toast.success("About Us section updated and published live!");
      } else {
        toast.error(res.error || "Failed to update About section");
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
        title="About Us Section"
        description="Edit the company profile, introductory story, equipment checklist, and showcase photos."
      >
        <SectionVisibilityToggle
          sectionKey="showAbout"
          label="About Section"
          initialVisible={initialShowAbout}
        />
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="mr-2 size-4" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Story Copy & CTA */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Headlines & Story</CardTitle>
              <CardDescription>
                Main titles and company overview paragraphs shown on the About section.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="badge">Section Badge</Label>
                <Input
                  id="badge"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. ABOUT JUBU CLEANING SERVICE"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="heading">Main Heading</Label>
                <Input
                  id="heading"
                  value={formData.heading}
                  onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                  placeholder="e.g. Professional Cleaning in Dubai"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="paragraphs">
                  About Paragraphs (Separate paragraphs with a blank line)
                </Label>
                <textarea
                  id="paragraphs"
                  value={paragraphsText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setParagraphsText(e.target.value)
                  }
                  rows={6}
                  className="min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-primary"
                  placeholder="Write your company background and service quality standards here..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ctaLabel">CTA Button Label</Label>
                  <Input
                    id="ctaLabel"
                    value={formData.ctaLabel}
                    onChange={(e) => setFormData({ ...formData, ctaLabel: e.target.value })}
                    placeholder="e.g. Get a Free Quote"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ctaHref">CTA Button Link</Label>
                  <Input
                    id="ctaHref"
                    value={formData.ctaHref}
                    onChange={(e) => setFormData({ ...formData, ctaHref: e.target.value })}
                    placeholder="#quote"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Checklist */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Equipment Checklist</CardTitle>
              <CardDescription>
                List of certified machinery and tools shown in the verified equipment grid.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Input
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddEquipment();
                    }
                  }}
                  placeholder="Add tool (e.g. Steam Extractor Machine)"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddEquipment}
                  className="shrink-0"
                >
                  <Plus className="mr-1.5 size-4" />
                  <span>Add</span>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {formData.equipment.map((item, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="flex items-center gap-1.5 px-3 py-1 text-xs"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEquipment(idx)}
                      className="cursor-pointer text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: About Photos */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">About Showcase Photo</CardTitle>
              <CardDescription>
                Primary photo of your cleaning staff or service execution.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ImageCropUploader
                currentImageUrl={formData.mainImageSrc}
                folder="hero"
                aspectRatio={4 / 3}
                label="Upload About Photo"
                onUploadComplete={(url) => setFormData((prev) => ({ ...prev, mainImageSrc: url }))}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
