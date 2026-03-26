"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const keywords = [
  "Next.js", "TypeScript", "React", "Prisma", "PostgreSQL",
  "Tailwind", "Framer Motion", "Node.js", "Full Stack", "API",
  "UI/UX", "Database", "Scalable", "Clean Code", "Modern Web"
];

const colors = ["#818cf8", "#f472b6", "#fbbf24", "#34d399", "#60a5fa"];

export default function BackgroundEffects() {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollY } = useScroll();

  // Parallax for keywords
  const y1 = useTransform(scrollY, [0, 5000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 5000], [0, -500]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[var(--bg-primary)]">
      {/* 1. Large Ambient Glows */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[130px]"
      />

      {/* 2. Floating Technical Keywords */}
      <div className="absolute inset-0 opacity-[0.03]">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.span
            key={i}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              y: i % 2 === 0 ? y1 : y2,
              fontSize: `${Math.random() * 1 + 0.8}rem`,
            }}
            className="absolute font-mono font-bold whitespace-nowrap"
          >
            {keywords[i % keywords.length]}
          </motion.span>
        ))}
      </div>

      {/* 3. Square Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 2000 - 1000,
              y: Math.random() * 2000 - 1000,
              opacity: Math.random() * 0.3 + 0.1,
              rotate: Math.random() * 360
            }}
            animate={{
              x: [null, Math.random() * 2000 - 1000],
              y: [null, Math.random() * 2000 - 1000],
              rotate: [null, Math.random() * 360 + 180]
            }}
            transition={{
              duration: Math.random() * 30 + 30,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              backgroundColor: colors[i % colors.length],
              borderRadius: 1, // small "pixel" square
              filter: "blur(0.5px)"
            }}
            className="absolute"
          />
        ))}
      </div>

      {/* 4. Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
    </div>
  );
}
