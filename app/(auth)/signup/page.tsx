'use client'

import { createClient } from '@/lib/supabase/client-ssr'
import { FlaskConical, Loader2, Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignupPage() {
    const router = useRouter()
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
            const { error, data } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
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

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-[400px]">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                        <FlaskConical className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Create an account</h1>
                    <p className="text-sm text-foreground-subtle mt-1">Join TestPilot AI today</p>
                </div>

                {/* Card */}
                <div className="card p-6 md:p-8">
                    {success ? (
                        <div className="text-center space-y-4 py-4">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Mail className="w-6 h-6 text-green-400" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground">Check your email</h3>
                            <p className="text-sm text-foreground-subtle">
                                We've sent a verification link to <strong>{email}</strong>.
                                Please check your inbox to complete signup.
                            </p>
                            <Link href="/login" className="btn-secondary w-full flex justify-center mt-4">
                                Return to Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="input-field pl-9"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="At least 6 characters"
                                            className="input-field pl-9"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <p className="text-[11px] text-foreground-muted mt-1.5">
                                        Make sure it's at least 6 characters.
                                    </p>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-md">
                                        <p className="text-xs text-red-400 text-center">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading || !email || password.length < 6}
                                    className="btn-primary w-full flex items-center justify-center mt-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center text-sm text-foreground-subtle">
                                Already have an account?{' '}
                                <Link href="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
                                    Sign in
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
