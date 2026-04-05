"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  profile: any;
}

export default function SplashScreen({ profile }: SplashScreenProps) {
  const [show, setShow] = useState(true);
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const runSequence = (unmountMs: number) => {
      setShow(true);
      document.body.style.overflow = "hidden";
      clearTimeout(timer);
      timer = setTimeout(() => {
        setShow(false);
        document.body.style.overflow = "auto";
      }, unmountMs); 
    };

    // Run on initial page load
    runSequence(4000);

    // Listen for manual triggers from Navbar
    const handleTrigger = () => {
      setIsInitial(false);
      setShow(false);
      setTimeout(() => runSequence(4500), 50); 
    };
    
    window.addEventListener("triggerSplashScreen", handleTrigger);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
      window.removeEventListener("triggerSplashScreen", handleTrigger);
    };
  }, []);

  // Animation constants
  const bez = [0.76, 0, 0.24, 1]; 
  const totalDuration = isInitial ? 4.0 : 4.5; 

  const rotateValues = isInitial ? [0, 0, 0, 75] : [75, 0, 0, 75];
  const rotateTimes  = [0, 0.35, 0.65, 1]; 
  const rotateEase   = [bez, "linear", bez];

  const opacityValues = isInitial
    ? [0, 1, 1, 1, 0, 0]   
    : [0, 0, 1, 1, 0, 0];  
  const opacityTimes  = [0, 0.35, 0.45, 0.55, 0.65, 1];
  
  const scaleValues   = isInitial 
    ? [0.8, 0.9, 1, 1, 1.1, 1.1]
    : [0.8, 0.8, 1, 1, 1.1, 1.1];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none"
          }}
        >
          {/* PERFECT MECHANICAL APERTURE (6 Exact Wedges) */}
          <div style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden", 
            zIndex: 1,
            pointerEvents: "all"
          }}>
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 0,
                  height: 0,
                  transform: `rotate(${idx * 60}deg)`,
                  zIndex: 1, 
                }}
              >
                <motion.div
                  initial={{ rotate: rotateValues[0] }}
                  animate={{ rotate: rotateValues }} 
                  transition={{ duration: totalDuration, times: rotateTimes, ease: rotateEase as any }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "150vw", 
                    height: "150vw",
                    background: "var(--bg-primary)",
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 58% 100%)",
                    transformOrigin: "100% 100%", 
                    borderTop: "2px solid rgba(108,99,255,0.6)",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                />
              </div>
            ))}
          </div>

          {/* CONTENT (Profile & Photo) */}
          <motion.div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              pointerEvents: "none"
            }}
          >
            {/* Cinematic Fade and Scale coordinated precisely with the Shutter timelines */}
            <motion.div
              initial={{ opacity: opacityValues[0], scale: scaleValues[0] }}
              animate={{ opacity: opacityValues, scale: scaleValues }}
              transition={{ duration: totalDuration, times: opacityTimes, ease: "easeInOut" }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}
            >
              {profile?.avatarUrl && (
                <div style={{
                  width: 140, height: 140, borderRadius: "50%",
                  padding: 4, background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                  boxShadow: "0 0 40px rgba(108, 99, 255, 0.3)"
                }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "var(--bg-card)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={profile.avatarUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
              )}
              <h1 style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: 900,
                background: "linear-gradient(135deg, #6c63ff 0%, #ff5e9c 50%, #ff985d 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "var(--accent)", 
                letterSpacing: "-0.02em",
                fontFamily: "var(--font-heading)",
                textShadow: "0 10px 30px rgba(108, 99, 255, 0.4)"
              }}>
                {profile?.name ?? "Portfolio"}
              </h1>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
