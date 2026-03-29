"use client";

import { useEffect, useState } from "react";

/**
 * High-Fidelity Celestial Toggle.
 * Derived from the premium day/night transition design provided.
 * Features: Moving clouds, cratered moon, and appearing stars.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  if (!mounted) {
    return <div style={{ width: 80, height: 34, transform: 'scale(1)' }} />;
  }

  // According to the provided CSS:
  // Default = Day (Light)
  // Checked = Night (Dark)
  const isDark = theme === "dark";

  return (
    <div className="theme-toggle-wrapper">
      <label className="theme-container">
        <input 
          type="checkbox" 
          checked={isDark} 
          onChange={toggle} 
        />
        <div className="theme-slider round">
          <div className="theme-background"></div>
          <div className="theme-star"></div>
          <div className="theme-star"></div>
        </div>
      </label>
    </div>
  );
}
