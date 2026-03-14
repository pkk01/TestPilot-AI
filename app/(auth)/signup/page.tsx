'use client'

import { SignInPage } from '@/components/ui/sign-in'
import { createClient } from '@/lib/supabase/client-ssr'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignupPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const supabase = createClient()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            // Check if user already exists in public.users table
            const { data: existingUser, error: checkError } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .maybeSingle()

            if (checkError) {
                console.error('Error checking for existing user:', checkError)
            }

            if (existingUser) {
                setError('A user with this email already exists. Please sign in instead.')
                return
            }

            const { error, data } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                    data: {
                        full_name: name,
                    }
                },
            })

            if (error) {
                throw error
            }

            setSuccess(true)

            // If auto sign-in is allowed without email verification
            if (data.session) {
                router.push('/dashboard')
                router.refresh()
            }

        } catch (error: any) {
            setError(error.message || 'An error occurred during sign up.')
        } finally {
            setIsLoading(false)
        }
    }

    const sampleTestimonials = [
        {
            avatarSrc: "https://randomuser.me/api/portraits/women/67.jpg",
            name: "Sarah Chen",
            handle: "@sarah_digital",
            text: "The automation tools here are top-notch. I can't imagine going back to manual Gherkin writing."
        },
        {
            avatarSrc: "https://randomuser.me/api/portraits/men/86.jpg",
            name: "Michael Ross",
            handle: "@mross_dev",
            text: "Clean, fast, and reliable. TestPilot AI is the future of QA engineering."
        }
    ];

    if (success) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 text-white">
                <div className="w-full max-w-md animate-fade-slide-in">
                    <div className="card bg-white/5 border-white/10 p-8 rounded-[2rem] backdrop-blur-xl text-center space-y-6">
                        <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                            <Mail className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-semibold tracking-tight">Check your email</h3>
                        <p className="text-slate-400">
                            We've sent a verification link to <strong className="text-white">{email}</strong>.
                            Please check your inbox to complete signup.
                        </p>
                        <Link href="/login" className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex justify-center font-medium">
                            Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#020617]">
            <SignInPage
                title={<span className="font-light tracking-tighter">Create Account</span>}
                description="Join TestPilot AI today and start automating your testing workflow."
                heroImageSrc="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2160&auto=format&fit=crop"
                testimonials={sampleTestimonials}
                onSignIn={handleSignup}
                onBackToSignIn={() => router.push('/login')}
                submitButtonText="Create Account"
                showNameField={true}
                nameValue={name}
                onNameChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                emailValue={email}
                onEmailChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                passwordValue={password}
                onPasswordChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                isLoading={isLoading}
                error={error}
                onGoogleSignIn={async () => {
                    await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: { redirectTo: `${location.origin}/auth/callback` }
                    });
                }}
                onGitHubSignIn={async () => {
                    await supabase.auth.signInWithOAuth({
                        provider: 'github',
                        options: { redirectTo: `${location.origin}/auth/callback` }
                    });
                }}
            />
        </div>
    );
}
