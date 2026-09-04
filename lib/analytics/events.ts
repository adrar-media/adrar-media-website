export type AnalyticsEvent =
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "quote_cta_click"
  | "contact_form_submit"
  | "quote_form_submit";

type EventParams = Record<string, string>;

export function trackEvent(name: AnalyticsEvent, params: EventParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

declare global {
  interface Window {
    gtag?: (command: string, event: string, params?: EventParams) => void;
  }
}
