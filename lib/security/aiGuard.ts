// ============================================================
// AI Guard — Daily limit, duplicate detection, usage logging
// ============================================================
// Manages the per-user daily AI action quota using Supabase.
// A "Generate" batch (testcases + gherkin + stepdefs + coverage)
// counts as 1 action via the shared batchId.

import { SupabaseClient } from '@supabase/supabase-js';
import { hashInput } from './inputSanitizer';
import { LIMITS } from './securityConstants';

interface AIGuardResult {
    allowed: boolean;
    reason?: string;
    warning?: string;
    dailyCount: number;
}

/**
 * Checks whether the user can make an AI call.
 * Uses `batchId` to group multiple Groq calls under one daily action.
 *
 * @param userId   Authenticated user ID
 * @param input    The raw user prompt / input text
 * @param batchId  Unique ID for this generation batch (shared across
 *                 testcases + gherkin + stepdefs + coverage calls)
 * @param endpoint The API endpoint being called (for logging)
 * @param supabase Authenticated Supabase client
 */
export async function checkAIGuard(
    userId: string,
    input: string,
    batchId: string,
    endpoint: string,
    supabase: SupabaseClient
): Promise<AIGuardResult> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    // ── 1. Check if this batchId already exists (same Generate batch) ──
    const { data: existingBatch } = await supabase
        .from('ai_usage_log')
        .select('id')
        .eq('user_id', userId)
        .eq('batch_id', batchId)
        .limit(1);

    if (existingBatch && existingBatch.length > 0) {
        // This batch was already counted — allow subsequent calls in the same batch
        // Get current daily count for the warning header
        const { count } = await supabase
            .from('ai_usage_log')
            .select('batch_id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', todayStart);

        // Count distinct batches (the query above counts rows, we need distinct)
        const { data: distinctBatches } = await supabase
            .from('ai_usage_log')
            .select('batch_id')
            .eq('user_id', userId)
            .gte('created_at', todayStart);

        const uniqueBatches = new Set(distinctBatches?.map((r) => r.batch_id) || []);
        const dailyCount = uniqueBatches.size;

        return {
            allowed: true,
            dailyCount,
            warning: dailyCount >= LIMITS.AI_DAILY_WARN
                ? 'You are nearing your daily AI usage limit.'
                : undefined,
        };
    }

    // ── 2. Count today's distinct batch IDs for this user ──
    const { data: todayBatches } = await supabase
        .from('ai_usage_log')
        .select('batch_id')
        .eq('user_id', userId)
        .gte('created_at', todayStart);

    const uniqueBatches = new Set(todayBatches?.map((r) => r.batch_id) || []);
    const dailyCount = uniqueBatches.size;

    // ── 3. Hard limit check ──
    if (dailyCount >= LIMITS.AI_DAILY_MAX) {
        return {
            allowed: false,
            dailyCount,
            reason: 'Daily AI limit reached. Please try again tomorrow.',
        };
    }

    // ── 4. Duplicate detection (same input hash in last 24h) ──
    const inputHash = hashInput(input);

    const { data: duplicates } = await supabase
        .from('ai_usage_log')
        .select('id')
        .eq('user_id', userId)
        .eq('input_hash', inputHash)
        .gte('created_at', todayStart)
        .limit(1);

    if (duplicates && duplicates.length > 0) {
        return {
            allowed: false,
            dailyCount,
            reason: 'Duplicate prompt detected. Please modify your input.',
        };
    }

    // ── 5. Allowed — warning if approaching limit ──
    return {
        allowed: true,
        dailyCount,
        warning: dailyCount >= LIMITS.AI_DAILY_WARN - 1
            ? 'You are nearing your daily AI usage limit.'
            : undefined,
    };
}

/**
 * Logs a successful AI usage to the database.
 * Called AFTER a successful Groq API response.
 */
export async function logAIUsage(
    userId: string,
    input: string,
    batchId: string,
    endpoint: string,
    ip: string | null,
    tokensUsed: number,
    supabase: SupabaseClient
): Promise<void> {
    const inputHash = hashInput(input);

    try {
        await supabase.from('ai_usage_log').insert({
            user_id: userId,
            batch_id: batchId,
            endpoint,
            input_hash: inputHash,
            ip_address: ip,
            tokens_used: tokensUsed,
        });
    } catch (error) {
        // Non-critical — log but don't fail the request
        console.error('Failed to log AI usage:', error);
    }
}

/**
 * Returns the current daily usage count for a user.
 */
export async function getDailyUsage(
    userId: string,
    supabase: SupabaseClient
): Promise<{ used: number; limit: number; remaining: number }> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    const { data } = await supabase
        .from('ai_usage_log')
        .select('batch_id')
        .eq('user_id', userId)
        .gte('created_at', todayStart);

    const uniqueBatches = new Set(data?.map((r) => r.batch_id) || []);
    const used = uniqueBatches.size;

    return {
        used,
        limit: LIMITS.AI_DAILY_MAX,
        remaining: Math.max(0, LIMITS.AI_DAILY_MAX - used),
    };
}
