/**
 * Helper to normalize and resolve public image URLs from database values,
 * Supabase Storage buckets, local /images/ paths, and remote URLs.
 */
export function getPublicImageUrl(
  pathOrUrl: string | null | undefined,
  fallback = "/images/logo.png"
): string {
  if (!pathOrUrl || typeof pathOrUrl !== "string") {
    return fallback;
  }

  const trimmed = pathOrUrl.trim();
  if (trimmed.length === 0) {
    return fallback;
  }

  // Absolute http/https URLs (including Supabase Storage full public URLs, Unsplash, etc.)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Relative public asset paths (e.g. /images/...)
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  // Supabase storage relative object path (e.g. "branding/logo.webp" or "cms-media/branding/...")
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (supabaseUrl) {
    // If bucket prefix is missing, default to cms-media bucket
    const cleanPath = trimmed.startsWith("cms-media/") ? trimmed : `cms-media/${trimmed}`;
    return `${supabaseUrl}/storage/v1/object/public/${cleanPath}`;
  }

  return `/${trimmed}`;
}
