"use client";
import { motion, useInView } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useRef } from "react";

const testimonials = [
    {
        quote: "TestPilot AI reduced our QA test writing time by 70%. It's like having an extra QA engineer on the team.",
        name: "Sarah Chen",
        role: "Lead QA Engineer",
        company: "TechFlow Inc.",
    },
    {
        quote: "We went from 2 days of manual test case writing to 30 minutes. The edge case detection is incredible.",
        name: "Marcus Johnson",
        role: "Engineering Manager",
        company: "DevScale Labs",
    },
    {
        quote: "The Cucumber feature file generation is a game changer. Our BDD workflow is now fully automated.",
        name: "Priya Patel",
        role: "Senior SDET",
        company: "CloudNova",
    },
];

const companyNames = [
    "TechFlow", "DevScale", "CloudNova", "DataPulse", "CodeVerse", "NexGen"
];

export default function SocialProofSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="relative py-32">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

            <div ref={ref} className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="text-sm font-semibold text-blue-400 tracking-widest uppercase mb-4 block">
                        Social Proof
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Trusted by{" "}
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Modern QA Teams
                        </span>
                    </h2>
                </motion.div>

                {/* Company logos */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="flex flex-wrap items-center justify-center gap-8 mb-16"
                >
                    {companyNames.map((name) => (
                        <div
                            key={name}
                            className="px-6 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-gray-500 font-semibold text-lg tracking-wider"
                        >
                            {name}
                        </div>
                    ))}
                </motion.div>

                {/* Testimonial cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                            className="group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500"
                        >
                            <Quote className="w-8 h-8 text-blue-500/30 mb-4" />
                            <p className="text-gray-300 leading-relaxed mb-6 text-sm">
                                &ldquo;{t.quote}&rdquo;
                            </p>
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, j) => (
                                    <Star
                                        key={j}
                                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>
                            <div>
                                <div className="font-semibold text-white text-sm">{t.name}</div>
                                <div className="text-xs text-gray-500">
                                    {t.role} · {t.company}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
