"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

interface TextRevealCardProps {
  text: string;
  revealText: string;
  children: ReactNode;
}

export const TextRevealCard = ({
  text,
  revealText,
  children,
}: TextRevealCardProps) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsRevealed(true)}
      onHoverEnd={() => setIsRevealed(false)}
      className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-background-card to-background-card/50 border border-border p-8 cursor-pointer overflow-hidden"
    >
      <div className="relative h-40 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isRevealed ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <p className="text-2xl font-bold text-center text-white">{text}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isRevealed ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <p className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {revealText}
          </p>
        </motion.div>
      </div>

      <div className="mt-6 relative z-10">{children}</div>
    </motion.div>
  );
};

export const TextRevealCardTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="text-lg font-semibold text-foreground mb-2">{children}</h3>
);

export const TextRevealCardDescription = ({ children }: { children: ReactNode }) => (
  <p className="text-sm text-foreground-muted leading-relaxed">{children}</p>
);
