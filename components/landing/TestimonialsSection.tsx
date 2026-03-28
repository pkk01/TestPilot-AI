"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TypewriterTestimonial } from "@/components/ui/typewriter-testimonial";

const testimonials = [
    {
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        audio: "audio_1.mp3",
        text: "TestPilot AI cut our test case creation time by 80%. We used to spend days writing test cases — now it takes minutes. Absolute game-changer for our QA team.",
        name: "Sarah Chen",
        jobtitle: "QA Lead @ Stripe",
    },
    {
        image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop",
        audio: "audio_2.mp3",
        text: "The edge case detection is incredible. TestPilot AI found boundary conditions our senior engineers missed. It's like having an extra QA architect on the team.",
        name: "James Park",
        jobtitle: "Engineering Manager @ Shopify",
    },
    {
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
        audio: "audio_3.mp3",
        text: "We export Selenium scripts directly from TestPilot AI. Our automation coverage went from 40% to 90% in just 3 weeks. Best QA investment we ever made.",
        name: "Priya Sharma",
        jobtitle: "VP of Engineering @ Razorpay",
    },
    {
        image: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?q=80&w=200&auto=format&fit=crop",
        audio: "audio_4.mp3",
        text: "The Cucumber feature file generation is spot-on. Given/When/Then steps are clean and our BDD workflow is now fully automated. Saved us weeks of manual work.",
        name: "Emily White",
        jobtitle: "SDET Lead @ Microsoft",
    },
    {
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
        audio: "audio_5.mp3",
        text: "TestPilot AI transformed how we approach QA. The AI understands our requirements better than most junior testers. Coverage went up, bugs went down. Simple as that.",
        name: "David Lee",
        jobtitle: "CTO @ FinTech Startup",
    },
    {
        image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop",
        audio: "audio_6.mp3",
        text: "I was skeptical about AI-generated test cases, but TestPilot AI delivers production-quality outputs every time. The Playwright export feature alone is worth it.",
        name: "Alex Johnson",
        jobtitle: "QA Automation Engineer @ Netflix",
    },
];

export default function TestimonialsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

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
                        Hover over each avatar to hear what our users think.
                    </p>
                </motion.div>

                {/* Typewriter Testimonial */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.3 }}
                >
                    <TypewriterTestimonial testimonials={testimonials} />
                </motion.div>
            </div>
        </section>
    );
}
