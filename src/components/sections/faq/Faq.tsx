"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

import type { FaqItem } from "@/types/content";
import { SectionHeading } from "@/ui";

interface FaqProps {
  faqs: FaqItem[];
  areaName?: string;
  badge?: string;
  title?: string;
  description?: string;
}

export function Faq({
  faqs,
  areaName,
  badge = "FREQUENTLY ASKED QUESTIONS",
  title,
  description
}: FaqProps) {
  // First item open by default
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  const toggleIndex = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const sectionTitle =
    title ||
    (areaName
      ? `Frequently Asked Questions in ${areaName}`
      : "Frequently Asked Questions");

  const sectionDescription =
    description ||
    (areaName
      ? `Everything you need to know about our professional cleaning services in ${areaName}.`
      : "Clear, transparent answers about JUBU Cleaning Service, our booking process, and pricing.");

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#f9fcfe] py-16 sm:py-20 lg:py-24"
      aria-label="Frequently Asked Questions"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={badge}
          title={sectionTitle}
          description={sectionDescription}
          align="center"
          className="mb-12 max-w-2xl mx-auto text-center"
        />

        <div className="mx-auto max-w-3xl space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndexes.includes(index);
            const questionId = `faq-q-${index}`;
            const answerId = `faq-a-${index}`;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-200 hover:border-sky-300"
              >
                <button
                  type="button"
                  id={questionId}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => toggleIndex(index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left transition-colors sm:p-6"
                >
                  <div className="flex items-center gap-3 sm:gap-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-100/70 text-[#0070ba]">
                      <HelpCircle className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-bold text-[#0a1e3b] sm:text-base">
                      {faq.question}
                    </span>
                  </div>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 transition-all duration-200 ${
                      isOpen
                        ? "rotate-180 bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                        : "text-[#0a1e3b] hover:bg-slate-200"
                    }`}
                    aria-hidden="true"
                  >
                    <ChevronDown className="h-4 w-4 stroke-[2.5]" />
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    className="border-t border-slate-100 px-5 pt-3 pb-5 sm:px-6 sm:pb-6"
                  >
                    <p className="text-xs leading-relaxed text-[#4a5f78] sm:text-sm pl-11">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
