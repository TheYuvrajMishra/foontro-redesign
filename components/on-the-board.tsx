"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { FREELANCERS, TIER_META, CATEGORIES } from "@/lib/data";
import { SectionShell, Marquee } from "./ui";

/* ON THE BOARD — freelancer proof as live player cards, not testimonials.
   Filter by category; each card wears its earned tier frame. Spotlight hover. */

export default function OnTheBoard() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const reduced = useReducedMotion();
  const players =
    cat === "All" ? FREELANCERS : FREELANCERS.filter((f) => f.category === cat);

  return (
    <SectionShell
      id="board"
      inning="05"
      eyebrow="Freelancer proof"
      title={
        <>
          ON THE BOARD. <span className="text-ember">MEET THE PLAYERS.</span>
        </>
      }
      lede="No stock-photo testimonials. These are the kinds of verified players waiting on the board right now — frames earned, streaks burning. (Sample data; the real board has 5,000+.)"
    >
      {/* category filter */}
      <div className="flex flex-wrap gap-2 pb-8" role="group" aria-label="Filter by category">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={`min-h-[44px] border px-5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
              cat === c
                ? "border-ember bg-ember text-[#14100b]"
                : "border-line text-fog hover:border-ember hover:text-ember"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 pb-8 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((f, i) => {
          const meta = TIER_META[f.tier];
          return (
            <motion.article
              key={f.id}
              data-reveal
              layout={!reduced}
              initial={reduced ? undefined : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
              className="group relative border border-line bg-panel/50 p-6 transition-colors hover:border-ember/60"
            >
              {/* spotlight sweep */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(420px circle at 50% 0%, rgba(243,105,56,0.12), transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-void font-display text-lg text-bone"
                    style={{
                      border: `2px solid ${meta.ring}`,
                      boxShadow: meta.glow === "none" ? undefined : meta.glow,
                    }}
                    aria-hidden="true"
                  >
                    {f.name.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <span
                    className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: meta.ring }}
                  >
                    ◆ {meta.label}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl tracking-tight text-bone">
                  {f.name}
                </h3>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog">
                  {f.role}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-fog">{f.blurb}</p>
                <dl className="tnum mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4 font-mono text-[11px]">
                  <div>
                    <dt className="uppercase tracking-[0.14em] text-dim">Rating</dt>
                    <dd className="mt-1 text-sm text-bone">★ {f.rating.toFixed(1)}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.14em] text-dim">Gigs</dt>
                    <dd className="mt-1 text-sm text-bone">{f.gigs}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.14em] text-dim">Streak</dt>
                    <dd className="mt-1 text-sm text-ember">{f.streakDays}d</dd>
                  </div>
                </dl>
                <div className="mt-4 flex items-baseline justify-between">
                  <p className="tnum font-mono text-lg font-bold text-bone">
                    {f.rate}
                    <span className="text-xs font-normal text-dim">{f.rateNote}</span>
                  </p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                    ✓ verified
                  </span>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* category marquee: the board never sleeps */}
      <div className="border-y border-line py-4">
        <Marquee label="Service categories on Foontro">
          {["Logo design", "Next.js builds", "Video editing", "Copywriting", "SEO", "UI design", "Voice-over", "Brand kits"].map(
            (c) => (
              <span key={c} className="mx-6 font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
                {c} <span className="ml-6 text-ember">●</span>
              </span>
            )
          )}
        </Marquee>
      </div>
      <div className="h-16" />
    </SectionShell>
  );
}
