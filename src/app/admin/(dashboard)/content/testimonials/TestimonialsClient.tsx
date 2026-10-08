"use client";

import { useState } from "react";

import { CheckCircle2, Loader2, Pencil, Plus, Star, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { ImageCropUploader } from "@/components/admin/ImageCropUploader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

import {
  createTestimonialAction,
  deleteTestimonialAction,
  toggleTestimonialActiveAction,
  updateTestimonialAction,
  type TestimonialFormData
} from "./actions";

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  service: string;
  rating: number;
  quote: string;
  avatarSrc?: string;
  order: number;
  isActive: boolean;
}

interface TestimonialsClientProps {
  initialTestimonials: TestimonialItem[];
}

const DEFAULT_FORM: TestimonialFormData = {
  name: "",
  location: "Downtown Dubai",
  service: "Deep Cleaning",
  rating: 5,
  quote: "",
  avatarSrc: "",
  order: 0,
  isActive: true
};

export function TestimonialsClient({ initialTestimonials }: TestimonialsClientProps) {
  const [items, setItems] = useState<TestimonialItem[]>(initialTestimonials);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TestimonialFormData>(DEFAULT_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...DEFAULT_FORM,
      order: items.length + 1
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (t: TestimonialItem) => {
    setEditingId(t.id);
    setFormData({
      name: t.name,
      location: t.location,
      service: t.service,
      rating: t.rating,
      quote: t.quote,
      avatarSrc: t.avatarSrc || "",
      order: t.order,
      isActive: t.isActive
    });
    setIsOpen(true);
  };

  const handleToggle = async (t: TestimonialItem) => {
    const nextVal = !t.isActive;
    setItems((prev) =>
      prev.map((item) => (item.id === t.id ? { ...item, isActive: nextVal } : item))
    );

    const res = await toggleTestimonialActiveAction(t.id, nextVal);
    if (!res.success) {
      toast.error("Failed to update review visibility");
      setItems((prev) =>
        prev.map((item) => (item.id === t.id ? { ...item, isActive: !nextVal } : item))
      );
    } else {
      toast.success(`Review from ${t.name} is now ${nextVal ? "active" : "hidden"}`);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSaving(true);
    try {
      const res = await deleteTestimonialAction(id);
      if (res.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        toast.success("Review deleted successfully");
        setDeleteConfirmId(null);
      } else {
        toast.error(res.error || "Failed to delete review");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.quote.trim()) {
      toast.error("Name and review text are required.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        const res = await updateTestimonialAction(editingId, formData);
        if (res.success) {
          setItems((prev) =>
            prev.map((item) => (item.id === editingId ? { ...item, ...formData } : item))
          );
          toast.success("Review updated successfully");
          setIsOpen(false);
        } else {
          toast.error(res.error || "Failed to update review");
        }
      } else {
        const res = await createTestimonialAction(formData);
        if (res.success) {
          // Re-render will reflect the newly created item on reload or optimistic
          toast.success("New review added successfully");
          setIsOpen(false);
          window.location.reload();
        } else {
          toast.error(res.error || "Failed to add review");
        }
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header action strip */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Customer Reviews ({items.length})</h2>
          <p className="text-xs text-muted-foreground">
            Manage reviews displayed on the homepage and area landing pages.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="size-4" />
          <span>Add Review</span>
        </Button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const initials = item.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2);

          return (
            <Card
              key={item.id}
              className={`relative flex flex-col justify-between transition-all ${
                item.isActive ? "border-border shadow-xs" : "border-dashed opacity-60"
              }`}
            >
              <CardContent className="flex flex-col gap-3 p-5">
                {/* Header: Avatar, Name, Location */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-11 border">
                      <AvatarImage src={item.avatarSrc} alt={item.name} />
                      <AvatarFallback className="text-xs font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm leading-tight font-bold">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.location}</span>
                    </div>
                  </div>

                  <Badge variant={item.isActive ? "secondary" : "outline"} className="text-[10px]">
                    {item.service}
                  </Badge>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${
                        i < item.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xs font-bold text-foreground">{item.rating}.0</span>
                </div>

                {/* Quote Text */}
                <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground italic">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Actions bottom strip */}
                <div className="mt-2 flex items-center justify-between border-t pt-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(item)}
                    className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.isActive ? (
                      <>
                        <CheckCircle2 className="size-3.5 text-emerald-500" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="size-3.5 text-muted-foreground" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(item)}
                      className="size-8 p-0"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="size-8 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Review" : "Add Customer Review"}</DialogTitle>
            <DialogDescription>
              Client testimonial displayed in the sinuous wave section on your website.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Customer Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Marcus Vance"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Dubai Marina"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="service">Service Category</Label>
                <Input
                  id="service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  placeholder="e.g. Deep Cleaning"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="rating">Rating (1 to 5 Stars)</Label>
                <div className="flex items-center gap-1 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="cursor-pointer p-0.5"
                    >
                      <Star
                        className={`size-5 ${
                          star <= formData.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="quote">Review Comment *</Label>
              <textarea
                id="quote"
                value={formData.quote}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, quote: e.target.value })
                }
                rows={3}
                className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-primary"
                placeholder="Write the customer's feedback or testimonial text here..."
                required
              />
            </div>

            {/* Avatar Image Uploader */}
            <div className="flex flex-col gap-1.5">
              <Label>Customer Avatar Photo (Optional)</Label>
              <ImageCropUploader
                currentImageUrl={formData.avatarSrc}
                folder="team"
                aspectRatio={1}
                label="Upload Customer Avatar"
                onUploadComplete={(url) => setFormData({ ...formData, avatarSrc: url })}
              />
            </div>

            <DialogFooter className="mt-3">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{editingId ? "Update Review" : "Add Review"}</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this customer review?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isSaving}
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              {isSaving ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
