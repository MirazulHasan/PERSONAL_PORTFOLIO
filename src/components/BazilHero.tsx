"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";

interface BazilHeroProps {
  profile: any;
}

export default function BazilHero({ profile }: BazilHeroProps) {
  const name = profile?.name ?? "Md. Mirazul Hasan";
  const title = profile?.title ?? "AI Developer";
  const aboutImageUrl = profile?.aboutImageUrl ?? null;
  const avatarUrl = profile?.avatarUrl ?? null;

  // hoveredLine tracks exactly which text line currently has the mouse
  const [hoveredLine, setHoveredLine] = useState<1 | 2 | null>(null);

  const line1 = profile?.heroHeadline1 ?? "Photographer";
  const line2 = profile?.heroHeadline2 ?? "AI Engineer";

  const [animationKey, setAnimationKey] = useState(0);
  const [delayShift, setDelayShift] = useState(2.7);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleReTrigger = () => {
      // Delay word reset until shutter closes (1575ms)
      setTimeout(() => {
        setDelayShift(1.1); // Match 2.7s total reveal
        setAnimationKey(prev => prev + 1);
      }, 1575);
    };
    window.addEventListener("triggerSplashScreen", handleReTrigger);

    return () => {
      window.removeEventListener("triggerSplashScreen", handleReTrigger);
    };
  }, []);

  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Restore original fast-reacting tracking speed, but keep the constrained travel limits
  const springConfig = { damping: 40, stiffness: 250 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Greatly reduced physical movement bounding distance for a subtler float
  const photoX = useTransform(smoothX, [-900, 900], [-15, 15]);
  const photoY = useTransform(smoothY, [-900, 900], [-15, 15]);

  useEffect(() => {
    const startLock = () => {
      // Catch the springs at their current rendered value to kill any ongoing momentum
      mouseX.set(smoothX.get());
      mouseY.set(smoothY.get());
      setHoveredLine(null); // Immediately clear any active headline hover states
      setIsScrolling(true);
    };
    const endLock = () => setIsScrolling(false);
    
    window.addEventListener("scrollStart", startLock);
    window.addEventListener("scrollEnd", endLock);

    return () => {
      window.removeEventListener("scrollStart", startLock);
      window.removeEventListener("scrollEnd", endLock);
    };
  }, [smoothX, smoothY, mouseX, mouseY]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isScrolling) return;
    if (typeof window !== "undefined") {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const x = e.clientX - windowWidth / 2;
      const y = e.clientY - windowHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      window.dispatchEvent(new Event("scrollStart"));
      document.body.style.pointerEvents = "none";
      window.history.replaceState(null, "", href);
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        document.body.style.pointerEvents = "all";
        window.dispatchEvent(new Event("scrollEnd"));
      }, 1500);
    }
  };
  // ─── text styles ──────────────────────────────────────────────
  const baseStyle: React.CSSProperties = {
    fontSize: "clamp(5.5rem, 15vw, 15rem)",
    fontWeight: 900,
    letterSpacing: "-0.05em",
    lineHeight: 1,
    margin: 0,
    whiteSpace: "nowrap",
    cursor: "default",
    userSelect: "none" as const,
    display: "block",
    width: "fit-content",
    textAlign: "center",
    transition: "color 0.7s cubic-bezier(0.16, 1, 0.3, 1), -webkit-text-stroke 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
        padding: "100px 5% 40px",
      }}
    >
      {/* ── INTERACTION LOCK OVERLAY ── */}
      <AnimatePresence>
        {isScrolling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              pointerEvents: "all",
              background: "rgba(0,0,0,0)" // Fully transparent but blocks everything
            }}
          />
        )}
      </AnimatePresence>
      {/* ── Ambient glows ── */}
      <div style={{
        position: "absolute", top: "15%", left: "-5%", width: 600, height: 600,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "-5%", width: 400, height: 400,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
      }} />

      <motion.div
        key={`greeting-${animationKey}`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: delayShift, ease: [0.16, 1, 0.3, 1] }}
        style={{
          marginBottom: 0,
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          fontSize: "clamp(1.5rem, 4vw, 3rem)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline"
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.4em", alignItems: "baseline" }}>
          <span style={{ color: "var(--text-primary)", marginRight: "0.3em" }}>{profile?.heroGreetingPrefix ?? "👋 Hi, I'm"}</span>
          <span style={{
            background: "linear-gradient(to right, #a78bfa, #f472b6, #fb923c, #fbbf24)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            paddingRight: "0.1em",
          }}>
            {name}
          </span>
          <span style={{
            color: "var(--text-muted)",
            fontWeight: 700,
            marginLeft: "0.3em", // Balancing the space on the other side as well
            opacity: 0.8,
            letterSpacing: "-0.02em"
          }}>
            {profile?.heroGreetingSuffix ?? "and I am a"}
          </span>
        </div>
      </motion.div>

      {/* ──────────────────────────────────────────────────────────
          HEADLINE BLOCK
          Photo drives the container height. Text is absolutely 
          positioned over the top portion of the photo.
      ────────────────────────────────────────────────────────── */}
      <div
        key={`headlines-${animationKey}`}
        style={{ position: "relative", width: "100%", zIndex: 5, padding: "0" }}
      >
        {/* === LAYER 1: BACK (Solid Text) === */}
        <div style={{ position: "absolute", top: "8%", left: 0, width: "100%", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>
          {/* Back Line 1 */}
          <motion.h1
            className="bazil-headline"
            style={{
              ...baseStyle,
              color: hoveredLine === 2 ? "transparent" : "var(--text-primary)",
              WebkitTextStroke: hoveredLine === 2 ? "2px var(--text-muted)" : "0px transparent"
            }}
            initial={{ opacity: 0, x: -150 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: delayShift + 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {line1}
          </motion.h1>
          {/* Back Line 2 */}
          <motion.h2
            className="bazil-headline"
            style={{
              ...baseStyle,
              color: hoveredLine === 2 ? "var(--text-primary)" : "transparent",
              WebkitTextStroke: hoveredLine === 2 ? "0px transparent" : "2px var(--text-muted)"
            }}
            initial={{ opacity: 0, x: 150 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: delayShift + 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {line2 || title}
          </motion.h2>
        </div>

        {/* === LAYER 2: MIDDLE (Photo defines normal flow & height) === */}
        {(aboutImageUrl || avatarUrl) && (
          <motion.div
            style={{
              position: "relative",
              zIndex: 2,
              pointerEvents: "none",
              display: "flex",
              justifyContent: "center",
              x: photoX,
              y: photoY,
            }}
          >
            {/* glow */}
            <div style={{
              position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
              width: "80%", height: "40%",
              background: "radial-gradient(ellipse, rgba(108,99,255,0.35) 0%, transparent 70%)",
              filter: "blur(40px)", zIndex: 0,
            }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={aboutImageUrl || avatarUrl}
              alt={name}
              style={{
                height: "clamp(350px, 55vw, 850px)",
                width: "auto",
                display: "block",
                position: "relative",
                zIndex: 1,
                maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
              }}
            />
          </motion.div>
        )}

        {/* === LAYER 3: FRONT (Outline Text Only active word draws here) === */}
        <div style={{ position: "absolute", top: "8%", left: 0, width: "100%", zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>
          {/* Front Line 1 */}
          <motion.h1
            className="bazil-headline"
            style={{
              ...baseStyle,
              color: "transparent",
              WebkitTextStroke: hoveredLine === 2 ? "0px transparent" : "2px var(--text-muted)",
              opacity: hoveredLine === 2 ? 0 : 1 // Also toggle opacity to ensure transitions
            }}
            initial={{ opacity: 0, x: -150 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: delayShift + 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {line1}
          </motion.h1>
          {/* Front Line 2 */}
          <motion.h2
            className="bazil-headline"
            style={{
              ...baseStyle,
              color: "transparent",
              WebkitTextStroke: hoveredLine === 2 ? "2px var(--text-muted)" : "0px transparent",
              opacity: hoveredLine === 2 ? 1 : 0
            }}
            initial={{ opacity: 0, x: 150 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: delayShift + 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {line2 || title}
          </motion.h2>
        </div>

        {/* === LAYER 4: INVISIBLE HITBOXES (Highest z-index) === */}
        <div style={{ position: "absolute", top: "8%", left: 0, width: "100%", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <motion.h1
            className="bazil-headline"
            style={{ ...baseStyle, color: "transparent", cursor: "default", pointerEvents: "auto" }}
            onMouseEnter={() => setHoveredLine(1)}
            onMouseLeave={() => setHoveredLine(null)}
            initial={{ opacity: 0, x: -150 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: delayShift + 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {line1}
          </motion.h1>
          <motion.h2
            className="bazil-headline"
            style={{ ...baseStyle, color: "transparent", cursor: "default", pointerEvents: "auto" }}
            onMouseEnter={() => setHoveredLine(2)}
            onMouseLeave={() => setHoveredLine(null)}
            initial={{ opacity: 0, x: 150 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: delayShift + 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {line2 || title}
          </motion.h2>
        </div>
      </div>



      {/* ── Secondary Pill row ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
        style={{
          position: "absolute",
          bottom: "clamp(100px, 22vh, 250px)",
          left: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          flexWrap: "wrap",
          zIndex: 20, // Overlay on top of photo
        }}
      >
        <Link
          href="#projects"
          onClick={(e) => handleScrollClick(e, "#projects")}
          style={{
            padding: "12px 36px",
            background: "linear-gradient(135deg, #7c3aed, #f472b6)",
            color: "#ffffff",
            borderRadius: "50px",
            fontWeight: 800,
            fontSize: "15px",
            textDecoration: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.3)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.04) translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 20px 35px -5px rgba(124, 58, 237, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(124, 58, 237, 0.3)";
          }}
        >
          View My Work
        </Link>
        <Link
          href="#contact"
          onClick={(e) => handleScrollClick(e, "#contact")}
          style={{
            padding: "12px 36px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1.5px solid rgba(255, 255, 255, 0.15)",
            color: "#ffffff",
            borderRadius: "50px",
            fontWeight: 800,
            fontSize: "15px",
            textDecoration: "none",
            transition: "all 0.3s ease",
            backdropFilter: "blur(8px)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Get in Touch
        </Link>
      </motion.div>
    </section>
  );
}
