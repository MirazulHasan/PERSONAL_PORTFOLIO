"use client";

import React from "react";
import { motion } from "framer-motion";

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface SkillTreeProps {
  skillsByCategory: { [key: string]: Skill[] };
}

export default function SkillTree({ skillsByCategory }: SkillTreeProps) {
  const categories = Object.keys(skillsByCategory);
  const totalCategories = categories.length;

  const Tag = ({ name }: { name: string }) => (
    <motion.div
      whileHover={{ y: -3, scale: 1.05, borderColor: "var(--accent)", background: "rgba(108, 99, 255, 0.15)" }}
      style={{
        padding: "6px 14px",
        background: "var(--bg-section)",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: 700,
        color: "var(--text-primary)",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        whiteSpace: "normal",
        wordBreak: "break-word",
        lineHeight: "1.4",
        transition: "all 0.3s ease",
        cursor: "default"
      }}
    >
      {name}
    </motion.div>
  );

  return (
    <div className="skill-tree-dynamic" style={{
      position: "relative",
      padding: "40px 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: totalCategories * 140 + 200
    }}>

      {/* ── ROOT NODE ── */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        style={{
          padding: "16px 40px",
          background: "var(--bg-card)",
          border: "2px solid var(--border)",
          boxShadow: "0 0 40px rgba(0,0,0,0.1), inset 0 0 20px rgba(108,99,255,0.05)",
          borderRadius: "4px",
          zIndex: 10,
          position: "relative",
          marginBottom: 0
        }}
      >
        <span style={{
          color: "var(--text-primary)",
          fontSize: "16px",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "2.5px"
        }}>Skills</span>
        <div style={{ position: "absolute", bottom: 0, left: 10, right: 10, height: 2, background: "var(--accent)", opacity: 0.5 }} />
      </motion.div>

      {/* ── CENTRAL TRUNK ── */}
      <div className="skill-tree-desktop-view" style={{
        position: "absolute",
        top: 100,
        width: 2,
        height: totalCategories * 120,
        background: "var(--border)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 0,
        opacity: 0.8
      }} />

      {/* ── DYNAMIC BRANCHES ── */}
      <div className="skill-tree-desktop-view" style={{
        width: "100%",
        maxWidth: 1000,
        marginTop: 30,
        display: "flex",
        flexDirection: "column",
        gap: 30,
        zIndex: 5
      }}>
        {categories.map((cat, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div key={cat} style={{
              position: "relative",
              width: "100%",
              display: "flex",
              justifyContent: isEven ? "flex-start" : "flex-end",
              alignItems: "center"
            }}>

              {/* Branch Connector */}
              <div style={{
                position: "absolute",
                left: isEven ? "45%" : "50%",
                right: isEven ? "50%" : "45%",
                height: 2,
                background: "var(--border)",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: -1,
                opacity: 0.8
              }} />

              {/* Branch Content */}
              <motion.div
                initial={{ x: isEven ? -20 : 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                style={{
                  width: "42%",
                  textAlign: isEven ? "right" : "left",
                  padding: "0 20px"
                }}
              >
                <div style={{ marginBottom: 12 }}>
                  <h3 style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em"
                  }}>{cat}</h3>
                  <div style={{ height: 1, width: 30, background: "var(--accent)", marginLeft: isEven ? "auto" : 0, marginRight: isEven ? 0 : "auto", marginTop: 4, opacity: 0.6 }} />
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: isEven ? "flex-end" : "flex-start" }}>
                  {skillsByCategory[cat].map((s: any) => (
                    <Tag key={s.id} name={s.name} />
                  ))}
                </div>
              </motion.div>

              {/* Node on trunk */}
              <div style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--accent)",
                border: "2px solid var(--bg-primary)",
                boxShadow: "0 0 10px var(--accent)",
                zIndex: 1
              }} />

            </div>
          );
        })}
      </div>

      {/* ── MOBILE FALLBACK ── */}
      <div className="skill-tree-mobile-view" style={{ display: "none", width: "100%", marginTop: 40, position: "relative", zIndex: 10 }}>
        {categories.map((cat) => (
          <motion.div
            key={`mobile-${cat}`}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            className="skill-mobile-category"
          >
            <h3 className="skill-mobile-category-title">{cat}</h3>
            <div className="skill-mobile-tags">
              {skillsByCategory[cat].map((s: any) => (
                <Tag key={`mobile-tag-${s.id}`} name={s.name} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
