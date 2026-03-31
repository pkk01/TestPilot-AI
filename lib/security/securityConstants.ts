// ============================================================
// Security Constants — Central configuration for all limits
// ============================================================

/** true when running `npm run dev` — rate limits are bypassed */
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

export const LIMITS = {
    /** Max AI "actions" per user per day (a Generate batch = 1 action) */
    AI_DAILY_MAX: 4,
    /** Show warning after this many daily AI actions */
    AI_DAILY_WARN: 3,

    /** General API rate limits — per authenticated user */
    API_PER_USER_PER_MIN: 3,
    API_PER_USER_PER_HOUR: 20,

    /** General API rate limits — per IP address */
    API_PER_IP_PER_MIN: 5,
    /** Block IP if burst exceeds this in 5-minute window */
    IP_BURST_THRESHOLD: 15,
    IP_BURST_WINDOW_MS: 5 * 60 * 1000,

    /** Input length constraints */
    MAX_INPUT_LENGTH: 5000,
    MIN_INPUT_LENGTH: 10,

    /** Groq token cap per request */
    MAX_TOKENS_PER_REQUEST: 4096,
} as const;

/** Patterns that indicate SQL injection attempts */
export const SQL_INJECTION_PATTERNS = [
    /(\b(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE)\b)/i,
    /(--|;|\bOR\b\s+\d+=\d+)/i,
    /(\bunion\b.*\bselect\b)/i,
    /(\binto\b\s+\b(outfile|dumpfile)\b)/i,
];

/** Patterns that indicate XSS attempts */
export const XSS_PATTERNS = [
    /<\s*script\b/i,
    /\bon\w+\s*=/i,
    /javascript\s*:/i,
    /<\s*iframe\b/i,
    /<\s*embed\b/i,
    /<\s*object\b/i,
];

/** Very low-value / spam inputs to reject */
export const SPAM_PATTERNS = [
    /^(hi|hey|hello|test|testing|yo|ok|okay|a+|b+)\s*\.?$/i,
    /^(.)\1{5,}$/,  // Repeated single character like "aaaaaa"
    /^\s*$/,         // Empty or whitespace only
];

/** Security headers applied to every response */
export const SECURITY_HEADERS: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
