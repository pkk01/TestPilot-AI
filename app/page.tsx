"use client";
import BenefitsSection from "@/components/landing/BenefitsSection";
import CTASection from "@/components/landing/CTASection";
import ExampleOutputSection from "@/components/landing/ExampleOutputSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import FooterSection from "@/components/landing/FooterSection";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import Navbar from "@/components/landing/Navbar";
import ProblemSection from "@/components/landing/ProblemSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import { TextRevealSection } from "@/components/landing/TextRevealSection";
import TypewriterSection from "@/components/landing/TypewriterSection";
import dynamic from "next/dynamic";

const ParticleBackground = dynamic(
    () => import("@/components/landing/ParticleBackground"),
    { ssr: false }
);

export default function HomePage() {
    return (
        <main className="relative min-h-screen bg-[#030712] overflow-hidden">
            {/* Ambient background effects */}
            <ParticleBackground />

            {/* Fixed ambient glow blobs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/[0.07] rounded-full blur-[120px]" />
                <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-blue-600/[0.05] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/[0.05] rounded-full blur-[120px]" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <Navbar />
                <HeroSection />
                <ProblemSection />
                <TextRevealSection />
                <TypewriterSection />
                <FeaturesSection />
                <HowItWorksSection />
                <ExampleOutputSection />
                <BenefitsSection />
                <SocialProofSection />
                <CTASection />
                <FooterSection />
            </div>
        </main>
    );
}
