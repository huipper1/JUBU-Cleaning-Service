export interface GoogleUserData {
  email?: string;
  phone_number?: string;
  address?: {
    first_name?: string;
    last_name?: string;
    city?: string;
    region?: string;
    postal_code?: string;
    country?: string;
  };
}

export interface MetaUserData {
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
  ct?: string;
  st?: string;
  country?: string;
  fbp?: string;
  fbc?: string;
}

export interface TrafficSourceData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
}

export interface ItemData {
  item_id: string;
  item_name: string;
  item_category?: string;
  price?: number;
  quantity?: number;
}

export interface GenerateLeadEventData {
  event: "generate_lead";
  event_category: "Conversion";
  lead_type: string;
  service_id: string;
  service_name: string;
  property_type: string;
  location_area: string;
  preferred_date?: string;
  preferred_time?: string;
  source_area?: string;
  currency?: string;
  value?: number;
  traffic_source?: TrafficSourceData;
  userData?: GoogleUserData;
  user_data?: MetaUserData;
}

export interface ContactWhatsAppEventData {
  event: "contact_whatsapp";
  event_category: "Conversion";
  button_location: string;
  page_path: string;
  area_context?: string;
  target_phone?: string;
  user_data?: MetaUserData;
}

export interface ContactPhoneEventData {
  event: "contact_phone";
  event_category: "Conversion";
  button_location: string;
  phone_number: string;
  page_path: string;
}

export interface FormStartEventData {
  event: "form_start";
  event_category: "Engagement";
  form_id: string;
  form_name: string;
  source_area?: string;
}

export interface SelectItemEventData {
  event: "select_item";
  item_list_name: string;
  items: ItemData[];
}

export interface SelectLocationEventData {
  event: "select_location";
  area_id: string;
  area_name: string;
  zone_group?: string;
}

export interface ViewGalleryItemEventData {
  event: "view_item_details";
  gallery_item_id: string;
  gallery_item_title: string;
  active_view?: "before" | "after";
}

export interface FaqExpandEventData {
  event: "faq_expand";
  faq_question: string;
  faq_index: number;
}

export type AnalyticsEvent =
  | GenerateLeadEventData
  | ContactWhatsAppEventData
  | ContactPhoneEventData
  | FormStartEventData
  | SelectItemEventData
  | SelectLocationEventData
  | ViewGalleryItemEventData
  | FaqExpandEventData
  | Record<string, unknown>;
