"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="relative py-32">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />

            <div ref={ref} className="max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ duration: 0.8 }}
                    className="relative rounded-3xl overflow-hidden"
                >
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-cyan-600/20" />
                    <div className="absolute inset-0 bg-[#030712]/60 backdrop-blur-xl" />

                    {/* Glowing orbs */}
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />

                    {/* Border glow */}
                    <div className="absolute inset-0 rounded-3xl border border-white/10" />

                    {/* Content */}
                    <div className="relative px-8 py-20 md:px-16 md:py-24 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                <span className="text-white">Start Testing</span>{" "}
                                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                                    Smarter with AI
                                </span>
                            </h2>
                            <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10">
                                Automate your QA workflow and generate test cases instantly. No credit card required.
                            </p>

                            <div className="flex flex-wrap justify-center gap-4">
                                <Link
                                    href="/signup"
                                    className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-base hover:from-purple-500 hover:to-pink-500 transition-all shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 flex items-center gap-2"
                                >
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a
                                    href="#docs"
                                    className="group px-8 py-4 rounded-2xl border border-white/10 text-gray-300 font-semibold text-base hover:bg-white/5 hover:border-white/20 transition-all flex items-center gap-2"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    View Documentation
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
