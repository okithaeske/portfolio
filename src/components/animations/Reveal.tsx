"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  once?: boolean;
  className?: string;
  disabled?: boolean;
  amount?: number | "some" | "all";
};

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  x = 0,
  once = true,
  className,
  disabled = false,
  amount = 0.2,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const inView = useInView(ref, { once, margin: "0px 0px -10% 0px", amount });
  const shouldAnimate = mounted && !prefersReducedMotion && !disabled;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={shouldAnimate ? "hidden" : false}
      animate={shouldAnimate ? (inView ? "visible" : "hidden") : "visible"}
      variants={{
        hidden: { opacity: 0, y, x },
        visible: { opacity: 1, y: 0, x: 0 },
      }}
      transition={{ duration: 0.6, ease: "easeOut", delay: shouldAnimate ? delay / 1000 : 0 }}
      style={shouldAnimate ? { willChange: "opacity, transform" } : undefined}
    >
      {children}
    </motion.div>
  );
}
