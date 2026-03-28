"use client";

import { motion, useInView } from "framer-motion";
import {
    BarChart3,
    Code2,
    Cpu,
    Download,
    FileCode2,
    Search,
} from "lucide-react";
import { useRef } from "react";
import { GlowCard } from "@/components/ui/spotlight-card";

const features = [
    {
        icon: Cpu,
        title: "AI Test Case Generator",
        desc: "Automatically generate comprehensive test cases from requirements, user stories, or PRDs in seconds.",
        glow: "indigo" as const,
        gradient: "from-indigo-500 to-blue-500",
    },
    {
        icon: Code2,
        title: "Selenium Script Generation",
        desc: "Get ready-to-run Selenium Java automation scripts generated from your test scenarios.",
        glow: "cyan" as const,
        gradient: "from-cyan-500 to-blue-500",
    },
    {
        icon: FileCode2,
        title: "Cucumber Feature Files",
        desc: "Generate Gherkin-syntax Cucumber feature files with Given/When/Then steps instantly.",
        glow: "green" as const,
        gradient: "from-emerald-500 to-cyan-500",
    },
    {
        icon: Search,
        title: "Smart Edge Case Detection",
        desc: "AI identifies boundary conditions, negative scenarios, and edge cases humans often miss.",
        glow: "orange" as const,
        gradient: "from-amber-500 to-orange-500",
    },
    {
        icon: BarChart3,
        title: "Test Coverage Suggestions",
        desc: "Get AI-powered recommendations to improve your test coverage and identify gaps.",
        glow: "purple" as const,
        gradient: "from-purple-500 to-indigo-500",
    },
    {
        icon: Download,
        title: "Export to Automation",
        desc: "One-click export to Selenium & Playwright projects. Download ready-to-run automation ZIP files.",
        glow: "blue" as const,
        gradient: "from-blue-500 to-indigo-500",
    },
];

export default function NewFeaturesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="features" className="relative py-24 md:py-32 bg-[#030712]">
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

            <div ref={ref} className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="text-sm font-semibold text-indigo-400 tracking-widest uppercase mb-4 block">
                        Features
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                        Everything You Need for{" "}
                        <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            AI-Powered QA
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
                        A complete suite of intelligent tools to automate your testing
                        workflow from requirements to automation scripts.
                    </p>
                </motion.div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 * i }}
                        >
                            <GlowCard
                                glowColor={f.glow}
                                className="h-full hover:-translate-y-1 transition-transform duration-300"
                            >
                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div
                                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg`}
                                    >
                                        <f.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {f.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        {f.desc}
                                    </p>
                                </div>
                            </GlowCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
