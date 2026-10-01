"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { TIER_META, STREAK_TIERS, type Tier } from "@/lib/data";
import { SectionShell, Reveal } from "./ui";

const SonarField = dynamic(() => import("./sonar-field"), { ssr: false });

/* THE STREAK GAUNTLET — the gamification section as a playable arena.
   Log days, watch metallic frames unlock, feel the search boost fill.
   Tier names/thresholds are concept placeholders until Yuvraj confirms the
   real in-app values (see lib/data.ts). */

function tierFor(days: number): Tier {
  if (days >= 30) return "gold";
  if (days >= 15) return "silver";
  if (days >= 7) return "bronze";
  return "none";
}

export default function StreakGauntlet() {
  const reduced = useReducedMotion();
  const [days, setDays] = useState(4);
  const [auto, setAuto] = useState(false);
  const [pings, setPings] = useState<number[]>([]);
  const [announce, setAnnounce] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const tier = tierFor(days);
  const meta = TIER_META[tier];
  const boost = 1 + (days / 30) * 1.5;
  const nextTier = STREAK_TIERS.find((t) => t.days > days);

  const bump = (d: number) => {
    const prev = tierFor(days);
    const now = tierFor(d);
    setDays(d);
    if (!reduced) {
      const id = Date.now() + Math.random();
      setPings((p) => [...p.slice(-4), id]);
      window.setTimeout(() => setPings((p) => p.filter((x) => x !== id)), 1200);
    }
    if (now !== prev && now !== "none") {
      const t = STREAK_TIERS.find((x) => x.tier === now)!;
      setAnnounce(`${t.name} UNLOCKED`);
      window.setTimeout(() => setAnnounce(null), 2600);
    }
  };

  const logDay = () => days < 30 && bump(days + 1);

  const autoActive = auto && days < 30;

  useEffect(() => {
    if (autoActive) {
      timer.current = window.setTimeout(() => bump(Math.min(30, days + 1)), reduced ? 80 : 450);
    }
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoActive, days]);

  return (
    <SectionShell
      id="gauntlet"
      inning="04"
      eyebrow="Gamification"
      title={
        <>
          THE STREAK GAUNTLET. <span className="text-ember">30 DAYS.</span>
        </>
      }
      lede="Login Streaks are live on Foontro: show up daily, earn metallic frames, and the board pushes you up the search rankings. This is the game — play a round."
    >
      <div className="relative overflow-hidden border border-line pb-16 md:pb-20">
        <SonarField />
        <div className="relative grid gap-10 p-6 md:p-10 lg:grid-cols-[1fr_1.5fr]">
          {/* challenger card */}
          <Reveal className="flex flex-col items-start">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
              Challenger
            </p>
            <div className="relative mt-4">
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full bg-panel font-display text-3xl text-bone transition-all duration-500"
                style={{ border: `3px solid ${meta.ring}`, boxShadow: meta.glow === "none" ? undefined : meta.glow }}
                aria-hidden="true"
              >
                Y
              </div>
              {pings.map((id) => (
                <span
                  key={id}
                  aria-hidden="true"
                  className="ping-ring absolute inset-0 rounded-full border-2 border-ember"
                />
              ))}
            </div>
            <p className="tnum mt-5 font-display text-7xl leading-none text-bone">
              {days}
              <span className="text-2xl text-dim">/30</span>
            </p>
            <p
              className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em]"
              style={{ color: meta.ring }}
            >
              ◆ {meta.label} frame · search boost {meta.boost}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={logDay}
                disabled={days >= 30}
                className="min-h-[52px] bg-ember px-7 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-[#14100b] transition-colors hover:bg-bone disabled:cursor-not-allowed disabled:opacity-40"
              >
                Log day
              </button>
              <button
                onClick={() => setAuto((a) => !a)}
                disabled={days >= 30}
                aria-pressed={autoActive}
                className="min-h-[52px] border border-line px-6 font-mono text-[12px] uppercase tracking-[0.18em] text-fog transition-colors hover:border-ember hover:text-ember disabled:cursor-not-allowed disabled:opacity-40"
              >
                {autoActive ? "Pause" : "Auto-play"}
              </button>
            </div>

            <div className="mt-8 w-full max-w-xs">
              <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.22em]">
                <span className="text-dim">Search visibility</span>
                <span className="tnum text-ember">×{boost.toFixed(2)}</span>
              </div>
              <div className="mt-2 h-2 w-full bg-faint" role="progressbar" aria-valuenow={Math.round((days / 30) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Search visibility boost">
                <div
                  className="h-full bg-ember transition-[width] duration-500"
                  style={{ width: `${(days / 30) * 100}%` }}
                />
              </div>
            </div>

            <AnimatePresence>
              {announce && (
                <motion.p
                  data-reveal
                  initial={reduced ? undefined : { opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 border border-ember bg-void/80 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ember"
                  role="status"
                >
                  ◆ {announce}
                </motion.p>
              )}
            </AnimatePresence>
          </Reveal>

          {/* the board */}
          <Reveal delay={0.1}>
            <div
              className="grid grid-cols-10 gap-1.5 sm:grid-cols-[repeat(15,minmax(0,1fr))]"
              role="img"
              aria-label={`${days} of 30 streak days logged`}
            >
              {Array.from({ length: 30 }, (_, i) => {
                const logged = i < days;
                const milestone = STREAK_TIERS.find((t) => t.days === i + 1);
                return (
                  <div
                    key={i}
                    className="aspect-square border transition-colors duration-300"
                    style={{
                      background: logged ? "var(--color-ember)" : "var(--color-faint)",
                      borderColor: milestone ? TIER_META[milestone.tier].ring : "var(--color-line)",
                      boxShadow: logged && milestone ? `0 0 12px ${TIER_META[milestone.tier].ring}55` : undefined,
                    }}
                  />
                );
              })}
            </div>

            {/* tier podium */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {STREAK_TIERS.map((t) => {
                const unlocked = days >= t.days;
                const c = TIER_META[t.tier].ring;
                return (
                  <div
                    key={t.tier}
                    className="border p-4 text-center transition-all duration-300"
                    style={{
                      borderColor: unlocked ? c : "var(--color-line)",
                      opacity: unlocked ? 1 : 0.45,
                      boxShadow: unlocked ? `0 0 20px ${c}33` : undefined,
                    }}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: unlocked ? c : "var(--color-dim)" }}>
                      {unlocked ? "◆ Unlocked" : `◇ Day ${t.days}`}
                    </p>
                    <p className="mt-1 font-display text-sm text-bone md:text-base">{t.name}</p>
                  </div>
                );
              })}
            </div>

            <p className="mt-6 max-w-xl font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-dim">
              {nextTier ? (
                <>Next: {nextTier.name} at day {nextTier.days} — {nextTier.days - days} to go. Frames are earned, never bought.</>
              ) : (
                <>Gold frame earned. The board remembers who shows up.</>
              )}
            </p>
          </Reveal>
        </div>
      </div>
      <div className="h-10" />
    </SectionShell>
  );
}
