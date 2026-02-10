import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayButtonProps {
  size?: "sm" | "lg";
  className?: string;
  onClick?: () => void;
}

export function PlayButton({ size = "lg", className, onClick }: PlayButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full bg-primary text-black flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-black/40 hover:bg-[#1ed760]",
        size === "lg" ? "w-14 h-14" : "w-10 h-10",
        className
      )}
    >
      <Play fill="currentColor" className={cn(size === "lg" ? "ml-1 w-7 h-7" : "ml-0.5 w-5 h-5")} />
    </button>
  );
}
