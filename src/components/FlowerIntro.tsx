import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";

/* ───────────────────────────────────────────────────────────────────────────
   Premium cinematic flower intro
   - Organic curved stem grows from bottom
   - Two soft leaves unfurl mid-growth
   - Bud forms, then petals bloom in 3 depth layers (back → mid → front)
   - Each petal has gradient shading + rim light + subtle thickness
   - Soft bloom core, glowing pollen, drifting depth particles
   - Gentle breathing + camera parallax loop after bloom
   ─────────────────────────────────────────────────────────────────────────── */

const EASE_CINEMA: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ── Single 3D-feeling petal ───────────────────────────────────────────────
const Petal = ({
  index,
  total,
  layer,
  delay,
}: {
  index: number;
  total: number;
  layer: 0 | 1 | 2;
  delay: number;
}) => {
  // Stable per-petal randomness (no re-roll on re-render)
  const jitter = useMemo(
    () => ({
      rot: (Math.random() - 0.5) * 6,
      scl: 1 + (Math.random() - 0.5) * 0.08,
      sway: 4 + Math.random() * 3,
      swayDur: 6 + Math.random() * 3,
    }),
    []
  );

  const baseAngle = (index / total) * 360;
  const offset = layer % 2 === 0 ? 0 : 360 / total / 2;
  const rotateZ = baseAngle + offset + jitter.rot;

  // Outer layer = flatter (back petals), inner = lifted (front petals)
  const tiltX = layer === 0 ? 18 : layer === 1 ? 42 : 62;
  const baseScale =
    (layer === 0 ? 1 : layer === 1 ? 0.78 : 0.55) * jitter.scl;

  const gradId =
    layer === 0 ? "petalOuter" : layer === 1 ? "petalMid" : "petalInner";

  return (
    <motion.div
      className="absolute bottom-0 left-1/2 -ml-[55px] w-[110px] h-[230px] origin-bottom"
      style={{ transformStyle: "preserve-3d", rotateZ }}
    >
      {/* Bloom: bud → unfold (rotateX from curled to open, scale from 0 to baseScale) */}
      <motion.div
        className="w-full h-full origin-bottom"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ rotateX: 115, scale: 0.06, opacity: 0 }}
        animate={{ rotateX: tiltX, scale: baseScale, opacity: 1 }}
        transition={{ delay, duration: 2.6, ease: EASE_CINEMA }}
      >
        {/* Continuous breathing once bloomed */}
        <motion.div
          className="w-full h-full origin-bottom"
          animate={{ rotateX: [0, jitter.sway, -jitter.sway * 0.5, 0] }}
          transition={{
            duration: jitter.swayDur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + 2.6,
          }}
        >
          <svg
            viewBox="0 0 110 230"
            className="w-full h-full overflow-visible drop-shadow-[0_14px_24px_rgba(180,80,200,0.25)]"
          >
            {/* Soft cast shadow under petal for depth */}
            <ellipse cx="55" cy="225" rx="34" ry="5" fill="rgba(0,0,0,0.35)" />

            {/* Petal body — teardrop with curved silhouette */}
            <path
              d="M 55 228
                 C 8 175, -4 80, 55 4
                 C 114 80, 102 175, 55 228 Z"
              fill={`url(#${gradId})`}
              opacity={0.92}
            />

            {/* Inner luminous core (translucent depth) */}
            <path
              d="M 55 220
                 C 22 170, 12 90, 55 18
                 C 98 90, 88 170, 55 220 Z"
              fill="url(#petalInnerGlow)"
              opacity={0.7}
            />

            {/* Rim light along edge */}
            <path
              d="M 55 228 C 8 175, -4 80, 55 4 C 114 80, 102 175, 55 228 Z"
              fill="none"
              stroke="url(#petalRim)"
              strokeWidth="1.4"
              opacity={0.85}
            />

            {/* Specular crease running down center */}
            <path
              d="M 55 12 Q 55 110 55 220"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />

            {/* Subtle vein detail */}
            <path
              d="M 55 215 Q 38 150 30 95 M 55 215 Q 72 150 80 95"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────
