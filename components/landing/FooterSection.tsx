"use client";
import { FlaskConical, Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

const footerSections = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Pricing", href: "#pricing" },
            { label: "Dashboard", href: "/dashboard" },
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
    {
        title: "Company",
        links: [
            { label: "About", href: "#" },
            { label: "Contact", href: "mailto:prk61dlw@gmail.com" },
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
        ],
    },
];

const socialLinks = [
    { icon: Github, href: "https://github.com/pkk01", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/prathamkumar01/", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Mail, href: "mailto:prk61dlw@gmail.com", label: "Email" },
];

export default function FooterSection() {
    return (
        <footer className="relative border-t border-white/5 bg-[#020408]">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
                <div className="grid md:grid-cols-5 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <FlaskConical className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex items-center">
                                <span className="text-xl font-bold text-white">Test</span>
                                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                                    Pilot
                                </span>
                                <span className="text-xl font-bold text-cyan-400 ml-1">AI</span>
                            </div>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-sm mb-6">
                            TestPilot AI — Intelligent QA automation powered by AI. Generate test cases, automation scripts, and BDD scenarios from your requirements instantly.
                        </p>
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-sm font-semibold text-white mb-4">{section.title}</h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-600">
                        © {new Date().getFullYear()} TestPilot AI. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-600">
                        Built with ❤️ by{" "}
                        <a
                            href="https://github.com/pkk01"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-300 transition-colors"
                        >
                            Pratham Kumar
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
