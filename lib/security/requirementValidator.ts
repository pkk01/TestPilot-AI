// ============================================================
// Requirement Validator — Detects garbage vs real requirements
// ============================================================
// Client-safe: no server imports, pure logic.
// Validates that user input looks like a real software requirement
// before wasting AI credits on nonsense.

export interface ValidationResult {
    valid: boolean;
    reason?: string;
    suggestion?: string;
    /** Category of rejection for UI hints */
    category?: 'casual_chat' | 'gibberish' | 'too_vague' | 'off_topic' | 'single_word' | 'question_only';
}

// ── Patterns for casual/conversational input ──────────────────
const CASUAL_CHAT_PATTERNS = [
    /^(hi+|hey+|hello+|howdy|sup|yo+|hola|namaste)\b/i,
    /^(how are you|how('s| is) it going|what('s| is) up|whats up)/i,
    /^(good (morning|afternoon|evening|night))/i,
    /^(thank(s| you)|thx|ty|cheers|cool|nice|great|awesome|ok(ay)?)\b/i,
    /^(bye|goodbye|see ya|later|cya|gtg)\b/i,
    /^(lol|lmao|rofl|haha+|hehe+|xd+|bruh)\b/i,
    /^(what are you|who are you|are you (a |an )?(ai|bot|human|real))/i,
    /^(can you help|help me|i need help)\s*\??$/i,
    /^(tell me (a joke|something|about yourself))/i,
    /^(do you (like|know|understand|think))/i,
    /^(what do you (do|think))/i,
    /^(how do you work|what can you do)\s*\??$/i,
    /^(i('m| am) (bored|tired|happy|sad|fine|good))\b/i,
    /^(please|pls|plz)\s*$/i,
    /^(yes|no|maybe|sure|nah|nope|yep|yup)\s*\!?\.?$/i,
];

// ── Patterns for off-topic input ──────────────────────────────
const OFF_TOPIC_PATTERNS = [
    /^(what('s| is) the (weather|time|date))/i,
    /^(tell me (a |the )?(news|story|joke|recipe|poem))/i,
    /^(who (is|was) (the )?(president|prime minister|king|queen))/i,
    /^(what('s| is) (the )?(meaning of life|love|happiness))/i,
    /^(play|sing|draw|paint|cook|make me)/i,
    /^(translate|convert|calculate|solve)\s/i,
    /^(write (me )?(a |an )?(poem|story|essay|letter|song|email(?! verification| notification)))/i,
    /^(explain (quantum|relativity|universe|philosophy|history))/i,
];

// ── Patterns indicating gibberish / keyboard spam ─────────────
const GIBBERISH_PATTERNS = [
    /^[a-z]{1,3}$/i,                          // Just 1-3 random letters
    /^(.)\1{3,}/,                             // Same char repeated 4+ times
    /^[^a-zA-Z]*$/,                           // No letters at all (just numbers/symbols)
    /^[a-zA-Z\s]{1,5}$/,                      // Very short with no structure
    /asdf|qwer|zxcv|hjkl|uiop/i,             // Keyboard smash patterns
    /(.)\1{4,}/,                              // Any character repeated 5+ times
    /^[!@#$%^&*()_+=\[\]{};:'",.<>?/\\|`~\s]+$/, // Only special characters
];

// ── Keywords strongly associated with software requirements ───
const REQUIREMENT_KEYWORDS = [
    // Actions
    'user', 'admin', 'system', 'application', 'app',
    'login', 'logout', 'register', 'signup', 'sign up', 'sign in',
    'authenticate', 'authorize', 'verify', 'validate',
    'submit', 'upload', 'download', 'export', 'import',
    'create', 'read', 'update', 'delete', 'edit', 'modify',
    'search', 'filter', 'sort', 'paginate', 'navigate',
    'display', 'show', 'render', 'load', 'fetch',
    'send', 'receive', 'notify', 'alert', 'email',
    'click', 'tap', 'press', 'select', 'choose', 'enter',
    'save', 'store', 'persist', 'cache', 'database',
    'redirect', 'route', 'navigate',

    // Entities
    'button', 'form', 'page', 'screen', 'modal', 'dialog',
    'input', 'field', 'dropdown', 'checkbox', 'radio',
    'table', 'list', 'grid', 'card', 'panel',
    'menu', 'sidebar', 'navbar', 'header', 'footer',
    'api', 'endpoint', 'request', 'response', 'payload',
    'password', 'email', 'username', 'token', 'session',
    'cart', 'checkout', 'payment', 'order', 'product', 'item',
    'dashboard', 'profile', 'settings', 'account',
    'error', 'message', 'notification', 'toast', 'popup',

    // Behavior
    'should', 'must', 'shall', 'able to', 'can',
    'when', 'then', 'given', 'if', 'after', 'before',
    'expected', 'result', 'outcome', 'behavior', 'behaviour',
    'valid', 'invalid', 'success', 'failure', 'fail',
    'enable', 'disable', 'lock', 'unlock', 'block',
    'allow', 'deny', 'restrict', 'permission', 'role',
    'timeout', 'retry', 'limit', 'threshold',
    'responsive', 'mobile', 'desktop', 'tablet',
    'integration', 'unit', 'functional', 'regression',

    // Technical
    'database', 'server', 'client', 'frontend', 'backend',
    'microservice', 'webhook', 'websocket', 'rest', 'graphql',
    'encryption', 'ssl', 'https', 'oauth', 'jwt',
    'deploy', 'ci/cd', 'pipeline', 'docker', 'kubernetes',
];

// ── Structural patterns indicating a requirement ──────────────
const REQUIREMENT_STRUCTURE_PATTERNS = [
    /\b(as a|as an)\s+\w+.*\b(i want|i need|i should|i can)\b/i,    // User story format
    /\b(user|admin|customer|system|application)\s+(should|must|shall|can|will)\b/i,
    /\b(when|if|given|after|before)\b.*\b(then|should|must|display|show|return|redirect)\b/i,
    /\b(the system|the app|the application|the page|the form|the button)\s+(should|must|shall|will)\b/i,
    /\b(click|tap|press|submit|enter|select)\b.*\b(should|must|display|show|redirect|navigate)\b/i,
    /\b(error|success|warning|info(rmation)?)\s+(message|notification|toast|alert)\b/i,
    /\b(validate|verify|check|ensure|confirm)\b/i,
    /\b(able to|capable of|feature|functionality|requirement|specification|scenario)\b/i,
    /\b(input|output|field|form|button|page|screen|modal|api|endpoint)\b/i,
    /[•\-\*]\s+\w/,  // Bullet points → likely a list of requirements
];

/**
 * Validates whether the input is a real software requirement or garbage.
 *
 * Scoring system:
 * - Negative signals (chat, gibberish, off-topic) → reject
 * - Positive signals (keywords, structure) → accept
 * - Mixed / ambiguous → accept with lower confidence (let AI handle it)
 */
export function validateRequirement(input: string): ValidationResult {
    const trimmed = input.trim();

    // ── 0. Basic length check ─────────────────────────────────
    if (trimmed.length < 10) {
        return {
            valid: false,
            reason: 'Your input is too short to be a meaningful requirement.',
            suggestion: 'Describe a feature, user action, or system behavior in at least a sentence.',
            category: 'single_word',
        };
    }

    const lowerTrimmed = trimmed.toLowerCase();
    const words = trimmed.split(/\s+/).filter(w => w.length > 0);

    // ── 1. Casual chat detection ──────────────────────────────
    for (const pattern of CASUAL_CHAT_PATTERNS) {
        if (pattern.test(trimmed)) {
            return {
                valid: false,
                reason: 'This looks like casual conversation, not a software requirement.',
                suggestion: 'Try describing what a user should be able to do, or how the system should behave.',
                category: 'casual_chat',
            };
        }
    }

    // ── 2. Off-topic detection ────────────────────────────────
    for (const pattern of OFF_TOPIC_PATTERNS) {
        if (pattern.test(trimmed)) {
            return {
                valid: false,
                reason: 'This doesn\'t appear to be a software requirement.',
                suggestion: 'TestPilot generates test cases from software requirements. Try something like: "User should be able to reset password via email."',
                category: 'off_topic',
            };
        }
    }

    // ── 3. Gibberish detection ────────────────────────────────
    for (const pattern of GIBBERISH_PATTERNS) {
        if (pattern.test(trimmed)) {
            return {
                valid: false,
                reason: 'This input doesn\'t appear to contain meaningful content.',
                suggestion: 'Please enter a clear software requirement or feature description.',
                category: 'gibberish',
            };
        }
    }

    // ── 4. Single-word / ultra-short phrase check ─────────────
    if (words.length <= 2) {
        // Allow if the 1-2 words are clearly requirement-related
        const hasKeyword = REQUIREMENT_KEYWORDS.some(kw => lowerTrimmed.includes(kw));
        if (!hasKeyword) {
            return {
                valid: false,
                reason: 'Your input is too brief to generate meaningful test cases.',
                suggestion: 'Please provide more detail. Example: "User should be able to log in using email and password."',
                category: 'too_vague',
            };
        }
    }

    // ── 5. Scoring: count requirement signals ─────────────────
    let score = 0;

    // Keyword matches (each unique match adds 1 point)
    const matchedKeywords = new Set<string>();
    for (const keyword of REQUIREMENT_KEYWORDS) {
        if (lowerTrimmed.includes(keyword) && !matchedKeywords.has(keyword)) {
            matchedKeywords.add(keyword);
            score += 1;
        }
    }

    // Structure pattern matches (each adds 2 points — strong signal)
    for (const pattern of REQUIREMENT_STRUCTURE_PATTERNS) {
        if (pattern.test(trimmed)) {
            score += 2;
        }
    }

    // Bonus for longer, more descriptive input
    if (words.length >= 8) score += 1;
    if (words.length >= 15) score += 1;
    if (words.length >= 25) score += 1;

    // Bonus for bullet points / numbered lists
    if (/[•\-\*]\s+\w/.test(trimmed) || /^\d+[\.\)]\s/m.test(trimmed)) {
        score += 2;
    }

    // ── 6. Decision threshold ─────────────────────────────────
    // Score < 2 → likely not a requirement
    if (score < 2) {
        // One final check: is it a standalone question that's not requirement-related?
        const isPlainQuestion = /^(what|who|how|why|where|when|can|do|does|is|are|will)\b/i.test(trimmed) &&
            trimmed.endsWith('?') &&
            !REQUIREMENT_STRUCTURE_PATTERNS.some(p => p.test(trimmed));

        if (isPlainQuestion) {
            return {
                valid: false,
                reason: 'This looks like a general question, not a testable requirement.',
                suggestion: 'Rephrase as a requirement. Instead of "Can users log in?", try "Users should be able to log in with email and password."',
                category: 'question_only',
            };
        }

        return {
            valid: false,
            reason: 'We couldn\'t identify this as a software requirement.',
            suggestion: 'Describe a specific feature or behavior. Example: "After 5 failed login attempts, the account should be locked for 15 minutes."',
            category: 'too_vague',
        };
    }

    // ── 7. Valid! ─────────────────────────────────────────────
    return { valid: true };
}
