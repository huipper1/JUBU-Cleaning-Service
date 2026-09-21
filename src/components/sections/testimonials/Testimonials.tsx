"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TestimonialItem } from "@/types/testimonial";

interface TestimonialsProps {
  testimonials: TestimonialItem[];
}

// Preset spread positions for the 8 avatar nodes distributed along the sinuous wave path
// Avatars are generously sized and widely spread across the full width and curvature
const AVATAR_POSITIONS = [
  { left: "8%", top: "45%", size: "w-16 h-16 md:w-20 md:h-20" },
  { left: "16%", top: "20%", size: "w-18 h-18 md:w-22 md:h-22" },
  { left: "24%", top: "62%", size: "w-16 h-16 md:w-20 md:h-20" },
  { left: "30%", top: "33%", size: "w-18 h-18 md:w-22 md:h-22" },
  { left: "45%", top: "18%", size: "w-16 h-16 md:w-20 md:h-20" },
  { left: "62%", top: "22%", size: "w-18 h-18 md:w-22 md:h-22" },
  { left: "74%", top: "38%", size: "w-22 h-22 md:w-28 md:h-28" }, // Main focal anchor (matches mockup)
  { left: "90%", top: "40%", size: "w-18 h-18 md:w-22 md:h-22" }
];

export function Testimonials({ testimonials }: TestimonialsProps) {
  // Default to index 6 (Carol Schmitz focal anchor in mockup)
  const [selectedIndex, setSelectedIndex] = useState(6);
  const activeTestimonial = testimonials[selectedIndex] ?? testimonials[0];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-white py-20 sm:py-28 lg:py-32"
      aria-label="Customer Testimonials"
    >
      {/* Background Soft Ambient Light in Brand Tones */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-brand-green-light/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[420px] w-[420px] rounded-full bg-brand-sky-light/50 blur-3xl" />

      {/* SVG Sinuous Wavy Ribbon Pathway matching theme */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <svg
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full object-cover"
          preserveAspectRatio="none"
        >
          {/* Outer soft wave path in brand mint */}
          <path
            d="M-50 200 C 200 200, 200 520, 520 520 C 840 520, 880 200, 1180 200 C 1350 200, 1460 400, 1530 440"
            stroke="#e6f7ed"
            strokeWidth="56"
            strokeLinecap="round"
            className="opacity-80"
          />
          {/* Inner wave path in brand green subtle tone */}
          <path
            d="M-50 200 C 200 200, 200 520, 520 520 C 840 520, 880 200, 1180 200 C 1350 200, 1460 400, 1530 440"
            stroke="#bbf7d0"
            strokeWidth="18"
            strokeLinecap="round"
            className="opacity-70"
          />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">

        {/* Desktop & Tablet Curved Layout */}
        <div className="relative mx-auto hidden min-h-[640px] w-full max-w-7xl sm:block lg:min-h-[720px]">

          {/* Center Heading matching Brand Navy theme */}
          <div className="absolute top-[38%] left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 max-w-lg text-center">
            <h2 className="mb-3 text-3xl font-black tracking-tight text-brand-navy sm:text-4xl lg:text-[2.85rem]">
              Testimonials
            </h2>
            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm lg:text-base">
              Our reputation speaks for itself through the countless glowing reviews from satisfied customers across Dubai. Find out what people are saying about us!
            </p>
          </div>

          {/* Spread Customer Avatar Nodes */}
          {testimonials.slice(0, 8).map((item, idx) => {
            const isSelected = selectedIndex === idx;
            const pos = AVATAR_POSITIONS[idx] || AVATAR_POSITIONS[0];
            const initials = item.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                style={{ left: pos.left, top: pos.top }}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 focus:outline-none ${
                  isSelected ? "z-30 scale-110" : "z-20 hover:scale-105"
                }`}
                aria-label={`View review from ${item.name}`}
              >
                {/* Concentric aura pulse rings for the selected avatar */}
                {isSelected && (
                  <div className="pointer-events-none absolute -inset-4 animate-pulse rounded-full bg-brand-green/20 sm:-inset-6">
                    <div className="absolute -inset-3 rounded-full bg-brand-green/15 sm:-inset-5" />
                  </div>
                )}

                {/* shadcn Avatar Component */}
                <Avatar
                  className={`${pos.size} border-3 bg-white shadow-xl transition-all duration-300 ${
                    isSelected
                      ? "border-brand-green ring-4 ring-brand-green/30 shadow-2xl"
                      : "border-white hover:border-brand-green/60 hover:shadow-lg"
                  }`}
                >
                  <AvatarImage
                    src={item.avatar}
                    alt={item.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-brand-pale-blue text-xs font-bold text-brand-navy md:text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            );
          })}

          {/* Floating Review Bubble anchored under the active avatar */}
          <div
            className="absolute z-30 transition-all duration-500 ease-out"
            style={{
              left: AVATAR_POSITIONS[selectedIndex]?.left ?? "74%",
              top: AVATAR_POSITIONS[selectedIndex]?.top ?? "38%",
              transform: "translate(-20%, 45px)"
            }}
          >
            <div className="relative w-80 rounded-3xl bg-[#07241c] p-6 text-white shadow-2xl transition-all sm:w-96 lg:w-[410px]">

              {/* Pointer triangle connecting avatar to speech bubble */}
              <div className="absolute -top-3 left-10 h-0 w-0 border-x-8 border-x-transparent border-b-12 border-b-[#07241c]" />

              {/* Google Review Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                {activeTestimonial.location && (
                  <span className="text-[11px] font-medium text-emerald-300">
                    {activeTestimonial.location}
                  </span>
                )}
              </div>

              {/* Review Text */}
              <p className="mb-4 text-xs italic leading-relaxed text-slate-100 sm:text-sm">
                &ldquo;{activeTestimonial.review}&rdquo;
              </p>

              {/* Author and Rating */}
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    {activeTestimonial.name}
                  </h4>
                  {activeTestimonial.service && (
                    <span className="text-[11px] text-emerald-400">
                      {activeTestimonial.service}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white">5.0</span>
                </div>
              </div>

              {/* Background decorative quotation mark */}
              <span className="pointer-events-none absolute right-5 bottom-4 select-none font-serif text-5xl font-black text-white/10">
                ”
              </span>
            </div>
          </div>

        </div>

        {/* Mobile View: Dedicated clean vertical layout */}
        <div className="flex flex-col items-center text-center sm:hidden">
          <h2 className="mb-2 text-2xl font-black text-brand-navy">
            Testimonials
          </h2>
          <p className="mb-6 text-xs leading-relaxed text-slate-600">
            Our reputation speaks for itself through countless glowing reviews from satisfied customers across Dubai.
          </p>

          {/* Avatar Selector Strip on Mobile using shadcn Avatar */}
          <div className="mb-6 flex w-full items-center justify-center gap-3 overflow-x-auto py-2">
            {testimonials.slice(0, 6).map((item, idx) => {
              const isSelected = selectedIndex === idx;
              const initials = item.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className="shrink-0 focus:outline-none"
                  aria-label={`View review from ${item.name}`}
                >
                  <Avatar
                    className={`size-14 border-2 transition-all ${
                      isSelected
                        ? "border-brand-green ring-3 ring-brand-green/40 scale-105 shadow-md"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <AvatarImage src={item.avatar} alt={item.name} />
                    <AvatarFallback className="text-xs font-bold text-brand-navy">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              );
            })}
          </div>

          {/* Active Review Card on Mobile */}
          <div className="w-full rounded-2xl bg-[#07241c] p-5 text-left text-white shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-xs">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-emerald-300">
                {activeTestimonial.location}
              </span>
            </div>

            <p className="mb-4 text-xs italic leading-relaxed text-slate-100">
              &ldquo;{activeTestimonial.review}&rdquo;
            </p>

            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <div>
                <h4 className="text-xs font-bold text-white">
                  {activeTestimonial.name}
                </h4>
                <span className="text-[10px] text-emerald-400">
                  {activeTestimonial.service}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-3 w-3 fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="text-xs font-bold text-white">5.0</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
