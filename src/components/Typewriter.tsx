import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const Typewriter = ({ text, speed = 55, start = true, className = "" }: {
  text: string; speed?: number; start?: boolean; className?: string;
}) => {
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const active = start && inView;

  // Split text into graphemes (correctly handles emojis)
  const segments = useRef<string[]>([]);
  useEffect(() => {
    segments.current = Array.from(new (Intl as any).Segmenter("en", { granularity: "grapheme" }).segment(text), (s: any) => s.segment);
  }, [text]);

  useEffect(() => {
    if (!active) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setStep(i);
      if (i >= segments.current.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [active, speed]);

  const isEmoji = (str: string) => /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u.test(str);

  return (
    <span ref={ref} className={className}>
      {segments.current.slice(0, step).map((char, index) => (
        isEmoji(char) ? <span key={index} className="no-gradient">{char}</span> : char
      ))}
      <motion.span
        aria-hidden
        className="inline-block w-[2px] ml-1 align-middle bg-neon-pink"
        style={{ height: "0.9em" }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </span>
  );
};
