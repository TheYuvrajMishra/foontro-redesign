"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useState } from "react";
import { SectionShell, Reveal } from "./ui";

/* HOUSE RULES — the five rules the marketplace runs on.
   Hover or focus a rule: siblings dim, the demo strip performs the mechanic. */

function DemoVerify() {
  return (
    <div className="border border-line bg-void p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-ember bg-panel2 font-display text-lg text-bone">
          AS
        </div>
        <div>
          <p className="font-bold text-bone">Ananya Sharma</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
            Applied 12 Jan → ID check → portfolio review → trial gig
          </p>
        </div>
      </div>
      <div className="mt-4 h-1.5 w-full bg-panel2">
        <div className="vault-fill h-full w-full bg-ember" />
      </div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ember">
        Cleared in 4 days — by a human, not an algorithm
      </p>
    </div>
  );
}

function DemoVault() {
  return (
    <div className="border border-line bg-void p-5 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
        The vault, right now
      </p>
      <p className="tnum mt-3 font-display text-4xl text-ember">₹4.2L</p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fog">
        held across 312 live orders
      </p>
      <p className="mt-4 border-t border-line pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
        Demo figures — the mechanic is real
      </p>
    </div>
  );
}

function DemoNoBids() {
  return (
    <div className="border border-line bg-void p-5">
      <div className="relative opacity-40">
        {["₹1,999", "₹1,499", "₹999"].map((b) => (
          <div
            key={b}
            className="mb-2 flex justify-between border border-line px-3 py-2 font-mono text-xs text-dim line-through"
          >
            <span>Random bidder</span>
            <span className="tnum">{b}</span>
          </div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-void px-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ember">
            Not how this works
          </span>
        </div>
      </div>
      <div className="mt-2 flex justify-between border border-ember bg-panel px-3 py-3">
        <span className="font-mono text-xs text-bone">✓ Matched: Rohan V. — verified</span>
        <span className="tnum font-mono text-xs font-bold text-ember">₹1,499/hr</span>
      </div>
    </div>
  );
}

function DemoStreak() {
  return (
    <div className="border border-line bg-void p-5">
      <div className="flex gap-1.5">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="h-8 flex-1 bg-ember" />
        ))}
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-8 flex-1 bg-faint" />
        ))}
      </div>
      <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.18em]">
        <span className="border border-[#c98a4b] px-3 py-1 text-[#c98a4b]">
          ◆ Bronze frame earned
        </span>
      </p>
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
        7 days in → search boost ×1.25
      </p>
    </div>
  );
}

function DemoPayout() {
  return (
    <div className="border border-line bg-void p-5">
      {["UPI — instant rails", "Bank transfer — on schedule"].map((r) => (
        <div
          key={r}
          className="mb-2 flex items-center justify-between border border-line px-4 py-3"
        >
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-fog">
            {r}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember">
            ● live
          </span>
        </div>
      ))}
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
        No minimum-withdrawal games. Your money, your call.
      </p>
    </div>
  );
}

const RULES = [
  {
    n: "R1",
    title: "Human-verified, not profile-verified.",
    body: "ID checks, portfolio reviews, a trial gig. A person signs off before anyone touches the board.",
    Demo: DemoVerify,
  },
  {
    n: "R2",
    title: "The vault holds the money.",
    body: "Clients pay upfront into escrow. Freelancers see proof of funds; nobody touches it until approval.",
    Demo: DemoVault,
  },
  {
    n: "R3",
    title: "No bidding wars.",
    body: "You don't undercut 40 strangers for a logo. You get matched with verified players at honest rates.",
    Demo: DemoNoBids,
  },
  {
    n: "R4",
    title: "Streaks that pay.",
    body: "Log in daily, build your streak, earn metallic frames that push you up the search board.",
    Demo: DemoStreak,
  },
  {
    n: "R5",
    title: "Payouts on rails.",
    body: "UPI and bank transfers, on a schedule — not a whim, not a threshold you have to beg past.",
    Demo: DemoPayout,
  },
];

export default function HouseRules() {
  const [active, setActive] = useState(1);
  const reduced = useReducedMotion();
  const Active = RULES[active];

  return (
    <SectionShell
      id="rules"
      inning="03"
      eyebrow="Why Foontro"
      title={
        <>
          HOUSE RULES. <span className="text-ember">FIVE OF THEM.</span>
        </>
      }
      lede="Every marketplace has terms & conditions. Ours fit on a napkin — and every rule protects someone at the table."
    >
      <div className="grid gap-8 pb-16 md:pb-24 lg:grid-cols-[1.2fr_1fr]">
        <ul className="flex flex-col">
          {RULES.map((r, i) => {
            const isActive = i === active;
            const dimmed = active !== i;
            return (
              <li key={r.n}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-current={isActive}
                  className={`block w-full border-t border-line py-6 text-left transition-all duration-300 last:border-b ${
                    dimmed ? "opacity-40 blur-[0.5px]" : "opacity-100"
                  }`}
                >
                  <div className="flex gap-5 px-2">
                    <span className="tnum font-mono text-sm text-ember">{r.n}</span>
                    <span>
                      <span className="font-display text-lg tracking-tight text-bone md:text-xl">
                        {r.title}
                      </span>
                      <span className="block max-w-lg pt-2 text-[15px] leading-relaxed text-fog">
                        {r.body}
                      </span>
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <div className="border border-line bg-panel/60 p-6 md:p-8">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
              Rule {Active.n} — in motion
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                data-reveal
                initial={reduced ? undefined : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Active.Demo />
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
