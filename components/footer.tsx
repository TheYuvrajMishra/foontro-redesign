import { MagneticButton, Reveal, SplitText } from "./ui";

/* Final CTA + footer: "TAKE YOUR SPOT ON THE BOARD" in giant type,
   role-split magnetic buttons, ledger-style sitemap, giant wordmark. */

const SITEMAP: { h: string; links: string[] }[] = [
  { h: "Marketplace", links: ["Browse gigs", "Verified freelancers", "Streaks", "Escrow"] },
  { h: "Company", links: ["About Foontro", "Trust & Safety", "Reviews", "Blog"] },
  { h: "Support", links: ["Help center", "Contact", "Disputes", "Payout help"] },
];

export default function Footer() {
  return (
    <footer id="cta" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="h-px w-full bg-line" aria-hidden="true" />

        {/* final CTA */}
        <div className="py-16 md:py-24">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember">
              08 / Final call
            </p>
          </Reveal>
          <SplitText
            as="h2"
            text="TAKE YOUR SPOT ON THE BOARD."
            className="mt-6 block max-w-5xl font-display text-[clamp(2.4rem,8vw,7rem)] leading-[0.92] tracking-tight text-bone"
          />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fog">
              Two sides, one board. Post a gig and meet verified players — or
              bring your craft, build a streak, and earn the frame.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-4">
              <MagneticButton href="#top">Join as a freelancer</MagneticButton>
              <MagneticButton href="#console" variant="ghost">
                Hire talent
              </MagneticButton>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
              Free to join · No bidding wars · The Foontro app for Android keeps
              your streak alive on the go
            </p>
          </Reveal>
        </div>

        {/* ledger-style sitemap */}
        <div className="grid gap-10 border-t border-line py-12 md:grid-cols-[1fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/foontro-mark.svg" alt="" aria-hidden="true" className="h-8 w-8 object-contain" />
              <span className="font-display text-xl tracking-tight text-bone">FOONTRO</span>
            </div>
            <p className="mt-4 max-w-xs font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-dim">
              India&apos;s verified freelance marketplace. Built in Mumbai.
            </p>
            <div className="mt-6 flex gap-4 font-mono text-[10px] uppercase tracking-[0.18em]">
              {["Instagram", "LinkedIn", "YouTube", "Discord"].map((s) => (
                <a key={s} href="#top" className="text-dim transition-colors hover:text-ember">
                  {s}
                </a>
              ))}
            </div>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {SITEMAP.map((col) => (
              <div key={col.h}>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ember">
                  {col.h}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#top"
                        className="font-mono text-xs uppercase tracking-[0.12em] text-fog transition-colors hover:text-bone"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* giant wordmark */}
        <div className="overflow-hidden border-t border-line py-6" aria-hidden="true">
          <p className="whitespace-nowrap text-center font-display text-[clamp(4rem,17vw,16rem)] leading-none tracking-tight text-bone/[0.07]">
            FOONTRO
          </p>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-line py-6 md:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
            © 2026 Foontro · Concept redesign
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
            Filed under: verified · escrowed · streaked
          </p>
        </div>
      </div>
    </footer>
  );
}
