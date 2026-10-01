"use client";

import { useEffect, useRef } from "react";

/* SonarField — the single canvas piece on the page.
   A tap anywhere in the gauntlet = a streak day logged = a sonar ping.
   Zero dependencies, rAF loop, pauses offscreen, static under reduced motion. */

interface Ring {
  x: number;
  y: number;
  r: number;
  max: number;
  alpha: number;
}

export default function SonarField({ onTap }: { onTap?: (x: number, y: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const rings: Ring[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawDots();
    };

    const drawDots = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(237,232,220,0.07)";
      const gap = 34;
      for (let x = gap / 2; x < w; x += gap) {
        for (let y = gap / 2; y < h; y += gap) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }
    };

    const spawn = (x: number, y: number) => {
      if (rings.length > 24) rings.shift(); // hard cap: perf budget
      rings.push({ x, y, r: 6, max: 130 + Math.random() * 60, alpha: 0.55 });
    };

    const tick = () => {
      drawDots();
      for (let i = rings.length - 1; i >= 0; i--) {
        const rg = rings[i];
        rg.r += 2.1;
        rg.alpha *= 0.965;
        if (rg.r >= rg.max || rg.alpha < 0.02) {
          rings.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(rg.x, rg.y, rg.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(243,105,56,${rg.alpha.toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(rg.x, rg.y, rg.r * 0.55, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(243,105,56,${(rg.alpha * 0.5).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (reduced) return;
        if (visible && !raf) raf = requestAnimationFrame(tick);
        else if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawn(x, y);
      onTap?.(x, y);
    };
    canvas.addEventListener("pointerdown", onPointer);

    // ambient pings: the board breathes on its own
    const ambient = reduced
      ? 0
      : window.setInterval(() => {
          if (visible && document.visibilityState === "visible") {
            spawn(Math.random() * w, Math.random() * h);
          }
        }, 2600);

    resize();
    window.addEventListener("resize", resize);
    if (!reduced) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(ambient);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointer);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full cursor-crosshair"
    />
  );
}
