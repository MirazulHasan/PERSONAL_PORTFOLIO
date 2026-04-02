"use client";

import { useState } from "react";
import PublicationCard from "./PublicationCard";

interface PublicationSectionProps {
  publications: any[];
}

export default function PublicationSection({ publications }: PublicationSectionProps) {
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
      style={{ display: "flex", flexDirection: "column", gap: 24, position: "relative" }}
    >
      {publications.map((pub: any, idx: number) => (
        <PublicationCard 
          key={pub.id} 
          pub={pub} 
          ordinal={getOrdinal(idx + 1)}
          isExpanded={idx === (hoveredIndex)}
          onHover={() => handleHoverIn(idx)}
        />
      ))}
    </div>
  );
}
