"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  if (!mounted) {
    return <div style={{ width: 48, height: 24 }} />;
  }

  return (
    <label className="switch">
      <input 
        className="switch__input" 
        type="checkbox" 
        role="switch" 
        checked={theme === "light"} 
        onChange={toggle} 
      />
      <span className="switch__icon">
        <span className="switch__icon-part switch__icon-part--1"></span>
        <span className="switch__icon-part switch__icon-part--2"></span>
        <span className="switch__icon-part switch__icon-part--3"></span>
        <span className="switch__icon-part switch__icon-part--4"></span>
        <span className="switch__icon-part switch__icon-part--5"></span>
        <span className="switch__icon-part switch__icon-part--6"></span>
        <span className="switch__icon-part switch__icon-part--7"></span>
        <span className="switch__icon-part switch__icon-part--8"></span>
        <span className="switch__icon-part switch__icon-part--9"></span>
        <span className="switch__icon-part switch__icon-part--10"></span>
        <span className="switch__icon-part switch__icon-part--11"></span>
      </span>
      <span className="switch__sr">Toggle Theme</span>
    </label>
  );
}
