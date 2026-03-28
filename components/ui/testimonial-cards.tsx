"use client";

import * as React from 'react';
import { motion } from 'framer-motion';

interface TestimonialCardProps {
  handleShuffle: () => void;
  testimonial: string;
  position: string;
  id: number;
  author: string;
}

const avatarGradients = [
  "from-emerald-400 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-blue-500 to-indigo-500",
  "from-rose-400 to-pink-500",
];

function getInitials(author: string) {
  const name = author.split("—")[0].trim();
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialCard({ handleShuffle, testimonial, position, id, author }: TestimonialCardProps) {
  const dragRef = React.useRef(0);
  const isFront = position === "front";
  const gradient = avatarGradients[id % avatarGradients.length];

  return (
    <motion.div
      style={{
        zIndex: position === "front" ? "3" : position === "middle" ? "2" : "1",
      }}
      animate={{
        rotate: position === "front" ? "-6deg" : position === "middle" ? "0deg" : "6deg",
        x: position === "front" ? "0%" : position === "middle" ? "33%" : "66%",
        opacity: position === "front" ? 1 : position === "middle" ? 0.85 : 0.6,
      }}
      drag={true}
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onDragStart={(e: any) => {
        dragRef.current = e.clientX;
      }}
      onDragEnd={(e: any) => {
        if (dragRef.current - e.clientX > 100) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.35, type: "spring", stiffness: 200, damping: 25 }}
      className={`absolute left-0 top-0 grid h-[420px] w-[340px] select-none place-content-center space-y-5 rounded-2xl border border-white/[0.08] p-8 shadow-2xl ${
        isFront ? "cursor-grab active:cursor-grabbing" : ""
      }`}
      // Glassmorphism via inline style for proper backdrop-filter
      layoutId={`card-${id}`}
    >
      {/* Glass background */}
      <div className="absolute inset-0 rounded-2xl bg-slate-900/40 backdrop-blur-xl" />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent" />

      {/* Content on top of glass */}
      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Avatar */}
        <div
          className={`h-16 w-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shadow-black/30 border border-white/10`}
        >
          <span className="text-xl font-bold text-white">{getInitials(author)}</span>
        </div>

        {/* Testimonial text */}
        <p className="text-center text-[15px] italic text-slate-300/90 leading-relaxed">
          &quot;{testimonial}&quot;
        </p>

        {/* Author */}
        <span className="text-center text-sm font-medium text-indigo-400">
          {author}
        </span>
      </div>
    </motion.div>
  );
}
