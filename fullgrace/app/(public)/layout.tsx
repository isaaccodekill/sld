import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { WhatsAppWidget } from "@/components/public/WhatsAppWidget";
import { AmbientBlocks } from "@/components/public/AmbientBlocks";
import {
  BUSINESS_EMAIL,
  BUSINESS_NAME,
  BUSINESS_PHONE,
  SITE_URL,
  SOCIALS,
} from "@/lib/constants";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#business`,
      name: BUSINESS_NAME,
      alternateName: "Fullgrace Therapy & Learning",
      url: SITE_URL,
      email: BUSINESS_EMAIL,
      telephone: BUSINESS_PHONE,
      image: `${SITE_URL}/owner-image.jpg`,
      founder: { "@type": "Person", name: "Awele Bello", jobTitle: "Founder and Lead Therapist" },
      areaServed: { "@type": "City", name: "Lagos", containedInPlace: { "@type": "Country", name: "Nigeria" } },
      serviceType: [
        "Child speech and language therapy",
        "Behavioural support",
        "Self-help skills support",
        "Special needs learning support",
        "Home-visit consultation",
      ],
      sameAs: [SOCIALS.instagram],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Fullgrace Therapy & Learning",
      inLanguage: "en-NG",
      publisher: { "@id": `${SITE_URL}/#business` },
    },
  ],
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="top" className="relative isolate min-h-screen overflow-hidden bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <AmbientBlocks />
      <main id="main-content" className="relative z-10 pt-16 md:pt-20">{children}</main>
      <div className="relative z-10"><Footer /></div>
      <WhatsAppWidget />
    </div>
  );
}
