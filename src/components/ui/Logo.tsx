import React, { useState } from "react";
import { Rocket } from "lucide-react";

export function Logo({ className = "size-10" }: { className?: string }) {
  return (
    <div className={`${className} rounded-xl flex items-center justify-center shadow-lg shadow-brand-orange/20 overflow-hidden bg-white p-1`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7A18" />
            <stop offset="100%" stopColor="#7B3FE4" />
          </linearGradient>
        </defs>
        <path 
          d="M20 30 L50 10 L80 30 L80 70 L50 90 L20 70 Z" 
          fill="none" 
          stroke="url(#logoGradient)" 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M35 50 L50 35 L65 50 M35 65 L50 50 L65 65" 
          fill="none" 
          stroke="url(#logoGradient)" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M50 35 L50 65" 
          fill="none" 
          stroke="url(#logoGradient)" 
          strokeWidth="6" 
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
