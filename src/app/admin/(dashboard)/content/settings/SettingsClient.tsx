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

interface SettingsClientProps {
  initialSettings: UpdateSettingsData;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [formData, setFormData] = useState<UpdateSettingsData>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof UpdateSettingsData, val: string) => {
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

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-4xl pb-12">
      <AdminPageHeader
        title="General Site Settings"
        description="Manage company details, Dubai trade licence, contact info, and default SEO."
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

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contact">Contact & Address</TabsTrigger>
          <TabsTrigger value="licence">Trade Licence</TabsTrigger>
          <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
        </TabsList>

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
