import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  action?: ReactNode;
}

export function SectionHeading({
  badge,
  title,
  description,
  align = "center",
  className,
  action
}: SectionHeadingProps) {
  const isCenter = align === "center";

  // If there is an action (like "View All Projects"), render a split header on md+ screens
  if (action && !isCenter) {
    return (
      <div
        className={cn(
          "mb-10 flex flex-col justify-between gap-4 sm:mb-12 md:flex-row md:items-end",
          className
        )}
      >
        <div className="flex max-w-2xl flex-col items-start text-left">
          {badge && (
            <span className="mb-2.5 text-xs font-bold tracking-wider text-brand-green uppercase sm:text-sm">
              {badge}
            </span>
          )}
          <h2 className="text-2xl leading-tight font-extrabold tracking-tight text-brand-navy sm:text-3xl lg:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-3 text-sm leading-relaxed font-normal text-brand-muted sm:text-base">
              {description}
            </p>
          )}
        </div>
        <div className="shrink-0">{action}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mb-10 flex flex-col sm:mb-12",
        isCenter
          ? "mx-auto max-w-2xl items-center text-center"
          : "max-w-xl items-start text-left",
        className
      )}
    >
      {badge && (
        <span className="mb-2.5 text-xs font-bold tracking-wider text-brand-green uppercase sm:text-sm">
          {badge}
        </span>
      )}
      <h2 className="text-2xl leading-tight font-extrabold tracking-tight text-brand-navy sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-relaxed font-normal text-brand-muted sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
