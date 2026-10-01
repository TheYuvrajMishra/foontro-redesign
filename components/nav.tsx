"use client";

import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { useState } from "react";

/* Scoreboard ticker nav: a live-feeling strip up top, a bar that compacts
   into a floating pill, and hides on scroll-down (returns on scroll-up). */

const TICKER = [
  "5,000+ verified creators",
  "escrow on every order",
  "streaks earn metallic frames",
  "india-first · built in mumbai",
];

const LINKS = [
  { label: "Rulebook", href: "#rulebook" },
  { label: "Streaks", href: "#gauntlet" },
  { label: "The board", href: "#board" },
  { label: "Ledger", href: "#ledger" },
  { label: "Money", href: "#money" },
];

export default function Nav() {
  const { scrollY } = useScroll();
  const reduced = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 340);
    setCompact(y > 48);
  });

  return (
    <motion.header
      aria-label="Site navigation"
      initial={false}
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={
        reduced
          ? { duration: 0 }
          : { type: "spring", stiffness: 260, damping: 28 }
      }
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* ticker strip */}
      <div
        className={`overflow-hidden border-b border-line bg-void/90 backdrop-blur transition-all duration-300 ${
          compact ? "max-h-0 border-transparent" : "max-h-10"
        }`}
      >
        <div className="flex items-center gap-6 whitespace-nowrap px-5 py-2 md:px-10">
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ember">
            <span className="ember-pulse inline-block h-1.5 w-1.5 rounded-full bg-ember" />
            On the board
          </span>
          <div className="flex gap-6 overflow-hidden">
            {TICKER.map((t) => (
              <span
                key={t}
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* main bar -> floating pill */}
      <div className="flex justify-center px-4 pt-3">
        <nav
          className={`flex w-full items-center justify-between gap-4 transition-all duration-300 ${
            compact
              ? "max-w-3xl rounded-full border border-line bg-void/80 py-2 pl-4 pr-2 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
              : "max-w-7xl bg-transparent py-3"
          }`}
        >
          <a href="#top" className="flex items-center gap-2.5" aria-label="Foontro home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/foontro-mark.svg"
              alt=""
              aria-hidden="true"
              className="h-7 w-7 object-contain"
            />
            <span className="font-display text-lg tracking-tight text-bone">
              FOONTRO
            </span>
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog transition-colors hover:text-ember"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* role toggle: the desk flip */}
            <div
              className="hidden items-center rounded-full border border-line p-1 sm:flex"
              role="group"
              aria-label="Choose your side"
            >
              <a
                href="#console"
                className="rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-fog transition-colors hover:text-bone"
              >
                Hire
              </a>
              <a
                href="#gauntlet"
                className="rounded-full bg-ember px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#14100b]"
              >
                Work
              </a>
            </div>
            <a
              href="#cta"
              className="inline-flex min-h-[44px] items-center bg-ember px-5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#14100b] transition-colors hover:bg-bone"
            >
              Join the board
            </a>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
