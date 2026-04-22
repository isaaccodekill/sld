import { Hero } from "@/components/public/Hero";
import { ValuesMarquee } from "@/components/public/ValuesMarquee";
import { Approach } from "@/components/public/Approach";
import { WhoWeHelp } from "@/components/public/WhoWeHelp";
import { Programs } from "@/components/public/Programs";
import { Team } from "@/components/public/Team";
import { Testimonials } from "@/components/public/Testimonials";
import { FAQ } from "@/components/public/FAQ";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-content px-5 md:px-8">
      <div className="pt-10 md:pt-16">
        <Hero />
      </div>

      <div className="-mx-5 my-10 md:-mx-8 md:my-16">
        <ValuesMarquee />
      </div>

      <Approach />
      <WhoWeHelp />
      <Programs />
      <Team />
      <Testimonials />
      <FAQ />
    </div>
  );
}
