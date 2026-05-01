import { motion } from "framer-motion";
import { useEffect } from "react";

export const FlowerIntro = ({ onComplete }: { onComplete: () => void }) => {
  // Total animation timeline is ~4.5 seconds
  useEffect(() => {
    try {
      const AC = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
        ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      
      const playPianoNote = (freq: number, delay: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        // Piano-like envelope
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.05); // quick attack
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 3); // slow decay
        
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 3);
      };

      // Play soft arpeggio matching the growth and bloom timing
      // Growth phase
      playPianoNote(261.63, 0.5); // C4
      playPianoNote(329.63, 1.2); // E4
      // Bloom phase
      playPianoNote(392.00, 2.2); // G4
      playPianoNote(523.25, 2.8); // C5 (glow expands)
    } catch {
      // Audio is blocked by browser autoplay policy or not supported
    }

    const timer = setTimeout(() => {
      onComplete();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const petals = Array.from({ length: 12 });

  return (
    <motion.div
      key="flower-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background pointer-events-none overflow-hidden"
    >
      <svg width="300" height="400" viewBox="0 0 300 400" className="overflow-visible">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--neon-pink))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--neon-violet))" stopOpacity="0" />
          </radialGradient>
          <filter id="blur">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Ambient Glow behind flower */}
        <motion.circle
          cx="150"
          cy="150"
          r="80"
          fill="url(#glow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 1 }}
          transition={{ delay: 2.8, duration: 2, ease: "easeInOut" }}
        />

        {/* Stem */}
        <motion.path
          d="M 150 400 Q 120 280 150 150"
          fill="none"
          stroke="hsl(var(--neon-violet) / 0.6)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Left Leaf */}
        <motion.path
          d="M 142 270 Q 90 280 70 230 Q 110 220 142 270"
          fill="hsl(var(--neon-violet) / 0.2)"
          stroke="hsl(var(--neon-violet) / 0.5)"
          strokeWidth="1"
          style={{ originX: "142px", originY: "270px" }}
          initial={{ scale: 0, rotate: 10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.2, duration: 1.6, ease: "easeOut" }}
        />

        {/* Right Leaf */}
        <motion.path
          d="M 158 220 Q 210 210 230 160 Q 190 150 158 220"
          fill="hsl(var(--neon-violet) / 0.2)"
          stroke="hsl(var(--neon-violet) / 0.5)"
          strokeWidth="1"
          style={{ originX: "158px", originY: "220px" }}
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.5, duration: 1.6, ease: "easeOut" }}
        />

        {/* Petals */}
        <g transform="translate(150, 150)">
          {petals.map((_, i) => {
            const angle = (i * 30);
            const isInner = i % 2 !== 0;
            const color = isInner ? "var(--neon-rose)" : "var(--neon-pink)";
            const scaleAmount = isInner ? 0.7 : 1;
            
            return (
              <motion.path
                key={i}
                d="M 0 0 C -20 -40, -35 -70, 0 -95 C 35 -70, 20 -40, 0 0"
                fill={`hsl(${color} / 0.85)`}
                style={{ originX: 0, originY: 0 }}
                initial={{ scale: 0, rotate: angle - 30 }}
                animate={{ scale: scaleAmount, rotate: angle }}
                transition={{
                  delay: 2.2 + (i * 0.04),
                  duration: 1.8,
                  ease: [0.22, 1, 0.36, 1]
                }}
              />
            );
          })}
        </g>

        {/* Center Bud/Stamen */}
        <motion.circle
          cx="150"
          cy="150"
          r="8"
          fill="hsl(var(--gold))"
          filter="url(#blur)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 3, duration: 1 }}
        />
        <motion.circle
          cx="150"
          cy="150"
          r="4"
          fill="#fff"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 3.2, duration: 1 }}
        />
      </svg>
      
      {/* Particle sparkles during bloom */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white blur-[1px]"
            initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              x: (Math.random() - 0.5) * 200,
              y: (Math.random() - 0.5) * 200,
              scale: [0, 1.5, 0]
            }}
            transition={{
              delay: 2.5 + Math.random() * 0.5,
              duration: 2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
