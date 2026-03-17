"use client";
import { AnimatePresence, motion } from "framer-motion";
import { FlaskConical, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Docs", href: "#docs" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-[#030712]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-indigo-500/5"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
                        <FlaskConical className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-white tracking-tight">Test</span>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                                Pilot
                            </span>
                            <span className="text-xl font-bold text-cyan-400 ml-1 tracking-tight">AI</span>
                        </div>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/login"
                        className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        href="/signup"
                        className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:from-indigo-500 hover:to-cyan-500 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#030712]/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
                    >
                        <div className="px-6 py-4 flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="px-4 py-3 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="flex flex-col gap-2 mt-4 border-t border-white/10 pt-4">
                                <Link href="/login" className="px-4 py-3 text-gray-300 hover:text-white transition-colors">
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-5 py-3 text-center text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
