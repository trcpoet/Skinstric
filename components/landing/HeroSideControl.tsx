"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

interface HeroSideControlProps {
  label: string;
  side: "left" | "right";
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const HeroSideControl = forwardRef<HTMLDivElement, HeroSideControlProps>(
  function HeroSideControl({ label, side, className, onClick, onMouseEnter, onMouseLeave }, ref) {
    return (
      <div
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cn(
          "flex items-center gap-4",
          side === "right" && "flex-row-reverse",
          className
        )}
      >
        <button
          onClick={onClick}
          className="group transition-opacity hover:opacity-80 flex items-center justify-center outline-none"
          aria-label={label}
        >
          {side === "left" ? (
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M43.293 22L22 43.293L0.707031 22L22 0.707031L43.293 22Z" stroke="#1A1B1C" className="transition-colors group-hover:fill-[#1A1B1C]"/>
              <path d="M15.7144 22L25.1429 27.4436V16.5564L15.7144 22Z" fill="#1A1B1C" className="transition-colors group-hover:fill-white"/>
            </svg>
          ) : (
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M43.293 22L22 43.293L0.707031 22L22 0.707031L43.293 22Z" stroke="#1A1B1C" className="transition-colors group-hover:fill-[#1A1B1C]"/>
              <path d="M28.1426 22L18.714 27.4436V16.5564L28.1426 22Z" fill="#1A1B1C" className="transition-colors group-hover:fill-white"/>
            </svg>
          )}
        </button>
        <span className="text-sm font-bold tracking-wide text-[#1A1B1C]">
          {label}
        </span>
      </div>
    );
  }
);

export default HeroSideControl;
