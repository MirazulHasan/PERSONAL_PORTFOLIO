"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronDown, Menu, X, User, Briefcase, Code, GraduationCap,
  LayoutPanelLeft, FileText, Mail, Settings, Award, BookOpen, Star, Sparkles
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  profile: any;
}

const PRIMARY_LINKS = [
  { name: "About", href: "#about", icon: <User size={14} /> },
  { name: "Education", href: "#education", icon: <GraduationCap size={14} /> },
  { name: "Experience", href: "#experience", icon: <Briefcase size={14} /> },
  { name: "Skills", href: "#skills", icon: <Code size={14} /> },
  { name: "Projects", href: "#projects", icon: <LayoutPanelLeft size={14} /> },
];

const SECONDARY_LINKS = [
  { name: "Certificates", href: "#certificates", icon: <Award size={14} /> },
  { name: "Publications", href: "#publications", icon: <BookOpen size={14} /> },
  { name: "Activities", href: "#activities", icon: <Sparkles size={14} /> },
  { name: "References", href: "#references", icon: <Star size={14} /> },
  { name: "Blog", href: "#blog", icon: <FileText size={14} /> },
  { name: "Contact", href: "#contact", icon: <Mail size={14} /> },
];

export default function Navbar({ profile }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  useEffect(() => {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem("splashShown");
    if (splashShown) {
      setIsSplashComplete(true);
    } else {
      const timer = setTimeout(() => {
        setIsSplashComplete(true);
        sessionStorage.setItem("splashShown", "true");
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeMenus = () => {
    setIsDropdownOpen(false);
    setIsMobileOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {!isSplashComplete && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "#020617", // Deep obsidian navy from root
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "all"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
              <motion.div
                layoutId="nav-logo-inner"
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                  padding: "4px",
                  boxShadow: "0 0 50px rgba(108, 99, 255, 0.5)"
                }}
              >
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "var(--avatar-bg)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={profile?.avatarUrl || "/logo.png"} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="gradient-text" 
                style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.05em" }}
              >
                {profile?.name}
              </motion.h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="navbar-container">
        <nav className="navbar-pill">
          {/* Logo */}
          <Link href="/" className="nav-logo-link" style={{ display: "flex", alignItems: "center", marginRight: "8px" }}>
            <motion.div 
              layoutId="nav-logo-inner"
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="logo-container" 
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                padding: "1.5px"
              }}
            >
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "var(--avatar-bg)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile?.avatarUrl || "/logo.png"} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </motion.div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="nav-links-main">
            {PRIMARY_LINKS.map((link) => (
              <Link key={link.name} href={link.href} className="nav-link-item" style={{ gap: "8px" }}>
                <span className="nav-icon" style={{ opacity: 0.8, display: "flex", color: "var(--accent)" }}>{link.icon}</span>
                {link.name}
              </Link>
            ))}

            {/* More Dropdown */}
            <div ref={dropdownRef} className="nav-dropdown-wrapper">
              <button
                className={`nav-dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                More <ChevronDown size={14} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`nav-dropdown-menu visible`}
                  >
                    {SECONDARY_LINKS.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span style={{ color: "var(--accent)" }}>{link.icon}</span>
                        {link.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="nav-divider" />

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle />

            <Link href="/login" className="nav-cta">
              <span className="desktop-only" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Settings size={14} /> Admin
              </span>
            </Link>

            {/* Mobile Toggle */}
            <button className="mobile-toggle" onClick={() => setIsMobileOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Overlay */}
      <div className={`mobile-overlay ${isMobileOpen ? 'open' : ''}`}>
        <button className="close-mobile" onClick={() => setIsMobileOpen(false)}>
          <X size={32} />
        </button>

        <div className="mobile-nav-links">
          {/* Logo link for mobile home navigation */}
          <Link href="/" onClick={closeMenus} style={{ marginBottom: "20px" }}>
            <div className="logo-container" style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6c63ff, #ff6584)",
              padding: "4px"
            }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "var(--avatar-bg)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile?.avatarUrl || "/logo.png"} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          </Link>

          <div className="mobile-nav-grid">
            {[...PRIMARY_LINKS, ...SECONDARY_LINKS].map((link) => (
              <Link key={link.name} href={link.href} className="mobile-nav-item" onClick={closeMenus} style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}>
                <span style={{ color: "var(--accent)" }}>{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>

          <Link href="/login" className="mobile-nav-item" onClick={closeMenus} style={{ color: "var(--accent)", marginTop: "40px" }}>
            Admin Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
