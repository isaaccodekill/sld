// Placeholder values — REPLACE BEFORE LAUNCH.

export const WHATSAPP_NUMBER = "+2348000000000"; // TODO: replace with real WhatsApp Business number
export const WHATSAPP_DISPLAY = "+234 800 000 0000";

export const BUSINESS_NAME = "Fullgrace Educational Consult and Therapy";
export const BUSINESS_SHORT = "Fullgrace";
export const BUSINESS_EMAIL = "hello@fullgrace.ng";
export const BUSINESS_PHONE = "+234 800 000 0000";
export const BUSINESS_ADDRESS_LINE_1 = "14 Glover Road, Ikoyi";
export const BUSINESS_ADDRESS_LINE_2 = "Lagos, Nigeria";
export const BUSINESS_HOURS = "Mon–Sat · 9am–5pm WAT";

export const SOCIALS = {
  instagram: "https://instagram.com/fullgrace.ng",
};

export function waLink(message: string): string {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
