"use client";

import { useState, useRef } from "react";

const SECTIONS = [
  "About",
  "Education",
  "Experience",
  "Skills",
  "Projects",
  "Certificates",
  "Publications",
  "Activities",
  "References",
  "Blog",
  "Contact",
];

export default function CodingPanel() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle, error, success
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const command = input.trim().toLowerCase();
    
    // Find matching section
    const targetSection = SECTIONS.find(s => s.toLowerCase() === command);

    if (targetSection) {
      const element = document.getElementById(targetSection.toLowerCase());
      if (element) {
        setStatus("success");
        element.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          setInput("");
          setStatus("idle");
        }, 1000);
      }
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 1000);
    }
  };

  return (
    <div className={`coding-panel-container coding-panel-responsive ${status}`} style={{
      marginTop: "48px",
      width: "100%",
      maxWidth: "650px", // Increased from 500px
      marginInline: "auto",
      fontFamily: "'Fira Code', 'Courier New', monospace",
      position: "relative",
      zIndex: 10,
    }}>
      {/* Mac Terminal Window */}
      <div style={{
        overflow: "hidden",
        background: "var(--bg-card)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid var(--glass-border)",
        boxShadow: status === "error" ? "0 0 40px rgba(239, 68, 68, 0.2)" : (status === "success" ? "0 0 40px rgba(74, 222, 128, 0.2)" : "0 20px 50px rgba(0, 0, 0, 0.15)"),
        borderRadius: "12px",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        {/* Terminal Header (Title Bar) */}
        <div style={{
          height: "36px",
          background: "rgba(128, 128, 128, 0.08)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          position: "relative",
        }}>
          {/* Traffic Light Buttons */}
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f56" }}></div>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }}></div>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27c93f" }}></div>
          </div>
          
          {/* Title */}
          <div style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "12px",
            color: "var(--text-primary)",
            opacity: 0.4,
            letterSpacing: "0.02em",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}>
            mirazul — -zsh — 80x24
          </div>
        </div>

        {/* Terminal Body */}
        <form className="terminal-form-inner" onSubmit={handleCommand} style={{
          display: "flex",
          alignItems: "center",
          padding: "24px", // Increased padding
          gap: "12px",
          transition: "all 0.3s ease",
          transform: status === "error" ? "translateX(5px)" : "none",
        }}>
          {/* Desktop Full Prompt */}
          <div className="terminal-prompt terminal-prompt-full" style={{
            display: "flex",
            gap: "8px",
            color: "var(--accent)",
            fontWeight: "bold",
            fontSize: "15px", // Slightly larger font
            whiteSpace: "nowrap",
            userSelect: "none"
          }}>
            <span style={{ color: "#4ade80" }}>mirazul</span>
            <span style={{ color: "var(--text-muted)" }}>@</span>
            <span style={{ color: "var(--accent)" }}>macbook</span>
            <span style={{ color: "var(--text-muted)" }}>:</span>
            <span style={{ color: "#f472b6" }}>~</span>
            <span style={{ color: "var(--text-muted)" }}>$</span>
          </div>

          {/* Mobile Short Prompt */}
          <div className="terminal-prompt terminal-prompt-short" style={{
            display: "none", // Hidden by default, shown via media query
            gap: "4px",
            color: "var(--accent)",
            fontWeight: "bold",
            fontSize: "13px",
            whiteSpace: "nowrap",
            userSelect: "none"
          }}>
            <span style={{ color: "#f472b6" }}>~</span>
            <span style={{ color: "var(--text-muted)" }}>$</span>
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type command to navigate..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: status === "error" ? "#ef4444" : "var(--text-primary)",
              fontSize: "15px",
              width: "100%",
              caretColor: "var(--accent)",
              letterSpacing: "0.02em",
            }}
            autoComplete="off"
            spellCheck="false"
          />

          <div style={{
            fontSize: "11px",
            color: "var(--text-primary)",
            opacity: 0.5,
            whiteSpace: "nowrap",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontFamily: "Inter, sans-serif"
          }}>
            ⏎ Enter
          </div>
        </form>
      </div>
      
      {/* Quick Links Overlay (Kept as requested) */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "12px",
        marginTop: "20px",
        opacity: 0.6
      }}>
        {SECTIONS.map((s) => (
          <span 
            key={s} 
            onClick={() => {
              setInput(s);
              inputRef.current?.focus();
            }}
            className="quick-link-tag"
            style={{
              fontSize: "11px",
              padding: "4px 12px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "50px",
              cursor: "pointer",
              transition: "all 0.3s",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              opacity: 0.8,
              fontWeight: 600,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
