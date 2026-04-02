"use client";

import { motion, AnimatePresence } from "framer-motion";

interface PublicationCardProps {
  pub: any;
  ordinal: string;
  isExpanded: boolean;
  onHover: () => void;
}

export default function PublicationCard({ pub, ordinal, isExpanded, onHover }: PublicationCardProps) {

  return (
    <div 
      onMouseEnter={onHover}
      className="glass hover-card" 
      style={{
        padding: "32px 32px 24px",
        width: "100%",
        position: "relative",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
        zIndex: isExpanded ? 10 : 1
      }}
    >
      {/* Big Ordinal Number on the Right - ALWAYS VISIBLE */}
      <div className="pub-ordinal-float" style={{
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
        <div style={{ paddingRight: 80 }}> {/* Keep space for ordinal */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>{pub.title}</h3>
            {pub.submitted && (
              <span style={{ 
                background: "rgba(255,179,71,0.15)", color: "#ffb347", 
                fontSize: 11, fontWeight: 800, padding: "2px 10px", 
                borderRadius: 50, border: "1px solid rgba(255,179,71,0.3)" 
              }}>
                Submitted
              </span>
            )}
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
                {!pub.submitted ? (
                  <p style={{ color: "var(--accent)", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    {pub.publisher} • {pub.date ? new Date(pub.date).getFullYear() : "N/A"}
                  </p>
                ) : (
                  <p style={{ color: "var(--text-muted)", fontSize: 14, fontWeight: 600, marginBottom: 8, fontStyle: "italic" }}>
                    Currently under review
                  </p>
                )}
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
            {pub.description && <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{pub.description}</p>}
            {!pub.submitted && pub.url && (
              <a href={pub.url} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: "8px 20px", fontSize: 13, display: "inline-block" }}>
                Read Publication ↗
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
