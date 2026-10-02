'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Helper to convert hex to RGB values
function hexToRgb(hex) {
  if (!hex) return '2, 132, 199';
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return `${r}, ${g}, ${b}`;
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '2, 132, 199';
}

// Helper to darken hex color for hover states
function adjustBrightness(hex, percent) {
  if (!hex || hex[0] !== '#') return hex;
  const num = parseInt(hex.slice(1), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00FF) + percent;
  let b = (num & 0x0000FF) + percent;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function ThemeProvider({ children, initialThemeSettings }) {
  const [themeMode, setThemeMode] = useState('light');
  const [customColors, setCustomColors] = useState({
    primary: initialThemeSettings?.primaryColor || '#0284c7',
    primaryHover: initialThemeSettings?.primaryHover || '#0369a1',
    accent: initialThemeSettings?.accentColor || '#059669',
    accentHover: initialThemeSettings?.accentHover || '#047857'
  });

  // Load saved theme mode from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('doctor_theme_mode');
      if (saved === 'dark' || saved === 'light') {
        setThemeMode(saved);
      } else if (initialThemeSettings?.defaultTheme) {
        setThemeMode(initialThemeSettings.defaultTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setThemeMode('dark');
      }
    } catch (e) {
      // ignore
    }
  }, [initialThemeSettings]);

  // Apply theme class to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (themeMode === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    }
  }, [themeMode]);

  // Apply dynamic color variables to root CSS
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--primary', customColors.primary);
      root.style.setProperty('--primary-hover', customColors.primaryHover);
      root.style.setProperty('--primary-rgb', hexToRgb(customColors.primary));
      root.style.setProperty('--accent', customColors.accent);
      root.style.setProperty('--accent-hover', customColors.accentHover);
      root.style.setProperty('--accent-rgb', hexToRgb(customColors.accent));
    }
  }, [customColors]);

  const toggleThemeMode = () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(next);
    try {
      localStorage.setItem('doctor_theme_mode', next);
    } catch (e) {
      // ignore
    }
  };

  const updateCustomColors = (newColors) => {
    const primary = newColors.primaryColor || newColors.primary || customColors.primary;
    const accent = newColors.accentColor || newColors.accent || customColors.accent;
    const primaryHover = newColors.primaryHover || adjustBrightness(primary, -25);
    const accentHover = newColors.accentHover || adjustBrightness(accent, -25);

    setCustomColors({
      primary,
      primaryHover,
      accent,
      accentHover
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        toggleThemeMode,
        customColors,
        updateCustomColors
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
