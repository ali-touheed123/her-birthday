import { useEffect, useRef } from "react";

/**
 * Lightweight canvas particle field — soft glowing orbs drifting in 3D-ish space.
 * Mobile-friendly (<= ~50 particles), capped DPR, requestAnimationFrame loop.
 */
export const ParticleField = ({
  density = 42,
  hueA = 322,
  hueB = 280,
  hueC = 220,
  scrollFactor = 0.15,
}: {
  density?: number;
  hueA?: number;
  hueB?: number;
  hueC?: number;
  scrollFactor?: number;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let w = 0, h = 0, raf = 0, scrollY = window.scrollY;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    type P = { x: number; y: number; z: number; r: number; vx: number; vy: number; hue: number; phase: number };
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const particles: P[] = Array.from({ length: density }, () => {
      const hues = [hueA, hueB, hueC];
      return {
        x: Math.random(),
        y: Math.random(),
        z: rand(0.3, 1),
        r: rand(1.2, 3.4),
        vx: rand(-0.00015, 0.00015),
        vy: rand(-0.00025, -0.00005),
        hue: hues[(Math.random() * hues.length) | 0],
        phase: Math.random() * Math.PI * 2,
      };
    });

    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    resize();

    let t = 0;
    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const parallax = scrollY * scrollFactor;

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -0.05) p.y = 1.05;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;

        const sway = Math.sin(t * 0.6 + p.phase) * 8;
        const px = p.x * w + sway;
        const py = (p.y * h) - (parallax * p.z * 0.4);
        const radius = p.r * (0.6 + p.z) * 3;

        ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${0.4 * p.z})`;
        ctx.shadowBlur = radius * 2;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 70%, ${0.5 * p.z})`;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset for next
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, [density, hueA, hueB, hueC, scrollFactor]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden />;
};
