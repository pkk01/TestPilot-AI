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

const features = [
    {
        icon: Cpu,
        title: "AI Test Case Generator",
        desc: "Automatically generate comprehensive test cases from requirements, user stories, or PRDs in seconds.",
        gradient: "from-indigo-500 to-blue-500",
        glow: "indigo",
    },
    {
        icon: Code2,
        title: "Selenium Script Generation",
        desc: "Get ready-to-run Selenium Java automation scripts generated from your test scenarios.",
        gradient: "from-cyan-500 to-blue-500",
        glow: "cyan",
    },
    {
        icon: FileCode2,
        title: "Cucumber Feature Files",
        desc: "Generate Gherkin-syntax Cucumber feature files with Given/When/Then steps instantly.",
        gradient: "from-cyan-500 to-blue-500",
        glow: "cyan",
    },
    {
        icon: Search,
        title: "Smart Edge Case Detection",
        desc: "AI identifies boundary conditions, negative scenarios, and edge cases humans often miss.",
        gradient: "from-amber-500 to-orange-500",
        glow: "amber",
    },
    {
        icon: BarChart3,
        title: "Test Coverage Suggestions",
        desc: "Get AI-powered recommendations to improve your test coverage and identify gaps.",
        gradient: "from-emerald-500 to-green-500",
        glow: "emerald",
    },
    {
        icon: Download,
        title: "Export to QA Tools",
        desc: "Export generated test cases to Jira, TestRail, Zephyr, or download as CSV/Excel files.",
        gradient: "from-blue-500 to-indigo-500",
        glow: "blue",
    },
];

const glowColors: Record<string, string> = {
    indigo: "group-hover:shadow-indigo-500/20",
    cyan: "group-hover:shadow-cyan-500/20",
    amber: "group-hover:shadow-amber-500/20",
    emerald: "group-hover:shadow-emerald-500/20",
    blue: "group-hover:shadow-blue-500/20",
};

export default function FeaturesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="features" className="relative py-32">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

            <div ref={ref} className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="text-sm font-semibold text-indigo-400 tracking-widest uppercase mb-4 block">
                        Features
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Everything You Need for{" "}
                        <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            AI-Powered QA
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        A complete suite of intelligent tools to automate your testing workflow from requirements to automation scripts.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 * i }}
                            className={`group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500 cursor-default shadow-xl shadow-transparent ${glowColors[f.glow]} hover:-translate-y-1`}
                        >
                            {/* Glow behind icon */}
                            <div className={`absolute top-6 left-6 w-12 h-12 bg-gradient-to-br ${f.gradient} rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />

                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <f.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
