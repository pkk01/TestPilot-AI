'use client'

import { SignInPage } from '@/components/ui/sign-in'
import { createClient } from '@/lib/supabase/client-ssr'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                throw error
            }

            router.push('/dashboard')
            router.refresh()
        } catch (error: any) {
            setError(error.message || 'An error occurred during sign in.')
        } finally {
            setIsLoading(false)
        }
    }

    const sampleTestimonials = [
        {
            avatarSrc: "https://randomuser.me/api/portraits/women/44.jpg",
            name: "Emily Watson",
            handle: "@emilyqa",
            text: "TestPilot AI has completely changed how we handle BDD. The Gherkin generation is spot on!"
        },
        {
            avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
            name: "Jason Rivet",
            handle: "@jason_dev",
            text: "The Selenium step definitions saved me hours of boilerplate. Highly recommend!"
        }
    ];

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#020617]">
            <SignInPage
                title={<span className="font-light tracking-tighter">Welcome Back</span>}
                description="Sign in to TestPilot AI to continue generating high-quality test cases."
                heroImageSrc="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2160&auto=format&fit=crop"
                testimonials={sampleTestimonials}
                onSignIn={handleLogin}
                onGoogleSignIn={handleGoogleSignIn}
                onCreateAccount={() => router.push('/signup')}
                isLoading={isLoading}
                error={error}
                emailValue={email}
                onEmailChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                passwordValue={password}
                onPasswordChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
        </div>
    );
}
