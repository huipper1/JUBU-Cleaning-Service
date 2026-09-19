import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  description,
  align = "center",
  className
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "mb-10 flex flex-col sm:mb-12",
        isCenter ? "mx-auto max-w-2xl items-center text-center" : "max-w-xl items-start text-left",
        className
      )}
    >
      {badge && (
        <span className="mb-2.5 text-xs font-bold tracking-wider text-brand-green uppercase sm:text-sm">
          {badge}
        </span>
      )}
      <h2 className="mb-3 text-2xl leading-tight font-extrabold tracking-tight text-brand-navy sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-sm leading-relaxed font-normal text-brand-muted sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
