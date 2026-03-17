"use client";
import { motion, useInView } from "framer-motion";
import { Brain, FileCheck, Upload } from "lucide-react";
import { useRef } from "react";

const steps = [
    {
        icon: Upload,
        step: "01",
        title: "Upload Requirements",
        desc: "Upload your requirement document, PRD, user story, or simply paste your feature description.",
        gradient: "from-indigo-500 to-blue-500",
    },
    {
        icon: Brain,
        step: "02",
        title: "AI Analyzes Flows",
        desc: "Our AI engine analyzes functionality, maps system flows, and identifies all testable scenarios.",
        gradient: "from-cyan-500 to-blue-500",
    },
    {
        icon: FileCheck,
        step: "03",
        title: "Generate Test Artifacts",
        desc: "Get structured test cases, Cucumber feature files, Selenium scripts, and QA scenarios instantly.",
        gradient: "from-cyan-500 to-blue-500",
    },
];

export default function HowItWorksSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="how-it-works" className="relative py-32">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

            <div ref={ref} className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <span className="text-sm font-semibold text-cyan-400 tracking-widest uppercase mb-4 block">
                        How It Works
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Three Steps to{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Automated Testing
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        From requirements to test automation in minutes, not days.
                    </p>
                </motion.div>

                <div className="relative grid md:grid-cols-3 gap-8">
                    {/* Connecting line (desktop) */}
                    <div className="hidden md:block absolute top-20 left-[16%] right-[16%] h-px">
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={isInView ? { scaleX: 1 } : {}}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-indigo-500/50 via-blue-500/50 to-cyan-500/50 origin-left"
                        />
                    </div>

                    {steps.map((step, i) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 + i * 0.2 }}
                            className="relative text-center"
                        >
                            {/* Step circle */}
                            <div className="relative mx-auto mb-6">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/20`}>
                                    <step.icon className="w-8 h-8 text-white" />
                                </div>
                                <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#030712] border-2 border-white/20 flex items-center justify-center`}>
                                    <span className="text-xs font-bold text-white">{step.step}</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
