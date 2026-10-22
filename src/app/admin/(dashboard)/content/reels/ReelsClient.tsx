"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Film,
  Loader2,
  Pencil,
  Play,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
  X,
  XCircle,
  Type
} from "lucide-react";
import { toast } from "sonner";

import type { VideoReel, VideoReelsConfig } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { Switch } from "@/components/ui/switch";

import {
  deleteVideoReelAction,
  saveVideoReelAction,
  toggleVideoReelActiveAction,
  updateVideoReelsHeaderAction,
  uploadMediaAction
} from "./actions";

interface ReelsClientProps {
  initialConfig: VideoReelsConfig;
}

export function ReelsClient({ initialConfig }: ReelsClientProps) {
  const [config, setConfig] = useState<VideoReelsConfig>(initialConfig);
  const [reels, setReels] = useState<VideoReel[]>(initialConfig.items || []);

  // Section Header Editing State
  const [headerForm, setHeaderForm] = useState({
    badge: initialConfig.badge || "WATCH US IN ACTION",
    heading: initialConfig.heading || "Real Work & Transformations",
    subheading:
      initialConfig.subheading ||
      "Short 15-second reels of our licensed Dubai specialists operating professional equipment."
  });
  const [isSavingHeader, setIsSavingHeader] = useState(false);

  // Add / Edit Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // File upload loading states
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);

  const [form, setForm] = useState<Partial<VideoReel>>({
    title: "",
    serviceTitle: "",
    location: "",
    badge: "Live Work",
    duration: "0:15",
    videoUrl: "",
    posterUrl: "",
    order: 0,
    isActive: true
  });

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveHeader = async () => {
    setIsSavingHeader(true);
    const res = await updateVideoReelsHeaderAction(headerForm);
    setIsSavingHeader(false);
    if (res.success && res.config) {
      setConfig(res.config);
      toast.success("Section header updated successfully");
    } else {
      toast.error(res.error || "Failed to update section header");
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      id: `reel-${Date.now()}`,
      title: "",
      serviceTitle: "",
      location: "",
      badge: "Live Work",
      duration: "0:15",
      videoUrl: "",
      posterUrl: "",
      order: reels.length + 1,
      isActive: true
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (reel: VideoReel) => {
    setEditingId(reel.id);
    setForm({ ...reel });
    setIsOpen(true);
  };

  // Direct Video File Upload (Direct Supabase CDN with Server Action Fallback)
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/") && !file.name.match(/\.(mp4|webm|mov|m4v)$/i)) {
      toast.error("Please upload a valid video file (.mp4, .webm, .mov)");
      return;
    }

    if (file.size > 200 * 1024 * 1024) {
      toast.error("Video file is too large. Maximum size is 200MB.");
      return;
    }

    setIsUploadingVideo(true);
    toast.info("Uploading video file to cloud storage...");
    try {
      // 1. First try direct client upload (bypasses Next.js body parser limits)
      try {
        const supabase = createClient();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const fileName = `reels/${Date.now()}-${safeName}`;

        const { data, error } = await supabase.storage
          .from("cms-media")
          .upload(fileName, file, {
            contentType: file.type || "video/mp4",
            cacheControl: "31536000",
            upsert: true
          });

        if (!error && data?.path) {
          const {
            data: { publicUrl }
          } = supabase.storage.from("cms-media").getPublicUrl(data.path);

          setForm((prev) => ({ ...prev, videoUrl: publicUrl }));
          toast.success("Video file uploaded successfully!");
          return;
        }
      } catch (clientErr) {
        console.warn("Client storage upload attempt failed, falling back to server action:", clientErr);
      }

      // 2. Server Action fallback
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "reels");

      const res = await uploadMediaAction(formData);

      if (res.success && res.url) {
        setForm((prev) => ({ ...prev, videoUrl: res.url }));
        toast.success("Video file uploaded successfully!");
      } else {
        toast.error(res.error || "Failed to upload video file.");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred while uploading the video.");
    } finally {
      setIsUploadingVideo(false);
      e.target.value = "";
    }
  };

  // Direct Poster Image Upload (Direct Supabase CDN with Server Action Fallback)
  const handlePosterFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
      toast.error("Please upload a valid image file (.jpg, .png, .webp)");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image file is too large. Maximum size is 20MB.");
      return;
    }

    setIsUploadingPoster(true);
    toast.info("Uploading poster image...");
    try {
      // 1. First try direct client upload
      try {
        const supabase = createClient();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const fileName = `reels/posters/${Date.now()}-${safeName}`;

        const { data, error } = await supabase.storage
          .from("cms-media")
          .upload(fileName, file, {
            contentType: file.type || "image/jpeg",
            cacheControl: "31536000",
            upsert: true
          });

        if (!error && data?.path) {
          const {
            data: { publicUrl }
          } = supabase.storage.from("cms-media").getPublicUrl(data.path);

          setForm((prev) => ({ ...prev, posterUrl: publicUrl }));
          toast.success("Poster image uploaded successfully!");
          return;
        }
      } catch (clientErr) {
        console.warn("Client storage upload attempt failed, falling back to server action:", clientErr);
      }

      // 2. Server Action fallback
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "reels/posters");

      const res = await uploadMediaAction(formData);

      if (res.success && res.url) {
        setForm((prev) => ({ ...prev, posterUrl: res.url }));
        toast.success("Poster image uploaded successfully!");
      } else {
        toast.error(res.error || "Failed to upload poster image.");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred while uploading the poster image.");
    } finally {
      setIsUploadingPoster(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    // Only videoUrl is strictly required! Title & category are completely optional.
    if (!form.videoUrl?.trim()) {
      toast.error("Please upload a video file or paste a video link");
      return;
    }

    setIsSaving(true);
    const reelData: VideoReel = {
      id: editingId || form.id || `reel-${Date.now()}`,
      title: form.title?.trim() || "",
      serviceTitle: form.serviceTitle?.trim() || "",
      location: form.location?.trim() || "",
      badge: form.badge?.trim() || "Live Work",
      duration: form.duration?.trim() || "0:15",
      videoUrl: form.videoUrl.trim(),
      posterUrl: form.posterUrl?.trim() || "",
      order: Number(form.order) || 0,
      isActive: form.isActive ?? true
    };

    const res = await saveVideoReelAction(reelData);
    setIsSaving(false);

    if (res.success && res.reels) {
      setReels(res.reels);
      setIsOpen(false);
      toast.success(editingId ? "Video reel updated" : "Video reel added");
    } else {
      toast.error(res.error || "Failed to save reel");
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    const res = await deleteVideoReelAction(id);
    setIsDeleting(false);

    if (res.success && res.reels) {
      setReels(res.reels);
      setDeletingId(null);
      toast.success("Video reel deleted");
    } else {
      toast.error(res.error || "Failed to delete reel");
    }
  };

  const handleToggleActive = async (id: string) => {
    const res = await toggleVideoReelActiveAction(id);
    if (res.success && res.reels) {
      setReels(res.reels);
      toast.success("Reel status updated");
    } else {
      toast.error(res.error || "Failed to update status");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Section Header Settings Card (Zero hardcoded headers!) */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-bold">Section Header Configuration</CardTitle>
          </div>
          <CardDescription>
            Customize the badge tag, heading title, and description displayed above the reels section on the website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground">Section Badge</label>
              <Input
                placeholder="WATCH US IN ACTION"
                value={headerForm.badge}
                onChange={(e) => setHeaderForm((p) => ({ ...p, badge: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-foreground">Section Heading</label>
              <Input
                placeholder="Real Work & Transformations"
                value={headerForm.heading}
                onChange={(e) => setHeaderForm((p) => ({ ...p, heading: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground">Section Subheading</label>
            <Input
              placeholder="Short 15-second reels of our licensed Dubai specialists operating professional equipment."
              value={headerForm.subheading}
              onChange={(e) => setHeaderForm((p) => ({ ...p, subheading: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSaveHeader}
              disabled={isSavingHeader}
              size="sm"
              className="gap-1.5"
            >
              {isSavingHeader ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Section Header
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Video Reels List Management */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <Film className="h-5 w-5 text-primary" />
            Work Video Reels
            <Badge variant="secondary" className="text-xs font-normal">
              {reels.length} {reels.length === 1 ? "reel" : "reels"} in database
            </Badge>
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Only active reels from this database will appear on the website (nothing is hardcoded).
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Video Reel
        </Button>
      </div>

      {/* Empty State */}
      {reels.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Video className="h-7 w-7" />
          </div>
          <h3 className="text-base font-semibold text-foreground">No video reels in database yet</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Add your first 9:16 vertical video reel. When added, it will automatically appear in the public reels section.
          </p>
          <Button onClick={handleOpenAdd} className="mt-5 gap-2">
            <Plus className="h-4 w-4" />
            Add First Reel
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {reels.map((reel) => (
            <Card
              key={reel.id}
              className={`overflow-hidden transition-all duration-200 ${
                !reel.isActive ? "opacity-60 bg-muted/30" : "hover:border-primary/50"
              }`}
            >
              {/* 9:16 Thumbnail Container */}
              <div className="relative aspect-9/16 w-full bg-slate-900 overflow-hidden">
                {reel.posterUrl ? (
                  <Image
                    src={reel.posterUrl}
                    alt={reel.title || "JUBU Cleaning Reel"}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <video
                    src={`${reel.videoUrl}#t=0.5`}
                    preload="metadata"
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                )}

                {/* Badge Overlay */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-xs text-[10px]">
                    {reel.badge || "Live Work"}
                  </Badge>
                  {reel.duration && (
                    <Badge variant="outline" className="bg-black/40 text-white text-[10px] border-white/20">
                      {reel.duration}
                    </Badge>
                  )}
                </div>

                {/* Active Toggle Button */}
                <div className="absolute top-2.5 right-2.5">
                  <button
                    onClick={() => handleToggleActive(reel.id)}
                    className="rounded-full bg-black/60 p-1.5 text-white backdrop-blur-xs transition-colors hover:bg-black/80"
                    title={reel.isActive ? "Click to disable" : "Click to enable"}
                  >
                    {reel.isActive ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Card Details */}
              <CardContent className="p-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-primary">
                    <span>{reel.serviceTitle || "Video Reel"}</span>
                    <span className="text-[11px] text-muted-foreground font-normal">Order: #{reel.order}</span>
                  </div>
                  <h4 className="mt-1 line-clamp-2 text-sm font-bold text-foreground">
                    {reel.title || "Untitled Reel"}
                  </h4>
                  {reel.location && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      📍 {reel.location}
                    </p>
                  )}
                </div>

                <div className="truncate text-[11px] text-muted-foreground font-mono bg-muted/50 p-1.5 rounded-md">
                  {reel.videoUrl}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(reel)}
                    className="h-8 gap-1.5 text-xs"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingId(reel.id)}
                    className="h-8 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Video Reel" : "Add New Video Reel"}</DialogTitle>
            <DialogDescription>
              Upload a 9:16 vertical video or paste an MP4 link with optional service details.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Title (Optional) */}
            <div>
              <label className="text-xs font-semibold text-foreground">
                Reel Title
              </label>
              <Input
                placeholder="e.g. Deep Villa Cleaning & Marble Polish (optional)"
                value={form.title || ""}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="mt-1"
              />
            </div>

            {/* Service Title & Location (Both Optional) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Service Category
                </label>
                <Input
                  placeholder="e.g. Deep Cleaning (optional)"
                  value={form.serviceTitle || ""}
                  onChange={(e) => setForm((p) => ({ ...p, serviceTitle: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Dubai Location / Area
                </label>
                <Input
                  placeholder="e.g. Dubai Marina (optional)"
                  value={form.location || ""}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Video File Upload & URL (Required) */}
            <div className="rounded-xl border p-3.5 bg-muted/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  Video (MP4 / WebM) <span className="text-destructive">*</span>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
                    className="hidden"
                    onChange={handleVideoFileUpload}
                    disabled={isUploadingVideo}
                  />
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                    {isUploadingVideo ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    {isUploadingVideo ? "Uploading Video..." : "Upload Video File"}
                  </span>
                </label>
              </div>

              <Input
                placeholder="https://.../video.mp4 (or upload file above)"
                value={form.videoUrl || ""}
                onChange={(e) => setForm((p) => ({ ...p, videoUrl: e.target.value }))}
              />
            </div>

            {/* Poster / Thumbnail Upload & URL (Optional) */}
            <div className="rounded-xl border p-3.5 bg-muted/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  Poster / Thumbnail Image
                </label>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handlePosterFileUpload}
                    disabled={isUploadingPoster}
                  />
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                    {isUploadingPoster ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    {isUploadingPoster ? "Uploading Poster..." : "Upload Poster Image"}
                  </span>
                </label>
              </div>

              <Input
                placeholder="https://.../poster.jpg (optional: video will autoplay if blank)"
                value={form.posterUrl || ""}
                onChange={(e) => setForm((p) => ({ ...p, posterUrl: e.target.value }))}
              />
            </div>

            {/* Live Preview if videoUrl exists */}
            {form.videoUrl && (
              <div className="rounded-xl border p-3 bg-black/5">
                <span className="text-[11px] font-semibold text-muted-foreground block mb-2">Live Video Preview:</span>
                <div className="relative aspect-9/16 max-w-[180px] mx-auto rounded-xl overflow-hidden bg-black shadow">
                  <video
                    src={form.videoUrl}
                    poster={form.posterUrl}
                    controls
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Badge & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">Badge Tag</label>
                <Input
                  placeholder="e.g. Live Work, Deep Clean"
                  value={form.badge || ""}
                  onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Duration</label>
                <Input
                  placeholder="e.g. 0:15"
                  value={form.duration || ""}
                  onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Display Order & Active Toggle */}
            <div className="grid grid-cols-2 items-center gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-foreground">Display Order</label>
                <Input
                  type="number"
                  min={0}
                  value={form.order ?? 0}
                  onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3 mt-4">
                <span className="text-xs font-semibold">Active &amp; Visible</span>
                <Switch
                  checked={form.isActive ?? true}
                  onCheckedChange={(c) => setForm((p) => ({ ...p, isActive: c }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="gap-1.5">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Update Reel" : "Add Reel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Video Reel?</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this reel? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeletingId(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingId && handleDelete(deletingId)}
              disabled={isDeleting}
              className="gap-1.5"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
