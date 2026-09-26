"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, X, Check, Loader2, Crop as CropIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export interface ImageCropUploaderProps {
  currentImageUrl?: string;
  folder: "branding" | "hero" | "services" | "gallery" | "team" | "areas";
  aspectRatio?: number; // e.g. 1 for 1:1, 4/3 for 4:3, undefined for free/unconstrained
  label?: string;
  onUploadComplete: (url: string) => void;
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

  // Interactive cropper states
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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
      setModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    if (aspectRatio) {
      let cropWidth = width * 0.8;
      let cropHeight = cropWidth / aspectRatio;
      if (cropHeight > height * 0.8) {
        cropHeight = height * 0.8;
        cropWidth = cropHeight * aspectRatio;
      }
      setCrop({
        x: (width - cropWidth) / 2,
        y: (height - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      });
    } else {
      setCrop({
        x: 0,
        y: 0,
        width,
        height
      });
    }
  };

  const handleCropAndUpload = async () => {
    if (!imageRef.current) return;
    setIsUploading(true);

    try {
      const img = imageRef.current;
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;

      const canvas = document.createElement("canvas");
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not acquire 2D canvas context");

      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        img,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            toast.error("Failed to generate image blob");
            setIsUploading(false);
            return;
          }

          try {
            const supabase = createClient();
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

            const { data, error } = await supabase.storage
              .from("cms-media")
              .upload(fileName, blob, {
                contentType: "image/webp",
                cacheControl: "31536000",
                upsert: true
              });

            if (error) {
              console.error("Storage upload error:", error);
              toast.error(`Upload error: ${error.message}`);
              setIsUploading(false);
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
            toast.error("Failed to upload image to storage");
          } finally {
            setIsUploading(false);
          }
        },
        "image/webp",
        0.88
      );
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to process image");
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-300">{label}</span>
        {aspectRatio && (
          <span className="text-[10px] text-slate-500 font-mono">
            {aspectRatio === 1 ? "1:1 Square" : aspectRatio === 4 / 3 ? "4:3 Standard" : `${aspectRatio} Ratio`}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {previewUrl ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950 text-slate-600">
            <Upload className="h-5 w-5" />
          </div>
        )}

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-slate-700 hover:text-white">
          <Upload className="h-3.5 w-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div className="flex items-center gap-2">
                <CropIcon className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold text-white">
                  Crop & Optimize ({aspectRatio === 1 ? "1:1 Square" : aspectRatio === 4 / 3 ? "4:3 Standard" : "Free Crop"})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-900/40 min-h-[300px]">
              <div className="relative inline-block select-none max-w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={rawImageSrc}
                  alt="Crop Target"
                  onLoad={onImageLoad}
                  className="max-h-[50vh] max-w-full object-contain pointer-events-none"
                />

                {/* Crop Box Overlay */}
                {crop.width > 0 && (
                  <div
                    style={{
                      left: crop.x,
                      top: crop.y,
                      width: crop.width,
                      height: crop.height
                    }}
                    className="absolute border-2 border-emerald-500 bg-emerald-500/15 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] cursor-move"
                    onMouseDown={(e) => {
                      setIsDragging(true);
                      setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y });
                    }}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-6 py-4">
              <span className="text-xs text-slate-400">
                Converts automatically to optimized WebP format
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropAndUpload}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Compressing & Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Crop & Upload</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
