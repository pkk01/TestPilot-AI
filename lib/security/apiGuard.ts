// ============================================================
// API Guard — Higher-order wrapper for all API routes
// ============================================================
// Combines auth check + rate limiting for any API route.
// For AI routes, also enforces daily limits and input validation.

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { checkAIGuard, logAIUsage } from './aiGuard';
import { sanitizeInput } from './inputSanitizer';
import { checkIpRateLimit, checkUserRateLimit } from './rateLimiter';
import { IS_DEVELOPMENT } from './securityConstants';

interface ApiGuardOptions {
    /** Whether this is an AI endpoint (Groq-calling) */
    isAiRoute?: boolean;
    /** Skip general rate limiting (e.g. for lightweight endpoints) */
    skipRateLimit?: boolean;
}

interface GuardedContext {
    user: { id: string; email?: string; user_metadata?: Record<string, any>; [key: string]: any };
    supabase: ReturnType<typeof createClient>;
    ip: string;
}

interface AIGuardedContext extends GuardedContext {
    /** The sanitized user input (only for AI routes) */
    cleanInput: string;
    /** Batch ID for grouping Groq calls under one daily action */
    batchId: string;
    /** Current daily AI usage count */
    dailyCount: number;
    /** Log AI usage after successful Groq call */
    logUsage: (tokensUsed?: number) => Promise<void>;
}

/**
 * Extract client IP from request headers
 */
function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return request.headers.get('x-real-ip') || '127.0.0.1';
}

/**
 * Wraps a standard (non-AI) API route with auth + rate limiting.
 */
export async function withApiGuard(
    request: NextRequest,
    handler: (ctx: GuardedContext) => Promise<NextResponse>,
    options?: ApiGuardOptions
): Promise<NextResponse> {
    try {
        const supabase = createClient();

        // ── 1. Authentication ──────────────────────────────────
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const ip = getClientIp(request);

        // ── 2. Rate limiting (skipped in development) ──────────
        if (!IS_DEVELOPMENT && !options?.skipRateLimit) {
            const ipCheck = checkIpRateLimit(ip);
            if (!ipCheck.allowed) {
                return NextResponse.json(
                    { success: false, error: ipCheck.reason || 'Too many requests.' },
                    {
                        status: 429,
                        headers: {
                            'Retry-After': String(Math.ceil(ipCheck.retryAfterMs / 1000)),
                        },
                    }
                );
            }

            const userCheck = checkUserRateLimit(user.id);
            if (!userCheck.allowed) {
                return NextResponse.json(
                    { success: false, error: userCheck.reason || 'Too many requests.' },
                    {
                        status: 429,
                        headers: {
                            'Retry-After': String(Math.ceil(userCheck.retryAfterMs / 1000)),
                        },
                    }
                );
            }
        }

        // ── 3. Call the handler ────────────────────────────────
        const response = await handler({ user, supabase, ip });
        return response;
    } catch (error) {
        console.error('API Guard error:', error);
        return NextResponse.json(
            { success: false, error: 'Service temporarily unavailable. Please try again later.' },
            { status: 500 }
        );
    }
}

/**
 * Wraps an AI API route with auth + rate limiting + daily AI limit + input validation.
 *
 * @param request    The incoming request
 * @param inputText  The raw user input to validate
 * @param batchId    Batch ID grouping Groq calls under one daily action
 * @param endpoint   API endpoint name (for logging)
 * @param handler    The actual route logic
 */
export async function withAIApiGuard(
    request: NextRequest,
    inputText: string,
    batchId: string,
    endpoint: string,
    handler: (ctx: AIGuardedContext) => Promise<NextResponse>
): Promise<NextResponse> {
    try {
        const supabase = createClient();

        // ── 1. Authentication ──────────────────────────────────
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const ip = getClientIp(request);

        // ── 2. Rate limiting (skipped in development) ──────────
        if (!IS_DEVELOPMENT) {
            const ipCheck = checkIpRateLimit(ip);
            if (!ipCheck.allowed) {
                return NextResponse.json(
                    { success: false, error: ipCheck.reason || 'Too many requests.' },
                    {
                        status: 429,
                        headers: { 'Retry-After': String(Math.ceil(ipCheck.retryAfterMs / 1000)) },
                    }
                );
            }

            const userCheck = checkUserRateLimit(user.id);
            if (!userCheck.allowed) {
                return NextResponse.json(
                    { success: false, error: userCheck.reason || 'Too many requests.' },
                    {
                        status: 429,
                        headers: { 'Retry-After': String(Math.ceil(userCheck.retryAfterMs / 1000)) },
                    }
                );
            }
        }

        // ── 3. Input sanitization (always enforced) ────────────
        const sanitized = sanitizeInput(inputText);
        if (sanitized.rejected) {
            return NextResponse.json(
                { success: false, error: sanitized.reason || 'Invalid input.' },
                { status: 400 }
            );
        }

        // ── 4. AI daily limit + duplicate detection (skipped in development) ──
        let aiCheck: { allowed: boolean; dailyCount: number; warning?: string; reason?: string } = {
            allowed: true, dailyCount: 0,
        };
        if (!IS_DEVELOPMENT) {
            aiCheck = await checkAIGuard(user.id, sanitized.clean, batchId, endpoint, supabase);
            if (!aiCheck.allowed) {
                return NextResponse.json(
                    { success: false, error: aiCheck.reason || "You've reached your usage limit. Please try again later." },
                    { status: 429 }
                );
            }
        }

        // ── 5. Call the handler ────────────────────────────────
        const logUsage = async (tokensUsed: number = 0) => {
            await logAIUsage(user.id, sanitized.clean, batchId, endpoint, ip, tokensUsed, supabase);
        };

        const response = await handler({
            user,
            supabase,
            ip,
            cleanInput: sanitized.clean,
            batchId,
            dailyCount: aiCheck.dailyCount,
            logUsage,
        });

        // Add usage headers
        if (aiCheck.warning) {
            response.headers.set('X-AI-Usage-Warning', aiCheck.warning);
        }
        response.headers.set('X-AI-Daily-Count', String(aiCheck.dailyCount));
        response.headers.set('X-AI-Daily-Limit', String(4));

        return response;
    } catch (error) {
        console.error('AI API Guard error:', error);
        return NextResponse.json(
            { success: false, error: 'Service temporarily unavailable. Please try again later.' },
            { status: 500 }
        );
    }
}