export const FlowerIntro = ({ onComplete }: { onComplete: () => void }) => {
  // Cinematic ambient piano arpeggio (Web Audio, no asset needed)
  useEffect(() => {
    try {
      const AC =
        (window as unknown as { AudioContext?: typeof AudioContext })
          .AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AC();
      const playNote = (freq: number, t: number, dur = 4.5, vol = 0.13) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(freq, ctx.currentTime + t);
        g.gain.setValueAtTime(0, ctx.currentTime + t);
        g.gain.linearRampToValueAtTime(vol, ctx.currentTime + t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0008, ctx.currentTime + t + dur);
        o.connect(g).connect(ctx.destination);
        o.start(ctx.currentTime + t);
        o.stop(ctx.currentTime + t + dur);
      };
      // Soft Cmaj7 arpeggio matching bloom timing
      playNote(261.63, 0.3); // C4
      playNote(329.63, 1.2); // E4
      playNote(392.0, 2.1); // G4
      playNote(493.88, 3.0); // B4
      playNote(659.25, 3.8, 5, 0.1); // E5
    } catch {
      /* audio is optional */
    }

    // Total cinematic length ≈ 6.5s (stem 0–2.5, bloom 2.5–5, hold 5–6.5)
    const t = setTimeout(onComplete, 6500);
    return () => clearTimeout(t);
  }, [onComplete]);

  // Pre-computed depth particles
  const sparks = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => {
        const blur = Math.random() * 3.5;
        const near = blur < 1;
        return {
          id: i,
          size: Math.random() * 4 + 2,
          blur,
          near,
          dx: (Math.random() - 0.5) * 480,
          dy: (Math.random() - 0.5) * 460 - 80,
          delay: 3.6 + Math.random() * 2.2,
          dur: 3 + Math.random() * 2.5,
        };
      }),
    []
  );

  return (
    <motion.div
      key="flower-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.06,
        filter: "blur(24px)",
        transition: { duration: 1.8, ease: EASE_CINEMA },
      }}
      transition={{ duration: 1.4, ease: EASE_CINEMA }}
      className="fixed inset-0 z-50 overflow-hidden bg-[#07050a] pointer-events-none"
    >
      {/* SVG gradient & filter library */}
      <svg className="absolute h-0 w-0">
        <defs>
          {/* Petal gradients — lighter near base (toward center of flower), deeper at tip */}
          <radialGradient id="petalOuter" cx="50%" cy="92%" r="95%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="35%" stopColor="hsl(var(--neon-rose))" stopOpacity="0.75" />
            <stop offset="75%" stopColor="hsl(var(--neon-pink))" stopOpacity="0.55" />
            <stop offset="100%" stopColor="hsl(var(--neon-violet))" stopOpacity="0.25" />
          </radialGradient>
          <radialGradient id="petalMid" cx="50%" cy="95%" r="95%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="40%" stopColor="hsl(var(--neon-rose))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(var(--neon-violet))" stopOpacity="0.4" />
          </radialGradient>
          <radialGradient id="petalInner" cx="50%" cy="98%" r="95%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="55%" stopColor="hsl(var(--neon-pink))" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(var(--neon-rose))" stopOpacity="0.55" />
          </radialGradient>

          <radialGradient id="petalInnerGlow" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="hsl(var(--neon-pink))" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="petalRim" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="60%" stopColor="hsl(var(--neon-pink))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(var(--neon-violet))" stopOpacity="0" />
          </linearGradient>

          {/* Stem gradient — green-violet luminous */}
          <linearGradient id="stemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--neon-violet))" stopOpacity="0.05" />
            <stop offset="40%" stopColor="hsl(280 60% 55%)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="hsl(var(--neon-rose))" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--neon-violet))" stopOpacity="0.55" />
            <stop offset="100%" stopColor="hsl(var(--neon-pink))" stopOpacity="0.15" />
          </linearGradient>
        </defs>
      </svg>

      {/* Deep ambient glow behind everything */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -ml-[450px] -mt-[450px] rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--neon-violet)/0.18) 0%, hsl(var(--neon-pink)/0.10) 35%, transparent 70%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0.55] }}
        transition={{ duration: 6, ease: "easeInOut" }}
      />

      {/* Camera rig — slow parallax sway */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: 1600, transformStyle: "preserve-3d" }}
        animate={{ rotateY: [-2.5, 2.5, -2.5], rotateX: [10, 13, 10], y: [0, -8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Stem (curved, growing) */}
        <motion.div
          className="absolute left-1/2 top-[52%] h-[46vh] w-[120px] -ml-[60px] origin-bottom"
          animate={{ rotateZ: [-1.2, 1.8, -1.2] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 120 500" preserveAspectRatio="none" className="h-full w-full overflow-visible">
            {/* Soft stem glow */}
            <motion.path
              d="M 60 500 C 78 360, 44 220, 60 0"
              stroke="hsl(var(--neon-pink))"
              strokeOpacity="0.35"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
              filter="blur(6px)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 2.5, ease: EASE_CINEMA }}
            />
            {/* Main stem */}
            <motion.path
              d="M 60 500 C 78 360, 44 220, 60 0"
              stroke="url(#stemGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, ease: EASE_CINEMA }}
            />
            {/* Highlight on stem */}
            <motion.path
              d="M 60 500 C 78 360, 44 220, 60 0"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, ease: EASE_CINEMA }}
            />

            {/* Leaf — left */}
            <motion.path
              d="M 62 320 C 8 305, -10 230, 18 195 C 32 235, 52 280, 62 320 Z"
              fill="url(#leafGrad)"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="0.8"
              initial={{ scale: 0, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              style={{ transformOrigin: "62px 320px" }}
              transition={{ delay: 1.4, duration: 1.6, ease: EASE_CINEMA }}
            />
            {/* Leaf — right */}
            <motion.path
              d="M 58 245 C 112 232, 132 165, 104 132 C 90 170, 70 210, 58 245 Z"
              fill="url(#leafGrad)"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="0.8"
              initial={{ scale: 0, opacity: 0, rotate: 20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              style={{ transformOrigin: "58px 245px" }}
              transition={{ delay: 1.8, duration: 1.6, ease: EASE_CINEMA }}
            />
          </svg>
        </motion.div>

        {/* Flower head — anchored at top of stem */}
        <div
          className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-[46vh]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Bud (visible briefly before petals bloom out from it) */}
          <motion.div
            className="absolute left-0 top-0 -ml-3 -mt-3 h-6 w-6 rounded-full"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--neon-pink)) 0%, hsl(var(--neon-violet)) 70%, transparent 100%)",
              boxShadow: "0 0 24px hsl(var(--neon-pink) / 0.7)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 1.4, 0.4],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              delay: 2.3,
              duration: 1.4,
              times: [0, 0.3, 0.7, 1],
              ease: EASE_CINEMA,
            }}
          />

          {/* Petals — back layer (largest, flattest) */}
          {Array.from({ length: 9 }).map((_, i) => (
            <Petal key={`l0-${i}`} index={i} total={9} layer={0} delay={2.6 + i * 0.04} />
          ))}
          {/* Mid layer */}
          {Array.from({ length: 7 }).map((_, i) => (
            <Petal key={`l1-${i}`} index={i} total={7} layer={1} delay={3.1 + i * 0.045} />
          ))}
          {/* Front layer (smallest, most lifted) */}
          {Array.from({ length: 5 }).map((_, i) => (
            <Petal key={`l2-${i}`} index={i} total={5} layer={2} delay={3.55 + i * 0.05} />
          ))}

          {/* Pollen / glowing core */}
          <motion.div
            className="absolute left-0 top-0 -ml-9 -mt-9 h-[72px] w-[72px] rounded-full blur-[10px]"
            style={{
              background:
                "radial-gradient(circle, #fff 0%, hsl(var(--neon-pink) / 0.85) 35%, transparent 75%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0.85] }}
            transition={{ delay: 3.8, duration: 2.4, ease: "easeOut" }}
          />
          {/* Tiny gold pollen dots */}
          <motion.div
            className="absolute left-0 top-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.4, duration: 1.2 }}
          >
            {Array.from({ length: 7 }).map((_, i) => {
              const a = (i / 7) * Math.PI * 2;
              const r = 10 + Math.random() * 6;
              return (
                <div
                  key={i}
                  className="absolute h-[4px] w-[4px] rounded-full"
                  style={{
                    left: Math.cos(a) * r,
                    top: Math.sin(a) * r,
                    background: "hsl(var(--gold))",
                    boxShadow: "0 0 8px hsl(var(--gold))",
                  }}
                />
              );
            })}
          </motion.div>
        </div>

        {/* Depth particles around flower */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
          {sparks.map((s) => (
            <motion.div
              key={s.id}
              className="absolute rounded-full bg-white"
              style={{
                width: s.size,
                height: s.size,
                filter: `blur(${s.blur}px)`,
                boxShadow: s.near ? "0 0 10px 2px hsl(var(--neon-rose))" : "none",
                zIndex: s.near ? 10 : -1,
              }}
              initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.85, 0],
                x: s.dx,
                y: s.dy,
              }}
              transition={{ delay: s.delay, duration: s.dur, ease: "easeOut" }}
            />
          ))}
        </div>
      </motion.div>

      {/* Soft vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.85) 100%)",
        }}
      />
    </motion.div>
  );
};
