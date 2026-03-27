"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FlaskConical, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const menuItems = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "About", href: "#about" },
];

export default function NewNavbar() {
    const [menuState, setMenuState] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <nav className="w-full px-2">
                <div
                    className={cn(
                        "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
                        isScrolled &&
                            "bg-[#030712]/70 max-w-4xl rounded-2xl border border-white/10 backdrop-blur-xl lg:px-5 shadow-lg shadow-indigo-500/5"
                    )}
                >
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        {/* Logo */}
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center gap-3 group"
                            >
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
                                    <FlaskConical className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex items-center">
                                    <span className="text-lg font-bold text-white tracking-tight">
                                        Test
                                    </span>
                                    <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                                        Pilot
                                    </span>
                                    <span className="text-lg font-bold text-cyan-400 ml-1 tracking-tight">
                                        AI
                                    </span>
                                </div>
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState ? "Close Menu" : "Open Menu"}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-white"
                            >
                                {menuState ? (
                                    <X className="size-6" />
                                ) : (
                                    <Menu className="size-6" />
                                )}
                            </button>
                        </div>

                        {/* Desktop Nav Links */}
                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <a
                                            href={item.href}
                                            className="text-gray-400 hover:text-white block duration-150 transition-colors"
                                        >
                                            <span>{item.name}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Desktop Buttons */}
                        <div className="hidden lg:flex items-center gap-3">
                            <Link
                                href="/login"
                                className={cn(
                                    "px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5",
                                    isScrolled && "lg:hidden"
                                )}
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className={cn(
                                    "px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:from-indigo-500 hover:to-cyan-500 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95",
                                    isScrolled ? "lg:inline-flex" : "hidden lg:inline-flex"
                                )}
                            >
                                Get Started
                            </Link>
                        </div>

                        {/* Mobile Menu */}
                        <AnimatePresence>
                            {menuState && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="w-full overflow-hidden lg:hidden bg-[#030712]/95 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl"
                                >
                                    <ul className="space-y-4 text-base mb-6">
                                        {menuItems.map((item, index) => (
                                            <li key={index}>
                                                <a
                                                    href={item.href}
                                                    className="text-gray-400 hover:text-white block duration-150 transition-colors py-2"
                                                    onClick={() => setMenuState(false)}
                                                >
                                                    <span>{item.name}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                                        <Link
                                            href="/login"
                                            className="px-4 py-3 text-center text-gray-300 hover:text-white transition-colors"
                                            onClick={() => setMenuState(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className="px-5 py-3 text-center text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white"
                                            onClick={() => setMenuState(false)}
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>
        </header>
    );
}
