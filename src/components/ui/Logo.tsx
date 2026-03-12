import React, { useState } from "react";
import { useTheme } from "../ThemeProvider";

export function Logo({ className = "size-10", variant = "system" }: { className?: string; variant?: "login" | "system" }) {
  const [imgError, setImgError] = useState(false);
  
  // Hardcoded Google Drive links
  // Standard direct link format
  const logoSrc = variant === "login" 
    ? "https://drive.google.com/uc?id=1WT51iEfFcC6-7s1eVgA5NOWd0BnbsMWt" // Horizontal logo for login
    : "https://drive.google.com/uc?id=1XdTLyPyRLzrwpbfmlGmw2zs1pgihocFC"; // Standard logo

  const containerClasses = `${className} flex items-center justify-center overflow-hidden ${variant === 'login' ? 'min-h-[100px]' : 'min-h-[40px]'}`;

  if (!imgError) {
    return (
      <div className={containerClasses}>
        <img 
          key={logoSrc}
          src={logoSrc} 
          alt="Logo" 
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Fallback UI - Simple and clean
  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center justify-center">
        <div className="bg-brand-orange text-white font-black text-2xl px-4 py-2 rounded-xl italic shadow-lg">
          OPERFLOW
        </div>
        {variant === 'login' && (
          <div className="mt-2 text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em]">
            Gestão Inteligente
          </div>
        )}
      </div>
    </div>
  );
}
