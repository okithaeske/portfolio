"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollPin({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  return (
    <section className="py-24 px-4">
      <div ref={ref} className="sticky top-20">
        <motion.div style={{ y, opacity }}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}


