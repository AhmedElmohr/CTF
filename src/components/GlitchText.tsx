"use client";

import clsx from "clsx";

interface GlitchTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
  className?: string;
}

export default function GlitchText({
  text,
  as: Component = "span",
  className = "",
}: GlitchTextProps) {
  return (
    <Component className={clsx("font-bold tracking-wider uppercase", className)}>
      <span className="glitch-wrapper" data-text={text}>
        {text}
      </span>
    </Component>
  );
}
