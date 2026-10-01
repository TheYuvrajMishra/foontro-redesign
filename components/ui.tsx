"use client";

import {
  motion,
  useReducedMotion,
  useSpring,
  useMotionValue,
  useInView,
  animate,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";
import Lenis from "lenis";

/* ---------------- Lenis smooth scroll (skipped under reduced motion) ---------------- */
export function LenisRoot() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduced]);
  return null;
}

/* ---------------- SplitText: character-stagger scoreboard reveal ---------------- */
export function SplitText({
  text,
  className = "",
  as: Tag = "span",
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "p";
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");

  if (reduced) {
    return (
      <Tag className={className} data-reveal>
        {text}
      </Tag>
    );
  }

  let ci = 0;
  return (
    <Tag className={className} aria-label={text}>
      <span ref={ref} aria-hidden="true" className="inline">
        {words.map((w, wi) => (
          <span key={wi} className="inline-block whitespace-pre">
            {w.split("").map((ch) => {
              const i = ci++;
              return (
                <motion.span
                  key={i}
                  className="inline-block"
                  data-reveal
                  initial={{ opacity: 0, y: "0.6em", filter: "blur(6px)" }}
                  animate={
                    inView
                      ? { opacity: 1, y: "0em", filter: "blur(0px)" }
                      : undefined
                  }
                  transition={{
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                    delay: delay + i * 0.022,
                  }}
                >
                  {ch}
                </motion.span>
              );
            })}
            {wi < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </Tag>
  );
}

/* ---------------- SectionShell: inning number + hairline rules ---------------- */
export function SectionShell({
  id,
  inning,
  eyebrow,
  title,
  lede,
  children,
  tight = false,
}: {
  id: string;
  inning: string;
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  children: ReactNode;
  tight?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <section id={id} aria-label={eyebrow} className="relative">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        {/* top rule sliced across the page */}
        <div className="h-px w-full bg-line" aria-hidden="true" />
        <div className={`${tight ? "pt-8" : "pt-14 md:pt-20"} pb-8 md:pb-12`}>
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ember">
              <span className="tnum">{inning}</span>
              <span className="mx-3 text-dim">/</span>
              <span className="text-fog">{eyebrow}</span>
            </p>
            <p className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-dim md:block">
              foontro.com
            </p>
          </div>
          <motion.div
            data-reveal
            initial={reduced ? undefined : { opacity: 0, y: 28, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-4xl"
          >
            <h2 className="font-display text-[clamp(2rem,5.5vw,4.5rem)] leading-[0.95] tracking-tight text-bone">
              {title}
            </h2>
            {lede && (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-fog md:text-lg">
                {lede}
              </p>
            )}
          </motion.div>
        </div>
        {children}
        <div className="h-px w-full bg-line" aria-hidden="true" />
      </div>
    </section>
  );
}

/* ---------------- MagneticButton: one grabbable CTA per viewport ---------------- */
export function MagneticButton({
  children,
  href = "#",
  variant = "primary",
  className = "",
  onClick,
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost";
  className?: string;
  onClick?: () => void;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 18 });
  const y = useSpring(my, { stiffness: 180, damping: 18 });

  const onMove = (e: MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const styles =
    variant === "primary"
      ? "bg-ember text-[#14100b] hover:bg-bone"
      : "border border-line text-bone hover:border-ember hover:text-ember";

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex min-h-[48px] items-center justify-center gap-2 px-7 font-mono text-[12px] font-bold uppercase tracking-[0.18em] transition-colors duration-200 ${styles} ${className}`}
    >
      {children}
    </motion.a>
  );
}

/* ---------------- NumTicker: numbers that earn their count ---------------- */
export function NumTicker({
  value,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      // deferred so the effect body stays sync-free (hydration-safe)
      const t = window.setTimeout(
        () => setDisplay(value.toLocaleString("en-IN")),
        0
      );
      return () => window.clearTimeout(t);
    }
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString("en-IN")),
    });
    return () => controls.stop();
  }, [inView, value, reduced]);

  return (
    <span ref={ref} className={`tnum ${className}`} data-reveal>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ---------------- Marquee: seamless CSS loop, pause on hover ---------------- */
export function Marquee({
  children,
  fast = false,
  className = "",
  label,
}: {
  children: ReactNode;
  fast?: boolean;
  className?: string;
  label: string;
}) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      role="region"
      aria-label={label}
    >
      <div className={`marquee-track flex w-max hover:[animation-play-state:paused] ${fast ? "fast" : ""}`}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Reveal: quiet blur-fade for section bodies ---------------- */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      data-reveal
      className={className}
      initial={reduced ? undefined : { opacity: 0, y: 24, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
