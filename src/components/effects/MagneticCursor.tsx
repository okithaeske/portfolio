"use client";
import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const x = useSpring(cursorX, { stiffness: 300, damping: 30, mass: 0.6 });
  const y = useSpring(cursorY, { stiffness: 300, damping: 30, mass: 0.6 });
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.matchMedia) {
      const frame = requestAnimationFrame(() => setEnabled(true));
      return () => cancelAnimationFrame(frame);
    }

    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      const interactive = !coarsePointer.matches && !reducedMotion.matches;
      setEnabled(interactive);
      if (!interactive) document.body.classList.remove('cursor-magnet');
    };

    update();

    const listeners = [coarsePointer, reducedMotion];
    listeners.forEach((mq) => {
      if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', update);
      } else {
        mq.addListener?.(update);
      }
    });

    return () => {
      listeners.forEach((mq) => {
        if (typeof mq.removeEventListener === 'function') {
          mq.removeEventListener('change', update);
        } else {
          mq.removeListener?.(update);
        }
      });
      document.body.classList.remove('cursor-magnet');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseenter', onEnter);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [cursorX, cursorY, enabled]);

  useEffect(() => {
    if (!enabled) return;
    const handleHover = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-magnetic]') as HTMLElement | null;
      document.body.classList.toggle('cursor-magnet', Boolean(target));
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const strength = Number(target.getAttribute('data-magnetic')) || 0.25;
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      target.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    };
    const reset = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-magnetic]') as HTMLElement | null;
      if (target) target.style.transform = '';
    };
    window.addEventListener('mousemove', handleHover);
    window.addEventListener('mouseout', reset);
    return () => {
      window.removeEventListener('mousemove', handleHover);
      window.removeEventListener('mouseout', reset);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-[60] size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/50 bg-cyan-400/10 backdrop-blur-[1px] transition-opacity duration-200"
      style={{ left: x, top: y, opacity: visible ? 1 : 0 }}
      aria-hidden
    />
  );
}


