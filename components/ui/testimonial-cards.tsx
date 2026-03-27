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
  "from-indigo-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-emerald-500 to-cyan-500",
  "from-amber-500 to-orange-500",
  "from-blue-500 to-indigo-500",
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
        zIndex: position === "front" ? "3" : position === "middle" ? "2" : "1"
      }}
      animate={{
        rotate: position === "front" ? "-2deg" : position === "middle" ? "2deg" : "6deg",
        scale: position === "front" ? 1 : position === "middle" ? 0.95 : 0.9,
        x: position === "front" ? "0%" : position === "middle" ? "15%" : "30%",
        opacity: position === "front" ? 1 : position === "middle" ? 0.7 : 0.4,
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
      className={`absolute left-0 top-0 grid h-[400px] w-[320px] select-none place-content-center space-y-5 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-md ${
        isFront ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      {/* Avatar with initials */}
      <div
        className={`mx-auto h-20 w-20 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg border-2 border-white/10`}
      >
        <span className="text-2xl font-bold text-white">{getInitials(author)}</span>
      </div>
      <span className="text-center text-base italic text-slate-400 leading-relaxed">&quot;{testimonial}&quot;</span>
      <span className="text-center text-sm font-medium text-indigo-400">{author}</span>
    </motion.div>
  );
}
