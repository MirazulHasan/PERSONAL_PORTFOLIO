"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ExperienceCardProps {
  exp: any;
  ordinal: string;
  isExpanded: boolean;
  onHover: () => void;
}

export default function ExperienceCard({ exp, ordinal, isExpanded, onHover }: ExperienceCardProps) {
  const calculateDuration = (start: string | Date, end?: string | Date | null, isCurrent?: boolean) => {
    if (!start) return "";
    const startDate = new Date(start);
    const endDate = isCurrent ? new Date() : (end ? new Date(end) : new Date());
    
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }

    const parts = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
    if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
    
    return parts.length > 0 ? `(${parts.join(" ")})` : "";
  };

  return (
    <div 
      onMouseEnter={onHover}
      className="glass hover-card" 
      style={{
        padding: "40px 40px 24px",
        width: "100%",
        position: "relative",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
        zIndex: isExpanded ? 10 : 1
      }}
    >
      {/* Big Ordinal Number on the Right - ALWAYS VISIBLE */}
      <div className="experience-ordinal-float" style={{
        position: "absolute", right: 24, top: "50%",
        transform: "translateY(-50%)",
        fontSize: "3.2rem", fontWeight: 900,
        color: "var(--accent)", opacity: 0.15,
        fontFamily: "var(--font-heading)",
        userSelect: "none", pointerEvents: "none",
        whiteSpace: "nowrap",
        textShadow: "0 0 10px rgba(108,99,255,0.1)"
      }}>
        {ordinal}
      </div>

      <div style={{ marginBottom: isExpanded ? 16 : 0, transition: "margin 0.3s ease" }}>
        <div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{exp.position}</h3>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <p style={{ color: "var(--accent)", fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>{exp.company}</p>
                <div style={{ color: "var(--text-muted)", fontWeight: 700, fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>
                  <span>
                    {exp.startDate ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(exp.startDate)) : "N/A"} 
                    {" — "} 
                    {exp.current ? "Present" : exp.endDate ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(exp.endDate)) : ""}
                  </span>
                  <span style={{ color: "var(--accent)", opacity: 0.8, fontWeight: 600 }}>
                    {calculateDuration(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: 15, marginTop: 16 }}>{exp.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
