import React from "react";
import { motion } from "framer-motion";

// Elastic structural spring constants for buttons & interaction items
export const springTransition = { type: "spring", stiffness: 450, damping: 28 } as const;

interface MotionProps {
  children: React.ReactNode;
  className?: string;
}

export const SmoothButton: React.FC<MotionProps> = ({
  children,
  className = "",
}) => (
  <motion.div
    whileHover={{ scale: 1.015, y: -1 }}
    whileTap={{ scale: 0.985, y: 0 }}
    transition={springTransition}
    className={className}
  >
    {children}
  </motion.div>
);

export const FadeInLayout: React.FC<MotionProps> = ({
  children,
  className = "",
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);
