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
                    DEFAULT: "#6366f1",
                    container: "#4f46e5",
                    hover: "#818cf8",
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#a8b1ff",
                    container: "#3730a3",
                    foreground: "#ffffff",
                },
                background: {
                    DEFAULT: "#0d1117",
                    card: "#161b22",
                    surface: "#0d1117",
                    bright: "#21262d",
                    highest: "#30363d"
                },
                foreground: {
                    DEFAULT: "#dee5ff",
                    muted: "#a3aac4",
                    subtle: "#6d758c",
                },
                border: {
                    DEFAULT: "rgba(161, 250, 255, 0.1)",
                    light: "rgba(161, 250, 255, 0.15)",
                },
                destructive: {
                    DEFAULT: "#ffb4ab",
                    foreground: "#690005",
                },
                success: {
                    DEFAULT: "#22C55E",
                },
                warning: {
                    DEFAULT: "#d97721",
                },
                accent: {
                    DEFAULT: "#c0c1ff",
                    muted: "#42447b",
                }
            },
            fontFamily: {
                display: ["var(--font-headline)", "system-ui", "sans-serif"],
                sans: ["var(--font-body)", "system-ui", "sans-serif"],
                mono: ["var(--font-mono)", "ui-monospace", "monospace"],
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
