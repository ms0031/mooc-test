"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    try {
      // Check for saved theme preference
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      // Set initial theme based on saved preference or system preference
      if (savedTheme) {
        setTheme(savedTheme);
        // Remove dark class first, then add it if needed
        document.documentElement.classList.remove("dark");
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
        }
      } else if (prefersDark) {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      }
    } catch (error) {
      console.error("Error initializing theme:", error);
    }
  }, []);

  const value = {
    theme,
    setTheme: (newTheme: string) => {
      try {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        // Instead of toggle, explicitly remove/add for more reliable behavior
        if (newTheme === "dark") {
          document.documentElement.classList.remove("light");
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
        }
      } catch (error) {
        console.error("Error setting theme:", error);
      }
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};