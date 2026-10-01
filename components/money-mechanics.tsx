"use client";

import { motion, useReducedMotion } from "motion/react";
import { FEE_ROWS, MONEY_SENTENCE } from "@/lib/fees";
import { SectionShell, Reveal } from "./ui";

/* MONEY MECHANICS — pricing reinvented as one confident sentence plus the
   escrow diagram. No invented percentages: unconfirmed figures are honestly
   marked "to confirm" and read from lib/fees.ts. */

function EscrowDiagram() {
  const reduced = useReducedMotion();
  const steps = [
    { n: "1", label: "Client pays in", sub: "order placed" },
    { n: "2", label: "Vault holds", sub: "visible, untouchable" },
    { n: "3", label: "Work happens", sub: "chat + revise" },
    { n: "4", label: "You approve", sub: "the only key" },
    { n: "5", label: "Freelancer paid", sub: "UPI / bank" },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-5" role="img" aria-label="Money flow: client pays in, vault holds, work happens, client approves, freelancer is paid">
      {steps.map((s, i) => (
        <motion.div
          key={s.n}
          data-reveal
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
          className={`relative border p-5 ${
            s.n === "2" ? "border-ember bg-panel" : "border-line bg-void"
          }`}
        >
          <p className={`tnum font-mono text-xs ${s.n === "2" ? "text-ember" : "text-dim"}`}>
            {s.n}
          </p>
          <p className="mt-2 font-display text-base tracking-tight text-bone">{s.label}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
            {s.sub}
          </p>
          {i < steps.length - 1 && (
            <span aria-hidden="true" className="absolute -right-3 top-1/2 hidden -translate-y-1/2 font-mono text-ember md:block">
              →
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function MoneyMechanics() {
  return (
    <SectionShell
      id="money"
      inning="07"
      eyebrow="Pricing & fees"
      title={
        <>
          THE MONEY, <span className="text-ember">IN ONE SENTENCE.</span>
        </>
      }
    >
      <Reveal>
        <blockquote className="max-w-4xl border-l-2 border-ember pl-6 md:pl-8">
          <p className="font-display text-[clamp(1.6rem,4vw,3rem)] leading-[1.05] tracking-tight text-bone">
            “{MONEY_SENTENCE}”
          </p>
        </blockquote>
      </Reveal>

      <Reveal delay={0.1} className="pt-10">
        <EscrowDiagram />
      </Reveal>

      <div className="grid gap-px border border-line bg-line pb-16 pt-10 md:grid-cols-2 lg:grid-cols-4 md:pb-20">
        {FEE_ROWS.map((f, i) => (
          <Reveal key={f.label} delay={i * 0.06} className="bg-void">
            <div className="h-full bg-void p-6">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                  {f.label}
                </p>
                {!f.confirmed && (
                  <span className="border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-dim">
                    to confirm
                  </span>
                )}
              </div>
              <p className="tnum mt-3 font-display text-3xl text-bone">{f.value}</p>
              <p className="mt-3 text-sm leading-relaxed text-fog">{f.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="-mt-10 pb-16 font-mono text-[10px] uppercase tracking-[0.16em] text-dim md:-mt-14 md:pb-20">
        Figures marked “to confirm” are placeholders — real numbers ship with Yuvraj&apos;s sign-off, not before.
      </p>
    </SectionShell>
  );
}
