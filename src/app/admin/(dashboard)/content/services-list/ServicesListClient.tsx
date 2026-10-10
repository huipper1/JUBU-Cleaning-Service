"use client";

import { useState } from "react";
import Image from "next/image";

import {
  CheckCircle2,
  FolderPlus,
  Loader2,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  XCircle
} from "lucide-react";
import slugify from "@sindresorhus/slugify";
import { toast } from "sonner";

import type { ServiceAddon } from "@/types/content";

import { ImageCropUploader } from "@/components/admin/ImageCropUploader";
import { JubuIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  createServiceAction,
  deleteServiceAction,
  toggleServiceActiveAction,
  updateServiceAction,
  type ServiceFormData
} from "./actions";

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription?: string;
  icon: string;
  imageSrc: string;
  imageAlt: string;
  basePrice?: number;
  addons?: ServiceAddon[];
  order: number;
  isActive: boolean;
}

interface ServicesListClientProps {
  initialServices: ServiceItem[];
}

const COMMON_ICONS = [
  "sparkles",
  "home",
  "building",
  "building-2",
  "sofa",
  "shield-check",
  "leaf",
  "truck",
  "hard-hat",
  "gem",
  "star",
  "users"
];

const ADDON_ICONS = [
  "bed",
  "bath",
  "armchair",
  "sofa",
  "monitor",
  "crown",
  "users",
  "coffee",
  "sun",
  "flame",
  "disc",
  "brush",
  "droplets",
  "wind",
  "snowflake",
  "archive",
  "door-closed",
  "wrench",
  "sparkles",
  "home",
  "building"
];

