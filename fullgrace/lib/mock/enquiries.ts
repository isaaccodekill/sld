import type { Enquiry } from "./types";

export const enquiries: Enquiry[] = [
  {
    id: "e_001",
    source: "form_quick",
    status: "new",
    receivedAt: "2026-04-21T19:42:00Z",
    payload: {
      parentName: "Uche Nwosu",
      phone: "+2348091112233",
      email: "uche.nwosu@example.com",
      message:
        "Do you work with children who stutter? My nephew is 7 and his mum is asking for a recommendation.",
    },
  },
  {
    id: "e_002",
    source: "form_parent",
    status: "new",
    receivedAt: "2026-04-20T14:05:00Z",
    payload: {
      parentName: "Sola Adebanjo",
      phone: "+2348123344556",
      email: "sola.adebanjo@example.com",
      preferredChannel: "whatsapp",
      city: "Lagos",
      childFirstName: "Demi",
      childAge: 4,
      concern:
        "Demi's crèche teacher mentioned he isn't speaking in full sentences yet. He's our youngest and we want to make sure we're not waiting too long. He says about 40 words and mixes English with Yoruba at home.",
      howTheyFound: "Paediatrician recommended you",
      extra: "We're usually free Tuesday afternoons or Saturday mornings.",
    },
  },
  {
    id: "e_003",
    source: "form_parent",
    status: "archived",
    receivedAt: "2026-01-03T10:15:00Z",
    payload: {
      parentName: "Adaeze Adebayo",
      phone: "+2348121234501",
      email: "adaeze.adebayo@example.com",
      preferredChannel: "whatsapp",
      city: "Lagos",
      childFirstName: "Tola",
      childAge: 5,
      concern:
        "Tola is mostly using single words. Receptively she seems to understand everything. Our GP said to find a speech therapist.",
      howTheyFound: "Google",
    },
    promotedToClientId: "c_tola",
  },
  {
    id: "e_004",
    source: "form_referrer",
    status: "read",
    receivedAt: "2026-04-18T09:28:00Z",
    payload: {
      referrerName: "Dr. Funmi Ajayi",
      organisation: "Reddington Hospital — Paediatrics",
      role: "Consultant Paediatrician",
      email: "f.ajayi@example.com",
      phone: "+2348060006000",
      message:
        "I have a 6-year-old patient newly diagnosed with ASD, level 2 support needs. Parents are motivated but overwhelmed. Can you take an initial consult in the next 2–3 weeks?",
    },
  },
  {
    id: "e_005",
    source: "form_parent",
    status: "read",
    receivedAt: "2026-04-16T16:50:00Z",
    payload: {
      parentName: "Ngozi Obi",
      phone: "+2348087001122",
      email: "ngozi.obi@example.com",
      preferredChannel: "email",
      city: "Lagos",
      childFirstName: "Ebuka",
      childAge: 8,
      concern:
        "Ebuka has Down's Syndrome. We're coming off a move from Abuja and looking for a new therapist. Previous therapist's latest report attached (I'll email it separately).",
      howTheyFound: "Instagram",
      extra: "We need a consistent weekly slot if possible.",
    },
  },
];

export function getEnquiry(id: string): Enquiry | undefined {
  return enquiries.find((e) => e.id === id);
}

export function enquirySourceLabel(s: Enquiry["source"]): string {
  switch (s) {
    case "form_quick":
      return "Quick question";
    case "form_parent":
      return "Parent enquiry";
    case "form_referrer":
      return "Referrer";
    case "widget":
      return "WhatsApp widget";
  }
}
