// ============================================================
// Input Sanitizer — Validates and cleans all user input
// ============================================================

import {
    LIMITS,
    SPAM_PATTERNS,
    SQL_INJECTION_PATTERNS,
    XSS_PATTERNS,
} from './securityConstants';

interface SanitizeResult {
    clean: string;
    rejected: boolean;
    reason?: string;
}

/**
 * Sanitizes and validates user input.
 * Returns the cleaned string or a rejection reason.
 */
export function sanitizeInput(
    raw: unknown,
    maxLength: number = LIMITS.MAX_INPUT_LENGTH
): SanitizeResult {
    // Must be a string
    if (typeof raw !== 'string') {
        return { clean: '', rejected: true, reason: 'Invalid input type.' };
    }

    // Strip null bytes and control characters (keep newlines & tabs)
    let cleaned = raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Normalize whitespace (collapse multiple spaces/newlines)
    cleaned = cleaned.replace(/[ \t]+/g, ' ').trim();

    // ── Length checks ──────────────────────────────────────
    if (cleaned.length === 0) {
        return { clean: '', rejected: true, reason: 'Input cannot be empty.' };
    }

    if (cleaned.length < LIMITS.MIN_INPUT_LENGTH) {
        return {
            clean: cleaned,
            rejected: true,
            reason: `Input too short. Minimum ${LIMITS.MIN_INPUT_LENGTH} characters required.`,
        };
    }

    if (cleaned.length > maxLength) {
        return {
            clean: cleaned,
            rejected: true,
            reason: `Input too long. Maximum ${maxLength} characters allowed.`,
        };
    }

    // ── Spam detection ─────────────────────────────────────
    for (const pattern of SPAM_PATTERNS) {
        if (pattern.test(cleaned)) {
            return {
                clean: cleaned,
                rejected: true,
                reason: 'Input appears to be low-value. Please provide a meaningful requirement.',
            };
        }
    }

    // ── SQL injection detection ────────────────────────────
    for (const pattern of SQL_INJECTION_PATTERNS) {
        if (pattern.test(cleaned)) {
            return {
                clean: cleaned,
                rejected: true,
                reason: 'Request denied due to security policy.',
            };
        }
    }

    // ── XSS detection ──────────────────────────────────────
    for (const pattern of XSS_PATTERNS) {
        if (pattern.test(cleaned)) {
            return {
                clean: cleaned,
                rejected: true,
                reason: 'Request denied due to security policy.',
            };
        }
    }

    // ── Strip any remaining HTML tags ──────────────────────
    cleaned = cleaned.replace(/<[^>]*>/g, '');

    return { clean: cleaned, rejected: false };
}

/**
 * Generates a simple hash of the input string for duplicate detection.
 * Uses a fast, non-cryptographic hash (djb2) — sufficient for dedup.
 */
export function hashInput(input: string): string {
    let hash = 5381;
    for (let i = 0; i < input.length; i++) {
        hash = ((hash << 5) + hash + input.charCodeAt(i)) & 0xFFFFFFFF;
    }
    return hash.toString(36);
}
