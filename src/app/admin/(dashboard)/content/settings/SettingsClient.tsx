"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { updateSettingsAction, type UpdateSettingsData } from "./actions";
import { AdminPageHeader } from "@/components/admin/page-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ImageCropUploader } from "@/components/admin/ImageCropUploader";

interface SettingsClientProps {
  initialSettings: UpdateSettingsData;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [formData, setFormData] = useState<UpdateSettingsData>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof UpdateSettingsData, val: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateSettingsAction(formData);
      if (res.success) {
        toast.success("Site settings updated and published live!");
      } else {
        toast.error(res.error ?? "Failed to save settings");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const sectionToggles: Array<{
    key: keyof Pick<
      UpdateSettingsData,
      | "showHero"
      | "showServices"
      | "showWhyChoose"
      | "showAbout"
      | "showTeam"
      | "showGallery"
      | "showQuote"
      | "showAreas"
      | "showContact"
    >;
    title: string;
    description: string;
  }> = [
    {
      key: "showHero",
      title: "Hero Section",
      description: "Top headline, call-to-actions, and main cleaner banner.",
    },
    {
      key: "showServices",
      title: "Services Catalog",
      description: "Grid displaying all residential, commercial & deep cleaning services.",
    },
    {
      key: "showWhyChoose",
      title: "Why Choose JUBU Highlights",
      description: "Trust pillars, trained staff badges, and quality assurance cards.",
    },
    {
      key: "showAbout",
      title: "About Us / Company Profile",
      description: "Company mission statement, equipment checklist, and profile story.",
    },
    {
      key: "showTeam",
      title: "Our Team",
      description: "Staff portraits, leadership cards, and supervisor bios.",
    },
    {
      key: "showGallery",
      title: "Projects & Before/After Gallery",
      description: "Visual portfolio of completed deep cleaning and sanitization projects.",
    },
    {
      key: "showQuote",
      title: "Free Quote & Lead Form",
      description: "Instant booking and contact inquiry form for prospective clients.",
    },
    {
      key: "showAreas",
      title: "Dubai Service Areas",
      description: "Interactive coverage map and list of covered Dubai neighborhoods.",
    },
    {
      key: "showContact",
      title: "Contact & Location",
      description: "Registered office address, phone numbers, and working hours.",
    },
  ];

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 pb-12">
      <AdminPageHeader
        title="General Site Settings"
        description="Manage company details, official branding logo, Dubai trade licence, contact info, and default SEO."
      >
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

      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="branding">Branding & Logo</TabsTrigger>
          <TabsTrigger value="sections">Page Sections</TabsTrigger>
          <TabsTrigger value="contact">Contact & Address</TabsTrigger>
          <TabsTrigger value="licence">Trade Licence</TabsTrigger>
          <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
        </TabsList>

        {/* Branding & Logo Tab */}
        <TabsContent value="branding" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Logo & Identity</CardTitle>
              <CardDescription>
                Upload the official company logo used across the website, admin login, and sidebar header.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <ImageCropUploader
                currentImageUrl={formData.logoSrc}
                folder="branding"
                label="Site Logo (PNG/WebP recommended)"
                onUploadComplete={(url) => setFormData((prev) => ({ ...prev, logoSrc: url }))}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">
                  Logo Alt Text (SEO & Accessibility)
                </label>
                <Input
                  value={formData.logoAlt}
                  onChange={(e) => handleChange("logoAlt", e.target.value)}
                  placeholder="e.g. JUBU Cleaning Service Logo"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Page Sections Visibility Tab */}
        <TabsContent value="sections" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Sections Visibility</CardTitle>
              <CardDescription>
                Enable or disable entire sections from displaying on the public landing page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sectionToggles.map((sec) => {
                  const isChecked = Boolean(formData[sec.key]);
                  return (
                    <div
                      key={sec.key}
                      className="flex items-center justify-between gap-3 rounded-lg border p-4 shadow-xs"
                    >
                      <div className="flex flex-col gap-0.5 pr-2">
                        <span className="text-sm font-semibold text-foreground">
                          {sec.title}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-2">
                          {sec.description}
                        </span>
                      </div>
                      <Switch
                        checked={isChecked}
                        onCheckedChange={(checked) => handleChange(sec.key, checked)}
                        aria-label={`Toggle ${sec.title}`}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact & Registered Office</CardTitle>
              <CardDescription>
                Primary business phone, email, and Dubai office location.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Business Name
                  </label>
                  <Input
                    value={formData.businessName}
                    onChange={(e) => handleChange("businessName", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Tagline
                  </label>
                  <Input
                    value={formData.tagline}
                    onChange={(e) => handleChange("tagline", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Phone Display
                  </label>
                  <Input
                    value={formData.phoneDisplay}
                    onChange={(e) => handleChange("phoneDisplay", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    WhatsApp Display
                  </label>
                  <Input
                    value={formData.whatsapp}
                    onChange={(e) => handleChange("whatsapp", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Official Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Working Hours
                  </label>
                  <Input
                    value={formData.workingHours}
                    onChange={(e) => handleChange("workingHours", e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Registered Office Address
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Licence Tab */}
        <TabsContent value="licence" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Dubai Trade Licence</CardTitle>
              <CardDescription>
                Verification details for Dubai Department of Economy and Tourism (DET).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Licence Number
                  </label>
                  <Input
                    value={formData.licenceNumber}
                    onChange={(e) => handleChange("licenceNumber", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Legal Structure
                  </label>
                  <Input
                    value={formData.licenceStructure}
                    onChange={(e) => handleChange("licenceStructure", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Issuing Authority
                  </label>
                  <Input
                    value={formData.licenceAuthority}
                    onChange={(e) => handleChange("licenceAuthority", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Issue Date
                  </label>
                  <Input
                    value={formData.licenceIssueDate}
                    onChange={(e) => handleChange("licenceIssueDate", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Social Metadata</CardTitle>
              <CardDescription>
                Default page title and meta description used across all pages.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">
                  Default Meta Title
                </label>
                <Input
                  value={formData.seoTitle}
                  onChange={(e) => handleChange("seoTitle", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">
                  Default Meta Description
                </label>
                <textarea
                  rows={3}
                  value={formData.seoDescription}
                  onChange={(e) => handleChange("seoDescription", e.target.value)}
                  className="w-full rounded-md border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
