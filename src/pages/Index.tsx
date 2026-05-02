import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ParticleField } from "@/components/ParticleField";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import { Scene } from "@/components/Scene";
import { Typewriter } from "@/components/Typewriter";
import { FlowerIntro } from "@/components/FlowerIntro";
import React from "react";

// Helper to wrap emojis so they don't get the gradient text effect
const E = ({ children }: { children: React.ReactNode }) => (
  <span className="no-gradient">{children}</span>
);

// Edit this name to personalize the experience.
const HER_NAME = "Zainab";

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const [entered, setEntered] = useState(false);
  const [showFinalNote, setShowFinalNote] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { scrollYProgress } = useScroll();
  const progressBar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Lock scroll until user enters
  useEffect(() => {
    document.body.style.overflow = entered ? "auto" : "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, [entered]);

  const handleEnter = () => {
    setEntered(true);
    // Soft cinematic ambient tone — generated WebAudio (no external file)
    try {
      const AC = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
        ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 0.0;
      master.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 4);
      master.connect(ctx.destination);

      // Bright, uplifting ambient C Major 7 chord
      const freqs = [130.81, 196.00, 246.94, 329.63];
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = i === 3 ? "triangle" : "sine";
        o.frequency.value = f;
        const g = ctx.createGain();
        g.gain.value = i === 3 ? 0.08 : 0.18;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.08 + i * 0.03;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 1.5;
        lfo.connect(lfoGain).connect(o.frequency);
        o.connect(g).connect(master);
        o.start(); lfo.start();
      });
    } catch { /* silent — audio is optional */ }
  };

  return (
    <main className="relative grain text-foreground">
      {/* Scroll progress bar */}
      <motion.div
        style={{ width: progressBar }}
        className="fixed left-0 top-0 z-50 h-[2px] bg-gradient-to-r from-neon-pink via-neon-violet to-neon-blue"
      />

      {/* Persistent background elements */}
      <div className="pointer-events-none fixed inset-0 z-0 aurora-bg overflow-hidden">
        <FloatingOrbs />
        <div className="absolute inset-0">
          <ParticleField density={50} />
        </div>
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 40%, hsl(var(--background) / 0.85) 100%)" }}
        />
      </div>

      {/* ============ ENTRY OVERLAY ============ */}
      <AnimatePresence mode="wait">
        {!entered && !introComplete && (
          <FlowerIntro key="flower" onComplete={() => setIntroComplete(true)} />
        )}

        {!entered && introComplete && (
          <motion.div
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/95 px-6"
          >
            <FloatingOrbs />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="font-serif-luxe text-center text-3xl font-light leading-tight text-foreground sm:text-4xl glow-soft will-change-[transform,opacity]"
            >
              Hey… I made something for you <E>👀</E>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1.4 }}
              className="mt-6 text-center text-sm font-light tracking-[0.3em] text-muted-foreground uppercase"
            >
              A small story · scroll to play
            </motion.p>

            <motion.button
              onClick={handleEnter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.2, duration: 1.4 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group relative mt-14 overflow-hidden rounded-full px-10 py-4 glass glow-bloom"
            >
              <span className="relative z-10 font-sans-luxe text-sm tracking-[0.4em] text-foreground uppercase">
                Tap to begin
              </span>
              <motion.span
                aria-hidden
                className="absolute inset-0 -z-0"
                animate={{ background: [
                  "radial-gradient(circle at 0% 50%, hsl(var(--neon-pink)/0.4), transparent 60%)",
                  "radial-gradient(circle at 100% 50%, hsl(var(--neon-violet)/0.4), transparent 60%)",
                  "radial-gradient(circle at 0% 50%, hsl(var(--neon-blue)/0.4), transparent 60%)",
                ] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{ delay: 4, duration: 2 }}
              className="absolute bottom-10 text-[10px] tracking-[0.4em] text-muted-foreground uppercase"
            >
              with sound · best on headphones
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ STORY ============ */}
      <div aria-hidden={!entered}>
        {/* Hero */}
        <Scene align="center" parallax={false}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: entered ? 1 : 0 }}
            transition={{ duration: 2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative text-center"
          >
            <p className="font-sans-luxe text-xs tracking-[0.5em] text-muted-foreground uppercase">A film for one</p>
            <h2 className="mt-8 font-serif-luxe text-5xl font-light italic leading-[1.05] text-foreground sm:text-6xl">
              Once upon a <br />
              <span className="text-aurora">very special day…</span>
            </h2>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mt-16 h-10 w-[1px] bg-gradient-to-b from-neon-violet to-transparent"
            />
            <p className="mt-3 text-[10px] tracking-[0.4em] text-muted-foreground uppercase">scroll</p>
          </motion.div>
        </Scene>

        {/* Intro sequence */}
        <Scene>
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-sans-luxe text-xs tracking-[0.5em] text-muted-foreground uppercase"
            >
              It started quietly…
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 font-serif-luxe text-3xl font-light italic leading-snug text-foreground sm:text-4xl"
            >
              like any other day <br />
              <span className="text-aurora">But something about it felt different <E>👀</E></span>
            </motion.h3>
          </div>
        </Scene>

        <Scene>
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-sans-luxe text-xs tracking-[0.5em] text-muted-foreground uppercase"
            >
              and then —
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 font-serif-luxe text-3xl font-light italic leading-snug text-foreground sm:text-4xl"
            >
              Almost like the world was waiting <br />
              for a <span className="text-aurora">cutie to born…</span> <br /> <br />
              <span className="text-xs font-sans-luxe tracking-[0.2em] opacity-70">
                someone who makes everything a little softer, <br />
                a little brighter <E>✨</E>
              </span>
            </motion.h3>
          </div>
        </Scene>

        {/* Name reveal */}
        <NameReveal name={HER_NAME} />

        {/* Memory scenes */}
        <Scene>
          <MemoryCard
            kicker="Chapter I"
            line="You know what’s funny? Some people walk into life and change nothing…"
            highlight={<>and then there are people like you who don’t even try — yet somehow make everything better <E>😭💖</E></>}
          />
        </Scene>

        <Scene>
          <MemoryCard
            kicker="Chapter II"
            line="It’s not just about today. It’s about all the little things. the way you smile, the way you talk, the way you just exist…"
            highlight={<>and somehow make people feel lighter <E>🥹✨</E></>}
          />
        </Scene>

        <Scene>
          <MemoryCard
            kicker="Chapter III"
            line="And honestly… I believe Allah chose a beautiful day to bring someone like you into this world."
            highlight={<>the day you were born <E>🤭🌸</E></>}
          />
        </Scene>

        <Scene>
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-sans-luxe text-xs tracking-[0.5em] text-muted-foreground uppercase"
            >
              today is different
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 font-serif-luxe text-3xl font-light italic leading-snug text-foreground sm:text-4xl"
            >
              because today… is yours. <br />
              No stress, No worries. <br /> <br />
              <span className="text-aurora">just good vibes and full princess energy <E>👑</E></span>
            </motion.h3>
          </div>
        </Scene>
        
        <Scene>
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              className="font-sans-luxe text-xs tracking-[0.5em] text-muted-foreground uppercase"
            >
              let's talk about you
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              className="mt-8 font-serif-luxe text-3xl font-light italic leading-snug text-foreground sm:text-4xl will-change-[transform,opacity]"
            >
              Like how are you even real? <E>😭</E> <br /><br />
              That smile? <span className="text-aurora">Illegal.</span><br />
              That vibe? <span className="text-aurora">Addictive.</span><br />
              Those little quirks? <span className="text-aurora">Unforgettable. <E>🫠💖</E></span>
            </motion.h3>
          </div>
        </Scene>

        {/* Tap-to-reveal hidden card */}
        <Scene>
          <RevealCard />
        </Scene>

        {/* Typewriter line */}
        <Scene>
          <div className="text-center">
            <p className="font-sans-luxe text-xs tracking-[0.5em] text-muted-foreground uppercase">a thought I saved for today</p>
            <h3 className="mt-8 font-serif-luxe text-3xl font-light italic leading-snug text-foreground sm:text-4xl glow-soft min-h-[6rem]">
              And somehow… <br />
              <span className="text-aurora inline-block mt-4">
                <Typewriter text="without even trying, you’ve taken a very special place in my heart 🤍" speed={45} start={entered} />
              </span>
            </h3>
          </div>
        </Scene>

        {/* Climax */}
        <Climax />

        {/* Final message */}
        <Scene parallax={false}>
          <div className="text-center">
            <p className="font-sans-luxe text-xs tracking-[0.5em] text-muted-foreground uppercase">final note</p>
            <h3 className="mt-8 font-serif-luxe text-3xl font-light italic leading-snug text-foreground sm:text-4xl">
              So today… smile a little extra, <br /> laugh a little louder <br /> <br />
              <span className="text-aurora">because you’re not just loved — you’re genuinely appreciated <E>😌💖</E></span>
            </h3>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowFinalNote(true)}
              className="mt-12 rounded-full px-8 py-3 glass text-sm tracking-[0.3em] uppercase font-sans-luxe glow-bloom"
            >
              One last thing…
            </motion.button>
          </div>
        </Scene>

        {/* Closing fade-to-black */}
        <Scene parallax={false}>
          <div className="text-center opacity-60">
            <p className="mt-3 text-[10px] tracking-[0.4em] text-muted-foreground uppercase">made with love</p>
          </div>
        </Scene>
      </div>

      {/* Final note overlay */}
      <AnimatePresence>
        {showFinalNote && (
          <motion.div
            key="finalnote"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 px-6 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.92, filter: "blur(20px)", opacity: 0 }}
              animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-md rounded-3xl glass p-10 text-center glow-bloom"
            >
              <div className="mb-4 text-3xl">💌</div>
              <p className="font-serif-luxe text-xl sm:text-2xl font-light italic leading-snug">
                Stay exactly the way you are… <br />
                that’s already more than enough <E>✨</E> <br /><br />
                <span className="text-sm font-sans-luxe tracking-widest opacity-70">
                  Sending you an unreasonable amount of love, hugs, and all the good vibes in the universe… <br /><br />
                  because honestly, you deserve nothing less <E>💕🌹✨</E>
                </span>
              </p>
              <button
                onClick={() => setShowFinalNote(false)}
                className="mt-8 text-[10px] tracking-[0.4em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} hidden />
    </main>
  );
};

