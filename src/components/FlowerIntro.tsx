import { motion } from "framer-motion";
import { useEffect } from "react";

const Petal = ({ index, total, layer, delay }: { index: number; total: number; layer: number; delay: number }) => {
  const angle = (index / total) * 360;
  // Introduce slight organic randomness
  const organicRotate = angle + (Math.random() * 6 - 3);
  const organicScale = 1 + (Math.random() * 0.1 - 0.05);

  const offsetAngle = layer % 2 === 0 ? organicRotate : organicRotate + (360 / total) / 2;
  
  // Outer blooms flat, inner stands up
  const finalRotateX = layer === 0 ? 12 : layer === 1 ? 35 : layer === 2 ? 55 : 75;
  const scale = (layer === 0 ? 1 : layer === 1 ? 0.8 : layer === 2 ? 0.55 : 0.35) * organicScale;
  
  const gradientId = layer === 0 ? "outerGrad" : layer === 1 ? "midGrad" : "innerGrad";

  return (
    <motion.div
      className="absolute bottom-0 left-1/2 w-[120px] h-[260px] -ml-[60px] origin-bottom transform-style-3d"
      style={{ rotateZ: offsetAngle }}
    >
      {/* Bloom animation */}
      <motion.div
        className="w-full h-full origin-bottom transform-style-3d"
        initial={{ rotateX: 110, scale: 0.05, opacity: 0 }}
        animate={{ rotateX: finalRotateX, scale: scale, opacity: 1 }}
        transition={{ delay, duration: 4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Continuous breathing animation (starts after bloom) */}
        <motion.div
          className="w-full h-full origin-bottom"
          animate={{ rotateX: [0, 4, -2, 0] }}
          transition={{ duration: 6 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay: delay + 3 }}
        >
          <svg viewBox="0 0 120 260" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] overflow-visible">
            {/* Translucent Glass Petal Base */}
            <path
              d="M 60 260 C -10 160, -30 50, 60 0 C 150 50, 130 160, 60 260"
              fill={`url(#${gradientId})`}
              opacity={0.85}
            />
            {/* Inner Glow / Thickness Illusion */}
            <path
              d="M 60 260 C -5 160, -20 60, 60 5 C 140 60, 125 160, 60 260"
              fill="url(#innerGlow)"
              opacity={0.6}
            />
            {/* Rim Light Highlight */}
            <path
              d="M 60 260 C -10 160, -30 50, 60 0 C 150 50, 130 160, 60 260"
              stroke="url(#rimLight)"
              strokeWidth="1.5"
              fill="none"
              opacity={0.8}
            />
            {/* Organic Veins */}
            <path
              d="M 60 260 Q 60 140 60 20 M 60 220 Q 40 160 30 100 M 60 220 Q 80 160 90 100"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </motion.div>
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
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 5);
        
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 5);
      };

      playPianoNote(261.63, 0.5); // C4
      playPianoNote(329.63, 1.8); // E4
      playPianoNote(392.00, 3.0); // G4
      playPianoNote(523.25, 4.0); // C5
      playPianoNote(659.25, 4.8); // E5
    } catch { /* ignored */ }

    const timer = setTimeout(() => {
      onComplete();
    }, 7500); // 7.5s for the full majestic intro
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      key="flower-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)", transition: { duration: 2 } }}
      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#07050a] pointer-events-none overflow-hidden"
    >
      {/* Cinematic Lighting Defs */}
      <svg className="hidden">
        <defs>
          <radialGradient id="outerGrad" cx="50%" cy="100%" r="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="30%" stopColor="hsl(var(--neon-pink))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--neon-violet))" stopOpacity="0.1" />
          </radialGradient>
          <radialGradient id="midGrad" cx="50%" cy="100%" r="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="40%" stopColor="hsl(var(--neon-rose))" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(var(--neon-violet))" stopOpacity="0.2" />
          </radialGradient>
          <radialGradient id="innerGrad" cx="50%" cy="100%" r="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="60%" stopColor="hsl(var(--neon-pink))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--neon-rose))" stopOpacity="0.4" />
          </radialGradient>
          <linearGradient id="rimLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--neon-pink))" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--neon-pink))" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--neon-violet))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#07050a" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Global Camera Parallax */}
      <motion.div
        animate={{ rotateY: [-3, 3, -3], rotateX: [10, 14, 10], y: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full perspective-[1400px] flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* Deep background ethereal glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -ml-[400px] -mt-[400px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, hsl(var(--neon-violet)/0.15) 0%, transparent 60%)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.4] }}
          transition={{ duration: 8, ease: "easeInOut" }}
        />

        {/* Stem Container (Swaying) */}
        <motion.div
          className="absolute top-[50%] left-1/2 w-[100px] h-[500px] -ml-[50px] origin-bottom"
          animate={{ rotateZ: [-1, 2, -1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.svg viewBox="0 0 100 500" className="w-full h-full overflow-visible">
            {/* Thick 3D-like Stem */}
            <motion.path
              d="M 50 500 Q 70 250 50 0"
              fill="none"
              stroke="url(#stemGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 4, ease: "easeInOut" }}
            />
            {/* Subtle Translucent Leaf */}
            <motion.path
              d="M 50 300 C 140 280, 180 150, 150 100 C 120 150, 80 250, 50 300"
              fill="hsl(var(--neon-violet)/0.2)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              initial={{ scale: 0, rotate: 10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              style={{ originX: "50px", originY: "300px" }}
              transition={{ delay: 2, duration: 3, ease: "easeOut" }}
            />
          </motion.svg>
        </motion.div>

        {/* Flower Head */}
        <div className="absolute top-1/2 left-1/2 w-0 h-0" style={{ transformStyle: 'preserve-3d' }}>
          {Array.from({ length: 9 }).map((_, i) => <Petal key={`l0-${i}`} index={i} total={9} layer={0} delay={2.0 + i * 0.05} />)}
          {Array.from({ length: 8 }).map((_, i) => <Petal key={`l1-${i}`} index={i} total={8} layer={1} delay={2.8 + i * 0.05} />)}
          {Array.from({ length: 7 }).map((_, i) => <Petal key={`l2-${i}`} index={i} total={7} layer={2} delay={3.6 + i * 0.05} />)}
          {Array.from({ length: 5 }).map((_, i) => <Petal key={`l3-${i}`} index={i} total={5} layer={3} delay={4.2 + i * 0.05} />)}
        </div>

        {/* Central Magical Light Bloom */}
        <div className="absolute top-1/2 left-1/2 w-0 h-0">
          <motion.div
            className="absolute w-24 h-24 rounded-full -ml-12 -mt-12 blur-[15px]"
            style={{ background: "radial-gradient(circle, #fff 0%, hsl(var(--neon-pink)/0.8) 40%, transparent 100%)" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 0.8], opacity: [0, 1, 0.6] }}
            transition={{ delay: 4.5, duration: 4, ease: "easeOut" }}
          />
          
          {/* Depth Blurred Floating Particles */}
          {Array.from({ length: 20 }).map((_, i) => {
            const size = Math.random() * 4 + 2;
            const blur = Math.random() * 3;
            const isNear = blur < 1;
            return (
              <motion.div
                key={`spark-${i}`}
                className="absolute bg-white rounded-full"
                style={{ 
                  width: size, height: size, 
                  filter: `blur(${blur}px)`,
                  boxShadow: isNear ? "0 0 10px 2px hsl(var(--neon-rose))" : "none",
                  zIndex: isNear ? 10 : -1
                }}
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400 - 100,
                }}
                transition={{ delay: 4 + Math.random() * 2, duration: 3 + Math.random() * 2, ease: "easeOut" }}
              />
            );
          })}
        </div>
        
      </div>
    </motion.div>
  );
};
