import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#10B981", // Emerald 500
                    hover: "#059669",
                    foreground: "#000000",
                },
                secondary: {
                    DEFAULT: "#1B2333",
                    foreground: "#F8FAFC",
                },
                background: {
                    DEFAULT: "#0B0F1A",
                    card: {
                        DEFAULT: "#1B2333",
                        hover: "#222C41",
                    },
                    surface: "#121826",
                },
                foreground: {
                    DEFAULT: "#F8FAFC",
                    muted: "#CBD5E1",
                    subtle: "#B4C3D6",
                },
                border: {
                    DEFAULT: "#232D3F",
                    light: "#334155",
                },
                destructive: {
                    DEFAULT: "#EF4444",
                    foreground: "#ffffff",
                },
                success: {
                    DEFAULT: "#10B981",
                },
                warning: {
                    DEFAULT: "#F59E0B",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "Fira Code", "monospace"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
            borderRadius: {
                xl: "24px",
                lg: "16px",
                md: "12px",
                sm: "8px",
            },
            animation: {
                "spin-slow": "spin 1.5s linear infinite",
                "fade-in": "fadeIn 0.2s ease-in-out",
                "slide-up": "slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                "float": "float 6s ease-in-out infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(12px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
