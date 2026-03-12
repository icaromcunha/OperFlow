import React, { useState } from "react";
import logoSystem from "../../../logo.png";
import logoLogin from "../../../logoh.png";

export function Logo({ className = "size-10", variant = "system" }: { className?: string; variant?: "login" | "system" }) {
  const [imgError, setImgError] = useState(false);

  const logoSrc = variant === "login" ? logoLogin : logoSystem;
  const containerClasses = `${className} flex items-center justify-center overflow-hidden ${variant === "login" ? "min-h-[100px]" : "min-h-[40px]"}`;

  if (!imgError) {
    return (
      <div className={containerClasses}>
        <img
          key={logoSrc}
          src={logoSrc}
          alt="OperFlow"
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="bg-brand-orange text-white font-black text-2xl px-4 py-2 rounded-xl italic shadow-lg">
        OPERFLOW
      </div>
    </div>
  );
}
