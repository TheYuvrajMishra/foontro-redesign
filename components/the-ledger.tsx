"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useState, useEffect } from "react";
import { LEDGER_SEED, type LedgerRow } from "@/lib/data";
import { SectionShell, Reveal, NumTicker } from "./ui";

/* THE LEDGER — client proof as receipts, not quotes.
   A mono-typeset transaction stream: escrow locked -> approved -> paid.
   Rows stream in on an interval (seeded demo data, loops forever). */

const STAGES = ["escrow locked", "approved", "paid"] as const;

function LedgerLine({ row, index }: { row: LedgerRow; index: number }) {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (reduced) {
      // deferred: keeps the effect body sync-free and hydration-safe
      const t = window.setTimeout(() => setStage(2), 0);
      return () => window.clearTimeout(t);
    }
    const t1 = window.setTimeout(() => setStage(1), 900 + index * 120);
    const t2 = window.setTimeout(() => setStage(2), 1900 + index * 120);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reduced, index]);

  return (
    <motion.div
      data-reveal
      initial={reduced ? undefined : { opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-line/60 py-3.5 md:grid-cols-[90px_1fr_220px_110px_90px]"
    >
      <span className="tnum font-mono text-xs font-bold text-ember">{row.order}</span>
      <span className="col-span-2 font-mono text-xs text-fog md:col-span-1">
        {row.gig}
        <span className="text-dim"> → {row.freelancer}</span>
      </span>
      <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] md:block">
        {STAGES.map((s, i) => (
          <span key={s}>
            <span className={i <= stage ? "text-ember" : "text-dim"}>
              {i <= stage ? "●" : "○"} {s}
            </span>
            {i < STAGES.length - 1 && <span className="text-dim"> → </span>}
          </span>
        ))}
      </span>
      <span className="tnum text-right font-mono text-sm font-bold text-bone">
        {row.amount}
      </span>
      <span className="text-right font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
        {row.time}
      </span>
    </motion.div>
  );
}

export default function TheLedger() {
  const reduced = useReducedMotion();
  const [rows, setRows] = useState<LedgerRow[]>(LEDGER_SEED.slice(0, 4));

  useEffect(() => {
    if (reduced) {
      // deferred: keeps the effect body sync-free and hydration-safe
      const t = window.setTimeout(() => setRows(LEDGER_SEED), 0);
      return () => window.clearTimeout(t);
    }
    let i = 4;
    const id = window.setInterval(() => {
      setRows((r) => {
        const next = LEDGER_SEED[i % LEDGER_SEED.length];
        const stamped: LedgerRow = {
          ...next,
          order: `#F-${2050 + i}`,
          time: "just now",
        };
        i++;
        return [stamped, ...r].slice(0, 6);
      });
    }, 5200);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <SectionShell
      id="ledger"
      inning="06"
      eyebrow="Client proof"
      title={
        <>
          THE LEDGER. <span className="text-ember">RECEIPTS, NOT PROMISES.</span>
        </>
      }
      lede="Anyone can collect testimonials. We'd rather show you the money moving — every row is an order that went escrow → approved → paid. (Demonstration stream; amounts illustrative.)"
    >
      {/* aggregate counters */}
      <Reveal className="grid grid-cols-3 gap-4 pb-10">
        {[
          { v: 1284, suffix: "", label: "orders settled this month*" },
          { v: 42, suffix: "L", prefix: "₹", label: "moved through escrow*" },
          { v: 98, suffix: "%", label: "approved without dispute*" },
        ].map((s) => (
          <div key={s.label} className="border border-line bg-panel/40 p-5">
            <p className="tnum font-display text-2xl text-bone md:text-4xl">
              <NumTicker value={s.v} prefix={s.prefix ?? ""} suffix={s.suffix} />
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
              {s.label}
            </p>
          </div>
        ))}
      </Reveal>

      <Reveal>
        <div className="border border-line bg-void/60 px-5 py-2 md:px-8" role="log" aria-label="Recent order receipts">
          <AnimatePresence initial={false}>
            {rows.map((r, i) => (
              <LedgerLine key={`${r.order}-${i}`} row={r} index={i} />
            ))}
          </AnimatePresence>
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
          *Illustrative demo figures — the escrow → approve → pay loop is the real product mechanic.
        </p>
      </Reveal>
      <div className="h-16" />
    </SectionShell>
  );
}
