// ============================================================
// In-Memory Sliding-Window Rate Limiter
// ============================================================
// Tracks request timestamps per identifier (IP or user ID).
// No external dependencies — runs entirely in process memory.
// Auto-cleans stale entries every 60s to prevent memory leaks.

import { LIMITS } from './securityConstants';

interface RateLimitEntry {
    timestamps: number[];
}

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    retryAfterMs: number;
    reason?: string;
}

interface RateLimitConfig {
    maxPerMinute: number;
    maxPerHour?: number;
    burstThreshold?: number;
    burstWindowMs?: number;
}

// Separate stores for IP-based vs user-based limits
const ipStore = new Map<string, RateLimitEntry>();
const userStore = new Map<string, RateLimitEntry>();

// Auto-cleanup every 60 seconds
const CLEANUP_INTERVAL_MS = 60_000;
const MAX_ENTRY_AGE_MS = 60 * 60 * 1000; // 1 hour

let cleanupTimer: NodeJS.Timeout | null = null;

function startCleanup() {
    if (cleanupTimer) return;
    if (typeof setInterval === 'undefined') return; // SSG/build safety
    cleanupTimer = setInterval(() => {
        const now = Date.now();
        const cutoff = now - MAX_ENTRY_AGE_MS;

        ipStore.forEach((entry, key) => {
            entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
            if (entry.timestamps.length === 0) ipStore.delete(key);
        });
        userStore.forEach((entry, key) => {
            entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
            if (entry.timestamps.length === 0) userStore.delete(key);
        });
    }, CLEANUP_INTERVAL_MS);

    // Don't block process exit
    if (cleanupTimer.unref) cleanupTimer.unref();
}

// NOTE: startCleanup() is called lazily on first use, NOT at import time.
// This prevents the setInterval from blocking `next build`.

function checkLimit(
    store: Map<string, RateLimitEntry>,
    identifier: string,
    config: RateLimitConfig
): RateLimitResult {
    startCleanup(); // Lazy init — only starts the timer on first real request

    const now = Date.now();
    const oneMinuteAgo = now - 60_000;
    const oneHourAgo = now - 3_600_000;

    let entry = store.get(identifier);
    if (!entry) {
        entry = { timestamps: [] };
        store.set(identifier, entry);
    }

    // Clean old timestamps (beyond 1 hour)
    entry.timestamps = entry.timestamps.filter((t) => t > oneHourAgo);

    // Check burst (IP only — large spike in short window)
    if (config.burstThreshold && config.burstWindowMs) {
        const burstCutoff = now - config.burstWindowMs;
        const burstCount = entry.timestamps.filter((t) => t > burstCutoff).length;
        if (burstCount >= config.burstThreshold) {
            return {
                allowed: false,
                remaining: 0,
                retryAfterMs: config.burstWindowMs,
                reason: 'Request rate too high. Please slow down.',
            };
        }
    }

    // Check per-minute limit
    const minuteCount = entry.timestamps.filter((t) => t > oneMinuteAgo).length;
    if (minuteCount >= config.maxPerMinute) {
        const oldestInWindow = entry.timestamps.find((t) => t > oneMinuteAgo) || now;
        return {
            allowed: false,
            remaining: 0,
            retryAfterMs: 60_000 - (now - oldestInWindow),
            reason: 'Too many requests. Please wait a moment.',
        };
    }

    // Check per-hour limit (user only)
    if (config.maxPerHour) {
        const hourCount = entry.timestamps.filter((t) => t > oneHourAgo).length;
        if (hourCount >= config.maxPerHour) {
            const oldestInWindow = entry.timestamps.find((t) => t > oneHourAgo) || now;
            return {
                allowed: false,
                remaining: 0,
                retryAfterMs: 3_600_000 - (now - oldestInWindow),
                reason: 'Hourly request limit reached. Please try again later.',
            };
        }
    }

    // Allowed — record this request
    entry.timestamps.push(now);

    const remaining = config.maxPerMinute - minuteCount - 1;
    return { allowed: true, remaining: Math.max(0, remaining), retryAfterMs: 0 };
}

// ── Public API ──────────────────────────────────────────────

export function checkIpRateLimit(ip: string): RateLimitResult {
    return checkLimit(ipStore, ip, {
        maxPerMinute: LIMITS.API_PER_IP_PER_MIN,
        burstThreshold: LIMITS.IP_BURST_THRESHOLD,
        burstWindowMs: LIMITS.IP_BURST_WINDOW_MS,
    });
}

export function checkUserRateLimit(userId: string): RateLimitResult {
    return checkLimit(userStore, userId, {
        maxPerMinute: LIMITS.API_PER_USER_PER_MIN,
        maxPerHour: LIMITS.API_PER_USER_PER_HOUR,
    });
}
