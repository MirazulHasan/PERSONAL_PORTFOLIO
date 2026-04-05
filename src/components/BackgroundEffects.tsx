"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const keywords = [
  "Next.js", "TypeScript", "React", "Prisma", "PostgreSQL",
  "Tailwind", "Framer Motion", "Node.js", "Full Stack", "API",
  "UI/UX", "Database", "Scalable", "Modern Web", "AI", "ML",
  "GPU", "CPU", "RAM", "MOBO", "SSD", "HDD", "PSU", "CASE"
];

const colors = ["#818cf8", "#f472b6", "#fbbf24", "#34d399", "#60a5fa"];

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * Individual Background Element (Keyword, Star, Nebula, or Planet)
 * Combines "Random Life" drift with "Cinematic Parallax" mouse interaction.
 */
const SpaceItem = ({
  type,
  mouseX,
  mouseY,
  gridPos,
  theme
}: {
  type: "keyword" | "star" | "nebula" | "planet" | "solarSystem" | "galaxy",
  mouseX: any,
  mouseY: any,
  gridPos?: { x: number, y: number },
  theme: string
}) => {
  const [key, setKey] = useState(0);

  const generateParams = useCallback(() => {
    const isKeyword = type === "keyword";
    const isNebula = type === "nebula";
    const isPlanet = type === "planet";
    const isSpaceObject = ["solarSystem", "galaxy"].includes(type);

    // Parallax Factor (Deeper layers move slower, planets move faster)
    const parallaxFactor = isNebula ? 0.01 : (isPlanet || isSpaceObject ? 0.05 : (isKeyword ? 0.03 : 0.02));

    const xStart = gridPos ? gridPos.x + getRandom(-5, 5) : getRandom(2, 98);
    const yStart = gridPos ? gridPos.y + getRandom(-5, 5) : getRandom(2, 98);

    return {
      content: isKeyword ? keywords[Math.floor(Math.random() * keywords.length)] : null,
      color: colors[Math.floor(Math.random() * colors.length)],
      fontSize: isKeyword ? getRandom(12, 22) : (isPlanet ? getRandom(40, 100) : (isSpaceObject ? getRandom(40, 80) : getRandom(1, 3))),

      xStart,
      yStart,

      xDrift: isPlanet || isSpaceObject ? getRandom(-5, 5) : getRandom(-12, 12),
      yDrift: isPlanet || isSpaceObject ? getRandom(-5, 5) : getRandom(-12, 12),
      rotateDrift: isKeyword ? getRandom(-15, 15) : (isPlanet || isSpaceObject ? getRandom(360, 720) : 0),

      duration: isNebula ? getRandom(30, 50) : (isPlanet || isSpaceObject ? getRandom(40, 60) : getRandom(15, 25)),
      delay: getRandom(0, 5),
      blur: isNebula ? getRandom(100, 150) : 0,
      opacity: isNebula ? (theme === "light" ? 0.02 : 0.04) : (isPlanet ? 0.15 : (isKeyword ? (theme === "light" ? 0.4 : 0.22) : (isSpaceObject ? (theme === "light" ? 0.6 : 0.45) : (theme === "light" ? 0.6 : 0.45)))),
      parallaxFactor
    };
  }, [type, gridPos, theme]);

  const [params, setParams] = useState(generateParams());

  const parallaxX = useTransform(mouseX, [-1, 1], [`${params.parallaxFactor * -150}px`, `${params.parallaxFactor * 150}px`]);
  const parallaxY = useTransform(mouseY, [-1, 1], [`${params.parallaxFactor * -150}px`, `${params.parallaxFactor * 150}px`]);

  const handleAnimationComplete = () => {
    setParams(generateParams());
    setKey(prev => prev + 1);
  };

  return (
    <motion.div
      key={key}
      style={{
        left: `${params.xStart}%`,
        top: `${params.yStart}%`,
        x: parallaxX,
        y: parallaxY,
        mixBlendMode: theme === "light" ? "multiply" : "screen",
        zIndex: type === "nebula" ? -3 : (type === "star" ? -2 : (type === "keyword" ? 0 : -1)),
        fontFamily: "ui-monospace, monospace",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        translateX: [`0vw`, `${params.xDrift}vw`],
        translateY: [`0vh`, `${params.yDrift}vh`],
        rotate: [0, params.rotateDrift],
        opacity: [0, params.opacity, params.opacity, 0],
        scale: [0.8, 1, 1, 0.8]
      }}
      transition={{
        duration: params.duration,
        delay: params.delay,
        ease: "linear",
      }}
      onAnimationComplete={handleAnimationComplete}
      className="absolute whitespace-nowrap will-change-transform select-none pointer-events-none"
    >
      {type === "keyword" ? (
        <span style={{ color: params.color, fontSize: `${params.fontSize}px`, fontWeight: 500 }}>
          {params.content}
        </span>
      ) : type === "solarSystem" ? (
        <div style={{ width: `${params.fontSize * 1.5}px`, height: `${params.fontSize * 1.5}px`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "20%", height: "20%", background: "radial-gradient(circle, #fbbf24, #f59e0b)", borderRadius: "50%", boxShadow: "0 0 20px #fbbf24" }} />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute w-full h-full rounded-full border border-[rgba(128,128,128,0.3)]">
            <div className="absolute top-[-3%] left-1/2 -translate-x-1/2 w-[6%] h-[6%] bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
          </motion.div>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute w-[70%] h-[70%] rounded-full border border-[rgba(128,128,128,0.3)]">
            <div className="absolute top-[-4%] left-1/2 -translate-x-1/2 w-[8%] h-[8%] bg-red-400 rounded-full shadow-[0_0_8px_#f87171]" />
          </motion.div>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} className="absolute w-[40%] h-[40%] rounded-full border border-[rgba(128,128,128,0.3)]">
            <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[10%] h-[10%] bg-gray-400 rounded-full shadow-[0_0_5px_#9ca3af]" />
          </motion.div>
        </div>
      ) : type === "galaxy" ? (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} style={{ width: `${params.fontSize * 2.5}px`, height: `${params.fontSize * 2.5}px`, position: "relative", borderRadius: "50%", background: `conic-gradient(from 0deg, transparent 0%, ${params.color}40 20%, transparent 40%, transparent 50%, ${params.color}40 70%, transparent 90%)`, filter: "blur(4px)" }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-white rounded-full blur-[8px]" style={{ boxShadow: `0 0 30px ${params.color}` }} />
        </motion.div>
      ) : type === "planet" ? (
        <div style={{
          width: `${params.fontSize}px`,
          height: `${params.fontSize}px`,
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${params.color}, #000)`,
          boxShadow: `inset -5px -5px 15px rgba(255,255,255,0.1), 0 0 20px ${params.color}33`,
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Subtle Ring for some planets */}
          {params.fontSize > 70 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[10%] border-[2px] border-white/10 rounded-[50%] rotate-[-20deg]" />
          )}
        </div>
      ) : (
        <div style={{
          width: type === "star" ? `${params.fontSize}px` : "40vw",
          height: type === "star" ? `${params.fontSize}px` : "40vw",
          backgroundColor: type === "star" ? (theme === "light" ? "#000000" : "#ffffff") : params.color,
          borderRadius: "50%",
          filter: params.blur > 0 ? `blur(${params.blur}px)` : "none",
          boxShadow: type === "star" ? (theme === "light" ? `0 0 4px rgba(0,0,0,0.2)` : `0 0 8px rgba(255,255,255,0.8)`) : "none",
        }} />
      )}
    </motion.div>
  );
};

