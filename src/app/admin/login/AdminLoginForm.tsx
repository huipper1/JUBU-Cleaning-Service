"use client";

import { useState, useActionState } from "react";
import { Lock, Mail, ShieldAlert, Loader2, Eye, EyeOff } from "lucide-react";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AdminLoginFormProps {
  branding: {
    logoSrc: string;
    logoAlt: string;
    businessName: string;
  };
}

export function AdminLoginForm({ branding }: AdminLoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 selection:bg-emerald-500 selection:text-white">
      <div className="w-full max-w-md">
        <Card className="border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-3 flex h-16 w-36 items-center justify-center ">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={branding.logoSrc}
                alt={branding.logoAlt}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              {branding.businessName}
            </CardTitle>
            <CardDescription className="text-sm text-slate-400">
              Sign in with your administrator credentials to manage website content and leads.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {state?.error && (
              <div
                className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
                role="alert"
              >
                <ShieldAlert className="mt-0.5 size-5 shrink-0 text-red-400" />
                <span>{state.error}</span>
              </div>
            )}

            <form action={formAction} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="admin@jubucleaning.ae"
                    className="pl-10 bg-slate-950/60 border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••••••"
                    className="pl-10 pr-10 bg-slate-950/60 border-slate-800 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="mt-2 w-full"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In to Dashboard</span>
                )}
              </Button>
            </form>

            <div className="mt-8 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-500">
              {branding.businessName} &bull; Admin Console
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
