'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

interface UsageData {
    used: number;
    limit: number;
    remaining: number;
}

interface AIUsageBadgeProps {
    /** Override usage data (e.g., from a parent component that tracks it) */
    usageOverride?: UsageData | null;
    /** Compact mode — just the pill */
    compact?: boolean;
}

export default function AIUsageBadge({ usageOverride, compact = false }: AIUsageBadgeProps) {
    const [usage, setUsage] = useState<UsageData | null>(usageOverride || null);
    const [loading, setLoading] = useState(!usageOverride);

    useEffect(() => {
        if (usageOverride) {
            setUsage(usageOverride);
            return;
        }

        const fetchUsage = async () => {
            try {
                const res = await fetch('/api/usage');
                const data = await res.json();
                if (data.success && data.data) {
                    setUsage(data.data);
                }
            } catch {
                // Silent fail — badge just won't show
            } finally {
                setLoading(false);
            }
        };

        fetchUsage();
    }, [usageOverride]);

    if (loading || !usage) return null;

    const isWarning = usage.used >= usage.limit - 1;
    const isBlocked = usage.remaining === 0;

    const bgColor = isBlocked
        ? 'bg-red-500/15 border-red-500/30'
        : isWarning
            ? 'bg-amber-500/15 border-amber-500/30'
            : 'bg-cyan-500/10 border-cyan-500/20';

    const textColor = isBlocked
        ? 'text-red-400'
        : isWarning
            ? 'text-amber-400'
            : 'text-cyan-400';

    const glowColor = isBlocked
        ? 'shadow-[0_0_8px_rgba(239,68,68,0.15)]'
        : isWarning
            ? 'shadow-[0_0_8px_rgba(245,158,11,0.15)]'
            : 'shadow-[0_0_8px_rgba(6,182,212,0.1)]';

    if (compact) {
        return (
            <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${bgColor} ${textColor} ${glowColor} transition-all duration-300`}
                title={`${usage.used}/${usage.limit} AI calls used today`}
            >
                <Zap className="w-3 h-3" />
                <span>{usage.remaining}/{usage.limit}</span>
            </div>
        );
    }

    return (
        <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border ${bgColor} ${glowColor} transition-all duration-300`}
        >
            <Zap className={`w-4 h-4 ${textColor}`} />
            <div className="flex flex-col">
                <span className={`text-xs font-medium ${textColor}`}>
                    AI Usage Today
                </span>
                <span className="text-[11px] text-gray-400">
                    {isBlocked
                        ? 'Limit reached — resets tomorrow'
                        : `${usage.used}/${usage.limit} calls used`
                    }
                </span>
            </div>
            {/* Progress bar */}
            <div className="ml-auto w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${
                        isBlocked
                            ? 'bg-red-500'
                            : isWarning
                                ? 'bg-amber-500'
                                : 'bg-cyan-500'
                    }`}
                    style={{ width: `${(usage.used / usage.limit) * 100}%` }}
                />
            </div>
        </div>
    );
}
