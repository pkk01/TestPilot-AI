"use client";

import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { motion } from "framer-motion";
import Link from "next/link";

const words = [
  { text: "requirements" },
  { text: "user stories" },
  { text: "edge cases" },
  { text: "acceptance criteria" },
  { text: "product ideas" },
];

export default function TypewriterSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 md:p-12 text-center"
        >
          <p className="text-sm md:text-base text-gray-400 mb-6">
            From product intent to execution-ready automation
          </p>

          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight whitespace-nowrap">
            Turn your{" "}
            <TypewriterEffect
              words={words}
              className="inline-flex"
              typingSpeed={65}
              deletingSpeed={35}
              pauseTime={1300}
            />
            <span className="text-white"> into test-ready scenarios</span>
          </h2>

          <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="w-full md:w-44 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-sm font-semibold inline-flex items-center justify-center hover:from-indigo-500 hover:to-cyan-500 transition-colors"
            >
              Start Free
            </Link>
            <Link
              href="/generate"
              className="w-full md:w-44 h-11 rounded-xl border border-white/15 text-gray-200 text-sm font-semibold inline-flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              See Generator
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
