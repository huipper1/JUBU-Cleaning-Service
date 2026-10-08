"use client";

import { useState } from "react";

import { Check, Copy, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { updateTrackingAction, type UpdateTrackingData } from "./actions";

interface TrackingClientProps {
  initialTracking: UpdateTrackingData;
}

export function TrackingClient({ initialTracking }: TrackingClientProps) {
  const [formData, setFormData] = useState<UpdateTrackingData>({
    gtmId: initialTracking.gtmId ?? "",
    gaId: initialTracking.gaId ?? ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const gtm = formData.gtmId?.trim();
    const ga = formData.gaId?.trim();

    if (gtm && !/^GTM-[A-Z0-9]+$/i.test(gtm)) {
      toast.error("Invalid GTM ID format. Must match GTM-XXXXXXX (e.g. GTM-N5DZLXX2)");
      return;
    }

    if (ga && !/^G-[A-Z0-9]+$/i.test(ga)) {
      toast.error("Invalid GA4 Measurement ID format. Must match G-XXXXXXXXXX (e.g. G-1234567890)");
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateTrackingAction({
        gtmId: gtm ? gtm.toUpperCase() : "",
        gaId: ga ? ga.toUpperCase() : ""
      });
      if (res.success) {
        toast.success("Tracking IDs saved and activated live!");
      } else {
        toast.error(res.error ?? "Failed to save tracking settings");
      }
    } catch {
      toast.error("An unexpected error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const hasGtm = Boolean(formData.gtmId?.trim());
  const hasGa = Boolean(formData.gaId?.trim());

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tracking & Analytics"
        description="Manage your Google Tag Manager and Google Analytics 4 IDs to enable tracking across the website."
      />

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* GTM Setup Card */}
          <Card className="border-border/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Google Tag Manager (GTM)</CardTitle>
                  <CardDescription>Enables GTM container on all pages.</CardDescription>
                </div>
                <Badge
                  variant={hasGtm ? "default" : "outline"}
                  className={hasGtm ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  {hasGtm ? "Active" : "Not Set"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="gtmId"
                  className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
                >
                  GTM Container ID
                </label>
                <div className="relative">
                  <Input
                    id="gtmId"
                    placeholder="GTM-XXXXXXX"
                    value={formData.gtmId ?? ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gtmId: e.target.value.toUpperCase().trim()
                      }))
                    }
                    className="font-mono tracking-wider uppercase"
                  />
                  {formData.gtmId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(formData.gtmId || "", "gtm")}
                      className="absolute top-1 right-1 h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                      {copiedKey === "gtm" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Example: <code className="rounded bg-muted px-1">GTM-XXXXXXX</code>
                </p>
              </div>
            </CardContent>

            <CardFooter className="border-t bg-muted/20 px-6 py-3">
              <a
                href="https://tagmanager.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                <span>Google Tag Manager</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </CardFooter>
          </Card>

          {/* GA4 Setup Card */}
          <Card className="border-border/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Google Analytics 4 (GA4)</CardTitle>
                  <CardDescription>Direct GA4 measurement integration.</CardDescription>
                </div>
                <Badge
                  variant={hasGa ? "default" : "outline"}
                  className={hasGa ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  {hasGa ? "Active" : "Not Set"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="gaId"
                  className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
                >
                  GA4 Measurement ID
                </label>
                <div className="relative">
                  <Input
                    id="gaId"
                    placeholder="G-XXXXXXXXXX"
                    value={formData.gaId ?? ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gaId: e.target.value.toUpperCase().trim()
                      }))
                    }
                    className="font-mono tracking-wider uppercase"
                  />
                  {formData.gaId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(formData.gaId || "", "ga")}
                      className="absolute top-1 right-1 h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                      {copiedKey === "ga" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Example: <code className="rounded bg-muted px-1">G-XXXXXXXXXX</code>
                </p>
              </div>
            </CardContent>

            <CardFooter className="border-t bg-muted/20 px-6 py-3">
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                <span>Google Analytics</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </CardFooter>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 rounded-xl border border-border bg-card p-4 shadow-xs">
          <Button type="submit" disabled={isSaving} className="min-w-35">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
