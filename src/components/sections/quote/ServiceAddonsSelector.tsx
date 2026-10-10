"use client";

import React from "react";

import { Minus, Plus, RotateCcw, Sparkles } from "lucide-react";

import type { ServiceAddon } from "@/types/content";

import { JubuIcon } from "@/components/icons";

interface ServiceAddonsSelectorProps {
  addons: ServiceAddon[];
  basePrice: number;
  serviceTitle: string;
  selectedQuantities: Record<string, number>;
  onChangeQuantity: (addonId: string, quantity: number) => void;
  onReset?: () => void;
  compact?: boolean;
}

export function ServiceAddonsSelector({
  addons,
  basePrice,
  serviceTitle,
  selectedQuantities,
  onChangeQuantity,
  onReset,
  compact = false
}: ServiceAddonsSelectorProps) {
  if (!addons || addons.length === 0) {
    return null;
  }

  // Calculate total add-on extras
  const addonTotal = addons.reduce((sum, item) => {
    const qty = selectedQuantities[item.id] ?? 0;
    return sum + qty * item.price;
  }, 0);

  const totalEstimatedPrice = basePrice + addonTotal;

  const totalSelectedItems = addons.reduce((sum, item) => {
    return sum + (selectedQuantities[item.id] ?? 0);
  }, 0);

  return (
    <div className="w-full rounded-2xl border border-white/15 bg-gradient-to-b from-[#08224d]/90 to-[#051736]/95 p-4 text-white shadow-xl backdrop-blur-md transition-all sm:p-5">
      {/* Header Row */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white sm:text-sm">
              Customize Your {serviceTitle}
            </h4>
            <p className="text-[11px] text-slate-300">
              Select rooms, washrooms, or extra items for real-time pricing
            </p>
          </div>
        </div>

        {totalSelectedItems > 0 && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="size-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Grid of Addon Items */}
      <div
        className={`grid gap-2.5 ${
          compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {addons.map((addon) => {
          const qty = selectedQuantities[addon.id] ?? 0;
          const isSelected = qty > 0;
          const min = addon.min ?? 0;
          const max = addon.max ?? 20;

          return (
            <div
              key={addon.id}
              className={`group flex items-center justify-between rounded-xl border p-2.5 transition-all duration-200 ${
                isSelected
                  ? "border-sky-400/50 bg-sky-950/40 shadow-sm shadow-sky-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
              }`}
            >
              {/* Left Item Info */}
              <div className="flex min-w-0 flex-1 items-center gap-2.5 pr-2">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isSelected
                      ? "bg-sky-500 text-white shadow-xs"
                      : "bg-[#0b2857] text-sky-300 group-hover:text-white"
                  }`}
                >
                  <JubuIcon name={addon.icon} className="size-4" />
                </div>
                <div className="flex flex-col truncate">
                  <span className="truncate text-xs font-bold text-slate-100">{addon.name}</span>
                  <span className="text-[11px] font-semibold text-emerald-400">
                    +{addon.price} AED
                    {addon.unitLabel ? (
                      <span className="font-normal text-slate-400"> /{addon.unitLabel}</span>
                    ) : null}
                  </span>
                </div>
              </div>

              {/* Stepper Counter */}
              <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 p-1">
                <button
                  type="button"
                  onClick={() => onChangeQuantity(addon.id, Math.max(min, qty - 1))}
                  disabled={qty <= min}
                  aria-label={`Decrease ${addon.name}`}
                  className="flex size-6 items-center justify-center rounded-md bg-white/5 text-slate-300 transition-colors hover:bg-white/15 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                >
                  <Minus className="size-3" />
                </button>
                <span
                  className={`min-w-5 text-center text-xs font-bold ${
                    isSelected ? "text-sky-300" : "text-slate-400"
                  }`}
                >
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => onChangeQuantity(addon.id, Math.min(max, qty + 1))}
                  disabled={qty >= max}
                  aria-label={`Increase ${addon.name}`}
                  className="flex size-6 items-center justify-center rounded-md bg-white/5 text-slate-300 transition-colors hover:bg-white/15 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                >
                  <Plus className="size-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Price Summary Bar */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3.5 py-2.5">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-slate-300">
            Starting Price: <span className="font-semibold text-white">{basePrice} AED</span>
          </span>
          {addonTotal > 0 && (
            <>
              <span className="text-slate-500">•</span>
              <span className="font-medium text-sky-300">
                Extras ({totalSelectedItems}): +{addonTotal} AED
              </span>
            </>
          )}
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-medium text-slate-300">Estimated Total:</span>
          <span className="text-base font-black text-emerald-400 sm:text-lg">
            {totalEstimatedPrice} AED
          </span>
        </div>
      </div>
    </div>
  );
}
