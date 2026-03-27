"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";

export default function ParticleShowcase() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <section className="relative py-16 md:py-24 bg-[#030712] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

            <div ref={ref} className="max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-8"
                >
                    <span className="text-sm font-semibold text-indigo-400 tracking-widest uppercase mb-4 block">
                        Interactive
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                        The Future of{" "}
                        <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Testing
                        </span>
                    </h2>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                        Watch as AI transforms your testing workflow — particle by particle.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="relative rounded-2xl overflow-hidden border border-white/5 bg-black"
                >
                    <ParticleTextEffect
                        words={["TestPilot", "AI Testing", "Automated", "Quality", "10x Faster"]}
                    />
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-gray-600 text-xs text-center mt-4 hidden md:block"
                >
                    Right-click and hold while moving mouse to interact with particles
                </motion.p>
            </div>
        </section>
    );
}
