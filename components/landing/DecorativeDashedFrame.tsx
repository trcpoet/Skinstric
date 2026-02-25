import { cn } from "@/lib/cn";
import { forwardRef } from "react";

interface DecorativeDashedFrameProps {
  side: "left" | "right";
  className?: string;
}

const DecorativeDashedFrame = forwardRef<
  HTMLDivElement,
  DecorativeDashedFrameProps
>(function DecorativeDashedFrame({ side, className }, ref) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-1/2 hidden min-[900px]:block",
        "h-[480px] w-[480px] -translate-y-1/2 rotate-45",
        "border-2 border-dashed border-muted",
        side === "left" ? "-left-[260px]" : "-right-[260px]",
        className
      )}
    />
  );
});

export default DecorativeDashedFrame;
