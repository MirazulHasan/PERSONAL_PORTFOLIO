"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronDown, Menu, X, Home, User, Briefcase, Code, GraduationCap,
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
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeMenus = () => {
    setIsDropdownOpen(false);
    setIsMobileOpen(false);
  };

  return (
    <>
      <div className="navbar-container">
        <nav className="navbar-pill">
          {/* Logo */}
          <Link href="/" className="nav-logo-link" style={{ display: "flex", alignItems: "center", marginRight: "8px" }}>
            <div className="logo-container" style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6c63ff, #ff6584)",
              padding: "1.5px"
            }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "var(--avatar-bg)" }}>
                <img src={profile?.avatarUrl || "/logo.png"} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="nav-links-main">
            {PRIMARY_LINKS.map((link) => (
              <Link key={link.name} href={link.href} className="nav-link-item" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ opacity: 0.8, display: "flex", color: "var(--accent)" }}>{link.icon}</span>
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
