"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useState } from "react";
import { SectionShell, Reveal } from "./ui";

/* THE RULEBOOK — how it works as four plays.
   Tap a play and the mechanic performs itself on the stage. No step icons. */

function DemoVerified() {
  return (
    <div className="flex flex-col gap-3">
      {["Ananya S. — ID checked", "Rohan V. — portfolio reviewed", "Priya N. — trial gig passed"].map(
        (t, i) => (
          <motion.div
            key={t}
            data-reveal
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between border border-line bg-void px-4 py-3"
          >
            <span className="font-mono text-xs text-fog">{t}</span>
            <span className="stamp-in border border-ember px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ember">
              Verified
            </span>
          </motion.div>
        )
      )}
    </div>
  );
}

function DemoVault() {
  return (
    <div className="border border-line bg-void p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
        Client pays → vault holds
      </p>
      <div className="mt-4 h-4 w-full bg-panel2">
        <div className="vault-fill h-full w-full bg-ember" />
      </div>
      <div className="mt-4 flex items-center justify-between font-mono text-xs">
        <span className="text-fog">Client</span>
        <span className="text-ember">▣ ₹24,999 locked</span>
        <span className="text-dim">Freelancer (waiting)</span>
      </div>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
        Visible to both sides. Touchable by neither.
      </p>
    </div>
  );
}

function DemoChat() {
  return (
    <div className="flex flex-col gap-2 border border-line bg-void p-5">
      <div className="max-w-[80%] self-start bg-panel2 px-4 py-2.5 text-sm text-fog">
        First cut&apos;s up — check the hero section.
      </div>
      <div className="max-w-[80%] self-end bg-ember px-4 py-2.5 text-sm font-medium text-[#14100b]">
        Love it. Can the CTA go bolder?
      </div>
      <div className="flex gap-1.5 self-start px-1" aria-hidden="true">
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-fog" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-fog" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-fog" />
      </div>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
        Revisions on the record, in one thread
      </p>
    </div>
  );
}

function DemoApprove() {
  return (
    <div className="border border-line bg-void p-5 text-center">
      <p className="stamp-in inline-block border-2 border-ember px-5 py-1.5 font-display text-2xl text-ember">
        APPROVED
      </p>
      <div className="tnum mt-5 flex items-center justify-between font-mono text-xs">
        <span className="text-fog">Vault</span>
        <span className="text-ember">━━━ ₹24,999 ━━━▶</span>
        <span className="text-fog">Rohan V.</span>
      </div>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
        One tap. Money moves. Receipt filed.
      </p>
    </div>
  );
}

const PLAYS = [
  {
    n: "01",
    title: "Pick from the verified board",
    body: "Every freelancer is vetted by a human before they touch the board. No open bidding, no race to the bottom — you choose from people who've already proven it.",
    Demo: DemoVerified,
  },
  {
    n: "02",
    title: "Lock the money in escrow",
    body: "You pay upfront, but the money parks in the vault. The freelancer sees it's real; nobody can touch it until the work is approved. That's the whole trust trick.",
    Demo: DemoVault,
  },
  {
    n: "03",
    title: "Chat, revise, repeat",
    body: "One shared thread for the whole gig. Feedback, files and revisions happen in the open, on the record — no lost WhatsApp threads at 1 AM.",
    Demo: DemoChat,
  },
  {
    n: "04",
    title: "Approve — money moves",
    body: "You say it's good. The vault opens and the payout hits the freelancer's account. Clean ending, every single time.",
    Demo: DemoApprove,
  },
];

export default function Rulebook() {
  const [active, setActive] = useState(1);
  const reduced = useReducedMotion();
  const Active = PLAYS[active];

  return (
    <SectionShell
      id="rulebook"
      inning="02"
      eyebrow="How it works"
      title={
        <>
          THE RULEBOOK. <span className="text-ember">FOUR PLAYS.</span>
        </>
      }
      lede="No fine print, no 40-step onboarding. This is the entire game, and every play protects someone."
    >
      <div className="grid gap-8 pb-16 md:pb-24 lg:grid-cols-[1fr_1fr]">
        {/* play list */}
        <div role="tablist" aria-label="The four plays" className="flex flex-col">
          {PLAYS.map((p, i) => {
            const isActive = i === active;
            return (
              <button
                key={p.n}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className={`group border-t border-line py-6 text-left transition-colors last:border-b ${
                  isActive ? "" : "hover:bg-faint"
                }`}
              >
                <div className="flex items-baseline gap-5 px-2">
                  <span
                    className={`tnum font-mono text-sm ${
                      isActive ? "text-ember" : "text-dim"
                    }`}
                  >
                    {p.n}
                  </span>
                  <span>
                    <span
                      className={`font-display text-xl tracking-tight md:text-2xl ${
                        isActive ? "text-bone" : "text-fog group-hover:text-bone"
                      }`}
                    >
                      {p.title}
                    </span>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.span
                          data-reveal
                          initial={reduced ? undefined : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="block overflow-hidden"
                        >
                          <span className="block max-w-md pt-3 text-[15px] leading-relaxed text-fog">
                            {p.body}
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* stage */}
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <div className="border border-line bg-panel/60 p-6 md:p-8">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
              Play {Active.n} — live diagram
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                data-reveal
                initial={reduced ? undefined : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
