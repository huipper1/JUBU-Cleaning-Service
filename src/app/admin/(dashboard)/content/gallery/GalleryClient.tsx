"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Pencil, Save, X, Loader2 } from "lucide-react";
import { ImageCropUploader } from "@/components/admin/ImageCropUploader";
import { toggleGalleryItemActiveAction, updateGalleryItemAction } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GalleryItemType {
  id: string;
  title: string;
  caption?: string;
  serviceId: string;
  serviceName?: string;
  imageSrc: string;
  imageAlt: string;
  isBeforeAfter: boolean;
  order: number;
  isActive: boolean;
}

interface GalleryClientProps {
  initialItems: GalleryItemType[];
}

export function GalleryClient({ initialItems }: GalleryClientProps) {
  const [items, setItems] = useState<GalleryItemType[]>(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editImageSrc, setEditImageSrc] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (item: GalleryItemType) => {
    const nextVal = !item.isActive;
    setItems(
      items.map((i) => (i.id === item.id ? { ...i, isActive: nextVal } : i))
    );

    const res = await toggleGalleryItemActiveAction(item.id, nextVal);
    if (!res.success) {
      toast.error("Failed to update status");
      setItems(
        items.map((i) =>
          i.id === item.id ? { ...i, isActive: !nextVal } : i
        )
      );
    } else {
      toast.success(`${item.title} is now ${nextVal ? "active" : "disabled"}`);
    }
  };

  const startEdit = (item: GalleryItemType) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditCaption(item.caption ?? "");
    setEditImageSrc(item.imageSrc);
    setEditOrder(item.order);
  };

  const handleSave = async (item: GalleryItemType) => {
    setIsSaving(true);
    try {
      const res = await updateGalleryItemAction(item.id, {
        title: editTitle,
        caption: editCaption || undefined,
        imageSrc: editImageSrc,
        order: editOrder,
        isActive: item.isActive,
      });

      if (res.success) {
        setItems(
          items.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  title: editTitle,
                  caption: editCaption || undefined,
                  imageSrc: editImageSrc,
                  order: editOrder,
                }
              : i
          )
        );
        toast.success("Gallery item updated!");
        setEditingId(null);
      } else {
        toast.error(res.error ?? "Failed to save item");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {items.map((item) => {
        const isEdit = editingId === item.id;

        return (
          <Card key={item.id} className="flex flex-col justify-between">
            <CardContent className="p-5">
              {isEdit ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <span className="font-semibold text-foreground text-xs">
                      Editing: {item.title}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="size-4" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSave(item)}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="size-3.5 animate-spin mr-1" />
                        ) : (
                          <Save className="size-3.5 mr-1" />
                        )}
                        <span>Save</span>
                      </Button>
                    </div>
                  </div>

                  <ImageCropUploader
                    currentImageUrl={editImageSrc}
                    folder="gallery"
                    aspectRatio={4 / 3} // 4:3 standard
                    label="Project Photo (4:3 Ratio)"
                    onUploadComplete={(url) => setEditImageSrc(url)}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-foreground">
                        Title
                      </label>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-foreground">
                        Display Order
                      </label>
                      <Input
                        type="number"
                        value={editOrder}
                        onChange={(e) => setEditOrder(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-foreground">
                      Caption
                    </label>
                    <textarea
                      rows={2}
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      className="w-full rounded-md border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      className="h-full w-full object-cover"
                    />

                    {item.isBeforeAfter && (
                      <Badge
                        variant="secondary"
                        className="absolute top-2.5 left-2.5 backdrop-blur-md"
                      >
                        Before / After
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {item.title}
                      </h3>
                      {item.serviceName && (
                        <span className="text-xs text-primary font-medium">
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
                          <CheckCircle2 className="size-3.5 text-emerald-500 mr-1" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="size-3.5 text-muted-foreground mr-1" />
                          <span>Disabled</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {item.caption && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  )}

                  <div className="pt-2 border-t flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">
                      Order #{item.order}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(item)}
                    >
                      <Pencil className="size-3.5 mr-1" />
                      <span>Edit</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
