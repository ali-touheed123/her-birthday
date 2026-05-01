import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

/**
 * Floating 3D-ish abstract orb stack — pure CSS gradients with parallax + rotation.
 * No WebGL — feels three-dimensional through layered blur, scale, and scroll-linked transform.
 */
export const FloatingOrbs = ({ progress }: { progress?: MotionValue<number> }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = progress ?? scrollYProgress;

  const y1 = useTransform(p, [0, 1], [0, -180]);
  const y2 = useTransform(p, [0, 1], [0, 220]);
  const y3 = useTransform(p, [0, 1], [0, -90]);
  const r1 = useTransform(p, [0, 1], [0, 60]);
  const r2 = useTransform(p, [0, 1], [0, -45]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl perspective-1000" aria-hidden>
      <motion.div
        style={{ y: y1, rotate: r1 }}
        className="absolute -left-20 top-[10%] h-[280px] w-[280px] rounded-full opacity-70 blur-3xl animate-float-slow will-change-transform"
      >
        <div className="h-full w-full rounded-full"
          style={{ background: "radial-gradient(circle at 30% 30%, hsl(var(--neon-pink) / 0.85), hsl(var(--neon-violet) / 0.4) 55%, transparent 75%)" }} />
      </motion.div>

      <motion.div
        style={{ y: y2, rotate: r2 }}
        className="absolute right-[-60px] top-[35%] h-[340px] w-[340px] rounded-full opacity-60 blur-3xl animate-float-slow will-change-transform"
      >
        <div className="h-full w-full rounded-full"
          style={{ background: "radial-gradient(circle at 70% 40%, hsl(var(--neon-blue) / 0.8), hsl(var(--neon-violet) / 0.35) 50%, transparent 75%)" }} />
      </motion.div>

      <motion.div
        style={{ y: y3 }}
        className="absolute left-[20%] bottom-[10%] h-[220px] w-[220px] rounded-full opacity-50 blur-3xl animate-float-slow will-change-transform"
      >
        <div className="h-full w-full rounded-full"
          style={{ background: "radial-gradient(circle, hsl(var(--neon-rose) / 0.7), transparent 70%)" }} />
      </motion.div>
    </div>
  );
};
