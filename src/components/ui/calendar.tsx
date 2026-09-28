"use client";

import * as React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";
import { DayPicker, type DayPickerProps } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = DayPickerProps;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "relative flex flex-col gap-3",
        month_caption: "flex justify-center items-center h-8 w-full",
        caption_label: "text-sm font-semibold text-white",
        nav: "flex items-center justify-between absolute inset-x-1 top-0.5 h-8 pointer-events-none z-10",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "pointer-events-auto h-7 w-7 border-white/10 bg-white/5 p-0 text-white hover:bg-white/15 hover:text-white"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "pointer-events-auto h-7 w-7 border-white/10 bg-white/5 p-0 text-white hover:bg-white/15 hover:text-white"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex w-full justify-between",
        weekday: "text-slate-400 w-9 font-medium text-[0.8rem] text-center",
        weeks: "flex flex-col gap-1 mt-2",
        week: "flex w-full justify-between",
        day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 rounded-lg p-0 font-normal text-slate-200 transition-colors hover:bg-white/15 hover:text-white aria-selected:opacity-100"
        ),
        selected:
          "bg-brand-sky text-[#041633] font-bold hover:bg-brand-sky hover:text-[#041633] focus:bg-brand-sky focus:text-[#041633] rounded-lg",
        today: "border border-brand-sky/60 text-brand-sky font-semibold rounded-lg",
        outside:
          "text-slate-600 opacity-40 aria-selected:bg-accent/50 aria-selected:text-slate-500",
        disabled: "text-slate-600 opacity-30 cursor-not-allowed hover:bg-transparent",
        hidden: "invisible",
        ...classNames
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("h-4 w-4", chevronClassName)} />
          ) : (
            <ChevronRight className={cn("h-4 w-4", chevronClassName)} />
          )
      }}
      {...props}
    />
  );
}

export { Calendar };
