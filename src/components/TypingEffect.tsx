"use client";

import { useState, useEffect } from "react";

interface TypingEffectProps {
  text: string | string[];
  speed?: number;
  delay?: number;
  loop?: boolean;
  className?: string;
}

export default function TypingEffect({
  text,
  speed = 50,
  delay = 1000,
  loop = false,
  className = "",
}: TypingEffectProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [arrayIndex, setArrayIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const textArray = Array.isArray(text) ? text : [text];
    const currentString = textArray[arrayIndex];

    if (!loop && !Array.isArray(text) && currentIndex === currentString.length) {
      return;
    }

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentIndex < currentString.length) {
          setDisplayText((prev) => prev + currentString[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        } else if (loop || arrayIndex < textArray.length - 1) {
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        if (currentIndex > 0) {
          setDisplayText((prev) => prev.slice(0, -1));
          setCurrentIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
          setArrayIndex((prev) => (prev + 1) % textArray.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, text, speed, delay, loop, arrayIndex]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-blink-caret border-r-4 border-hacker-green ml-1 inline-block h-[1em] translate-y-1"></span>
    </span>
  );
}
