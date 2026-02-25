import { forwardRef } from "react";
import { cn } from "@/lib/cn";

interface HeroCaptionProps {
  className?: string;
}

const HeroCaption = forwardRef<HTMLParagraphElement, HeroCaptionProps>(
  function HeroCaption({ className }, ref) {
    return (
      <p
        ref={ref}
        className={cn(
          "absolute bottom-8 left-15 max-w-[316px]",
          "text-sm font-normal uppercase leading-6 tracking-normal text-[#1A1B1C]",
          className
        )}
      >
        Skinstric developed an A.I. that creates a highly-personalised routine
        tailored to what your skin needs.
      </p>
    );
  }
);

export default HeroCaption;
