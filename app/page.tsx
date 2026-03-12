"use client";
import dynamic from "next/dynamic";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ExampleOutputSection from "@/components/landing/ExampleOutputSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import CTASection from "@/components/landing/CTASection";
import FooterSection from "@/components/landing/FooterSection";

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
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/[0.07] rounded-full blur-[120px]" />
                <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-pink-600/[0.05] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/[0.05] rounded-full blur-[120px]" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <Navbar />
                <HeroSection />
                <ProblemSection />
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
