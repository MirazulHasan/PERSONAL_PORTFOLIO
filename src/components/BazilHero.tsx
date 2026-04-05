"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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

  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 250 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const photoX = useTransform(smoothX, [-900, 900], [-45, 45]);
  const photoY = useTransform(smoothY, [-900, 900], [-45, 45]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window !== "undefined") {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const x = e.clientX - windowWidth / 2;
      const y = e.clientY - windowHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
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
    width: "100%",
    textAlign: "center",
    transition: "color 0.4s ease, -webkit-text-stroke 0.4s ease, opacity 0.4s ease",
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

      {/* ── Greeting ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0, ease: "easeOut" }}
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
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.2em", alignItems: "baseline" }}>
          <span style={{ color: "var(--text-primary)" }}>{profile?.heroGreetingPrefix ?? "Hi, I'm"}</span>
          <span style={{
            background: "linear-gradient(to right, #a78bfa, #f472b6, #fb923c, #fbbf24)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            paddingRight: "0.1em"
          }}>
            {name}
          </span>
          <span style={{
            color: "var(--text-muted)",
            fontWeight: 700,
            marginLeft: "0.4em",
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
          >
            {line2 || title}
          </motion.h2>
        </div>

        {/* === LAYER 4: INVISIBLE HITBOXES (Highest z-index) === */}
        <div style={{ position: "absolute", top: "8%", left: 0, width: "100%", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1
            className="bazil-headline"
            style={{ ...baseStyle, color: "transparent", cursor: "default", pointerEvents: "auto" }}
            onMouseEnter={() => setHoveredLine(1)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            {line1}
          </h1>
          <h2
            className="bazil-headline"
            style={{ ...baseStyle, color: "transparent", cursor: "default", pointerEvents: "auto" }}
            onMouseEnter={() => setHoveredLine(2)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            {line2 || title}
          </h2>
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
