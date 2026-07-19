import { Hero } from "@/components/public/Hero";
import { ValuesMarquee } from "@/components/public/ValuesMarquee";
import { Approach } from "@/components/public/Approach";
import { WhoWeHelp } from "@/components/public/WhoWeHelp";
import { Programs } from "@/components/public/Programs";
import { Team } from "@/components/public/Team";
import { Testimonials } from "@/components/public/Testimonials";
import { CommunityImpact } from "@/components/public/CommunityImpact";
import { FAQ } from "@/components/public/FAQ";

export default function HomePage() {
  return (
    <>
      <div className="mx-auto max-w-content px-5 pt-10 md:px-8 md:pt-16">
        <Hero />
      </div>

      <div className="my-8 w-full md:my-12">
        <ValuesMarquee />
      </div>

      <div className="mx-auto max-w-content px-5 md:px-8">
        <Approach />
        <WhoWeHelp />
        <Programs />
        <Team />
        <Testimonials />
        <CommunityImpact />
        <FAQ />
      </div>
    </>
  );
}
