"use client";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Footer } from "@/components/ui/modem-animated-footer";
import { ArrowRight, FlaskConical, Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
    return (
        <main className="flex flex-col min-h-screen bg-black overflow-hidden">
            {/* Navbar placeholder */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">T</span>
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">TestPilot AI</span>
                </div>
                <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
            </nav>

            <div className="flex flex-col overflow-hidden pt-20">
                <ContainerScroll
                    titleComponent={
                        <>
                            <h1 className="text-4xl font-semibold text-white">
                                Accelerate your QA workflow with <br />
                                <span className="text-5xl md:text-[6rem] font-bold mt-1 leading-none bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-400">
                                    TestPilot AI
                                </span>
                            </h1>
                        </>
                    }
                >
                    <Image
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=3840&auto=format&fit=crop"
                        alt="Dashboard Preview"
                        height={720}
                        width={1400}
                        className="mx-auto rounded-2xl object-cover h-full object-left-top"
                        draggable={false}
                    />
                </ContainerScroll>
            </div>

            <section className="py-20 px-6 text-center border-t border-white/5">
                <h2 className="text-3xl font-bold text-white mb-6 italic tracking-tighter">Ready to pilot your testing?</h2>
                <Link
                    href="/signup"
                    className="px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 inline-flex items-center gap-3"
                >
                    Get Started for Free <ArrowRight className="w-5 h-5" />
                </Link>
            </section>

            <Footer
                brandName="TestPilot AI"
                brandDescription="AI-powered test case generation for modern software teams. Building the future of automated testing."
                socialLinks={[
                    {
                        icon: <Linkedin className="w-6 h-6" />,
                        href: "https://www.linkedin.com/in/prathamkumar01/",
                        label: "LinkedIn",
                    },
                    {
                        icon: <Github className="w-6 h-6" />,
                        href: "https://github.com/pkk01",
                        label: "GitHub",
                    },
                    {
                        icon: <Mail className="w-6 h-6" />,
                        href: "mailto:prk61dlw@gmail.com",
                        label: "Email",
                    },
                ]}
                navLinks={[
                    { label: "Pricing", href: "#" },
                    { label: "About", href: "#" },
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Login", href: "/login" },
                ]}
                creatorName="Pratham Kumar"
                creatorUrl="https://github.com/pkk01"
                brandIcon={<FlaskConical className="w-8 sm:w-10 md:w-14 h-8 sm:h-10 md:h-14 text-white drop-shadow-lg" />}
            />
        </main>
    );
}
