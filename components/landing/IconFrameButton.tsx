import Image from "next/image";
import { cn } from "@/lib/cn";

interface IconFrameButtonProps {
  icon: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

export default function IconFrameButton({
  icon,
  alt,
  className,
  onClick,
}: IconFrameButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex h-11 w-11 items-center justify-center",
        "rotate-45 border border-[#1A1B1C]",
        "transition-colors hover:bg-[#1A1B1C]",
        className
      )}
      aria-label={alt}
    >
      <Image
        src={icon}
        alt={alt}
        width={16}
        height={16}
        className="-rotate-45 transition-[filter] group-hover:invert"
      />
    </button>
  );
}
