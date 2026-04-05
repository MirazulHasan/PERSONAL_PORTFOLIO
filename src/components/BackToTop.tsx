"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after 500px scroll, but keep it visible if we're scrolling to top
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    // Explicit manual smooth scroll since CSS behavior was removed for reliability
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          onClick={scrollToTop}
          // Simplified hover to avoid coordinate-fighting with entry/exit
          whileHover={{ scale: 1.1, backgroundColor: "#6c63ff" }}
          whileTap={{ scale: 0.9 }}
          layout // Smoothly handle state changes
          style={{
            position: "fixed",
            bottom: "40px",
            right: "40px",
            zIndex: 9999, // Ensure it's above reveal headers
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6c63ff, #ff6584)",
            color: "white",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(108, 99, 255, 0.3)",
            backdropFilter: "blur(4px)",
            WebkitBackfaceVisibility: "hidden", // Force GPU rendering
          }}
          title="Back to Top"
        >
          <ArrowUp size={24} strokeWidth={3} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
