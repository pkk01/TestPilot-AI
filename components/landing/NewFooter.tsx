"use client";

import React from "react";
import Link from "next/link";
import {
    Mail,
    Github,
    Linkedin,
    Twitter,
    FlaskConical,
} from "lucide-react";
import { FooterBackgroundGradient, TextHoverEffect } from "@/components/ui/hover-footer";

const footerLinks = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Dashboard", href: "/dashboard" },
            { label: "Pricing", href: "#pricing" },
        ],
    },
    {
        title: "Resources",
        links: [
            { label: "Documentation", href: "#docs" },
            { label: "API Reference", href: "#" },
            { label: "Blog", href: "#" },
            { label: "Changelog", href: "#" },
        ],
    },
];

const contactInfo = [
    {
        icon: <Mail size={18} className="text-indigo-400" />,
        text: "prk61dlw@gmail.com",
        href: "mailto:prk61dlw@gmail.com",
    },
];

const socialLinks = [
    { icon: <Github size={20} />, label: "GitHub", href: "https://github.com/pkk01" },
    { icon: <Linkedin size={20} />, label: "LinkedIn", href: "https://www.linkedin.com/in/prathamkumar01/" },
    { icon: <Twitter size={20} />, label: "Twitter", href: "#" },
];

export default function NewFooter() {
    return (
        <footer id="about" className="bg-[#030712]/10 relative h-fit rounded-t-3xl overflow-hidden mx-4 sm:mx-8 mb-0">
            <div className="max-w-7xl mx-auto p-8 sm:p-14 z-40 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12">
                    {/* Brand section */}
                    <div className="flex flex-col space-y-4">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                                <FlaskConical className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex items-center">
                                <span className="text-2xl font-bold text-white">Test</span>
                                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                                    Pilot
                                </span>
                                <span className="text-2xl font-bold text-cyan-400 ml-1">AI</span>
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-500">
                            TestPilot AI — Intelligent QA automation powered by AI. Generate test cases, automation scripts, and BDD scenarios from your requirements instantly.
                        </p>
                    </div>

                    {/* Footer link sections */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-white text-lg font-semibold mb-6">
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-gray-500 hover:text-indigo-400 transition-colors text-sm"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact section */}
                    <div>
                        <h4 className="text-white text-lg font-semibold mb-6">
                            Contact Us
                        </h4>
                        <ul className="space-y-4">
                            {contactInfo.map((item, i) => (
                                <li key={i} className="flex items-center space-x-3">
                                    {item.icon}
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="text-gray-500 hover:text-indigo-400 transition-colors text-sm"
                                        >
                                            {item.text}
                                        </a>
                                    ) : (
                                        <span className="text-gray-500 hover:text-indigo-400 transition-colors text-sm">
                                            {item.text}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <hr className="border-t border-gray-800 my-8" />

                {/* Footer bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
                    {/* Social icons */}
                    <div className="flex space-x-6 text-gray-500">
                        {socialLinks.map(({ icon, label, href }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="hover:text-indigo-400 transition-colors"
                            >
                                {icon}
                            </a>
                        ))}
                    </div>

                    {/* Copyright */}
                    <p className="text-gray-600 text-center md:text-left">
                        &copy; {new Date().getFullYear()} TestPilot AI. All rights reserved.
                    </p>
                    <p className="text-gray-600 text-xs">
                        Built with ❤️ by{" "}
                        <a
                            href="https://github.com/pkk01"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-indigo-400 transition-colors"
                        >
                            Pratham Kumar
                        </a>
                    </p>
                </div>
            </div>

            {/* Text hover effect - desktop only */}
            <div className="lg:flex hidden h-[12rem] -mt-8">
                <TextHoverEffect text="TestPilot AI" className="z-50" />
            </div>

            <FooterBackgroundGradient />
        </footer>
    );
}
