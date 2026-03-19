"use client";

import {
    TextRevealCard,
    TextRevealCardDescription,
    TextRevealCardTitle,
} from "@/components/ui/text-reveal-card";
import { motion } from "framer-motion";

export function TextRevealSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-indigo-600/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Manual Testing vs <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">AI-Powered</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            See how TestPilot AI transforms your QA workflow
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <TextRevealCard
              text="Slow & Manual"
              revealText="Fast & Automated"
            >
              <TextRevealCardTitle>
                Hover to see the difference
              </TextRevealCardTitle>
              <TextRevealCardDescription>
                Traditional QA requires hours of manual test case writing. TestPilot AI generates comprehensive test scenarios in minutes.
              </TextRevealCardDescription>
            </TextRevealCard>
          </motion.div>

          {/* Right card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <TextRevealCard
              text="Error Prone"
              revealText="99% Accurate"
            >
              <TextRevealCardTitle>
                Quality you can trust
              </TextRevealCardTitle>
              <TextRevealCardDescription>
                Manual testing is susceptible to human error. Our AI ensures consistent, comprehensive coverage with intelligent test case generation.
              </TextRevealCardDescription>
            </TextRevealCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
