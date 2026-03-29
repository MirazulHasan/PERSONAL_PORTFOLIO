"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import EducationCard from "./EducationCard";

interface EducationSectionProps {
  education: any[];
}

export default function EducationSection({ education }: EducationSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const count = education.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const startSequence = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((current) => {
        if (current === null) return 0;
        return (current + 1) % count;
      });
    }, 4000);
  }, [count]);

  useEffect(() => {
    if (count === 0) return;
    
    // Initial start
    if (!isPaused && hoveredIndex === null) {
        if (activeIndex === null) {
            const initialTimeout = setTimeout(() => {
                setActiveIndex(0);
                startSequence();
            }, 1000);
            return () => clearTimeout(initialTimeout);
        } else {
            startSequence();
        }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, count, hoveredIndex, startSequence, activeIndex]);

  const handleHoverIn = (idx: number) => {
    setHoveredIndex(idx);
    setIsPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleHoverOut = () => {
    const lastHovered = hoveredIndex;
    setHoveredIndex(null);
    setIsPaused(false);
    
    if (lastHovered !== null) {
        setActiveIndex(lastHovered); 
    }
  };

  return (
    <div 
      onMouseLeave={handleHoverOut}
      style={{ display: "flex", flexDirection: "column", gap: 40, position: "relative", paddingLeft: 20 }}
    >
      {education.map((edu: any, idx: number) => (
        <EducationCard 
          key={edu.id} 
          edu={edu} 
          idx={idx} 
          ordinal={getOrdinal(idx + 1)} 
          isExpanded={idx === (hoveredIndex ?? activeIndex)}
          onHover={() => handleHoverIn(idx)}
        />
      ))}
    </div>
  );
}
