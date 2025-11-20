import * as React from "react";
import Image from "next/image";
import { cn } from "@/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  sm: "h-8",
  md: "h-10",
  lg: "h-16",
};

export function Logo({ size = "md", className, animated = true }: LogoProps) {
  return (
    <div
      className={cn(
        sizeClasses[size],
        "relative",
        "drop-shadow-[0_0_12px_rgba(226,232,240,0.3)]",
        "transition-all duration-300",
        "group-hover:drop-shadow-[0_0_20px_rgba(226,232,240,0.5)]",
        animated && "animate-float-subtle",
        className
      )}
    >
      <Image
        src="/logo.svg"
        alt="Noctalys"
        width={622}
        height={362}
        className="h-full w-auto"
        priority
      />
    </div>
  );
}
