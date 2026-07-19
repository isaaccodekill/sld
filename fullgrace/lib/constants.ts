export const SITE_URL = "https://fullgracetherapy.com";
export const WHATSAPP_NUMBER = "+2348172931631";
export const WHATSAPP_DISPLAY = "+234 817 293 1631";

export const BUSINESS_NAME = "Fullgrace Educational Consult and Therapy";
export const BUSINESS_SHORT = "Fullgrace";
export const BUSINESS_EMAIL = "awelebello@gmail.com";
export const BUSINESS_PHONE = WHATSAPP_DISPLAY;
export const BUSINESS_ADDRESS_LINE_1 = "Home visits across Lagos";
export const BUSINESS_ADDRESS_LINE_2 = "Sessions take place in the child's familiar environment";
export const BUSINESS_HOURS = "Appointments by arrangement";

export const SOCIALS = {
  instagram: "https://instagram.com/fullgrace.ng",
};

export function waLink(message: string): string {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
