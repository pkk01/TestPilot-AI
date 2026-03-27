"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { BackgroundPaths } from "@/components/ui/background-paths";

export default function NewHeroSection() {
    return (
        <section id="home">
            <BackgroundPaths>
                <div className="pt-24 md:pt-0">

                    {/* Heading */}
                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 tracking-tighter">
                        {"AI That Generates".split(" ").map((word, wordIndex) => (
                            <span
                                key={wordIndex}
                                className="inline-block mr-3 sm:mr-4 last:mr-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay:
                                                wordIndex * 0.1 +
                                                letterIndex * 0.03,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 25,
                                        }}
                                        className="inline-block text-transparent bg-clip-text 
                                        bg-gradient-to-r from-white to-white/80"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                        <br className="hidden sm:block" />
                        {"Your Test Cases".split(" ").map((word, wordIndex) => (
                            <span
                                key={`line2-${wordIndex}`}
                                className="inline-block mr-3 sm:mr-4 last:mr-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`l2-${wordIndex}-${letterIndex}`}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay:
                                                0.3 +
                                                wordIndex * 0.1 +
                                                letterIndex * 0.03,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 25,
                                        }}
                                        className="inline-block text-transparent bg-clip-text 
                                        bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed px-4"
                    >
                        TestPilot AI automatically generates high-quality test cases, 
                        automation scripts, and BDD scenarios from your requirements. 
                        Reduce manual QA effort by 70% and ship faster with AI.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
                    >
                        <div className="bg-white/10 rounded-[14px] border border-white/10 p-0.5">
                            <Link
                                href="/signup"
                                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-base hover:from-indigo-500 hover:to-cyan-500 transition-all shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40"
                            >
                                <span className="text-nowrap">Try TestPilot AI</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <a
                            href="#features"
                            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl text-gray-300 font-semibold text-base hover:bg-white/5 transition-all"
                        >
                            <Play className="w-5 h-5" />
                            <span className="text-nowrap">See Features</span>
                        </a>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3 }}
                        className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12 md:mt-16 pt-8 border-t border-white/5"
                    >
                        {[
                            { value: "70%", label: "Faster QA" },
                            { value: "10K+", label: "Tests Generated" },
                            { value: "99%", label: "Accuracy" },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </BackgroundPaths>
        </section>
    );
}
