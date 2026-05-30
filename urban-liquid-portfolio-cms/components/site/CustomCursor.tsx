"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [active, setActive] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 32 });
  const springY = useSpring(y, { stiffness: 260, damping: 32 });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      x.set(event.clientX - 18);
      y.set(event.clientY - 18);
      setActive(true);
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[120] hidden h-9 w-9 rounded-full border border-cyan/70 bg-cyan/10 mix-blend-screen shadow-[0_0_34px_rgba(0,231,255,0.5)] backdrop-blur md:block"
      style={{ x: springX, y: springY, opacity: active ? 1 : 0 }}
    />
  );
}

