import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface LandingHeaderProps {
  className?: string;
}

const LandingHeader = forwardRef<HTMLElement, LandingHeaderProps>(
  function LandingHeader({ className }, ref) {
    return (
      <header
        ref={ref}
        className={cn(
          "absolute left-0 top-0 z-50 flex h-16 w-full items-center justify-between px-8",
          className
        )}
      >
        {/* Left: Brand + Intro */}
        <div className="flex items-center gap-3 text-base">
          <Link
            href="/"
            className="font-bold uppercase tracking-wide text-[#1A1B1C]"
          >
            Skinstric
          </Link>
          <span className="flex items-center gap-1 text-[#A0A4AB]">
            <span className="text-xs leading-none">&#x2503;</span>
            <span className="text-sm font-normal uppercase">Intro</span>
            <span className="text-xs leading-none">&#x2503;</span>
          </span>
        </div>

        {/* Right: Enter Code button */}
        <button
          className={cn(
            "bg-[#1A1B1C] px-3 py-1 text-[10px] font-bold uppercase leading-3",
            "tracking-[-0.02em] text-white",
            "border border-[#1A1B1C] transition-colors",
            "hover:bg-transparent hover:text-[#1A1B1C]"
          )}
        >
          Enter Code
        </button>
      </header>
    );
  }
);

export default LandingHeader;
