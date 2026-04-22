import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";
import { LinkButton } from "@/components/ui/Button";
import { PuzzleDot } from "@/components/ui/PuzzleDot";
import {
  BUSINESS_ADDRESS_LINE_1,
  BUSINESS_ADDRESS_LINE_2,
  BUSINESS_EMAIL,
  BUSINESS_HOURS,
  BUSINESS_NAME,
  BUSINESS_PHONE,
  SOCIALS,
  waLink,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream-2">
      {/* Oversized brand moment */}
      <div className="relative overflow-hidden bg-brandblack text-cream">
        <div className="mx-auto max-w-wide px-5 py-24 md:px-8 md:py-36">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-cream/60">
            <PuzzleDot color="blue" size={8} />
            <PuzzleDot color="red" size={8} />
            <PuzzleDot color="yellow" size={8} />
            <PuzzleDot color="green" size={8} />
            <span className="ml-2">Let's help</span>
          </div>
          <h2 className="mt-6 font-display text-[clamp(2.8rem,8vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.02em]">
            Let's help your child
            <br />
            find their voice.
          </h2>

          <div className="mt-12 grid gap-3 md:mt-16 md:grid-cols-2 md:gap-4">
            <LinkButton
              href={waLink("Hi Fullgrace — I'd like to chat.")}
              target="_blank"
              rel="noopener"
              size="lg"
              variant="primary"
              className="justify-center"
            >
              Chat on WhatsApp
            </LinkButton>
            <LinkButton href="/contact" size="lg" variant="outline" className="justify-center border-cream/30 text-cream hover:bg-cream/10">
              Send a message
            </LinkButton>
          </div>
        </div>
      </div>

      {/* Info block */}
      <div className="mx-auto max-w-wide px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark size={44} />
              <div>
                <div className="font-display text-lg">{BUSINESS_NAME}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
                  Lagos · Nigeria
                </div>
              </div>
            </div>
            <p className="mt-5 max-w-prose text-sm text-ink-2">
              A therapy and learning centre for children with speech and language delays, autism, and
              Down's Syndrome. Montessori-rooted, child-led, family-inclusive.
            </p>
          </div>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">Visit</div>
            <div className="mt-3 text-sm text-ink-2">
              {BUSINESS_ADDRESS_LINE_1}
              <br />
              {BUSINESS_ADDRESS_LINE_2}
              <br />
              <span className="text-ink-3">{BUSINESS_HOURS}</span>
            </div>
          </div>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">Contact</div>
            <div className="mt-3 space-y-1 text-sm">
              <a href={`mailto:${BUSINESS_EMAIL}`} className="block text-ink-2 hover:text-ink">
                {BUSINESS_EMAIL}
              </a>
              <a href={`tel:${BUSINESS_PHONE.replace(/\s/g, "")}`} className="block text-ink-2 hover:text-ink">
                {BUSINESS_PHONE}
              </a>
              <Link href="/contact" className="block text-green hover:text-green-2">
                Send a message →
              </Link>
            </div>
          </div>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">Elsewhere</div>
            <div className="mt-3 space-y-1 text-sm">
              <a href={SOCIALS.instagram} target="_blank" rel="noopener" className="block text-ink-2 hover:text-ink">
                Instagram ↗
              </a>
              <Link href="/privacy" className="block text-ink-2 hover:text-ink">
                Privacy
              </Link>
              <a href="#top" className="block text-ink-2 hover:text-ink">
                Back to top ↑
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-ink-3 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Fullgrace Educational Consult and Therapy. All rights reserved.</div>
          <div className="font-mono uppercase tracking-[0.16em]">Made with care · Lagos</div>
        </div>
      </div>
    </footer>
  );
}
