import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { WhatsAppWidget } from "@/components/public/WhatsAppWidget";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="top" className="min-h-screen bg-cream">
      <Nav />
      <main className="pt-16 md:pt-20">{children}</main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
