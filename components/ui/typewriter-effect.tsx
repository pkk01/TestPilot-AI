"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type TypewriterWord = {
  text: string;
  className?: string;
};

type TypewriterEffectProps = {
  words: TypewriterWord[];
  className?: string;
  cursorClassName?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
};

export function TypewriterEffect({
  words,
  className,
  cursorClassName,
  typingSpeed = 70,
  deletingSpeed = 40,
  pauseTime = 1400,
}: TypewriterEffectProps) {
  const wordList = useMemo(() => words.map((word) => word.text), [words]);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!wordList.length) return;

    const currentWord = wordList[wordIndex % wordList.length];
    const isWordComplete = charIndex === currentWord.length;
    const isWordEmpty = charIndex === 0;

    const timeout = setTimeout(() => {
      if (!isDeleting && isWordComplete) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && isWordEmpty) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % wordList.length);
        return;
      }

      setCharIndex((prev) => (isDeleting ? prev - 1 : prev + 1));
    }, !isDeleting && isWordComplete ? pauseTime : isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, deletingSpeed, isDeleting, pauseTime, typingSpeed, wordIndex, wordList]);

  const currentWord = words[wordIndex % words.length];
  const renderedText = currentWord?.text.slice(0, charIndex) ?? "";

  return (
    <div className={cn("inline-flex items-center", className)}>
      <span
        className={cn(
          "bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent",
          currentWord?.className
        )}
      >
        {renderedText}
      </span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        className={cn("ml-1 inline-block h-[1em] w-[2px] bg-cyan-400", cursorClassName)}
      />
    </div>
  );
}
