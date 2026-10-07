import type {
  AnalyticsEvent,
  ContactPhoneEventData,
  ContactWhatsAppEventData,
  FaqExpandEventData,
  FormStartEventData,
  GenerateLeadEventData,
  ItemData,
  SelectItemEventData,
  SelectLocationEventData,
  TrafficSourceData,
  ViewGalleryItemEventData
} from "@/types/analytics";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/**
 * Clean and format a phone number for Google Ads Enhanced Conversions
 * Google requires E.164 format with country code and '+' prefix (e.g. +971501234567)
 */
export function formatPhoneForGoogle(rawPhone: string): string {
  if (!rawPhone) return "";
  const cleaned = rawPhone.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  // If number starts with 00 (common international dialling prefix)
  if (cleaned.startsWith("00")) {
    return `+${cleaned.slice(2)}`;
  }

  // If local UAE number starting with 05
  if (cleaned.startsWith("05")) {
    return `+971${cleaned.slice(1)}`;
  }

  // If local UAE number starting with 5 (without leading 0)
  if (/^5[024568]\d{7}$/.test(cleaned)) {
    return `+971${cleaned}`;
  }

  // If starts with 971 without '+'
  if (cleaned.startsWith("971")) {
    return `+${cleaned}`;
  }

  // Default fallback prepending + if digits only
  return `+${cleaned}`;
}

/**
 * Clean and format a phone number for Meta (Facebook) Advanced Matching
 * Meta requires digits only with country code, NO leading '+' and NO whitespace (e.g. 971501234567)
 */
export function formatPhoneForMeta(rawPhone: string): string {
  if (!rawPhone) return "";
  const digitsOnly = rawPhone.replace(/\D/g, "");

  // If local UAE number starting with 05
  if (digitsOnly.startsWith("05")) {
    return `971${digitsOnly.slice(1)}`;
  }

  // If local UAE number starting with 5 (without leading 0)
  if (/^5[024568]\d{7}$/.test(digitsOnly)) {
    return `971${digitsOnly}`;
  }

  // If already starts with 971
  if (digitsOnly.startsWith("971")) {
    return digitsOnly;
  }

  return digitsOnly;
}

/**
 * Split full name into first and last name normalized for matching
 */
export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  if (!fullName) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";
  return {
    firstName: firstName.trim(),
    lastName: lastName.trim()
  };
}

/**
 * Extract browser cookie by name safely
 */
export function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1")}=([^;]*)`));
  return match ? decodeURIComponent(match[1] || "") : "";
}

/**
 * Extract Facebook click ID (fbclid) or fbc cookie
 */
export function getFacebookClickId(): string {
  if (typeof window === "undefined") return "";
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get("fbclid");
  if (fbclid) {
    const creationTime = Date.now();
    return `fb.1.${creationTime}.${fbclid}`;
  }
  return getCookie("_fbc");
}

/**
 * Core safe window.dataLayer push wrapper
 */
export function pushDataLayer(data: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data as Record<string, unknown>);
  } catch (error) {
    // Fail silently in production without crashing user interactions
    if (process.env.NODE_ENV === "development") {
      console.warn("[DataLayer Push Error]:", error);
    }
  }
}

/**
 * Track Primary Conversion: Quote Form Submission (Lead Generated)
 */
export function trackLeadGenerated(payload: {
  serviceId: string;
  serviceName: string;
  propertyType: string;
  locationArea: string;
  preferredDate?: string;
  preferredTime?: string;
  fullName: string;
  mobile: string;
  whatsappNumber?: string;
  sourceArea?: string;
  trafficSource?: TrafficSourceData;
}): void {
  const { firstName, lastName } = splitFullName(payload.fullName);
  const googlePhone = formatPhoneForGoogle(payload.mobile);
  const metaPhone = formatPhoneForMeta(payload.mobile);

  const fbp = getCookie("_fbp");
  const fbc = getFacebookClickId();

  const eventPayload: GenerateLeadEventData = {
    event: "generate_lead",
    event_category: "Conversion",
    lead_type: "quote_form",
    full_name: payload.fullName,
    mobile_number: googlePhone || payload.mobile,
    whatsapp_number: payload.whatsappNumber ? formatPhoneForGoogle(payload.whatsappNumber) : "",
    service_id: payload.serviceId,
    service_name: payload.serviceName,
    property_type: payload.propertyType,
    location_area: payload.locationArea,
    preferred_date: payload.preferredDate || "N/A",
    preferred_time: payload.preferredTime || "N/A",
    source_area: payload.sourceArea || "main-page",
    currency: "AED",
    traffic_source: payload.trafficSource,

    // Google Ads Enhanced Conversions (User-Provided Data Variable in GTM)
    userData: {
      email: "",
      phone_number: googlePhone,
      address: {
        first_name: firstName,
        last_name: lastName,
        city: "Dubai",
        region: "Dubai",
        country: "AE"
      }
    },

    // Meta (Facebook) Advanced Matching & CAPI Parameters
    user_data: {
      fn: firstName.toLowerCase(),
      ln: lastName.toLowerCase(),
      ph: metaPhone,
      ct: "dubai",
      st: "dubai",
      country: "ae",
      ...(fbp ? { fbp } : {}),
      ...(fbc ? { fbc } : {})
    }
  };

  pushDataLayer(eventPayload);
}

/**
 * Track Primary Conversion: WhatsApp Contact Click
 */
