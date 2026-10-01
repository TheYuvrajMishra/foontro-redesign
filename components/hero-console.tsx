"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import {
  TIER_META,
  GIG_PRESETS,
  STREAK_TIERS,
  matchFreelancers,
  type Freelancer,
  type Tier,
} from "@/lib/data";
import { SplitText, MagneticButton, Reveal } from "./ui";

/* ============ THE PLAYABLE BOARD — a working mini-Foontro ============
   Client side: post a gig -> verified cards answer -> escrow locks -> approve.
   Freelancer side: log days -> streak builds -> metallic frames unlock.
   All data seeded; the mechanics mirror the real product.               */

type Phase = "idle" | "matching" | "matched" | "escrow" | "released";

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function Avatar({
  name,
  tier,
  size = 44,
}: {
  name: string;
  tier: Tier;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("");
  const meta = TIER_META[tier];
  return (
    <div
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full bg-panel2 font-display"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        border: `2px solid ${meta.ring}`,
        boxShadow: meta.glow === "none" ? undefined : meta.glow,
        color: "var(--color-bone)",
      }}
    >
      {initials}
    </div>
  );
}

function ClientDesk() {
  const reduced = useReducedMotion();
  const [gig, setGig] = useState(GIG_PRESETS[0].title);
  const [phase, setPhase] = useState<Phase>("idle");
  const [cards, setCards] = useState<Freelancer[]>([]);
  const [hired, setHired] = useState<Freelancer | null>(null);
  const [amount, setAmount] = useState(GIG_PRESETS[0].amount);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) =>
    timers.current.push(window.setTimeout(fn, reduced ? 0 : ms));

  const post = () => {
    const text = gig.trim() || GIG_PRESETS[0].title;
    const preset = GIG_PRESETS.find((p) => p.title === text);
    setAmount(preset ? preset.amount : 4999 + (hashStr(text) % 20000));
    setPhase("matching");
    setHired(null);
    later(() => {
      setCards(matchFreelancers(text));
      setPhase("matched");
    }, 1400);
  };

  const hire = (f: Freelancer) => {
    setHired(f);
    setPhase("escrow");
  };

  const release = () => setPhase("released");
  const reset = () => {
    setPhase("idle");
    setHired(null);
    setCards([]);
  };

  const orderNo = `#F-${2000 + (hashStr(gig) % 900)}`;

  return (
    <div>
      <div aria-live="polite" className="sr-only">
        {phase === "matching" && "Scanning the board for verified freelancers."}
        {phase === "matched" && `${cards.length} verified freelancers answered.`}
        {phase === "escrow" && `Escrow locked for ${hired?.name}.`}
        {phase === "released" && "Payment released."}
      </div>

      {phase === "idle" && (
        <div>
          <label
            htmlFor="gig-input"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim"
          >
            Describe the gig
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="gig-input"
              value={gig}
              onChange={(e) => setGig(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && post()}
              placeholder="e.g. Logo + brand kit for a D2C startup"
              className="min-h-[52px] flex-1 border border-line bg-void px-4 font-mono text-sm text-bone placeholder:text-dim focus:border-ember focus:outline-none"
            />
            <button
              onClick={post}
              className="min-h-[52px] bg-ember px-6 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-[#14100b] transition-colors hover:bg-bone"
            >
              Post gig
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {GIG_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setGig(p.title)}
                className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fog transition-colors hover:border-ember hover:text-ember"
              >
                {p.label} · {p.budget}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "matching" && (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 py-10">
          <div className="flex gap-2" aria-hidden="true">
            <span className="typing-dot h-2 w-2 rounded-full bg-ember" />
            <span className="typing-dot h-2 w-2 rounded-full bg-ember" />
            <span className="typing-dot h-2 w-2 rounded-full bg-ember" />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fog">
            Scanning the board for verified players…
          </p>
        </div>
      )}

      {(phase === "matched" || phase === "escrow" || phase === "released") && (
        <div>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
              Gig: <span className="text-fog">{gig}</span>
            </p>
            <button
              onClick={reset}
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim underline-offset-4 hover:text-ember hover:underline"
            >
              Reset
            </button>
          </div>

          <div className="mt-4 grid gap-3">
            <AnimatePresence>
              {cards.map((f, i) => {
                const active = hired?.id === f.id;
                const dimmed = phase !== "matched" && !active;
                return (
                  <motion.div
                    key={f.id}
                    data-reveal
                    initial={reduced ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: dimmed ? 0.35 : 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: reduced ? 0 : i * 0.12,
                    }}
                    className={`flex items-center gap-4 border p-4 transition-colors ${
                      active ? "border-ember bg-panel" : "border-line bg-void"
                    }`}
                  >
                    <Avatar name={f.name} tier={f.tier} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        <p className="font-bold text-bone">{f.name}</p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ember">
                          {TIER_META[f.tier].label}
                        </p>
                      </div>
                      <p className="truncate text-sm text-fog">
                        {f.role} · ★ {f.rating.toFixed(1)} · {f.gigs} gigs ·
                        <span className="text-ember"> {f.streakDays}-day streak</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="tnum font-mono text-sm font-bold text-bone">
                        {f.rate}
                        <span className="font-normal text-dim">{f.rateNote}</span>
                      </p>
                      {phase === "matched" && (
                        <button
                          onClick={() => hire(f)}
                          className="mt-1 min-h-[36px] border border-ember px-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ember transition-colors hover:bg-ember hover:text-[#14100b]"
                        >
                          Hire
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* escrow vault */}
          {(phase === "escrow" || phase === "released") && hired && (
            <motion.div
              data-reveal
              initial={reduced ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 border border-ember/60 bg-panel p-5"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember">
                  ▣ Escrow vault
                </p>
                <p className="tnum font-mono text-sm text-fog">{orderNo}</p>
              </div>
              <div className="mt-3 h-3 w-full bg-void">
                <div className="vault-fill h-full w-full bg-ember" />
              </div>
              <p className="tnum mt-3 font-mono text-2xl font-bold text-bone">
                ₹{amount.toLocaleString("en-IN")}
                <span className="ml-3 align-middle font-mono text-[11px] font-normal uppercase tracking-[0.18em] text-fog">
                  held — moves only when you approve
                </span>
              </p>
              {phase === "escrow" ? (
                <button
                  onClick={release}
                  className="mt-4 min-h-[48px] w-full bg-ember font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-[#14100b] transition-colors hover:bg-bone sm:w-auto sm:px-8"
                >
                  Approve work & release payment
                </button>
              ) : (
                <div className="relative mt-4">
                  <p className="stamp-in inline-block border-2 border-ember px-4 py-1 font-display text-xl text-ember">
                    PAID
                  </p>
                  <p className="tnum mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-fog">
                    {orderNo} · approved · ₹{amount.toLocaleString("en-IN")} released
                    to {hired.name} · receipt filed
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

function FreelancerDesk() {
  const reduced = useReducedMotion();
  const [days, setDays] = useState(6);
  const [auto, setAuto] = useState(false);
  const [pings, setPings] = useState<number[]>([]);
  const timer = useRef<number | null>(null);

  const tier: Tier =
    days >= 30 ? "gold" : days >= 15 ? "silver" : days >= 7 ? "bronze" : "none";
  const meta = TIER_META[tier];
  const nextTier = STREAK_TIERS.find((t) => t.days > days);

  const logDay = () => {
    if (days >= 30) return;
    const d = days + 1;
    setDays(d);
    if (!reduced) {
      const id = Date.now();
      setPings((p) => [...p.slice(-5), id]);
      window.setTimeout(() => setPings((p) => p.filter((x) => x !== id)), 1200);
    }
  };

  const autoActive = auto && days < 30;

  useEffect(() => {
    if (autoActive) {
      timer.current = window.setTimeout(() => {
        setDays((d) => Math.min(30, d + 1));
      }, reduced ? 60 : 500);
    } else if (timer.current) {
      window.clearTimeout(timer.current);
    }
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [autoActive, days, reduced]);

  const boost = 1 + (days / 30) * 1.5;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-5">
        <div className="relative">
          <Avatar name="You" tier={tier} size={72} />
          {pings.map((id) => (
            <span
              key={id}
              aria-hidden="true"
              className="ping-ring absolute inset-0 rounded-full border-2 border-ember"
            />
          ))}
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
            Your streak
          </p>
          <p className="tnum font-display text-5xl text-bone">
            {days}
            <span className="text-xl text-dim">/30</span>
          </p>
          <p
            className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: meta.ring }}
          >
            {meta.label} frame · search boost {meta.boost}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={logDay}
            disabled={days >= 30}
            className="min-h-[52px] bg-ember px-6 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-[#14100b] transition-colors hover:bg-bone disabled:cursor-not-allowed disabled:opacity-40"
          >
            Log day
          </button>
          <button
            onClick={() => setAuto((a) => !a)}
            disabled={days >= 30}
            aria-pressed={autoActive}
            className="min-h-[52px] border border-line px-5 font-mono text-[12px] uppercase tracking-[0.18em] text-fog transition-colors hover:border-ember hover:text-ember disabled:cursor-not-allowed disabled:opacity-40"
          >
            {autoActive ? "Stop" : "Auto-play"}
          </button>
        </div>
      </div>

      {/* 30-day board */}
      <div
        className="mt-6 grid grid-cols-10 gap-1.5 sm:grid-cols-[repeat(15,minmax(0,1fr))]"
        role="img"
        aria-label={`${days} of 30 streak days logged, ${meta.label} frame earned`}
      >
        {Array.from({ length: 30 }, (_, i) => {
          const logged = i < days;
          const isThreshold = STREAK_TIERS.some((t) => t.days === i + 1);
          return (
            <div
              key={i}
              className="aspect-square border transition-colors duration-200"
              style={{
                background: logged ? "var(--color-ember)" : "var(--color-faint)",
                borderColor: isThreshold
                  ? TIER_META[STREAK_TIERS.find((t) => t.days === i + 1)!.tier].ring
                  : "var(--color-line)",
                opacity: logged ? 1 : 0.7,
              }}
            />
          );
        })}
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.22em]">
          <span className="text-dim">Search visibility</span>
          <span className="tnum text-ember">×{boost.toFixed(2)}</span>
        </div>
        <div className="mt-2 h-2 w-full bg-faint">
          <div
            className="h-full bg-ember transition-[width] duration-500"
            style={{ width: `${(days / 30) * 100}%` }}
          />
        </div>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
          {nextTier ? (
            <>
              {nextTier.days - days} days to{" "}
              <span style={{ color: TIER_META[nextTier.tier].ring }}>
                {nextTier.name}
              </span>
            </>
          ) : (
            <span style={{ color: TIER_META.gold.ring }}>
              Gold frame earned — the board pushes you first
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default function HeroConsole() {
  const [mode, setMode] = useState<"client" | "freelancer">("client");

  return (
    <section id="console" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-32 md:px-10 md:pb-24 md:pt-40">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          {/* ---- statement column ---- */}
          <div className="flex flex-col justify-center">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ember">
                Foontro — India&apos;s verified freelance marketplace
              </p>
            </Reveal>
            <h1 className="mt-6 font-display leading-[0.92] tracking-tight">
              <SplitText
                as="span"
                text="VERIFIED PEOPLE."
                className="block text-[clamp(2.6rem,7.5vw,6.5rem)] text-bone"
              />
              <SplitText
                as="span"
                text="LOCKED MONEY."
                delay={0.25}
                className="block text-[clamp(2.6rem,7.5vw,6.5rem)] text-ember"
              />
              <SplitText
                as="span"
                text="ZERO GHOSTING."
                delay={0.5}
                className="block text-[clamp(2.6rem,7.5vw,6.5rem)] text-bone"
              />
            </h1>
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-fog">
                Every freelancer is human-verified. Every rupee sits in escrow
                until you approve the work. And showing up daily earns you more
                than stars — it earns you the frame.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-wrap gap-4">
                <MagneticButton href="#cta">Join as a freelancer</MagneticButton>
                <MagneticButton href="#console" variant="ghost">
                  Post a gig ↓
                </MagneticButton>
              </div>
            </Reveal>
            <Reveal delay={0.35}>
              <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-6">
                {[
                  ["5,000+", "verified creators"],
                  ["100%", "orders in escrow"],
                  ["30-day", "streaks earn frames"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="sr-only">{l}</dt>
                    <dd className="tnum font-display text-xl text-bone md:text-2xl">
                      {v}
                    </dd>
                    <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                      {l}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* ---- playable console ---- */}
          <Reveal delay={0.2} className="relative">
            <div className="border border-line bg-panel/80 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur">
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                  <span className="ember-pulse mr-2 inline-block h-1.5 w-1.5 rounded-full bg-ember" />
                  Mini-Foontro
                </p>
                <div
                  className="flex rounded-full border border-line p-1"
                  role="group"
                  aria-label="Play as client or freelancer"
                >
                  {(
                    [
                      ["client", "Client"],
                      ["freelancer", "Freelancer"],
                    ] as const
                  ).map(([m, label]) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      aria-pressed={mode === m}
                      className={`rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                        mode === m
                          ? "bg-ember text-[#14100b]"
                          : "text-fog hover:text-bone"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-5 md:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {mode === "client" ? <ClientDesk /> : <FreelancerDesk />}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="border-t border-line px-5 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                  Live toy, not the app — data is seeded, the mechanics are real.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
