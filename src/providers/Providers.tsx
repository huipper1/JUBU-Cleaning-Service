"use client";

import type { ReactNode } from "react";

import { CounterProvider, QueryProvider, ThemeProvider } from "@/providers";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <CounterProvider>
        <QueryProvider>{children}</QueryProvider>
      </CounterProvider>
    </ThemeProvider>
  );
}
