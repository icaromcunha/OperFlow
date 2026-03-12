import React, { useState } from "react";
import { useTheme } from "../ThemeProvider";

export function Logo({ className = "size-10", variant = "system" }: { className?: string; variant?: "login" | "system" }) {
  const [imgError, setImgError] = useState(false);
  
  // Hardcoded Google Drive links as requested
  const logoSrc = variant === "login" 
    ? "https://drive.google.com/uc?id=1WT51iEfFcC6-7s1eVgA5NOWd0BnbsMWt" // Horizontal logo for login
    : "https://drive.google.com/uc?id=1XdTLyPyRLzrwpbfmlGmw2zs1pgihocFC"; // Standard logo

  if (!imgError) {
    return (
      <div className={`${className} flex items-center justify-center overflow-hidden`}>
        <img 
          src={logoSrc} 
          alt="Logo" 
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className={`${className} flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7A18" />
            <stop offset="100%" stopColor="#7B3FE4" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Main interlocking loops */}
        <g fill="none" stroke="url(#logoGradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)">
          {/* Outer loop - infinity style */}
          <path d="M30 50 C30 35 45 25 50 25 C55 25 70 35 70 50 C70 65 55 75 50 75 C45 75 30 65 30 50 Z" />
          
          {/* Interlocking inner loop */}
          <path d="M50 25 C65 25 80 40 80 50 C80 60 65 75 50 75 C35 75 20 60 20 50 C20 40 35 25 50 25" opacity="0.8" />
          
          {/* Arrows indicating flow and growth */}
          <path d="M50 25 L60 15 M50 25 L40 15" strokeWidth="6" />
          <path d="M50 75 L60 85 M50 75 L40 85" strokeWidth="6" />
          
          {/* Central connecting node */}
          <circle cx="50" cy="50" r="4" fill="url(#logoGradient)" stroke="none" />
        </g>
      </svg>
    </div>
  );
}
