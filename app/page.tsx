"use client";

import dynamic from "next/dynamic";
import NewNavbar from "@/components/landing/NewNavbar";
import NewHeroSection from "@/components/landing/NewHeroSection";
import NewFeaturesSection from "@/components/landing/NewFeaturesSection";
import PulseBeamCTA from "@/components/landing/PulseBeamCTA";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import NewFooter from "@/components/landing/NewFooter";

const ParticleShowcase = dynamic(
    () => import("@/components/landing/ParticleShowcase"),
    { ssr: false }
);

export default function HomePage() {
    return (
        <main className="relative min-h-screen bg-[#030712] overflow-hidden">
            {/* Fixed ambient glow blobs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-indigo-600/[0.05] rounded-full blur-[120px]" />
                <div className="absolute top-1/3 right-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-blue-600/[0.03] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-cyan-600/[0.03] rounded-full blur-[120px]" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <NewNavbar />
                <NewHeroSection />
                <NewFeaturesSection />
                <PulseBeamCTA />
                <TestimonialsSection />
                <ParticleShowcase />
                <NewFooter />
            </div>
        </main>
    );
}
