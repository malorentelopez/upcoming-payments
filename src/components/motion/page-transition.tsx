"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { useMotionEntrance } from "@/components/motion/motion-entrance";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  /** Override context; when false, content is visible immediately (better LCP). */
  entrance?: boolean;
}

export function PageTransition({
  children,
  className,
  entrance,
}: PageTransitionProps) {
  const reduceMotion = useReducedMotion();
  const contextEntrance = useMotionEntrance();
  const shouldAnimate = entrance ?? contextEntrance;

  if (reduceMotion || !shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerListProps {
  children: ReactNode;
  className?: string;
  entrance?: boolean;
}

export function StaggerList({ children, className, entrance }: StaggerListProps) {
  const reduceMotion = useReducedMotion();
  const contextEntrance = useMotionEntrance();
  const shouldAnimate = entrance ?? contextEntrance;

  if (reduceMotion || !shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.04 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  entrance,
}: {
  children: ReactNode;
  className?: string;
  entrance?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const contextEntrance = useMotionEntrance();
  const shouldAnimate = entrance ?? contextEntrance;

  if (reduceMotion || !shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 6 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
