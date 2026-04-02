"use client";

import { useState } from "react";
import ExperienceCard from "./ExperienceCard";

interface ExperienceSectionProps {
  experience: any[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const handleHoverIn = (idx: number) => {
    setHoveredIndex(idx);
  };

  const handleHoverOut = () => {
    setHoveredIndex(null);
  };

  return (
    <div 
      onMouseLeave={handleHoverOut}
      style={{ display: "flex", flexDirection: "column", gap: 32, position: "relative" }}
    >
      {experience.map((exp: any, idx: number) => (
        <ExperienceCard 
          key={exp.id} 
          exp={exp} 
          ordinal={getOrdinal(idx + 1)}
          isExpanded={idx === (hoveredIndex)}
          onHover={() => handleHoverIn(idx)}
        />
      ))}
    </div>
  );
}
