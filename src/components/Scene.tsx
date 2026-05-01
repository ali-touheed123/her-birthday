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
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 1.02]);

  const justify = align === "start" ? "justify-start" : align === "end" ? "justify-end" : "justify-center";

  return (
    <section
      ref={ref}
      className={`relative flex min-h-[100svh] w-full ${justify} items-center px-6 py-24 ${className}`}
    >
      <motion.div
        style={parallax ? { y, opacity, scale } : undefined}
        className="relative z-10 mx-auto w-full max-w-xl"
      >
        {children}
      </motion.div>
    </section>
  );
};
