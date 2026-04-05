"use client";

import { useEffect } from "react";

export default function ClientInteractivity() {
  useEffect(() => {
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
