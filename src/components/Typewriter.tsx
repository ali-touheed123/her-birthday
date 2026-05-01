import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const Typewriter = ({ text, speed = 55, start = true, className = "" }: {
  text: string; speed?: number; start?: boolean; className?: string;
}) => {
  const [shown, setShown] = useState("");
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const active = start && inView;

  useEffect(() => {
    if (!active) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [active, text, speed]);

  return (
    <span ref={ref} className={className}>
      {shown}
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
