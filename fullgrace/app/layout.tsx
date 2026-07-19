import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz"],
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Fullgrace Therapy & Learning | Child Speech Therapy in Lagos",
    template: "%s | Fullgrace Therapy & Learning",
  },
  description:
    "Home-based therapy and learning support in Lagos, helping children find their voice, build self-help skills, and move through difficulty with care.",
  applicationName: "Fullgrace Therapy & Learning",
  keywords: [
    "child speech therapy Lagos",
    "home visit speech therapist Lagos",
    "autism therapy Lagos",
    "behavioural therapy for children Lagos",
    "special needs education Lagos",
    "Montessori therapy Lagos",
    "speech and language support Nigeria",
  ],
  authors: [{ name: "Awele Bello" }],
  creator: "Awele Bello",
  publisher: "Fullgrace Educational Consult and Therapy",
  category: "Child therapy and special education",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: "Fullgrace Therapy & Learning",
    title: "Fullgrace Therapy & Learning | Child Speech Therapy in Lagos",
    description: "Child-led speech, behavioural and self-help support delivered through home visits across Lagos.",
  },
  twitter: {
    card: "summary",
    title: "Fullgrace Therapy & Learning",
    description: "Home-based speech, behavioural and learning support for children in Lagos.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-cream text-ink">{children}</body>
    </html>
  );
}
