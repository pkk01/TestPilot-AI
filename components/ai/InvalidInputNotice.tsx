'use client';

import { ValidationResult } from '@/lib/security/requirementValidator';
import {
    ShieldX,
    MessageSquareOff,
    HelpCircle,
    Lightbulb,
    ArrowRight,
    Sparkles,
} from 'lucide-react';

interface InvalidInputNoticeProps {
    validation: ValidationResult;
}

const CATEGORY_CONFIG: Record<
    string,
    { icon: typeof ShieldX; title: string; color: string; bgGlow: string }
> = {
    casual_chat: {
        icon: MessageSquareOff,
        title: 'Casual Conversation Detected',
        color: 'text-amber-400',
        bgGlow: 'from-amber-500/5 via-transparent to-transparent',
    },
    gibberish: {
        icon: ShieldX,
        title: 'Unrecognized Input',
        color: 'text-red-400',
        bgGlow: 'from-red-500/5 via-transparent to-transparent',
    },
    too_vague: {
        icon: HelpCircle,
        title: 'Need More Detail',
        color: 'text-blue-400',
        bgGlow: 'from-blue-500/5 via-transparent to-transparent',
    },
    off_topic: {
        icon: ShieldX,
        title: 'Off-Topic Input',
        color: 'text-orange-400',
        bgGlow: 'from-orange-500/5 via-transparent to-transparent',
    },
    single_word: {
        icon: HelpCircle,
        title: 'Input Too Brief',
        color: 'text-blue-400',
        bgGlow: 'from-blue-500/5 via-transparent to-transparent',
    },
    question_only: {
        icon: HelpCircle,
        title: 'Question, Not a Requirement',
        color: 'text-violet-400',
        bgGlow: 'from-violet-500/5 via-transparent to-transparent',
    },
};

const TIPS = [
    {
        label: 'User Stories',
        description: 'Describe what a user wants to achieve',
        example: '"As a user, I want to reset my password via email"',
    },
    {
        label: 'System Behavior',
        description: 'Specify how the system should respond',
        example: '"System should lock account after 5 failed login attempts"',
    },
    {
        label: 'Acceptance Criteria',
        description: 'Define the conditions for success',
        example: '"Payment form should validate card number before submission"',
    },
    {
        label: 'Edge Cases',
        description: 'Cover boundary and error conditions',
        example: '"Empty cart should disable checkout button"',
    },
];

export default function InvalidInputNotice({ validation }: InvalidInputNoticeProps) {
    const category = validation.category || 'too_vague';
    const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.too_vague;
    const Icon = config.icon;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 animate-fade-in overflow-y-auto">
            {/* Background glow effect */}
            <div className={`absolute inset-0 bg-gradient-radial ${config.bgGlow} pointer-events-none opacity-60`} />

            <div className="relative max-w-lg w-full space-y-6">
                {/* Main rejection card */}
                <div className="text-center space-y-4">
                    {/* Animated icon */}
                    <div className="relative inline-flex">
                        <div className="w-16 h-16 rounded-2xl bg-background-card border border-border flex items-center justify-center relative z-10">
                            <Icon className={`w-7 h-7 ${config.color}`} />
                        </div>
                        {/* Pulse ring */}
                        <div className={`absolute inset-0 rounded-2xl ${config.color} opacity-20 animate-ping`}
                            style={{ animationDuration: '2s' }} />
                    </div>

                    <div>
                        <h2 className={`text-lg font-semibold ${config.color} mb-1.5`}>
                            {config.title}
                        </h2>
                        <p className="text-sm text-foreground-muted leading-relaxed max-w-sm mx-auto">
                            {validation.reason}
                        </p>
                    </div>

                    {/* Suggestion callout */}
                    {validation.suggestion && (
                        <div className="bg-background-card/80 border border-border rounded-xl p-4 text-left">
                            <div className="flex items-start gap-3">
                                <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-foreground-muted leading-relaxed">
                                    {validation.suggestion}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[10px] font-semibold text-foreground-subtle uppercase tracking-widest">
                        What works best
                    </span>
                    <div className="flex-1 h-px bg-border" />
                </div>

                {/* Tips grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TIPS.map((tip, i) => (
                        <div
                            key={i}
                            className="bg-background-card/60 border border-border rounded-xl p-3.5 
                                hover:border-primary/30 hover:bg-background-card transition-all duration-200 group"
                        >
                            <div className="flex items-center gap-2 mb-1.5">
                                <ArrowRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-xs font-semibold text-foreground">{tip.label}</span>
                            </div>
                            <p className="text-[11px] text-foreground-subtle mb-2 leading-relaxed">
                                {tip.description}
                            </p>
                            <p className="text-[11px] text-primary/70 font-mono leading-relaxed">
                                {tip.example}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer hint */}
                <div className="text-center pt-2">
                    <p className="text-[11px] text-foreground-subtle flex items-center justify-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-primary/50" />
                        Update your input in the left panel and click Generate
                    </p>
                </div>
            </div>
        </div>
    );
}
