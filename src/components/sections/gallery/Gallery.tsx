"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { ArrowLeftRight, ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";

import { SectionHeading } from "@/ui";
import type { GalleryItem } from "@/types/content";

interface GalleryProps {
  items: GalleryItem[];
}

export function Gallery({ items }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");

  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null;

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setActiveTab("after");
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
    setActiveTab("after");
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
    setActiveTab("after");
  };

  // Keyboard navigation & accessibility
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      }
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
        setActiveTab("after");
      }
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
        setActiveTab("after");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock background scrolling when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedIndex, items.length]);

  return (
    <section
      id="gallery"
      className="border-b border-brand-border/60 bg-white py-16 sm:py-20 lg:py-24"
      aria-label="Projects and Gallery"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and View All Link */}
        <SectionHeading
          badge="OUR PROJECTS"
          title="Our Cleaning Services"
          align="left"
          action={
            <Link
              href="#gallery"
              className="group inline-flex items-center gap-3 rounded-full bg-[#00a651] py-2.5 pr-2.5 pl-6 text-xs font-bold text-white shadow-md transition-all duration-200 hover:bg-[#008f45] active:scale-98 sm:text-sm"
            >
              <span>View All Projects</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0a1e3b] text-white transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          }
        />

        {/* 8 Items Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openLightbox(index);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View ${item.title} project details in lightbox`}
              className="group relative transform cursor-pointer overflow-hidden rounded-2xl border border-brand-border bg-brand-pale-blue shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <figure className="relative m-0 aspect-[4/3] w-full">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <figcaption className="sr-only">{item.title}</figcaption>

                {/* Dark gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark/70 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

                {/* Title badge in bottom-left */}
                <div className="absolute bottom-3.5 left-3.5 z-10">
                  <span className="inline-flex items-center rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-brand-navy shadow-sm backdrop-blur-xs transition-colors group-hover:text-brand-blue">
                    {item.title}
                  </span>
                </div>

                {/* Before & After Indicators if applicable */}
                {item.isBeforeAfter && (
                  <>
                    <div className="absolute top-3 left-3 z-10">
                      <span className="rounded-md bg-amber-500/90 px-2 py-1 text-[10px] font-bold text-white shadow-xs">
                        Before
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                      <span className="rounded-md bg-brand-green/90 px-2 py-1 text-[10px] font-bold text-white shadow-xs">
                        After
                      </span>
                    </div>
                    <div className="absolute top-1/2 left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-blue shadow-md transition-transform group-hover:scale-110">
                      <ArrowLeftRight className="h-4 w-4" />
                    </div>
                  </>
                )}
              </figure>
            </div>
          ))}
        </div>
      </div>

      {/* Accessible Lightbox Modal */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.title}
          className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-brand-navy-dark/85 p-4 backdrop-blur-md duration-200 fade-in sm:p-6"
          onClick={closeLightbox}
        >
          <div
            className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-brand-border bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-brand-border bg-brand-pale-blue/40 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-wider text-brand-green uppercase">
                  {selectedItem.serviceName ?? "JUBU Project"}
                </span>
                <span className="text-brand-border">•</span>
                <h3 className="text-base font-bold text-brand-navy sm:text-lg">
                  {selectedItem.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeLightbox}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-navy shadow-xs transition-colors hover:bg-brand-pale-blue focus-visible:outline-2 focus-visible:outline-brand-blue"
                aria-label="Close lightbox modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="relative aspect-[16/10] w-full bg-brand-navy-dark/5 sm:aspect-[16/9]">
              {selectedItem.isBeforeAfter && selectedItem.beforeImage && selectedItem.afterImage ? (
                <Image
                  src={
                    activeTab === "before"
                      ? selectedItem.beforeImage.src
                      : selectedItem.afterImage.src
                  }
                  alt={
                    activeTab === "before"
                      ? selectedItem.beforeImage.alt
                      : selectedItem.afterImage.alt
                  }
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              ) : (
                <Image
                  src={selectedItem.image.src}
                  alt={selectedItem.image.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              )}

              {/* Prev / Next Buttons */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-md transition-transform hover:bg-white active:scale-90 sm:left-4"
                aria-label="Previous project image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-md transition-transform hover:bg-white active:scale-90 sm:right-4"
                aria-label="Next project image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Footer with Before/After toggle & Caption */}
            <div className="flex flex-col items-start justify-between gap-4 border-t border-brand-border bg-white p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                {selectedItem.caption && (
                  <p className="max-w-xl text-xs text-brand-muted sm:text-sm">
                    {selectedItem.caption}
                  </p>
                )}
              </div>

              {selectedItem.isBeforeAfter && (
                <div className="inline-flex shrink-0 rounded-xl border border-brand-border/60 bg-brand-pale-blue p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("before")}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${activeTab === "before"
                      ? "bg-amber-500 text-white shadow-xs"
                      : "text-brand-navy hover:text-brand-blue"
                      }`}
                  >
                    Before
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("after")}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${activeTab === "after"
                      ? "bg-brand-green text-white shadow-xs"
                      : "text-brand-navy hover:text-brand-blue"
                      }`}
                  >
                    After
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
