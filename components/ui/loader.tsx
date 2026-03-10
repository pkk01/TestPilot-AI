'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoaderFiveProps {
    text?: string;
    className?: string;
}

export function LoaderFive({ 
    text = "Generating...", 
    className = "",
    size = "md" 
}: LoaderFiveProps & { size?: "sm" | "md" | "lg" }) {
    const sizeMap = {
        sm: "w-8 h-8",
        md: "w-20 h-20",
        lg: "w-32 h-32"
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
            <div className={`relative ${sizeMap[size]}`}>
                {/* Outer glowing ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/20 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                
                {/* Rotating segments */}
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border-t-2 border-primary"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1.5 + i * 0.2,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        style={{
                            clipPath: 'inset(0 0 50% 0)',
                            opacity: 1 - i * 0.3,
                            scale: 1 - i * 0.1,
                        }}
                    />
                ))}

                {/* Center pulse */}
                <motion.div
                    className={`absolute rounded-full bg-primary ${size === 'sm' ? 'inset-1.5' : 'inset-4'}`}
                    animate={{
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            {text && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-2"
                >
                    <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary animate-pulse">
                        {text}
                    </span>
                    <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1 h-1 rounded-full bg-primary/40"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    backgroundColor: ["rgba(var(--primary-rgb), 0.4)", "rgba(var(--primary-rgb), 1)", "rgba(var(--primary-rgb), 0.4)"]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
