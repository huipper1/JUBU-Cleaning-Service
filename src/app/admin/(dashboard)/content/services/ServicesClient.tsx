"use client";

import { useState } from "react";
import Link from "next/link";

import { ArrowUpRight, Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { ServiceOption, ServiceSelector } from "@/components/admin/ServiceSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { updateHomepageServicesAction } from "./actions";

interface ServicesClientProps {
  allServices: ServiceOption[];
  initialSelectedIds: string[];
}

export function ServicesClient({ allServices, initialSelectedIds }: ServicesClientProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateHomepageServicesAction(selectedIds);
      if (res.success) {
        toast.success("Homepage services updated and published live!");
      } else {
        toast.error(res.error ?? "Failed to save homepage services");
      }
    } catch {
      toast.error("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Save Button Header Action */}
      <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-xs">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-foreground">
            Homepage Services ({selectedIds.length} Selected)
          </span>
          <span className="text-xs text-muted-foreground">
            Save changes to update the live homepage services section.
          </span>
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="gap-1.5">
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="size-4" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>

      {/* Info Card with Link to Services Catalog */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground">
                Want to add, edit, or delete services?
              </span>
              <span className="text-[11px] text-muted-foreground">
                Use the Services Catalog to create new services or modify existing service titles,
                descriptions, and images.
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="shrink-0 gap-1 self-start text-xs sm:self-auto"
          >
            <Link href="/admin/content/services-list">
              <span>Go to Services Catalog</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Main Service Selector Card */}
      <Card>
        <CardHeader>
          <CardTitle>Select Services to Display</CardTitle>
          <CardDescription>
            Choose which services appear on the main website homepage and reorder them as desired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceSelector
            availableServices={allServices}
            selectedIds={selectedIds}
            onChange={setSelectedIds}
            title="Homepage Services Display"
            description="Cards on the homepage will be displayed in this exact sequence."
          />
        </CardContent>
      </Card>
    </div>
  );
}
