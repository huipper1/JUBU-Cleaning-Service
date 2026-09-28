"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { ArrowDown, ArrowUp, Plus, Search, X } from "lucide-react";

import { JubuIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ServiceOption {
  id: string;
  slug: string;
  title: string;
  shortDescription?: string;
  icon: string;
  imageSrc?: string;
  isActive: boolean;
}

export interface ServiceSelectorProps {
  availableServices: ServiceOption[];
  selectedIds: string[];
  onChange: (newIds: string[]) => void;
  title?: string;
  description?: string;
}

export function ServiceSelector({
  availableServices,
  selectedIds,
  onChange,
  title = "Select & Order Services",
  description = "Choose which services appear in this section and arrange their display order."
}: ServiceSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Map of available services for fast lookup
  const serviceMap = useMemo(() => {
    const map = new Map<string, ServiceOption>();
    for (const s of availableServices) {
      map.set(s.id, s);
    }
    return map;
  }, [availableServices]);

  // Selected services in order
  const selectedServices = useMemo(() => {
    return selectedIds
      .map((id) => serviceMap.get(id))
      .filter((s): s is ServiceOption => Boolean(s));
  }, [selectedIds, serviceMap]);

  // Unselected services
  const unselectedServices = useMemo(() => {
    const selectedSet = new Set(selectedIds);
    return availableServices.filter((s) => !selectedSet.has(s.id));
  }, [availableServices, selectedIds]);

  // Filtered available services based on search
  const filteredUnselected = useMemo(() => {
    if (!searchQuery.trim()) return unselectedServices;
    const q = searchQuery.toLowerCase();
    return unselectedServices.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        (s.shortDescription && s.shortDescription.toLowerCase().includes(q))
    );
  }, [unselectedServices, searchQuery]);

  // Add a service to the end of the selected list
  const handleAdd = (id: string) => {
    if (!selectedIds.includes(id)) {
      onChange([...selectedIds, id]);
    }
  };

  // Remove a service from the selected list
  const handleRemove = (id: string) => {
    onChange(selectedIds.filter((item) => item !== id));
  };

  // Move service up
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newIds = [...selectedIds];
    const temp = newIds[index];
    newIds[index] = newIds[index - 1];
    newIds[index - 1] = temp;
    onChange(newIds);
  };

  // Move service down
  const handleMoveDown = (index: number) => {
    if (index >= selectedIds.length - 1) return;
    const newIds = [...selectedIds];
    const temp = newIds[index];
    newIds[index] = newIds[index + 1];
    newIds[index + 1] = temp;
    onChange(newIds);
  };

  // Select all active services
  const handleSelectAllActive = () => {
    const allActiveIds = availableServices.filter((s) => s.isActive).map((s) => s.id);
    onChange(allActiveIds);
  };

  // Clear all
  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header and bulk actions */}
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h4 className="text-xs font-semibold text-foreground">{title}</h4>
          {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectAllActive}
            className="h-7 px-2.5 text-[11px]"
          >
            Select All Active ({availableServices.filter((s) => s.isActive).length})
          </Button>
          {selectedIds.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-7 px-2.5 text-[11px] text-muted-foreground hover:text-destructive"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Selected Services (with Reorder Controls) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-foreground">
            Selected Services ({selectedServices.length}):
          </span>
          <span className="text-[10px] text-muted-foreground">
            Items will appear in this exact order
          </span>
        </div>

        {selectedServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 py-6 text-center text-muted-foreground">
            <p className="text-xs font-medium">No services selected yet</p>
            <p className="text-[11px]">
              Select services from the pool below to include them in this section.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {selectedServices.map((service, index) => (
              <div
                key={service.id}
                className="flex items-center justify-between rounded-lg border bg-card p-2.5 text-xs shadow-xs transition-colors hover:border-primary/30"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="flex size-6 shrink-0 items-center justify-center rounded-full p-0 font-mono text-[10px]"
                  >
                    #{index + 1}
                  </Badge>

                  <div className="relative size-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                    {service.imageSrc ? (
                      <Image
                        src={service.imageSrc}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <JubuIcon name={service.icon} className="size-4" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{service.title}</span>
                      {!service.isActive && (
                        <Badge
                          variant="outline"
                          className="border-amber-500/30 text-[9px] text-amber-500"
                        >
                          Inactive in Catalog
                        </Badge>
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      /{service.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => handleMoveUp(index)}
                    className="size-7 p-0"
                    title="Move up in order"
                  >
                    <ArrowUp className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={index === selectedServices.length - 1}
                    onClick={() => handleMoveDown(index)}
                    className="size-7 p-0"
                    title="Move down in order"
                  >
                    <ArrowDown className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(service.id)}
                    className="size-7 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title="Remove from section"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Services Pool */}
      <div className="flex flex-col gap-2 border-t pt-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-foreground">
            Available Services Pool ({unselectedServices.length} unselected):
          </span>
        </div>

        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter available services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>

        {filteredUnselected.length === 0 ? (
          <p className="py-3 text-center text-xs text-muted-foreground">
            {searchQuery
              ? "No matching unselected services found."
              : "All available services are already selected above!"}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {filteredUnselected.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => handleAdd(service.id)}
                className="group flex items-center justify-between rounded-lg border bg-card p-2 text-left transition-all hover:border-primary/40 hover:bg-muted/40"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <JubuIcon name={service.icon} className="size-3.5" />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-xs font-medium text-foreground group-hover:text-primary">
                      {service.title}
                    </span>
                    <span className="truncate font-mono text-[10px] text-muted-foreground">
                      /{service.slug}
                    </span>
                  </div>
                </div>

                <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-dashed text-muted-foreground transition-colors group-hover:border-primary group-hover:bg-primary/5 group-hover:text-primary">
                  <Plus className="size-3.5" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
