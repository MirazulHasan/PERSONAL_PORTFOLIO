"use client";

import { useEffect } from "react";

export default function ClientInteractivity() {
  useEffect(() => {
    // 0. Global Reset on Page Load/Refresh
    // Ensure browser doesn't try to restore scroll from previous session
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Immediately jump to top and clear hash to ensure entry animations play correctly
    window.scrollTo({ top: 0 });
    if (typeof window !== "undefined" && window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    // 1. Scroll Reveal Animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve to trigger animation only once
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.01, 
      rootMargin: "0px" 
    });

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
