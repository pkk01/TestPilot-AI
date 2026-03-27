"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TestimonialCard } from "@/components/ui/testimonial-cards";

const testimonials = [
    {
        id: 12,
        testimonial:
            "TestPilot AI cut our test case creation time by 80%. We used to spend days writing test cases — now it takes minutes. Absolute game-changer for our QA team.",
        author: "Sarah Chen — QA Lead @ Stripe",
    },
    {
        id: 25,
        testimonial:
            "The edge case detection is incredible. TestPilot AI found boundary conditions our senior engineers missed. It's like having an extra QA architect on the team.",
        author: "James Park — Engineering Manager @ Shopify",
    },
    {
        id: 33,
        testimonial:
            "We export Selenium scripts directly from TestPilot AI. Our automation coverage went from 40% to 90% in just 3 weeks. Best QA investment we ever made.",
        author: "Priya Sharma — VP of Engineering @ Razorpay",
    },
];

export default function TestimonialsSection() {
    const [positions, setPositions] = useState(["front", "middle", "back"]);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const handleShuffle = () => {
        const newPositions = [...positions];
        newPositions.unshift(newPositions.pop()!);
        setPositions(newPositions);
    };

    return (
        <section
            id="testimonials"
            className="relative py-24 md:py-32 bg-[#030712] overflow-hidden"
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

            <div ref={ref} className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="text-sm font-semibold text-indigo-400 tracking-widest uppercase mb-4 block">
                        Testimonials
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                        What QA Teams Are{" "}
                        <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Saying
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
                        Trusted by engineering teams at top companies to streamline their QA workflows.
                    </p>
                </motion.div>

                {/* Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="grid place-content-center px-4 sm:px-8 py-8 md:py-24"
                >
                    <div className="overflow-hidden w-full max-w-[500px] mx-auto">
                        <div className="relative h-[400px] sm:h-[400px] md:h-[420px] w-[320px] mx-auto scale-[0.75] sm:scale-[0.85] md:scale-100 origin-top">
                            {testimonials.map((testimonial, index) => (
                                <TestimonialCard
                                    key={testimonial.id}
                                    {...testimonial}
                                    handleShuffle={handleShuffle}
                                    position={positions[index]}
                                />
                            ))}
                        </div>
                    </div>
                    <p className="text-center text-gray-500 text-sm mt-4 md:mt-4">
                        ← Swipe to see more testimonials
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