/* ---------- Name reveal ---------- */
const NameReveal = ({ name }: { name: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1.05, 1.4]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[120svh] items-center justify-center overflow-hidden px-6">
      <FloatingOrbs />
      <motion.div style={{ scale, opacity }} className="relative text-center will-change-[transform,opacity]">
        <p className="font-sans-luxe text-xs tracking-[0.5em] text-muted-foreground uppercase mb-8">her name</p>
        <h2 className="font-serif-luxe text-7xl font-light leading-none sm:text-8xl">
          {name.split("").map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block text-aurora glow-soft will-change-[transform,opacity]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {ch}
            </motion.span>
          ))}
        </h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 h-[1px] w-40 origin-center bg-gradient-to-r from-transparent via-neon-pink to-transparent"
        />
      </motion.div>
    </section>
  );
};

/* ---------- Memory card ---------- */
const MemoryCard = ({ kicker, line, highlight }: { kicker: string; line: string; highlight: React.ReactNode }) => (
  <div className="text-center">
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="font-sans-luxe text-xs tracking-[0.5em] text-muted-foreground uppercase"
    >
      {kicker}
    </motion.p>
    <motion.h3
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8 font-serif-luxe text-3xl font-light italic leading-snug text-foreground sm:text-4xl will-change-[transform,opacity]"
    >
      {line} <br />
      <span className="text-aurora">{highlight}</span>
    </motion.h3>
  </div>
);

