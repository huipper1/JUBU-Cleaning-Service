"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  toggleSectionVisibilityAction,
  type SectionKey,
} from "@/app/admin/(dashboard)/content/section-visibility-action";

interface SectionVisibilityToggleProps {
  sectionKey: SectionKey;
  label?: string;
  initialVisible?: boolean;
}

export function SectionVisibilityToggle({
  sectionKey,
  label = "Visible on Website",
  initialVisible = true,
}: SectionVisibilityToggleProps) {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsVisible(checked);
    setIsPending(true);
    try {
      const res = await toggleSectionVisibilityAction(sectionKey, checked);
      if (res.success) {
        toast.success(
          checked
            ? "Section is now visible on public site"
            : "Section is now hidden from public site"
        );
      } else {
        setIsVisible(!checked);
        toast.error(res.error ?? "Failed to update section visibility");
      }
    } catch {
      setIsVisible(!checked);
      toast.error("Failed to update section visibility");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-3.5 py-2 shadow-xs">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-foreground">
          {label}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {isVisible ? "Active (Shown live)" : "Hidden from landing page"}
        </span>
      </div>
      <Switch
        checked={isVisible}
        disabled={isPending}
        onCheckedChange={handleToggle}
        aria-label={label}
      />
    </div>
  );
}
