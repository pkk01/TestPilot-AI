"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AlertTriangle, Clock, FileWarning, RefreshCcw } from "lucide-react";

const painPoints = [
    { icon: Clock, text: "Hours spent writing repetitive test cases" },
    { icon: FileWarning, text: "Inconsistent test coverage across features" },
    { icon: RefreshCcw, text: "Outdated tests after every sprint" },
    { icon: AlertTriangle, text: "Critical edge cases missed by manual QA" },
];

export default function ProblemSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="relative py-32 overflow-hidden">
            {/* Gradient separator */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

            <div ref={ref} className="max-w-5xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                >
                    <span className="text-sm font-semibold text-red-400/80 tracking-widest uppercase mb-4 block">
                        The Problem
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                            Manual Test Case Writing
                        </span>
                        <br />
                        <span className="text-white">is Slow</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-16 leading-relaxed">
                        QA teams spend hours writing repetitive test cases. TestPilot AI analyzes requirements and generates accurate test cases instantly — so your team can focus on what matters.
                    </p>
                </motion.div>

                {/* Pain point cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {painPoints.map((point, i) => (
                        <motion.div
                            key={point.text}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                            className="group p-5 rounded-2xl bg-red-500/5 border border-red-500/10 hover:border-red-500/20 hover:bg-red-500/10 transition-all duration-300"
                        >
                            <point.icon className="w-8 h-8 text-red-400/70 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                {point.text}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Floating glass card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="mt-16 inline-block"
                >
                    <div className="relative px-8 py-5 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-xl">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl" />
                        <div className="relative flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-lg font-semibold text-white">
                                AI Generated Test Cases →
                            </span>
                            <span className="text-lg text-purple-300 font-bold">Ready in seconds</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
