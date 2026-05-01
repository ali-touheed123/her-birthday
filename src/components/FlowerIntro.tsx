import { motion } from "framer-motion";
import { useEffect } from "react";

const Petal = ({ index, total, layer, delay }: { index: number; total: number; layer: number; delay: number }) => {
  const angle = (index / total) * 360;
  // Offset rotation for alternate layers so they interlock perfectly
  const offsetAngle = layer % 2 === 0 ? angle : angle + (360 / total) / 2;
  
  // Outer layer blooms wide (rotateX: 15), inner layer stands up (rotateX: 75)
  const finalRotateX = layer === 0 ? 15 : layer === 1 ? 40 : layer === 2 ? 60 : 75;
  const scale = layer === 0 ? 1 : layer === 1 ? 0.75 : layer === 2 ? 0.5 : 0.35;
  
  const gradientId = layer === 0 ? "outerGrad" : layer === 1 ? "midGrad" : "innerGrad";

  return (
    <motion.div
      className="absolute bottom-0 left-1/2 w-[120px] h-[260px] -ml-[60px] origin-bottom"
      style={{ rotateZ: offsetAngle }}
    >
      <motion.div
        className="w-full h-full origin-bottom"
        initial={{ rotateX: 110, scale: 0.1, opacity: 0 }}
        animate={{ rotateX: finalRotateX, scale: scale, opacity: 1 }}
        transition={{ delay, duration: 3.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg viewBox="0 0 120 260" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          {/* Realistic Lotus Petal Path */}
          <path
            d="M 60 260 C 10 160, -20 40, 60 0 C 140 40, 110 160, 60 260"
            fill={`url(#${gradientId})`}
            opacity={0.95}
          />
          {/* Petal Center Vein for realism */}
          <path
            d="M 60 260 Q 60 130 60 20"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
            fill="none"
            className="opacity-50"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export const FlowerIntro = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    try {
      const AC = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
        ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      
      const playPianoNote = (freq: number, delay: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 4);
        
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 4);
      };

      // Cinematic piano intro synchronized with the new slow 3D bloom
      playPianoNote(261.63, 0.5); // C4
      playPianoNote(329.63, 1.5); // E4
      playPianoNote(392.00, 2.5); // G4
      playPianoNote(523.25, 3.2); // C5
      playPianoNote(659.25, 4.0); // E5
    } catch { /* ignored */ }

    // Increased timer to allow for the luxurious slow 3D animation
    const timer = setTimeout(() => {
      onComplete();
    }, 6500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      key="flower-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050508] pointer-events-none overflow-hidden"
    >
      {/* Global SVG Defs for rich gradients */}
      <svg className="hidden">
        <defs>
          <linearGradient id="outerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--neon-violet))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0d041c" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="midGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--neon-pink))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(var(--neon-violet))" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="innerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--neon-rose))" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(var(--neon-pink))" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--neon-violet))" />
            <stop offset="100%" stopColor="hsl(var(--neon-blue))" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* 3D Perspective Container */}
      <div className="relative w-full h-full perspective-[1200px]" style={{ transformStyle: 'preserve-3d' }}>
        
        {/* Background ambient glow expanding during bloom */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -ml-[300px] -mt-[300px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, hsl(var(--neon-pink)/0.15) 0%, transparent 60%)" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.8, duration: 4, ease: "easeOut" }}
        />

        {/* Stem growing from the bottom */}
        <motion.svg
          viewBox="0 0 100 400"
          className="absolute top-1/2 left-1/2 w-[100px] h-[400px] -ml-[50px] overflow-visible"
        >
          <motion.path
            d="M 50 400 Q 90 200 50 0"
            fill="none"
            stroke="url(#stemGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3.5, ease: "easeInOut" }}
          />
          {/* Elegant Leaf unfurling */}
          <motion.path
            d="M 50 200 C 130 180, 180 80, 160 30 C 140 80, 80 160, 50 200"
            fill="hsl(var(--neon-violet)/0.3)"
            stroke="hsl(var(--neon-violet)/0.6)"
            strokeWidth="1"
            initial={{ scale: 0, rotate: 15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            style={{ originX: "50px", originY: "200px" }}
            transition={{ delay: 1.5, duration: 2.5, ease: "easeOut" }}
          />
          {/* Left Leaf */}
          <motion.path
            d="M 50 250 C -20 230, -70 130, -50 80 C -30 130, 20 210, 50 250"
            fill="hsl(var(--neon-violet)/0.2)"
            stroke="hsl(var(--neon-violet)/0.5)"
            strokeWidth="1"
            initial={{ scale: 0, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            style={{ originX: "50px", originY: "250px" }}
            transition={{ delay: 2.0, duration: 2.5, ease: "easeOut" }}
          />
        </motion.svg>

        {/* 3D Flower Head */}
        <div 
          className="absolute top-1/2 left-1/2 w-0 h-0" 
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Layer 0 (Outer, dark, large) */}
          {Array.from({ length: 8 }).map((_, i) => <Petal key={`l0-${i}`} index={i} total={8} layer={0} delay={2.0} />)}
          {/* Layer 1 (Mid, pink, slightly smaller) */}
          {Array.from({ length: 8 }).map((_, i) => <Petal key={`l1-${i}`} index={i} total={8} layer={1} delay={2.3} />)}
          {/* Layer 2 (Inner, rose, standing up more) */}
          {Array.from({ length: 8 }).map((_, i) => <Petal key={`l2-${i}`} index={i} total={8} layer={2} delay={2.6} />)}
          {/* Layer 3 (Core, tightly packed) */}
          {Array.from({ length: 6 }).map((_, i) => <Petal key={`l3-${i}`} index={i} total={6} layer={3} delay={2.9} />)}
        </div>

        {/* Glowing Pollen / Magical Sparks emerging from the center */}
        <div className="absolute top-1/2 left-1/2 w-0 h-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`spark-${i}`}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{ boxShadow: "0 0 10px 2px hsl(var(--neon-rose))" }}
              initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1.2, 0],
                opacity: [0, 1, 0],
                x: (Math.random() - 0.5) * 250,
                y: (Math.random() - 0.5) * 250 - 50,
              }}
              transition={{ delay: 3.5 + Math.random() * 1.5, duration: 2.5, ease: "easeOut" }}
            />
          ))}
          {/* Intense Core Light */}
          <motion.div
            className="absolute w-12 h-12 bg-white rounded-full -ml-6 -mt-6 blur-[10px]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 0.8, 0] }}
            transition={{ delay: 3.5, duration: 3, ease: "easeInOut" }}
          />
        </div>
        
      </div>
    </motion.div>
  );
};
