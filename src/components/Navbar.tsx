"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  profile: any;
}

export default function Navbar({ profile }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
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

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const navBg = theme === "light" 
    ? (scrolled ? "rgba(248, 250, 252, 0.55)" : "transparent")
    : (scrolled ? "rgba(2, 6, 23, 0.45)" : "transparent");
    
  const navBorder = theme === "light"
    ? (scrolled ? "1px solid rgba(15, 23, 42, 0.08)" : "1px solid transparent")
    : (scrolled ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid transparent");

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 5%",
        height: scrolled ? 60 : 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        background: navBg,
        backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "blur(0px)",
        // Bottom fade mask to blend in
        maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
        borderBottom: navBorder,
      }}
    >
      <Link
        href="/"
        className="nav-logo-link"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontWeight: 800,
          fontSize: "1.1rem",
          textDecoration: "none",
          color: "inherit",
          letterSpacing: "-0.02em",
        }}
      >
        {profile?.avatarUrl && (
          <div
            className="logo-container"
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6c63ff, #ff6584)",
              padding: "1.5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: scrolled ? "0 0 15px rgba(108,99,255,0.25)" : "none",
              transition: "all 0.5s ease",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
                background: "var(--avatar-bg)",
              }}
            >
              <img
                src={profile.avatarUrl}
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        )}
        <span style={{ 
          opacity: scrolled ? 1 : 0.9,
          transition: "opacity 0.5s ease"
        }}>
          {profile?.name ?? "Portfolio"}
        </span>
      </Link>

      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        <Link href="#about" className="nav-link-glow" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>About</Link>
        <Link href="#education" className="nav-link-glow" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Education</Link>
        <Link href="#experience" className="nav-link-glow" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Experience</Link>
        <Link href="#skills" className="nav-link-glow" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Skills</Link>
        <Link href="#projects" className="nav-link-glow" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Projects</Link>
        <Link href="#blog" className="nav-link-glow" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Blog</Link>
        <Link href="#contact" className="nav-link-glow" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Contact</Link>
        <ThemeToggle />

        <Link
          href="/login"
          className="admin-nav-link"
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "var(--text-muted)",
            textDecoration: "none",
            letterSpacing: "0.06em",
            padding: "6px 14px",
            border: "1px solid var(--border)",
            borderRadius: 8,
            transition: "all 0.2s",
            opacity: scrolled ? 1 : 0.7,
          }}
        >
          ⚙ Admin
        </Link>
      </div>
    </nav>
  );
}
