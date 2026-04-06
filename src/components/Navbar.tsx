"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronDown, Menu, X, User, Briefcase, Code, GraduationCap,
  LayoutPanelLeft, FileText, Mail, Settings, Award, BookOpen, Star, Sparkles
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface NavbarProps {
  profile: any;
}

const PRIMARY_LINKS = [
  { name: "About", href: "#about", icon: <User size={14} /> },
  { name: "Education", href: "#education", icon: <GraduationCap size={14} /> },
  { name: "Experience", href: "#experience", icon: <Briefcase size={14} /> },
  { name: "Skills", href: "#skills", icon: <Code size={14} /> },
];

const SECONDARY_LINKS = [
  { name: "Projects", href: "#projects", icon: <LayoutPanelLeft size={14} /> },
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
  const pathname = usePathname();
  
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDhakaTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      
      // Cancel any ongoing scroll locks
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("triggerSplashScreen"));
      }

      scrollTimeoutRef.current = setTimeout(() => {
        if (window.location.hash) {
          window.history.replaceState(null, "", "/");
        }
        window.scrollTo({ top: 0, behavior: "instant" });
        scrollTimeoutRef.current = null;
      }, 1575);
    }
  };

  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") && pathname === "/") {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        // Clear any existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        window.dispatchEvent(new Event("scrollStart"));
        window.history.replaceState(null, "", href);
        
        // Manual calculation for maximum reliability
        const offset = 90; 
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        // Use a reasonably short timeout to allow next clicks, 
        // but keep the 'isScrolling' state active briefly for animation syncing
        scrollTimeoutRef.current = setTimeout(() => {
          window.dispatchEvent(new Event("scrollEnd"));
          scrollTimeoutRef.current = null;
        }, 1000); // 1s is a good balance for smooth scroll duration
      }
    }
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenus = () => {
    setIsDropdownOpen(false);
    setIsMobileOpen(false);
  };

  return (
    <>

      <div className="navbar-container">
        <nav className="navbar-pill">
          <Link href="/" className="nav-logo-link" onClick={handleHomeClick} style={{ display: "flex", alignItems: "center", marginRight: "8px" }}>
            <div
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
            </div>
          </Link>

          <div className="nav-links-main">
            {PRIMARY_LINKS.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="nav-link-item" 
                style={{ gap: "8px" }}
                onClick={(e) => handleNavLinkClick(e, link.href)}
              >
                <span className="nav-icon" style={{ opacity: 0.8, display: "flex", color: "var(--accent)" }}>{link.icon}</span>
                {link.name}
              </Link>
            ))}

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
                        onClick={(e) => { setIsDropdownOpen(false); handleNavLinkClick(e, link.href); }}
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

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {mounted && (
              <div 
                className="desktop-only"
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.85rem",
                  color: "var(--text-primary)",
                  opacity: 0.8,
                  letterSpacing: "0.05em",
                  paddingRight: "12px",
                  borderRight: "1px solid var(--border-subtle)",
                  marginRight: "4px"
                }}
              >
                {formatDhakaTime(time)}
              </div>
            )}

            <ThemeToggle />

            <Link href="/login" className="nav-cta">
              <span className="desktop-only" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Settings size={14} /> Admin
              </span>
            </Link>

            <button className="mobile-toggle" onClick={() => setIsMobileOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </div>

      <div className={`mobile-overlay ${isMobileOpen ? 'open' : ''}`}>
        <button className="close-mobile" onClick={() => setIsMobileOpen(false)}>
          <X size={32} />
        </button>

        <div className="mobile-nav-links">
          <Link href="/" onClick={(e) => { closeMenus(); handleHomeClick(e); }} style={{ marginBottom: "20px" }}>
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
              <Link 
                key={link.name} 
                href={link.href} 
                className="mobile-nav-item" 
                onClick={(e) => { closeMenus(); handleNavLinkClick(e, link.href); }}
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
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
