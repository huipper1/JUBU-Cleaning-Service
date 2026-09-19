import { NextResponse } from "next/server";

import { createLeadInputSchema } from "@/lib/content/types";
import { leadService } from "@/lib/leads";

// In-memory rate limit store: IP -> array of timestamps
const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitStore.get(ip) ?? [];

  // Filter out timestamps outside the current window
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitStore.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  rateLimitStore.set(ip, validTimestamps);
  return false;
}

export async function POST(request: Request) {
  try {
    // Extract client IP from headers
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // Check rate limiting
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many quote requests. Please wait a moment before trying again or call us directly."
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate payload against shared Zod schema
    const parseResult = createLeadInputSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please correct the highlighted errors in the form.",
          errors: parseResult.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const leadData = parseResult.data;

    // Honeypot spam check
    if (leadData.honeypot && leadData.honeypot.trim().length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Submission rejected as spam."
        },
        { status: 400 }
      );
    }

    // Call LeadService
    const result = await leadService.create(leadData);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error handling lead submission:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please contact us via phone or WhatsApp."
      },
      { status: 500 }
    );
  }
}
