import { motion } from "framer-motion";
import { useEffect } from "react";

const Petal = ({ index, total, layer, delay }: { index: number; total: number; layer: number; delay: number }) => {
  const angle = (index / total) * 360;
  // Organic variations
  const organicRotate = angle + (Math.random() * 8 - 4);
  const organicScale = 1 + (Math.random() * 0.1 - 0.05);

  const offsetAngle = layer % 2 === 0 ? organicRotate : organicRotate + (360 / total) / 2;
  
  // Layering 3D effect
  const finalRotateX = layer === 0 ? 10 : layer === 1 ? 30 : layer === 2 ? 50 : 70;
  const scale = (layer === 0 ? 1 : layer === 1 ? 0.75 : layer === 2 ? 0.55 : 0.4) * organicScale;
  
  const gradientId = layer === 0 ? "outerGrad" : layer === 1 ? "midGrad" : "innerGrad";

  return (
    <motion.div
      className="absolute bottom-0 left-1/2 w-[200px] h-[300px] -ml-[100px] origin-bottom transform-style-3d"
      style={{ rotateZ: offsetAngle }}
    >
      <motion.div
        className="w-full h-full origin-bottom transform-style-3d"
        initial={{ rotateX: 110, scale: 0.05, opacity: 0 }}
        animate={{ rotateX: finalRotateX, scale: scale, opacity: 1 }}
        transition={{ delay, duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="w-full h-full origin-bottom"
          animate={{ rotateX: [0, 3, -2, 0] }}
          transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay: delay + 2 }}
        >
          <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] overflow-visible">
            {/* Lush Translucent Petal */}
            <path
              d="M 100 300 C 30 180, 10 60, 100 0 C 190 60, 170 180, 100 300"
              fill={`url(#${gradientId})`}
              opacity={0.9}
            />
            {/* Inner Glow / Thickness */}
            <path
              d="M 100 300 C 45 180, 35 70, 100 15 C 165 70, 155 180, 100 300"
              fill="url(#innerGlow)"
              opacity={0.4}
            />
            {/* Soft Rim Light */}
            <path
              d="M 100 300 C 30 180, 10 60, 100 0 C 190 60, 170 180, 100 300"
              stroke="url(#rimLight)"
              strokeWidth="1.5"
              fill="none"
              opacity={0.7}
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
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + delay + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 4);
        
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 4);
      };

      playPianoNote(261.63, 0.2); // C4
      playPianoNote(329.63, 0.8); // E4
      playPianoNote(392.00, 1.4); // G4
      playPianoNote(523.25, 2.0); // C5
      playPianoNote(659.25, 2.5); // E5
    } catch { /* Audio blocked */ }

    const timer = setTimeout(() => {
      onComplete();
    }, 4500); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      key="flower-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.85, filter: "blur(20px)", transition: { duration: 1.5, ease: "easeOut" } }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0b0f] pointer-events-none overflow-hidden"
    >
      {/* Cinematic Lighting Defs - Using absolute 0-size SVG instead of hidden to fix gradient bug */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="outerGrad" cx="50%" cy="100%" r="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
            <stop offset="30%" stopColor="hsl(var(--neon-pink))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--neon-violet))" stopOpacity="0.1" />
          </radialGradient>
          <radialGradient id="midGrad" cx="50%" cy="100%" r="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="hsl(var(--neon-rose))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--neon-violet))" stopOpacity="0.15" />
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
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--neon-pink))" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--neon-violet))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0b0b0f" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Global Camera Parallax */}
      <motion.div
        animate={{ rotateY: [-2, 2, -2], rotateX: [8, 12, 8], y: [0, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full perspective-[1400px] flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* Soft Background Glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -ml-[400px] -mt-[400px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, hsl(var(--neon-violet)/0.1) 0%, transparent 70%)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.3] }}
          transition={{ duration: 5, ease: "easeInOut" }}
        />

        {/* Stem Swaying */}
        <motion.div
          className="absolute top-[50%] left-1/2 w-[100px] h-[500px] -ml-[50px] origin-bottom"
          animate={{ rotateZ: [-1, 1, -1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.svg viewBox="0 0 100 500" className="w-full h-full overflow-visible">
            {/* Elegant Stem Growth */}
            <motion.path
              d="M 50 500 Q 75 250 50 0"
              fill="none"
              stroke="url(#stemGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            {/* Soft Leaves */}
            <motion.path
              d="M 50 280 C 130 260, 160 140, 140 100 C 110 140, 80 230, 50 280"
              fill="hsl(var(--neon-violet)/0.25)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              initial={{ scale: 0, rotate: 10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              style={{ originX: "50px", originY: "280px" }}
              transition={{ delay: 1.0, duration: 2, ease: "easeOut" }}
            />
            <motion.path
              d="M 50 340 C -20 320, -50 200, -30 160 C -10 200, 20 290, 50 340"
              fill="hsl(var(--neon-violet)/0.2)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              initial={{ scale: 0, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              style={{ originX: "50px", originY: "340px" }}
              transition={{ delay: 1.2, duration: 2, ease: "easeOut" }}
            />
          </motion.svg>
        </motion.div>

        {/* 3D Flower Head */}
        <div className="absolute top-1/2 left-1/2 w-0 h-0" style={{ transformStyle: 'preserve-3d' }}>
          {Array.from({ length: 9 }).map((_, i) => <Petal key={`l0-${i}`} index={i} total={9} layer={0} delay={1.2 + i * 0.04} />)}
          {Array.from({ length: 8 }).map((_, i) => <Petal key={`l1-${i}`} index={i} total={8} layer={1} delay={1.7 + i * 0.04} />)}
          {Array.from({ length: 7 }).map((_, i) => <Petal key={`l2-${i}`} index={i} total={7} layer={2} delay={2.1 + i * 0.04} />)}
          {Array.from({ length: 5 }).map((_, i) => <Petal key={`l3-${i}`} index={i} total={5} layer={3} delay={2.4 + i * 0.04} />)}
        </div>

        {/* Central Core Light */}
        <div className="absolute top-1/2 left-1/2 w-0 h-0">
          <motion.div
            className="absolute w-24 h-24 rounded-full -ml-12 -mt-12 blur-[20px]"
            style={{ background: "radial-gradient(circle, #fff 0%, hsl(var(--neon-pink)/0.7) 30%, transparent 100%)" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 0.9], opacity: [0, 0.9, 0.7] }}
            transition={{ delay: 2.2, duration: 3, ease: "easeOut" }}
          />
          
          {/* Depth Blurred Floating Particles */}
          {Array.from({ length: 25 }).map((_, i) => {
            const size = Math.random() * 4 + 2;
            const blur = Math.random() * 3.5;
            const isNear = blur < 1;
            return (
              <motion.div
                key={`spark-${i}`}
                className="absolute bg-white rounded-full"
                style={{ 
                  width: size, height: size, 
                  filter: `blur(${blur}px)`,
                  boxShadow: isNear ? "0 0 10px 2px hsl(var(--neon-pink))" : "none",
                  zIndex: isNear ? 10 : -1
                }}
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.7, 0],
                  x: (Math.random() - 0.5) * 450,
                  y: (Math.random() - 0.5) * 450 - 100,
                }}
                transition={{ delay: 2 + Math.random() * 2, duration: 3 + Math.random() * 2, ease: "easeOut" }}
              />
            );
          })}
        </div>
        
      </motion.div>
    </motion.div>
  );
};
