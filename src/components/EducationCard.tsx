"use client";

import { motion, AnimatePresence } from "framer-motion";

interface EducationCardProps {
  edu: any;
  idx: number;
  ordinal: string;
  isExpanded: boolean;
  onHover: () => void;
}

export default function EducationCard({ edu, idx, ordinal, isExpanded, onHover }: EducationCardProps) {

  return (
    <div 
      onMouseEnter={onHover}
      className="glass hover-card edu-staircase-offset" 
      style={{
        padding: 32,
        width: "min(650px, 100%)",
        marginLeft: `clamp(0px, ${idx * 8}%, 300px)`, // Dynamic staggered index
        position: "relative",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
        zIndex: isExpanded ? 10 : 1
      }}
    >
      {/* Big Ordinal Number on the Right - ALWAYS VISIBLE */}
      <div className="edu-ordinal-float" style={{
        position: "absolute", right: -130, top: "50%",
        transform: "translateY(-50%)",
        fontSize: "3.2rem", fontWeight: 900,
        color: "var(--accent)", opacity: 0.3,
        fontFamily: "var(--font-heading)",
        userSelect: "none", pointerEvents: "none",
        whiteSpace: "nowrap",
        textShadow: "0 0 10px rgba(108,99,255,0.2)"
      }}>
        {ordinal}
      </div>

      {/* Staircase Step Indicator - ALWAYS VISIBLE */}
      <div style={{
        position: "absolute", left: -10, top: 40, width: 20, height: 2,
        background: "var(--accent)", opacity: 0.5
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: isExpanded ? 16 : 0, alignItems: "flex-start", transition: "margin 0.3s ease" }}>
        <div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{edu.degree}</h3>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <p style={{ color: "var(--accent)", fontSize: 15, fontWeight: 700 }}>{edu.school}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.span 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              style={{
                fontSize: 12, fontWeight: 800, color: "var(--accent)",
                padding: "4px 12px", background: "rgba(108,99,255,0.1)",
                borderRadius: 50, border: "1px solid rgba(108,99,255,0.2)"
              }}
            >
              {edu.current ? (edu.passingYear && edu.passingYear > 0 ? `Ongoing (${edu.passingYear})` : "Present") : (edu.passingYear || "")}
            </motion.span>
          )}
        </AnimatePresence>
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
            {edu.field && <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20, fontWeight: 500 }}>{edu.field}</p>}

            {edu.grade && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 700 }}>{edu.gradeType}</span>
                <span style={{ padding: "4px 12px", background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.2)", borderRadius: 8, fontSize: 13, fontWeight: 800, color: "var(--accent-2)" }}>{edu.grade}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