const BackgroundEffects = () => {
  const [isMounted, setIsMounted] = useState(false);

  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const smoothMouseX = useSpring(rawMouseX, { stiffness: 12, damping: 40 });
  const smoothMouseY = useSpring(rawMouseY, { stiffness: 12, damping: 40 });

  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setIsMounted(true);

    // Initial theme check
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(currentTheme);

    // Observer for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          const nextTheme = document.documentElement.getAttribute("data-theme") || "dark";
          setTheme(nextTheme);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    const handleMouseMove = (e: MouseEvent) => {
      rawMouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawMouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
    };
  }, [rawMouseX, rawMouseY]);

  const gridCells = useMemo(() => {
    const cells = [];
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        cells.push({ x: x * 20 + 10, y: y * 20 + 10 });
      }
    }
    return cells.sort(() => Math.random() - 0.5);
  }, []);

  if (!isMounted) return null;

  return (
    <div
      id="background-effects"
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[var(--bg-primary)] print:hidden [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_80%,transparent_100%)]"
    >
      {/* 1. Deep Space Nebulas (Atmosphere) */}
      {[...Array(10)].map((_, i) => (
        <SpaceItem key={`nebula-${i}`} type="nebula" mouseX={smoothMouseX} mouseY={smoothMouseY} theme={theme} />
      ))}

      {/* 2. Massive Starfield (Optimized count for performance) */}
      {[...Array(50)].map((_, i) => (
        <SpaceItem key={`star-${i}`} type="star" mouseX={smoothMouseX} mouseY={smoothMouseY} theme={theme} />
      ))}

      {/* 3. Celestial Planets */}
      {[...Array(4)].map((_, i) => (
        <SpaceItem key={`planet-${i}`} type="planet" mouseX={smoothMouseX} mouseY={smoothMouseY} theme={theme} />
      ))}

      {/* 3.1. Galaxies */}
      {[...Array(2)].map((_, i) => (
        <SpaceItem key={`galaxy-${i}`} type="galaxy" mouseX={smoothMouseX} mouseY={smoothMouseY} theme={theme} />
      ))}

      {/* 3.2. Solar Systems */}
      {[...Array(2)].map((_, i) => (
        <SpaceItem key={`solarSystem-${i}`} type="solarSystem" mouseX={smoothMouseX} mouseY={smoothMouseY} theme={theme} />
      ))}

      {/* 4. Non-Colliding Tech Keywords */}
      {gridCells.map((pos, i) => (
        <SpaceItem
          key={`keyword-${i}`}
          type="keyword"
          mouseX={smoothMouseX}
          mouseY={smoothMouseY}
          gridPos={pos}
          theme={theme}
        />
      ))}

      {/* 5. Deep Texture Overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(129,140,248,0.02)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(244,114,182,0.02)_0%,transparent_50%)]" />
    </div>
  );
};

export default BackgroundEffects;
