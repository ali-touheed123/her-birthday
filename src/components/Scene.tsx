import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * A single cinematic scene panel. Animates in with blur->sharp + scroll parallax.
 */
export const Scene = ({
  children,
  align = "center",
  className = "",
  parallax = true,
}: {
  children: ReactNode;
  align?: "center" | "start" | "end";
  className?: string;
  parallax?: boolean;
}) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [12, 0, 0, 12]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 1.04]);

  const justify = align === "start" ? "justify-start" : align === "end" ? "justify-end" : "justify-center";

  return (
    <section
      ref={ref}
      className={`relative flex min-h-[100svh] w-full ${justify} items-center px-6 py-24 ${className}`}
    >
      <motion.div
        style={parallax ? { y, opacity, filter, scale } : undefined}
        className="relative z-10 mx-auto w-full max-w-xl"
      >
        {children}
      </motion.div>
    </section>
  );
};