export function trackWhatsAppClick(buttonLocation: string, areaContext?: string, targetPhone?: string): void {
  const fbp = getCookie("_fbp");
  const fbc = getFacebookClickId();

  const eventPayload: ContactWhatsAppEventData = {
    event: "contact_whatsapp",
    event_category: "Conversion",
    button_location: buttonLocation,
    page_path: typeof window !== "undefined" ? window.location.pathname : "/",
    ...(areaContext ? { area_context: areaContext } : {}),
    ...(targetPhone ? { target_phone: targetPhone } : {}),
    user_data: {
      ...(fbp ? { fbp } : {}),
      ...(fbc ? { fbc } : {})
    }
  };

  pushDataLayer(eventPayload);
}

/**
 * Track Primary Conversion: Direct Phone Call Click
 */
export function trackPhoneClick(buttonLocation: string, phoneNumber: string): void {
  const eventPayload: ContactPhoneEventData = {
    event: "contact_phone",
    event_category: "Conversion",
    button_location: buttonLocation,
    phone_number: phoneNumber,
    page_path: typeof window !== "undefined" ? window.location.pathname : "/"
  };

  pushDataLayer(eventPayload);
}

/**
 * Track Funnel Step: Form Start (user starts filling form)
 */
export function trackFormStart(sourceArea?: string): void {
  const eventPayload: FormStartEventData = {
    event: "form_start",
    event_category: "Engagement",
    form_id: "quote_form",
    form_name: "Instant Cleaning Quote Form",
    source_area: sourceArea || "main-page"
  };

  pushDataLayer(eventPayload);
}

/**
 * Track Micro-Conversion: Service Card Selection
 */
export function trackServiceSelect(service: ItemData): void {
  // In GA4 e-commerce, it is best practice to clear previous ecommerce object
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
  }

  const eventPayload: SelectItemEventData = {
    event: "select_item",
    item_list_name: "Cleaning Services Grid",
    items: [service]
  };

  pushDataLayer(eventPayload);
}

/**
 * Track Location Selection: Service Area Clicked
 */
export function trackLocationSelect(areaId: string, areaName: string, zoneGroup?: string): void {
  const eventPayload: SelectLocationEventData = {
    event: "select_location",
    area_id: areaId,
    area_name: areaName,
    ...(zoneGroup ? { zone_group: zoneGroup } : {})
  };

  pushDataLayer(eventPayload);
}

/**
 * Track Gallery Interaction: Before/After Lightbox
 */
export function trackGalleryView(itemId: string, itemTitle: string, activeView: "before" | "after" = "after"): void {
  const eventPayload: ViewGalleryItemEventData = {
    event: "view_item_details",
    gallery_item_id: itemId,
    gallery_item_title: itemTitle,
    active_view: activeView
  };

  pushDataLayer(eventPayload);
}

/**
 * Track Primary Conversion: Direct Phone Call Click
 */
export function trackEmailClick(buttonLocation: string, emailAddress: string): void {
  const eventPayload = {
    event: "contact_email",
    event_category: "Conversion",
    button_location: buttonLocation,
    email_address: emailAddress,
    page_path: typeof window !== "undefined" ? window.location.pathname : "/"
  };

  pushDataLayer(eventPayload);
}

/**
 * Track Primary Conversion: Instant Booking Confirmed (Service Booking Submission)
 * Google Ads Conversion + GA4 generate_lead / booking_confirmed + Enhanced Conversions & Meta Matching
 */
export function trackBookingConfirmed(payload: {
  serviceId: string;
  serviceName: string;
  locationArea: string;
  propertyType?: string;
  preferredDate?: string;
  preferredTime?: string;
  fullName: string;
  mobile: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  sourceArea?: string;
  trafficSource?: TrafficSourceData;
}): void {
  const { firstName, lastName } = splitFullName(payload.fullName);
  const googlePhone = formatPhoneForGoogle(payload.mobile);
  const metaPhone = formatPhoneForMeta(payload.mobile);

  const fbp = getCookie("_fbp");
  const fbc = getFacebookClickId();

  const eventPayload = {
    event: "booking_confirmed",
    event_category: "Conversion",
    lead_type: "instant_booking",
    service_id: payload.serviceId,
    service_name: payload.serviceName,
    property_type: payload.propertyType || "N/A",
    location_area: payload.locationArea,
    preferred_date: payload.preferredDate || "N/A",
    preferred_time: payload.preferredTime || "N/A",
    source_area: payload.sourceArea || "booking-modal",
    payment_method: payload.paymentMethod || "cash",
    currency: payload.currency || "AED",
    value: payload.amount || 0,
    traffic_source: payload.trafficSource,

    // Google Ads Enhanced Conversions
    userData: {
      email: "",
      phone_number: googlePhone,
      address: {
        first_name: firstName,
        last_name: lastName,
        city: "Dubai",
        region: "Dubai",
        country: "AE"
      }
    },

    // Meta Advanced Matching
    user_data: {
      fn: firstName.toLowerCase(),
      ln: lastName.toLowerCase(),
      ph: metaPhone,
      ct: "dubai",
      st: "dubai",
      country: "ae",
      ...(fbp ? { fbp } : {}),
      ...(fbc ? { fbc } : {})
    }
  };

  pushDataLayer(eventPayload);
}

/**
 * Track General CTA Button Clicks
 */
export function trackCtaClick(ctaName: string, buttonLocation: string, additionalContext?: Record<string, unknown>): void {
  const eventPayload = {
    event: "cta_click",
    event_category: "Engagement",
    cta_name: ctaName,
    button_location: buttonLocation,
    page_path: typeof window !== "undefined" ? window.location.pathname : "/",
    ...(additionalContext || {})
  };

  pushDataLayer(eventPayload);
}

/**
 * Track FAQ Accordion Expand
 */
export function trackFaqExpand(question: string, index: number): void {
  const eventPayload: FaqExpandEventData = {
    event: "faq_expand",
    faq_question: question,
    faq_index: index
  };

  pushDataLayer(eventPayload);
}

