"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  X
} from "lucide-react";

import type { SiteSettings, VideoReel, VideoReelsConfig } from "@/types/content";
import { WhatsAppIcon } from "@/components/icons";
import { trackWhatsAppClick } from "@/lib/analytics";

interface WorkReelsProps {
  reels?: VideoReel[] | VideoReelsConfig;
  settings?: SiteSettings;
}

export function WorkReels({ reels, settings }: WorkReelsProps) {
  // Extract database items and customizable header
  let activeReels: VideoReel[] = [];
  let badgeText = "WATCH US IN ACTION";
  let headingText = "Real Work & Transformations";
  let subheadingText = "Short 15-second reels of our licensed Dubai specialists operating professional equipment.";

  if (reels) {
    if (Array.isArray(reels)) {
      activeReels = reels
        .filter((r) => r && r.isActive)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    } else if (typeof reels === "object" && reels !== null) {
      if (reels.badge?.trim()) badgeText = reels.badge.trim();
      if (reels.heading?.trim()) headingText = reels.heading.trim();
      if (reels.subheading?.trim()) subheadingText = reels.subheading.trim();
      if (Array.isArray(reels.items)) {
        activeReels = reels.items
          .filter((r) => r && r.isActive)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      }
    }
  }

  // STRICT REQUIREMENT: DO NOT HARDCODE ANYTHING!
  // If no reels are added in the database, return null so nothing displays.
  if (activeReels.length === 0) {
    return null;
  }

  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedReel = activeModalIndex !== null ? activeReels[activeModalIndex] : null;

  const openModal = (index: number) => {
    setActiveModalIndex(index);
    setIsPlaying(true);
    setIsMuted(false);
  };

  const closeModal = () => {
    setActiveModalIndex(null);
  };

  const handlePrev = () => {
    if (activeModalIndex === null) return;
    const nextIdx = activeModalIndex > 0 ? activeModalIndex - 1 : activeReels.length - 1;
    setActiveModalIndex(nextIdx);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (activeModalIndex === null) return;
    const nextIdx = activeModalIndex < activeReels.length - 1 ? activeModalIndex + 1 : 0;
    setActiveModalIndex(nextIdx);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!modalVideoRef.current) return;
    if (modalVideoRef.current.paused) {
      modalVideoRef.current.play();
      setIsPlaying(true);
    } else {
      modalVideoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!modalVideoRef.current) return;
    modalVideoRef.current.muted = !modalVideoRef.current.muted;
    setIsMuted(modalVideoRef.current.muted);
  };

  // Keyboard navigation & lock body scroll
  useEffect(() => {
    if (activeModalIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeModalIndex]);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -310, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 310, behavior: "smooth" });
    }
  };

  const targetWhatsapp = settings?.whatsappNumber || "971542995191";

  return (
    <section
      id="reels"
      aria-label="Work Video Reels"
      className="relative overflow-hidden bg-linear-to-b from-[#030f24] via-[#051c3f] to-[#041633] py-14 text-white sm:py-20 lg:py-24"
    >
      {/* Background radial glows */}
      <div className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-brand-sky/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-[110px]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading from Database */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 text-center sm:mb-12 sm:flex-row sm:items-end sm:text-left">
          <div>
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/15 px-3.5 py-1 text-xs font-bold tracking-wider text-sky-300">
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              {badgeText}
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {headingText}
            </h2>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-300">
              {subheadingText}
            </p>
          </div>

          {/* Navigation Controls (Desktop) */}
          {activeReels.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                aria-label="Previous reels"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:border-sky-400 hover:bg-white/15 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={scrollRight}
                aria-label="Next reels"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:border-sky-400 hover:bg-white/15 active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* 9:16 Vertical Reels Cards Grid / Carousel */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex snap-x snap-mandatory gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-4 pt-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {activeReels.map((reel, idx) => (
            <div
              key={reel.id}
              onClick={() => {
                if (!hasMovedRef.current) {
                  openModal(idx);
                }
              }}
              className="group relative aspect-9/16 w-[235px] sm:w-[255px] md:w-[275px] lg:w-[285px] shrink-0 snap-start cursor-pointer overflow-hidden rounded-3xl border border-white/15 bg-[#061836] shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-500/15"
            >
              {/* Poster Thumbnail Image or Video First Frame */}
              {reel.posterUrl ? (
                <Image
                  src={reel.posterUrl}
                  alt={reel.title || "JUBU Cleaning Reel"}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 80vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <video
                  src={`${reel.videoUrl}#t=0.5`}
                  preload="metadata"
                  muted
                  playsInline
                  className="h-full w-full object-cover object-center"
                />
              )}

              {/* Dark Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-linear-to-t from-[#020b1c]/95 via-[#020b1c]/40 to-black/30 transition-opacity group-hover:opacity-90" />

              {/* Top Badges */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {reel.badge || "Live Work"}
                </span>

                {reel.duration && (
                  <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-slate-300 backdrop-blur-md">
                    {reel.duration}
                  </span>
                )}
              </div>

              {/* Central Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-115 group-hover:bg-brand-green group-hover:border-brand-green">
                  <Play className="ml-0.5 h-6 w-6 fill-white" />
                </div>
              </div>

              {/* Bottom Information (renders gracefully whether title/serviceTitle exist or not) */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                {reel.serviceTitle && (
                  <span className="text-[11px] font-semibold text-sky-300">
                    {reel.serviceTitle}
                  </span>
                )}
                {reel.title && (
                  <h3 className="line-clamp-2 mt-0.5 text-sm font-bold text-white leading-snug">
                    {reel.title}
                  </h3>
                )}
                {reel.location && (
                  <p className="mt-1 text-[11px] text-slate-300">
                    📍 {reel.location}
                  </p>
                )}

                {/* Hover CTA Indicator */}
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-400 opacity-90 transition-opacity group-hover:opacity-100">
                  <span>Watch Reel</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Reel Lightbox Modal (TikTok / Instagram Reels Style) */}
      {selectedReel && activeModalIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4 backdrop-blur-xl animate-in fade-in duration-200"
        >
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={closeModal} />

          {/* Modal Container */}
          <div className="relative z-10 flex flex-col items-center max-w-full">
            {/* Top Close Button */}
            <div className="mb-3 flex w-full max-w-[380px] sm:max-w-[420px] items-center justify-between px-2">
              <span className="text-xs font-medium text-slate-400">
                Reel {activeModalIndex + 1} of {activeReels.length}
              </span>
              <button
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 active:scale-90"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 9:16 Video Player Container */}
            <div className="relative aspect-9/16 w-full max-w-[380px] sm:max-w-[420px] max-h-[88vh] overflow-hidden rounded-3xl bg-black shadow-2xl border border-white/20 flex flex-col justify-between">
              <video
                ref={modalVideoRef}
                src={selectedReel.videoUrl}
                poster={selectedReel.posterUrl}
                autoPlay
                playsInline
                loop
                muted={isMuted}
                className="h-full w-full object-cover"
                onClick={togglePlay}
              />

              {/* Sound & Play State Controls (Top Right Overlay) */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/80 active:scale-90"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>

              {/* Pause Indicator overlay if paused */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer z-10"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md">
                    <Play className="ml-1 h-8 w-8 fill-white" />
                  </div>
                </div>
              )}

              {/* Bottom Reel Caption & Action CTA Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/70 to-transparent p-5 z-20">
                {(selectedReel.title || selectedReel.serviceTitle || selectedReel.location) && (
                  <div className="mb-3 space-y-1">
                    <div className="flex items-center gap-2">
                      {selectedReel.serviceTitle && (
                        <span className="rounded-full bg-sky-500/30 border border-sky-400/40 px-2.5 py-0.5 text-[10px] font-bold text-sky-200">
                          {selectedReel.serviceTitle}
                        </span>
                      )}
                      {selectedReel.location && (
                        <span className="text-[11px] text-slate-300 font-medium">
                          📍 {selectedReel.location}
                        </span>
                      )}
                    </div>
                    {selectedReel.title && (
                      <h3 className="text-base font-bold text-white leading-snug">
                        {selectedReel.title}
                      </h3>
                    )}
                  </div>
                )}

                {/* Direct WhatsApp Service Booking CTA */}
                <a
                  href={`https://wa.me/${targetWhatsapp}?text=${encodeURIComponent(
                    selectedReel.title
                      ? `Hello JUBU Cleaning Service, I saw your reel "${selectedReel.title}" (${selectedReel.serviceTitle || "Cleaning Service"} in ${selectedReel.location || "Dubai"}). I would like to book this service!`
                      : `Hello JUBU Cleaning Service, I saw your video reel on your website and I would like to book a cleaning service!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick("reel_modal")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green hover:bg-brand-green-hover py-3 text-sm font-bold text-white shadow-lg transition-transform active:scale-98"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-white" />
                  Book This Service on WhatsApp
                </a>
              </div>
            </div>

            {/* Modal Navigation Arrows for Carousel */}
            {activeReels.length > 1 && (
              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={handlePrev}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 active:scale-90"
                  aria-label="Previous reel"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-xs font-semibold text-white/80">
                  Swipe or use &larr; &rarr; keys
                </span>
                <button
                  onClick={handleNext}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 active:scale-90"
                  aria-label="Next reel"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
