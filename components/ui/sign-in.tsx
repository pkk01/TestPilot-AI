"use client";
import { Eye, EyeOff, FlaskConical } from 'lucide-react';
import { LoaderFive } from './loader';
import React, { useState } from 'react';
import Link from 'next/link';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);

const GitHubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
);


// --- TYPE DEFINITIONS ---

export interface Testimonial {
    avatarSrc: string;
    name: string;
    handle: string;
    text: string;
}

interface SignInPageProps {
    title?: React.ReactNode;
    description?: React.ReactNode;
    heroImageSrc?: string;
    testimonials?: Testimonial[];
    onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
    onGoogleSignIn?: () => void;
    onGitHubSignIn?: () => void;
    onResetPassword?: () => void;
    onCreateAccount?: () => void;
    onBackToSignIn?: () => void;
    isLoading?: boolean;
    error?: string | null;
    submitButtonText?: string;
    showNameField?: boolean;
    nameValue?: string;
    onNameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    emailValue?: string;
    onEmailChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    passwordValue?: string;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all focus-within:border-violet-400/50 focus-within:bg-violet-500/5">
        {children}
    </div>
);

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial, delay: string }) => (
    <div className={`animate-testimonial-in ${delay} flex items-start gap-3 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-5 w-64 opacity-0`}>
        <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
        <div className="text-sm leading-snug">
            <p className="flex items-center gap-1 font-medium">{testimonial.name}</p>
            <p className="text-white/50 text-xs">{testimonial.handle}</p>
            <p className="mt-0.5 text-white/80 text-xs leading-relaxed">{testimonial.text}</p>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
    title = <span className="font-light text-white tracking-tighter">Welcome</span>,
    description = "Access your account and continue your journey with us",
    heroImageSrc,
    testimonials = [],
    onSignIn,
    onGoogleSignIn,
    onGitHubSignIn,
    onResetPassword,
    onCreateAccount,
    onBackToSignIn,
    isLoading = false,
    error = null,
    submitButtonText = "Sign In",
    showNameField = false,
    nameValue,
    onNameChange,
    emailValue,
    onEmailChange,
    passwordValue,
    onPasswordChange,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="h-screen flex flex-col md:flex-row bg-[#020617] text-white overflow-hidden w-full">
            {/* Left column: sign-in form */}
            <section className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-4 animate-fade-slide-in animate-delay-75 opacity-0 mb-2 hover:opacity-80 transition-opacity group/logo">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20 border border-white/10 group-hover/logo:scale-105 transition-transform">
                                <FlaskConical className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-0.5">
                                    <span className="text-xl font-extrabold text-white tracking-tighter uppercase italic">Test</span>
                                    <span className="text-xl font-extrabold text-indigo-400 tracking-tighter uppercase italic">Pilot</span>
                                </div>
                                <span className="text-[10px] font-medium text-indigo-300/80 tracking-[0.2em] uppercase -mt-1 pl-0.5">AI Engine</span>
                            </div>
                        </Link>
                        <h1 className="animate-fade-slide-in animate-delay-100 text-2xl md:text-3xl font-semibold leading-tight opacity-0">{title}</h1>
                        <p className="animate-fade-slide-in animate-delay-200 text-slate-400 text-sm opacity-0">{description}</p>

                        <form className="space-y-4" onSubmit={onSignIn}>
                            {showNameField && (
                                <div className="animate-fade-slide-in animate-delay-300 opacity-0">
                                    <label className="text-xs font-medium text-slate-400 block mb-1">Full Name</label>
                                    <GlassInputWrapper>
                                        <input
                                            name="name"
                                            type="text"
                                            placeholder="Enter your full name"
                                            className="w-full bg-transparent text-sm p-3 rounded-2xl focus:outline-none"
                                            value={nameValue}
                                            onChange={onNameChange}
                                            required
                                        />
                                    </GlassInputWrapper>
                                </div>
                            )}

                            <div className={`animate-fade-slide-in ${showNameField ? 'animate-delay-400' : 'animate-delay-300'} opacity-0`}>
                                <label className="text-xs font-medium text-slate-400 block mb-1">Email Address</label>
                                <GlassInputWrapper>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="w-full bg-transparent text-sm p-3 rounded-2xl focus:outline-none"
                                        value={emailValue}
                                        onChange={onEmailChange}
                                        required
                                    />
                                </GlassInputWrapper>
                            </div>

                            <div className={`animate-fade-slide-in ${showNameField ? 'animate-delay-500' : 'animate-delay-400'} opacity-0`}>
                                <label className="text-xs font-medium text-slate-400 block mb-1">Password</label>
                                <GlassInputWrapper>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            className="w-full bg-transparent text-sm p-3 pr-12 rounded-2xl focus:outline-none"
                                            value={passwordValue}
                                            onChange={onPasswordChange}
                                            required
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
                                            {showPassword ? <EyeOff className="w-5 h-5 text-slate-400 hover:text-white transition-colors" /> : <Eye className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />}
                                        </button>
                                    </div>
                                </GlassInputWrapper>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <p className="text-xs text-red-400 text-center">{error}</p>
                                </div>
                            )}

                            {!showNameField && (
                                <div className="animate-fade-slide-in animate-delay-500 flex items-center justify-between text-sm opacity-0">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center w-5 h-5">
                                            <input type="checkbox" name="rememberMe" className="peer absolute opacity-0 w-full h-full cursor-pointer z-10" />
                                            <div className="w-5 h-5 border border-white/20 rounded-md bg-white/5 peer-checked:bg-white peer-checked:border-white transition-all"></div>
                                            <svg className="absolute w-2.5 h-2.5 text-black opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-white/70 group-hover:text-white transition-colors">Remember me</span>
                                    </label>
                                    <a href="#" onClick={(e) => { e.preventDefault(); onResetPassword?.(); }} className="hover:underline text-violet-400 transition-colors text-xs">Forgot password?</a>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="animate-fade-slide-in animate-delay-600 w-full rounded-2xl bg-indigo-600 py-3.5 font-medium text-white hover:bg-indigo-500 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 opacity-0 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <LoaderFive size="sm" text="" className="gap-0" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    submitButtonText
                                )}
                            </button>
                        </form>

                        <div className="animate-fade-slide-in animate-delay-700 relative flex items-center justify-center opacity-0 mt-2">
                            <span className="w-full border-t border-white/10"></span>
                            <span className="px-4 text-sm text-slate-500 bg-[#020617] absolute">Or continue with</span>
                        </div>

                        <div className="animate-fade-slide-in animate-delay-800 flex gap-3 opacity-0">
                            <button
                                onClick={onGoogleSignIn}
                                disabled={isLoading}
                                className="flex-1 flex items-center justify-center gap-3 border border-white/10 rounded-2xl py-3.5 hover:bg-white/5 transition-all active:scale-[0.98] text-sm"
                            >
                                <GoogleIcon />
                                Google
                            </button>
                            <button
                                onClick={onGitHubSignIn}
                                disabled={isLoading}
                                className="flex-1 flex items-center justify-center gap-3 border border-white/10 rounded-2xl py-3.5 hover:bg-white/5 transition-all active:scale-[0.98] text-sm"
                            >
                                <GitHubIcon />
                                GitHub
                            </button>
                        </div>

                        <p className="animate-fade-slide-in animate-delay-900 text-center text-sm text-slate-400 opacity-0">
                            {showNameField ? "Already have an account?" : "New to our platform?"}
                            <a href="#" onClick={(e) => { e.preventDefault(); showNameField ? onBackToSignIn?.() : onCreateAccount?.(); }} className="text-violet-400 hover:underline transition-colors ml-1.5">
                                {showNameField ? "Sign In" : "Create Account"}
                            </a>
                        </p>
                    </div>
                </div>
            </section>

            {/* Right column: hero image + testimonials */}
            {heroImageSrc && (
                <section className="hidden md:block flex-1 relative p-4 bg-[#020617]">
                    <div
                        className="animate-slide-right-in animate-delay-300 absolute inset-4 rounded-[2.5rem] bg-cover bg-center opacity-0 overflow-hidden"
                        style={{ backgroundImage: `url(${heroImageSrc})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent"></div>
                    </div>
                    {testimonials.length > 0 && (
                        <div className="absolute bottom-12 left-0 right-0 flex gap-4 px-8 w-full justify-center overflow-hidden">
                            <TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" />
                            {testimonials[1] && <div className="hidden xl:flex"><TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" /></div>}
                            {testimonials[2] && <div className="hidden 2xl:flex"><TestimonialCard testimonial={testimonials[2]} delay="animate-delay-1400" /></div>}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};
