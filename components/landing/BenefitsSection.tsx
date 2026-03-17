"use client";
import { motion, useInView } from "framer-motion";
import { Brain, ShieldCheck, Workflow, Zap } from "lucide-react";
import { useRef } from "react";

const benefits = [
    {
        icon: Zap,
        title: "Faster Testing",
        desc: "Generate comprehensive test suites in minutes instead of hours. Ship faster with confidence.",
        gradient: "from-yellow-500 to-orange-500",
    },
    {
        icon: ShieldCheck,
        title: "Better Test Coverage",
        desc: "AI identifies edge cases and boundary conditions that manual testing often misses.",
        gradient: "from-emerald-500 to-cyan-500",
    },
    {
        icon: Brain,
        title: "AI-Powered QA",
        desc: "Leverage advanced AI to understand requirements and generate intelligent test scenarios.",
        gradient: "from-indigo-500 to-cyan-500",
    },
    {
        icon: Workflow,
        title: "Developer Friendly",
        desc: "Seamless workflow integration. Export to your favorite tools and CI/CD pipelines.",
        gradient: "from-blue-500 to-indigo-500",
    },
];

export default function BenefitsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="relative py-32">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

            <div ref={ref} className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="text-sm font-semibold text-emerald-400 tracking-widest uppercase mb-4 block">
                        Benefits
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Built for{" "}
                        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            Modern QA Teams
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Empower your team with AI-driven testing tools designed for scale and speed.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 gap-6">
                    {benefits.map((b, i) => (
                        <motion.div
                            key={b.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 * i }}
                            className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500 hover:-translate-y-1"
                        >
                            {/* Glow */}
                            <div className={`absolute top-8 left-8 w-14 h-14 bg-gradient-to-br ${b.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${b.gradient} flex items-center justify-center mb-5 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                                <b.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">{b.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{b.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
