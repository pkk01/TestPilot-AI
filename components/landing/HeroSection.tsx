"use client";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Shield, Zap, Code2 } from "lucide-react";
import Link from "next/link";

const floatingCards = [
    {
        title: "Test Case #127",
        desc: "Login with valid credentials",
        status: "✅ Generated",
        delay: 0,
    },
    {
        title: "Test Case #128",
        desc: "Edge case: empty password",
        status: "✅ Generated",
        delay: 0.2,
    },
    {
        title: "Test Case #129",
        desc: "Session timeout handling",
        status: "⏳ Processing",
        delay: 0.4,
    },
];

export default function HeroSection() {
    return (
        <section id="home" className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
            {/* Radial glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-purple-600/20 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-pink-600/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8"
                    >
                        <Sparkles className="w-4 h-4" />
                        AI-Powered QA Automation
                    </motion.div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
                        <span className="text-white">AI That Writes</span>
                        <br />
                        <span className="text-white">Your </span>
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                            Test Cases.
                        </span>
                    </h1>

                    <p className="text-lg text-gray-400 max-w-lg mb-10 leading-relaxed">
                        TestPilot AI automatically generates high-quality software test cases from your requirements, user stories, or documentation. Reduce manual QA effort and accelerate testing with AI.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/signup"
                            className="group px-7 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-base hover:from-purple-500 hover:to-pink-500 transition-all shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            Try TestPilot AI
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="#example-output"
                            className="group px-7 py-4 rounded-2xl border border-white/10 text-gray-300 font-semibold text-base hover:bg-white/5 hover:border-white/20 transition-all flex items-center gap-2"
                        >
                            <Play className="w-5 h-5" />
                            View Demo
                        </a>
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex gap-8 mt-12 pt-8 border-t border-white/5"
                    >
                        {[
                            { value: "70%", label: "Faster QA" },
                            { value: "10K+", label: "Tests Generated" },
                            { value: "99%", label: "Accuracy" },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right — Floating Visual */}
                <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative hidden lg:block"
                >
                    {/* Central orb */}
                    <div className="relative flex items-center justify-center">
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 360],
                            }}
                            transition={{
                                scale: { duration: 4, repeat: Infinity },
                                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            }}
                            className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-600/30 via-pink-500/20 to-cyan-500/30 blur-xl"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl shadow-purple-500/50 flex items-center justify-center"
                        >
                            <Sparkles className="w-16 h-16 text-white/90" />
                        </motion.div>
                    </div>

                    {/* Floating test case cards */}
                    {floatingCards.map((card, i) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{
                                opacity: 1,
                                y: [0, -8, 0],
                            }}
                            transition={{
                                opacity: { delay: 0.5 + card.delay, duration: 0.5 },
                                y: {
                                    delay: 0.5 + card.delay,
                                    duration: 3 + i * 0.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                },
                            }}
                            className={`absolute bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl ${
                                i === 0
                                    ? "top-4 -left-4 w-64"
                                    : i === 1
                                    ? "top-1/2 -right-8 w-60"
                                    : "bottom-4 left-8 w-56"
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full ${i === 2 ? "bg-yellow-400" : "bg-green-400"}`} />
                                <span className="text-xs font-semibold text-gray-300">{card.title}</span>
                            </div>
                            <p className="text-sm text-gray-400">{card.desc}</p>
                            <span className="text-xs text-gray-500 mt-1 block">{card.status}</span>
                        </motion.div>
                    ))}

                    {/* Floating icons */}
                    <motion.div
                        animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute -top-8 right-16 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
                    >
                        <Shield className="w-6 h-6 text-cyan-400" />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -10, 0], rotate: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                        className="absolute -bottom-4 right-24 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20"
                    >
                        <Zap className="w-6 h-6 text-pink-400" />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -14, 0] }}
                        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                        className="absolute top-1/3 -left-12 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20"
                    >
                        <Code2 className="w-6 h-6 text-purple-400" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