/* ---------- Tap-to-reveal hidden card ---------- */
const RevealCard = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="text-center">
      <p className="font-sans-luxe text-xs tracking-[0.5em] text-muted-foreground uppercase mb-8">a secret</p>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="relative mx-auto block w-full max-w-sm cursor-pointer overflow-hidden rounded-3xl glass p-8 text-left glow-bloom perspective-1000"
        whileTap={{ scale: 0.98 }}
        whileHover={{ y: -4 }}
      >
        <motion.div
          animate={{ rotateY: open ? 180 : 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative min-h-[140px] preserve-3d"
        >
          <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center text-center" style={{ backfaceVisibility: "hidden" }}>
            <div className="text-3xl mb-3">✨</div>
            <p className="font-serif-luxe text-lg italic text-foreground/90">tap to reveal</p>
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="font-serif-luxe text-lg sm:text-xl italic leading-snug text-foreground">
              "I swear, you have this soft magic about you… <br />
              <span className="text-aurora">the kind that makes everything feel lighter, calmer, and way happier just by existing <E>🥹✨</E>"</span>
            </p>
          </div>
        </motion.div>
      </motion.button>
    </div>
  );
};

/* ---------- Climax ---------- */
const Climax = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1.15, 1.6]);
  const blur = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [24, 0, 0, 24]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  // Confetti pieces
  const confetti = Array.from({ length: 36 }, (_, i) => i);

  return (
    <section ref={ref} className="relative flex min-h-[140svh] items-center justify-center overflow-hidden px-6">
      <FloatingOrbs />

      {/* Slow-motion confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((i) => {
          const left = (i * 137.5) % 100;
          const delay = (i % 8) * 0.4;
          const dur = 6 + (i % 5);
          const colors = ["hsl(var(--neon-pink))", "hsl(var(--neon-violet))", "hsl(var(--neon-blue))", "hsl(var(--gold))"];
          const color = colors[i % colors.length];
          const size = 6 + (i % 4) * 2;
          return (
            <motion.span
              key={i}
              className="absolute top-[-10%] rounded-sm"
              style={{ left: `${left}%`, width: size, height: size * 0.4, background: color, boxShadow: `0 0 12px ${color}` }}
              initial={{ y: -20, rotate: 0, opacity: 0 }}
              whileInView={{ y: "120vh", rotate: 540, opacity: [0, 1, 1, 0] }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: dur, delay, ease: [0.4, 0, 0.6, 1], repeat: Infinity, repeatDelay: 1.5 }}
            />
          );
        })}
      </div>

      <motion.div style={{ scale, filter, opacity }} className="relative text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6 }}
          className="font-sans-luxe text-xs tracking-[0.5em] text-muted-foreground uppercase mb-6"
        >
          and so —
        </motion.p>
        <h2 className="font-serif-luxe text-5xl font-light leading-[1.05] sm:text-7xl">
          <span className="text-aurora glow-soft">Happy</span> <br />
          <span className="text-aurora glow-soft">Birthday</span> <span className="inline-block">🎉</span>
        </h2>
      </motion.div>
    </section>
  );
};

export default Index;
