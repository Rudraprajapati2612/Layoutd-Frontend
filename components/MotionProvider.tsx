"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/* Framer Motion runs JS-driven animations, so the CSS
 * prefers-reduced-motion override in globals.css can't stop them.
 * reducedMotion="user" makes every motion component respect the OS setting. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
