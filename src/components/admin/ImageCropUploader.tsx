"use client";

import { useState, useCallback } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { Upload, X, Check, Loader2, Crop as CropIcon, ZoomIn, ZoomOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export interface ImageCropUploaderProps {
  currentImageUrl?: string;
  folder: "branding" | "hero" | "services" | "gallery" | "team" | "areas";
  aspectRatio?: number; // e.g. 1 for 1:1, 4/3 for 4:3, undefined for free crop
  label?: string;
  onUploadComplete: (url: string) => void;
}

// Helper to create cropped image canvas blob
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (error) => reject(error));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      0.9
    );
  });
}

export function ImageCropUploader({
  currentImageUrl,
  folder,
  aspectRatio,
  label = "Upload Image",
  onUploadComplete
}: ImageCropUploaderProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl ?? "");

  // react-easy-crop states
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropAndUpload = async () => {
    if (!rawImageSrc || !croppedAreaPixels) return;
    setIsUploading(true);

    try {
      const croppedBlob = await getCroppedImg(rawImageSrc, croppedAreaPixels);
      const supabase = createClient();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

      const { data, error } = await supabase.storage
        .from("cms-media")
        .upload(fileName, croppedBlob, {
          contentType: "image/webp",
          cacheControl: "31536000",
          upsert: true
        });

      if (error) {
        console.error("Storage upload error:", error);
        toast.error(`Upload error: ${error.message}`);
        return;
      }

      const {
        data: { publicUrl }
      } = supabase.storage.from("cms-media").getPublicUrl(data.path);

      setPreviewUrl(publicUrl);
      onUploadComplete(publicUrl);
      setModalOpen(false);
      setRawImageSrc(null);
      toast.success("Image cropped, converted to WebP, and uploaded!");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to crop and upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{label}</span>
        {aspectRatio && (
          <span className="text-[10px] text-muted-foreground font-mono">
            {aspectRatio === 1 ? "1:1 Square" : aspectRatio === 4 / 3 ? "4:3 Standard" : `${aspectRatio} Ratio`}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {previewUrl ? (
          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            <Upload className="size-5" />
          </div>
        )}

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-secondary px-3.5 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">
          <Upload className="size-3.5" />
          <span>Select New Image</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
      </div>

      {/* Cropper Modal */}
      {modalOpen && rawImageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border bg-card text-card-foreground shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <CropIcon className="size-4 text-primary" />
                <span className="text-sm font-semibold">
                  Crop & Optimize ({aspectRatio === 1 ? "1:1 Square" : aspectRatio === 4 / 3 ? "4:3 Standard" : "Free Crop"})
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                onClick={() => setModalOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Cropper Viewport */}
            <div className="relative h-[420px] w-full bg-slate-950">
              <Cropper
                image={rawImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                showGrid={true}
              />
            </div>

            {/* Zoom Slider & Actions */}
            <div className="flex flex-col gap-3 border-t bg-card px-6 py-4">
              <div className="flex items-center gap-3">
                <ZoomOut className="size-4 text-muted-foreground" />
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <ZoomIn className="size-4 text-muted-foreground" />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">
                  Drag to reposition &bull; Pinch or slide to zoom &bull; Converts to WebP
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCropAndUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin mr-1" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Check className="size-3.5 mr-1" />
                        <span>Crop & Upload</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