export function ServicesListClient({ initialServices }: ServicesListClientProps) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "disabled">("all");

  // Dialog State (Create or Edit)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formLongDesc, setFormLongDesc] = useState("");
  const [formIcon, setFormIcon] = useState("sparkles");
  const [formImageSrc, setFormImageSrc] = useState("");
  const [formImageAlt, setFormImageAlt] = useState("");
  const [formBasePrice, setFormBasePrice] = useState<number>(199);
  const [formOrder, setFormOrder] = useState(0);
  const [formIsActive, setFormIsActive] = useState(true);

  // Add-ons State
  const [formAddons, setFormAddons] = useState<ServiceAddon[]>([]);
  const [newAddonName, setNewAddonName] = useState("");
  const [newAddonPrice, setNewAddonPrice] = useState<number>(50);
  const [newAddonUnit, setNewAddonUnit] = useState("per unit");
  const [newAddonIcon, setNewAddonIcon] = useState("sparkles");
  const [newAddonMax, setNewAddonMax] = useState<number>(10);
  const [isAddingAddon, setIsAddingAddon] = useState(false);

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const resetForm = () => {
    setEditingServiceId(null);
    setFormTitle("");
    setFormSlug("");
    setFormShortDesc("");
    setFormLongDesc("");
    setFormIcon("sparkles");
    setFormImageSrc("");
    setFormImageAlt("");
    setFormBasePrice(199);
    setFormOrder(services.length + 1);
    setFormIsActive(true);
    setFormAddons([]);
    setIsAddingAddon(false);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setFormTitle(service.title);
    setFormSlug(service.slug);
    setFormShortDesc(service.shortDescription);
    setFormLongDesc(service.longDescription ?? "");
    setFormIcon(service.icon);
    setFormImageSrc(service.imageSrc);
    setFormImageAlt(service.imageAlt);
    setFormBasePrice(service.basePrice ?? 199);
    setFormOrder(service.order);
    setFormIsActive(service.isActive);
    setFormAddons(service.addons ? [...service.addons] : []);
    setIsAddingAddon(false);
    setIsDialogOpen(true);
  };

  const handleAddAddon = () => {
    if (!newAddonName.trim()) {
      toast.error("Please enter an option name");
      return;
    }
    const newAddon: ServiceAddon = {
      id: slugify(newAddonName) + "-" + Date.now().toString(36),
      name: newAddonName.trim(),
      icon: newAddonIcon,
      price: Number(newAddonPrice) || 0,
      unitLabel: newAddonUnit.trim() || undefined,
      min: 0,
      max: Number(newAddonMax) || 10,
      defaultQty: 0
    };
    setFormAddons((prev) => [...prev, newAddon]);
    setNewAddonName("");
    setNewAddonPrice(50);
    setNewAddonUnit("per unit");
    setNewAddonIcon("sparkles");
    setIsAddingAddon(false);
    toast.success(`Added option: ${newAddon.name}`);
  };

  const handleRemoveAddon = (addonId: string) => {
    setFormAddons((prev) => prev.filter((a) => a.id !== addonId));
  };

  const loadResidentialPresets = () => {
    setFormAddons([
      {
        id: "bedroom",
        name: "Bedroom",
        icon: "bed",
        price: 50,
        unitLabel: "per room",
        min: 0,
        max: 10,
        defaultQty: 0
      },
      {
        id: "washroom",
        name: "Washroom",
        icon: "bath",
        price: 40,
        unitLabel: "per washroom",
        min: 0,
        max: 8,
        defaultQty: 0
      },
      {
        id: "balcony",
        name: "Balcony / Terrace",
        icon: "sun",
        price: 45,
        unitLabel: "per balcony",
        min: 0,
        max: 4,
        defaultQty: 0
      },
      {
        id: "kitchen-deep",
        name: "Kitchen Deep Scrub",
        icon: "flame",
        price: 85,
        unitLabel: "per kitchen",
        min: 0,
        max: 2,
        defaultQty: 0
      },
      {
        id: "oven-cleaning",
        name: "Oven Sanitization",
        icon: "disc",
        price: 60,
        unitLabel: "per appliance",
        min: 0,
        max: 3,
        defaultQty: 0
      }
    ]);
    toast.success("Loaded residential add-on presets");
  };

  const loadCommercialPresets = () => {
    setFormAddons([
      {
        id: "workstation",
        name: "Workstation Desk",
        icon: "monitor",
        price: 35,
        unitLabel: "per desk",
        min: 0,
        max: 50,
        defaultQty: 0
      },
      {
        id: "cabin",
        name: "Executive Cabin",
        icon: "crown",
        price: 75,
        unitLabel: "per cabin",
        min: 0,
        max: 15,
        defaultQty: 0
      },
      {
        id: "conference-room",
        name: "Meeting / Boardroom",
        icon: "users",
        price: 120,
        unitLabel: "per room",
        min: 0,
        max: 5,
        defaultQty: 0
      },
      {
        id: "pantry",
        name: "Office Pantry",
        icon: "coffee",
        price: 60,
        unitLabel: "per pantry",
        min: 0,
        max: 3,
        defaultQty: 0
      }
    ]);
    toast.success("Loaded commercial add-on presets");
  };

  const loadSofaPresets = () => {
    setFormAddons([
      {
        id: "single-sofa",
        name: "Single Armchair",
        icon: "armchair",
        price: 45,
        unitLabel: "per seat",
        min: 0,
        max: 8,
        defaultQty: 0
      },
      {
        id: "three-seater",
        name: "3-Seater Sofa",
        icon: "sofa",
        price: 120,
        unitLabel: "per sofa",
        min: 0,
        max: 5,
        defaultQty: 0
      },
      {
        id: "l-shape",
        name: "L-Shape Sectional",
        icon: "layers",
        price: 180,
        unitLabel: "per sofa",
        min: 0,
        max: 3,
        defaultQty: 0
      },
      {
        id: "medium-rug",
        name: "Area Rug (Medium)",
        icon: "brush",
        price: 70,
        unitLabel: "per rug",
        min: 0,
        max: 6,
        defaultQty: 0
      }
    ]);
    toast.success("Loaded upholstery & carpet presets");
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingServiceId) {
      setFormSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error("Please enter a service title.");
      return;
    }
    if (!formShortDesc.trim()) {
      toast.error("Please enter a short description.");
      return;
    }
    if (!formImageSrc) {
      toast.error("Please select or upload a service image.");
      return;
    }

    setIsSubmitting(true);
    const payload: ServiceFormData = {
      title: formTitle,
      slug: formSlug || slugify(formTitle),
      shortDescription: formShortDesc,
      longDescription: formLongDesc || undefined,
      icon: formIcon,
      imageSrc: formImageSrc,
      imageAlt: formImageAlt || formTitle,
      basePrice: Number(formBasePrice) || 199,
      addons: formAddons,
      order: formOrder,
      isActive: formIsActive
    };

    try {
      if (editingServiceId) {
        const res = await updateServiceAction(editingServiceId, payload);
        if (res.success) {
          setServices((prev) =>
            prev.map((s) =>
              s.id === editingServiceId
                ? {
                    ...s,
                    ...payload,
                    addons: formAddons,
                    slug: payload.slug ?? s.slug
                  }
                : s
            )
          );
          toast.success("Service updated successfully!");
          setIsDialogOpen(false);
          resetForm();
        } else {
          toast.error(res.error ?? "Failed to update service.");
        }
      } else {
        const res = await createServiceAction(payload);
        if (res.success && res.service) {
          const newServiceItem: ServiceItem = {
            id: res.service.id,
            slug: res.service.slug,
            title: res.service.title,
            shortDescription: res.service.shortDescription,
            longDescription: res.service.longDescription ?? undefined,
            icon: res.service.icon,
            imageSrc: res.service.imageSrc,
            imageAlt: res.service.imageAlt,
            basePrice: res.service.basePrice ?? payload.basePrice ?? 199,
            addons: formAddons,
            order: res.service.order,
            isActive: res.service.isActive
          };
          setServices((prev) => [...prev, newServiceItem].sort((a, b) => a.order - b.order));
          toast.success("New service added to catalog!");
          setIsDialogOpen(false);
          resetForm();
        } else {
          toast.error(res.error ?? "Failed to create service.");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (s: ServiceItem) => {
    const nextVal = !s.isActive;
    setServices((prev) =>
      prev.map((item) => (item.id === s.id ? { ...item, isActive: nextVal } : item))
    );

    const res = await toggleServiceActiveAction(s.id, nextVal);
    if (!res.success) {
      toast.error("Failed to update status");
      setServices((prev) =>
        prev.map((item) => (item.id === s.id ? { ...item, isActive: !nextVal } : item))
      );
    } else {
      toast.success(`${s.title} is now ${nextVal ? "active" : "disabled"}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await deleteServiceAction(deleteTarget.id);
      if (res.success) {
        setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        toast.success(`"${deleteTarget.title}" deleted from catalog.`);
        setDeleteTarget(null);
      } else {
        toast.error(res.error ?? "Failed to delete service.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterActive === "active") return matchesSearch && s.isActive;
    if (filterActive === "disabled") return matchesSearch && !s.isActive;
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Controls Bar */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex max-w-md flex-1 items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search services by title, slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border bg-muted/50 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setFilterActive("all")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                filterActive === "all"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({services.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterActive("active")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                filterActive === "active"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Active ({services.filter((s) => s.isActive).length})
            </button>
            <button
              type="button"
              onClick={() => setFilterActive("disabled")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                filterActive === "disabled"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Disabled ({services.filter((s) => !s.isActive).length})
            </button>
          </div>

          <Button onClick={openCreateDialog} size="sm" className="gap-1.5">
            <Plus className="size-4" />
            <span>Add Service</span>
          </Button>
        </div>
      </div>

      {/* Services List Grid */}
      {filteredServices.length === 0 ? (
        <Card className="border-dashed py-12 text-center">
          <CardContent className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <FolderPlus className="size-8" />
            <p className="text-sm font-medium">No services found</p>
            <p className="text-xs">
              {searchQuery
                ? "Try searching with different keywords."
                : "Get started by adding your first service to the master catalog."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredServices.map((s) => (
            <Card key={s.id} className="transition-colors hover:border-primary/40">
              <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3.5">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
                    {s.imageSrc ? (
                      <Image src={s.imageSrc} alt={s.imageAlt} fill className="object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <JubuIcon name={s.icon} className="size-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <JubuIcon name={s.icon} className="size-3.5" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{s.title}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">/{s.slug}</span>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        Order #{s.order}
                      </Badge>
                      <Badge className="border-emerald-500/20 bg-emerald-500/10 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        From {s.basePrice ?? 199} AED
                      </Badge>
                      {s.addons && s.addons.length > 0 && (
                        <Badge
                          variant="outline"
                          className="border-sky-500/30 bg-sky-500/10 text-[10px] font-semibold text-sky-700 dark:text-sky-300"
                        >
                          {s.addons.length} Add-on Options
                        </Badge>
                      )}
                    </div>
                    <p className="line-clamp-2 max-w-2xl text-xs text-muted-foreground">
                      {s.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant={s.isActive ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleToggle(s)}
                    className="h-8 gap-1.5 text-xs"
                  >
                    {s.isActive ? (
                      <>
                        <CheckCircle2 className="size-3.5 text-emerald-500" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="size-3.5 text-muted-foreground" />
                        <span>Disabled</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(s)}
                    className="h-8 gap-1 text-xs"
                  >
                    <Pencil className="size-3.5" />
                    <span>Edit</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(s)}
                    className="h-8 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title="Delete service"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Service Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>
                {editingServiceId ? "Edit Service" : "Add New Service to Catalog"}
              </DialogTitle>
              <DialogDescription>
                Configure service details. This service will be available to select on the Homepage
                and Area Landing Pages.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5 sm:col-span-3">
                <Label htmlFor="service-title" className="text-xs">
                  Service Title *
                </Label>
                <Input
                  id="service-title"
                  placeholder="e.g. Move In & Move Out Deep Cleaning"
                  value={formTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="service-slug" className="text-xs">
                  URL Slug *
                </Label>
                <Input
                  id="service-slug"
                  placeholder="e.g. move-in-cleaning"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="service-price"
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  Base Price (AED) *
                </Label>
                <Input
                  id="service-price"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="199"
                  value={formBasePrice}
                  onChange={(e) => setFormBasePrice(Number(e.target.value))}
                  required
                  className="border-emerald-500/40 font-bold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="service-order" className="text-xs">
                  Display Order
                </Label>
                <Input
                  id="service-order"
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(Number(e.target.value))}
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-3">
                <Label htmlFor="service-short-desc" className="text-xs">
                  Short Description (Shown on Cards) *
                </Label>
                <textarea
                  id="service-short-desc"
                  rows={2}
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="Concise overview of what this service includes..."
                  className="w-full rounded-md border bg-background p-2.5 text-xs text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="service-long-desc" className="text-xs">
                  Long Description / Scope (Optional)
                </Label>
                <textarea
                  id="service-long-desc"
                  rows={3}
                  value={formLongDesc}
                  onChange={(e) => setFormLongDesc(e.target.value)}
                  placeholder="Extended details, equipment used, deep cleaning steps..."
                  className="w-full rounded-md border bg-background p-2.5 text-xs text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                />
              </div>

              {/* Icon Selector */}
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label className="text-xs">Lucide Icon</Label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_ICONS.map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setFormIcon(iconName)}
                      className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors ${
                        formIcon.toLowerCase() === iconName.toLowerCase()
                          ? "border-primary bg-primary text-primary-foreground shadow-xs"
                          : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <JubuIcon name={iconName} className="size-3.5" />
                      <span className="capitalize">{iconName.replace("-", " ")}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    placeholder="Or type custom Lucide icon name..."
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="text-xs"
                  />
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted">
                    <JubuIcon name={formIcon} className="size-4 text-primary" />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="flex flex-col gap-2 border-t pt-2 sm:col-span-2">
                <ImageCropUploader
                  currentImageUrl={formImageSrc}
                  folder="services"
                  label="Service Card Cover Image *"
                  onUploadComplete={(url) => {
                    setFormImageSrc(url);
                    if (!formImageAlt && formTitle) {
                      setFormImageAlt(`${formTitle} in Dubai`);
                    }
                  }}
                />

                {formImageSrc && (
                  <div className="mt-1 flex flex-col gap-1.5">
                    <Label htmlFor="service-image-alt" className="text-xs">
                      Image Alt Text (SEO)
                    </Label>
                    <Input
                      id="service-image-alt"
                      placeholder="e.g. Professional cleaners providing deep villa cleaning"
                      value={formImageAlt}
                      onChange={(e) => setFormImageAlt(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Customizable Add-ons & Options Section */}
              <div className="flex flex-col gap-3 rounded-xl border border-sky-500/30 bg-sky-50/50 p-4 sm:col-span-3 dark:bg-sky-950/20">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-sky-600 dark:text-sky-400" />
                    <span className="text-sm font-bold text-foreground">
                      Service Personalization & Sub Add-ons
                    </span>
                    <Badge variant="secondary" className="text-[11px] font-semibold">
                      {formAddons.length} {formAddons.length === 1 ? "Option" : "Options"}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Customers can configure quantities (rooms, sofas, desks)
                  </span>
                </div>

                {/* Preset quick buttons if empty */}
                {formAddons.length === 0 && (
                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-sky-300/60 bg-white/60 p-3 dark:bg-black/20">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Quick Start Presets:
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={loadResidentialPresets}
                      className="h-7 text-xs"
                    >
                      + Residential Presets
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={loadCommercialPresets}
                      className="h-7 text-xs"
                    >
                      + Commercial Presets
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={loadSofaPresets}
                      className="h-7 text-xs"
                    >
                      + Upholstery Presets
                    </Button>
                  </div>
                )}

                {/* List of current configured add-ons */}
                {formAddons.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {formAddons.map((addon) => (
                      <div
                        key={addon.id}
                        className="flex items-center justify-between gap-3 rounded-lg border bg-background p-2.5 shadow-2xs"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
                            <JubuIcon name={addon.icon} className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-foreground">
                              {addon.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              +{addon.price} AED {addon.unitLabel ? `(${addon.unitLabel})` : ""} •
                              Max {addon.max ?? 10}
                            </p>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAddon(addon.id)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          title="Remove option"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new option toggle or inline form */}
                {!isAddingAddon ? (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddingAddon(true)}
                      className="gap-1.5 border-sky-400/40 text-xs text-sky-700 hover:bg-sky-100/50 dark:text-sky-300"
                    >
                      <Plus className="size-3.5" />
                      <span>Add Custom Option</span>
                    </Button>
                    {formAddons.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormAddons([])}
                        className="text-xs text-muted-foreground hover:text-destructive"
                      >
                        Clear All Options
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 rounded-lg border border-sky-300/80 bg-background p-3 shadow-sm dark:border-sky-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">
                        New Personalization Option
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddingAddon(false)}
                        className="h-6 text-xs text-muted-foreground"
                      >
                        Cancel
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-4">
                      <div className="sm:col-span-2">
                        <Label className="text-[11px]">Option Name *</Label>
                        <Input
                          placeholder="e.g. Master Bedroom, Sofa 3-Seater"
                          value={newAddonName}
                          onChange={(e) => setNewAddonName(e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>

                      <div>
                        <Label className="text-[11px]">Price (AED) *</Label>
                        <Input
                          type="number"
                          min="0"
                          value={newAddonPrice}
                          onChange={(e) => setNewAddonPrice(Number(e.target.value))}
                          className="h-8 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                        />
                      </div>

                      <div>
                        <Label className="text-[11px]">Unit Label</Label>
                        <Input
                          placeholder="e.g. per room"
                          value={newAddonUnit}
                          onChange={(e) => setNewAddonUnit(e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-[11px]">Icon</Label>
                      <div className="flex flex-wrap gap-1">
                        {ADDON_ICONS.map((ic) => (
                          <button
                            key={ic}
                            type="button"
                            onClick={() => setNewAddonIcon(ic)}
                            className={`flex items-center gap-1 rounded-md border p-1 text-[11px] transition-colors ${
                              newAddonIcon === ic
                                ? "border-sky-500 bg-sky-500 text-white"
                                : "bg-muted/40 hover:bg-muted"
                            }`}
                            title={ic}
                          >
                            <JubuIcon name={ic} className="size-3.5" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <Label className="text-[11px]">Max Limit:</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={newAddonMax}
                          onChange={(e) => setNewAddonMax(Number(e.target.value))}
                          className="h-7 w-16 text-center text-xs"
                        />
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddAddon}
                        className="h-8 gap-1 bg-sky-600 text-xs text-white hover:bg-sky-700"
                      >
                        <Plus className="size-3.5" />
                        <span>Save Option</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between rounded-lg border p-3 sm:col-span-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-foreground">Service Active</span>
                  <span className="text-[11px] text-muted-foreground">
                    Active services can be published to the Homepage and Area Landing Pages.
                  </span>
                </div>
                <Switch checked={formIsActive} onCheckedChange={setFormIsActive} />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{editingServiceId ? "Save Changes" : "Create Service"}</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Service from Catalog</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong className="text-foreground">{deleteTarget?.title}</strong>?
            </DialogDescription>
          </DialogHeader>

          <p className="text-xs text-muted-foreground">
            This action cannot be undone. If this service is currently selected on the Homepage or
            any Area Landing Page, deletion will be safely blocked until it is deselected.
          </p>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-1.5"
            >
              {isDeleting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              <span>Delete Service</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
