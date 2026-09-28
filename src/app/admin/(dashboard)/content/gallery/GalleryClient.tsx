"use client";

import { useState } from "react";

import {
  ArrowLeftRight,
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  XCircle
} from "lucide-react";
import { toast } from "sonner";

import { ImageCropUploader } from "@/components/admin/ImageCropUploader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  createGalleryItemAction,
  deleteGalleryItemAction,
  toggleGalleryItemActiveAction,
  updateGalleryItemAction
} from "./actions";

export interface GalleryItemType {
  id: string;
  title: string;
  caption?: string;
  serviceId: string;
  serviceName?: string;
  imageSrc: string;
  imageAlt: string;
  beforeImageSrc?: string;
  afterImageSrc?: string;
  isBeforeAfter: boolean;
  order: number;
  isActive: boolean;
}

interface ServiceOption {
  id: string;
  title: string;
}

interface GalleryClientProps {
  initialItems: GalleryItemType[];
  services: ServiceOption[];
}

export function GalleryClient({ initialItems, services }: GalleryClientProps) {
  const [items, setItems] = useState<GalleryItemType[]>(initialItems);
  const [previewBeforeIds, setPreviewBeforeIds] = useState<Record<string, boolean>>({});

  // Add Item Dialog State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newServiceId, setNewServiceId] = useState(services[0]?.id || "");
  const [newIsBeforeAfter, setNewIsBeforeAfter] = useState(false);
  const [newStandardImageSrc, setNewStandardImageSrc] = useState("");
  const [newBeforeImageSrc, setNewBeforeImageSrc] = useState("");
  const [newAfterImageSrc, setNewAfterImageSrc] = useState("");
  const [newOrder, setNewOrder] = useState(0);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editServiceId, setEditServiceId] = useState("");
  const [editIsBeforeAfter, setEditIsBeforeAfter] = useState(false);
  const [editStandardImageSrc, setEditStandardImageSrc] = useState("");
  const [editBeforeImageSrc, setEditBeforeImageSrc] = useState("");
  const [editAfterImageSrc, setEditAfterImageSrc] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deletingItem, setDeletingItem] = useState<GalleryItemType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const resetAddForm = () => {
    setNewTitle("");
    setNewCaption("");
    setNewServiceId(services[0]?.id || "");
    setNewIsBeforeAfter(false);
    setNewStandardImageSrc("");
    setNewBeforeImageSrc("");
    setNewAfterImageSrc("");
    setNewOrder(items.length > 0 ? Math.max(...items.map((i) => i.order)) + 1 : 0);
  };

  const handleOpenAdd = () => {
    resetAddForm();
    setIsAddOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!newServiceId) {
      toast.error("Please select an associated service.");
      return;
    }
    if (newIsBeforeAfter) {
      if (!newBeforeImageSrc) {
        toast.error("Please upload the Before photo.");
        return;
      }
      if (!newAfterImageSrc) {
        toast.error("Please upload the After photo.");
        return;
      }
    } else if (!newStandardImageSrc) {
      toast.error("Please upload the project photo.");
      return;
    }

    setIsCreating(true);
    try {
      const res = await createGalleryItemAction({
        title: newTitle.trim(),
        caption: newCaption.trim() || undefined,
        serviceId: newServiceId,
        imageSrc: newIsBeforeAfter ? newAfterImageSrc : newStandardImageSrc,
        beforeImageSrc: newIsBeforeAfter ? newBeforeImageSrc : undefined,
        afterImageSrc: newIsBeforeAfter ? newAfterImageSrc : undefined,
        isBeforeAfter: newIsBeforeAfter,
        order: newOrder,
        isActive: true
      });

      if (res.success && res.item) {
        const serviceName = services.find((s) => s.id === newServiceId)?.title;
        setItems([
          ...items,
          {
            id: res.item.id,
            title: res.item.title,
            caption: res.item.caption ?? undefined,
            serviceId: res.item.serviceId,
            serviceName,
            imageSrc: res.item.imageSrc,
            imageAlt: res.item.imageAlt,
            beforeImageSrc: res.item.beforeImageSrc ?? undefined,
            afterImageSrc: res.item.afterImageSrc ?? undefined,
            isBeforeAfter: res.item.isBeforeAfter,
            order: res.item.order,
            isActive: res.item.isActive
          }
        ]);
        toast.success(`"${newTitle}" added to projects gallery!`);
        setIsAddOpen(false);
        resetAddForm();
      } else {
        toast.error(res.error ?? "Failed to create gallery item.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsCreating(false);
    }
  };

  const startEdit = (item: GalleryItemType) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditCaption(item.caption ?? "");
    setEditServiceId(item.serviceId);
    setEditIsBeforeAfter(item.isBeforeAfter);
    setEditStandardImageSrc(item.imageSrc);
    setEditBeforeImageSrc(item.beforeImageSrc ?? "");
    setEditAfterImageSrc(item.afterImageSrc ?? item.imageSrc);
    setEditOrder(item.order);
  };

  const handleSave = async (item: GalleryItemType) => {
    if (!editTitle.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (editIsBeforeAfter) {
      if (!editBeforeImageSrc) {
        toast.error("Please upload the Before photo.");
        return;
      }
      if (!editAfterImageSrc) {
        toast.error("Please upload the After photo.");
        return;
      }
    } else if (!editStandardImageSrc) {
      toast.error("Please upload the project photo.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateGalleryItemAction(item.id, {
        title: editTitle.trim(),
        caption: editCaption.trim() || undefined,
        serviceId: editServiceId || item.serviceId,
        imageSrc: editIsBeforeAfter ? editAfterImageSrc : editStandardImageSrc,
        beforeImageSrc: editIsBeforeAfter ? editBeforeImageSrc : undefined,
        afterImageSrc: editIsBeforeAfter ? editAfterImageSrc : undefined,
        isBeforeAfter: editIsBeforeAfter,
        order: editOrder,
        isActive: item.isActive
      });

      if (res.success) {
        const serviceName = services.find((s) => s.id === editServiceId)?.title || item.serviceName;
        setItems(
          items.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  title: editTitle.trim(),
                  caption: editCaption.trim() || undefined,
                  serviceId: editServiceId || item.serviceId,
                  serviceName,
                  imageSrc: editIsBeforeAfter ? editAfterImageSrc : editStandardImageSrc,
                  beforeImageSrc: editIsBeforeAfter ? editBeforeImageSrc : undefined,
                  afterImageSrc: editIsBeforeAfter ? editAfterImageSrc : undefined,
                  isBeforeAfter: editIsBeforeAfter,
                  order: editOrder
                }
              : i
          )
        );
        toast.success("Gallery item updated successfully!");
        setEditingId(null);
      } else {
        toast.error(res.error ?? "Failed to save item.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      const res = await deleteGalleryItemAction(deletingItem.id);
      if (res.success) {
        setItems(items.filter((i) => i.id !== deletingItem.id));
        toast.success(`"${deletingItem.title}" deleted.`);
        setDeletingItem(null);
      } else {
        toast.error(res.error ?? "Failed to delete item.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggle = async (item: GalleryItemType) => {
    const nextVal = !item.isActive;
    setItems(items.map((i) => (i.id === item.id ? { ...i, isActive: nextVal } : i)));

    const res = await toggleGalleryItemActiveAction(item.id, nextVal);
    if (!res.success) {
      toast.error("Failed to update status");
      setItems(items.map((i) => (i.id === item.id ? { ...i, isActive: !nextVal } : i)));
    } else {
      toast.success(`${item.title} is now ${nextVal ? "active" : "disabled"}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top action toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {items.length} Photos in Gallery
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {items.filter((i) => i.isBeforeAfter).length} Before/After Comparisons
          </Badge>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={handleOpenAdd}>
              <Plus className="mr-1.5 size-4" />
              <span>Add Project Photo</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Photo to Projects Gallery</DialogTitle>
              <DialogDescription>
                Upload a completed cleaning showcase or a Before & After comparison card.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="flex flex-col gap-4 py-2">
              {/* Type Switcher */}
              <div className="flex flex-col gap-2 rounded-lg border bg-muted/20 p-3">
                <label className="text-xs font-semibold text-foreground">
                  Project Display Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewIsBeforeAfter(false)}
                    className={`flex items-center justify-center gap-2 rounded-md border p-2.5 text-xs font-medium transition-all ${
                      !newIsBeforeAfter
                        ? "border-primary bg-primary text-primary-foreground shadow-xs"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span>Standard Project Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewIsBeforeAfter(true)}
                    className={`flex items-center justify-center gap-2 rounded-md border p-2.5 text-xs font-medium transition-all ${
                      newIsBeforeAfter
                        ? "border-primary bg-primary text-primary-foreground shadow-xs"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <ArrowLeftRight className="size-3.5" />
                    <span>Before & After Comparison</span>
                  </button>
                </div>
              </div>

              {/* Photo Upload Section */}
              {!newIsBeforeAfter ? (
                <ImageCropUploader
                  currentImageUrl={newStandardImageSrc}
                  folder="gallery"
                  aspectRatio={4 / 3}
                  label="Project Photo (4:3 Standard Aspect Ratio)"
                  onUploadComplete={(url) => setNewStandardImageSrc(url)}
                />
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                    <Badge
                      variant="outline"
                      className="w-fit border-amber-500/30 text-[10px] text-amber-500"
                    >
                      1. Before Photo
                    </Badge>
                    <ImageCropUploader
                      currentImageUrl={newBeforeImageSrc}
                      folder="gallery"
                      aspectRatio={4 / 3}
                      label="Upload 'Before' Image"
                      onUploadComplete={(url) => setNewBeforeImageSrc(url)}
                    />
                  </div>

                  <div className="flex flex-col gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <Badge
                      variant="outline"
                      className="w-fit border-emerald-500/30 text-[10px] text-emerald-500"
                    >
                      2. After Photo (Main Preview)
                    </Badge>
                    <ImageCropUploader
                      currentImageUrl={newAfterImageSrc}
                      folder="gallery"
                      aspectRatio={4 / 3}
                      label="Upload 'After' Image"
                      onUploadComplete={(url) => setNewAfterImageSrc(url)}
                    />
                  </div>
                </div>
              )}

              {/* Basic Details */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">Project Title *</label>
                  <Input
                    placeholder="e.g. Luxury Penthouse Sofa Extraction"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Associated Service *
                  </label>
                  <select
                    value={newServiceId}
                    onChange={(e) => setNewServiceId(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                    required
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">
                  Caption / Note (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Deep steam cleaning and stain removal completed in 2 hours."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full rounded-md border bg-background p-2 text-xs leading-relaxed text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground">Display Order Index</label>
                <Input
                  type="number"
                  value={newOrder}
                  onChange={(e) => setNewOrder(Number(e.target.value))}
                />
              </div>

              <DialogFooter className="border-t pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-1.5 size-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Add Photo</span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid of gallery items */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => {
          const isEdit = editingId === item.id;

          return (
            <Card key={item.id} className="flex flex-col justify-between overflow-hidden">
              <CardContent className="p-3">
                {isEdit ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-xs font-semibold text-foreground">
                        Editing: {item.title}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                          <X className="size-4" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleSave(item)} disabled={isSaving}>
                          {isSaving ? (
                            <Loader2 className="mr-1 size-3.5 animate-spin" />
                          ) : (
                            <Save className="mr-1 size-3.5" />
                          )}
                          <span>Save</span>
                        </Button>
                      </div>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex items-center justify-between rounded-md border bg-muted/20 p-2">
                      <span className="text-xs font-medium text-foreground">
                        Before / After Mode
                      </span>
                      <Button
                        type="button"
                        variant={editIsBeforeAfter ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setEditIsBeforeAfter(!editIsBeforeAfter)}
                      >
                        {editIsBeforeAfter ? "Before & After" : "Standard Photo"}
                      </Button>
                    </div>

                    {/* Image Uploaders */}
                    {!editIsBeforeAfter ? (
                      <ImageCropUploader
                        currentImageUrl={editStandardImageSrc}
                        folder="gallery"
                        aspectRatio={4 / 3}
                        label="Project Photo (4:3 Ratio)"
                        onUploadComplete={(url) => setEditStandardImageSrc(url)}
                      />
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/5 p-2.5">
                          <span className="text-[11px] font-semibold text-amber-500">
                            1. Before Photo
                          </span>
                          <ImageCropUploader
                            currentImageUrl={editBeforeImageSrc}
                            folder="gallery"
                            aspectRatio={4 / 3}
                            label="Upload Before Photo"
                            onUploadComplete={(url) => setEditBeforeImageSrc(url)}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                          <span className="text-[11px] font-semibold text-emerald-500">
                            2. After Photo (Main Card Preview)
                          </span>
                          <ImageCropUploader
                            currentImageUrl={editAfterImageSrc}
                            folder="gallery"
                            aspectRatio={4 / 3}
                            label="Upload After Photo"
                            onUploadComplete={(url) => setEditAfterImageSrc(url)}
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-foreground">Title</label>
                        <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-foreground">Display Order</label>
                        <Input
                          type="number"
                          value={editOrder}
                          onChange={(e) => setEditOrder(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-foreground">Service</label>
                      <select
                        value={editServiceId}
                        onChange={(e) => setEditServiceId(e.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-foreground">Caption</label>
                      <textarea
                        rows={2}
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        className="w-full rounded-md border bg-background p-2 text-xs leading-relaxed text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {(() => {
                      const isShowingBefore = previewBeforeIds[item.id] ?? false;
                      const activeImageSrc =
                        item.isBeforeAfter && isShowingBefore && item.beforeImageSrc
                          ? item.beforeImageSrc
                          : item.afterImageSrc || item.imageSrc;

                      return (
                        <div
                          className={`group/img relative aspect-[4/3] w-full overflow-hidden rounded-md border bg-muted ${
                            item.isBeforeAfter && item.beforeImageSrc ? "cursor-pointer" : ""
                          }`}
                          onClick={() => {
                            if (item.isBeforeAfter && item.beforeImageSrc) {
                              setPreviewBeforeIds((prev) => ({
                                ...prev,
                                [item.id]: !prev[item.id]
                              }));
                            }
                          }}
                          title={
                            item.isBeforeAfter && item.beforeImageSrc
                              ? "Click to switch between Before & After preview"
                              : undefined
                          }
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={activeImageSrc}
                            alt={item.imageAlt}
                            className="h-full w-full object-cover transition-all duration-300"
                          />

                          {item.isBeforeAfter && (
                            <>
                              <Badge
                                variant={isShowingBefore ? "default" : "secondary"}
                                className={`absolute top-2.5 left-2.5 z-10 gap-1 text-[10px] backdrop-blur-md transition-colors ${
                                  isShowingBefore
                                    ? "border-amber-500/30 bg-amber-500 text-white hover:bg-amber-600"
                                    : "bg-white/90 text-foreground"
                                }`}
                              >
                                <ArrowLeftRight className="size-3" />
                                <span>{isShowingBefore ? "Before" : "Before / After"}</span>
                              </Badge>

                              {/* Center Dual-Arrow Badge (matching Reference Image 2) */}
                              <div className="pointer-events-none absolute top-1/2 left-1/2 z-10 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0066cc] shadow-md transition-transform duration-200 group-hover/img:scale-110">
                                <ArrowLeftRight className="size-4" />
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })()}

                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 flex-col">
                        <h3 className="truncate text-sm font-semibold text-foreground">
                          {item.title}
                        </h3>
                        {item.serviceName && (
                          <span className="text-xs font-medium text-primary">
                            {item.serviceName}
                          </span>
                        )}
                      </div>

                      <Button
                        variant={item.isActive ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => handleToggle(item)}
                      >
                        {item.isActive ? (
                          <>
                            <CheckCircle2 className="mr-1 size-3.5 text-emerald-500" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-1 size-3.5 text-muted-foreground" />
                            <span>Disabled</span>
                          </>
                        )}
                      </Button>
                    </div>

                    {item.caption && (
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {item.caption}
                      </p>
                    )}

                    <div className="flex items-center justify-between border-t pt-2">
                      <span className="text-[10px] text-muted-foreground">Order #{item.order}</span>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                          <Pencil className="mr-1 size-3.5" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingItem(item)}
                          className="size-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          title="Delete photo"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deletingItem)} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project Photo?</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove &quot;{deletingItem?.title}&quot; from the projects
              gallery? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingItem(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-1.5 size-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Photo</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
