import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { WhatsAppWidget } from "@/components/public/WhatsAppWidget";
import { AmbientBlocks } from "@/components/public/AmbientBlocks";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="top" className="relative isolate min-h-screen overflow-hidden bg-cream">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <AmbientBlocks />
      <main id="main-content" className="relative z-10 pt-16 md:pt-20">{children}</main>
      <div className="relative z-10"><Footer /></div>
      <WhatsAppWidget />
    </div>
  );
}
