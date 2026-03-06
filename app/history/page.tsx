'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Generation } from '@/types/generation.types';
import { useQuery } from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
import {
    Check,
    ChevronDown,
    ChevronRight,
    Code2,
    Copy,
    FlaskConical,
    GitBranch,
    History,
    Loader2,
    Search,
} from 'lucide-react';
import { useState } from 'react';

async function fetchHistory(): Promise<Generation[]> {
    const res = await fetch('/api/history?limit=100');
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

const typeConfig = {
    test_cases: {
        label: 'Test Cases',
        icon: FlaskConical,
        cls: 'badge-test-cases',
        color: 'text-primary',
    },
    gherkin: {
        label: 'Gherkin',
        icon: GitBranch,
        cls: 'badge-gherkin',
        color: 'text-emerald-400',
    },
    step_defs: {
        label: 'Step Defs',
        icon: Code2,
        cls: 'badge-step-defs',
        color: 'text-orange-400',
    },
};

function HistoryCard({ generation }: { generation: Generation }) {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const config = typeConfig[generation.generation_type];
    const Icon = config.icon;

    const getOutputText = (): string => {
        const output = generation.ai_output as unknown as Record<string, unknown>;
        if (generation.generation_type === 'test_cases') {
            return JSON.stringify(output, null, 2);
        }
        if (generation.generation_type === 'gherkin') {
            return (output.feature as string) || '';
        }
        return (output.javaCode as string) || '';
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(getOutputText());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="card hover:border-border-light transition-colors">
            <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="w-8 h-8 rounded-lg bg-background-surface border border-border flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">
                        {generation.requirement_text.slice(0, 100)}
                        {generation.requirement_text.length > 100 ? '...' : ''}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-foreground-subtle">
                            {format(new Date(generation.created_at), 'MMM d, yyyy · HH:mm')}
                        </span>
                        <span className="text-foreground-subtle">·</span>
                        <span className="text-xs text-foreground-subtle">
                            {formatDistanceToNow(new Date(generation.created_at), { addSuffix: true })}
                        </span>
                    </div>
                </div>

                {/* Badge + Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`badge ${config.cls}`}>{config.label}</span>
                    <button
                        onClick={handleCopy}
                        className="btn-ghost p-1.5"
                        title="Copy output"
                    >
                        {copied ? (
                            <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                            <Copy className="w-3.5 h-3.5" />
                        )}
                    </button>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="btn-ghost p-1.5"
                        title="Toggle preview"
                    >
                        {expanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Expandable preview */}
            {expanded && (
                <div className="mt-3 pt-3 border-t border-border animate-fade-in">
                    <pre className="text-xs text-foreground-muted bg-background-surface rounded-lg p-3 overflow-x-auto max-h-64 overflow-y-auto font-mono leading-relaxed whitespace-pre-wrap">
                        {getOutputText().slice(0, 2000)}
                        {getOutputText().length > 2000 ? '\n\n... (truncated)' : ''}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default function HistoryPage() {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<string>('all');

    const { data: history = [], isLoading } = useQuery({
        queryKey: ['history'],
        queryFn: fetchHistory,
    });

    const filtered = history.filter((gen) => {
        const matchesSearch = !search ||
            gen.requirement_text.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'all' || gen.generation_type === filterType;
        return matchesSearch && matchesType;
    });

    const counts = {
        all: history.length,
        test_cases: history.filter(g => g.generation_type === 'test_cases').length,
        gherkin: history.filter(g => g.generation_type === 'gherkin').length,
        step_defs: history.filter(g => g.generation_type === 'step_defs').length,
    };

    return (
        <DashboardLayout>
            <div className="p-6 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground mb-1.5">Generation History</h1>
                    <p className="text-sm text-foreground-muted">
                        All AI-generated test artifacts are stored here for future reference.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 mb-5">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-subtle" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by requirement..."
                            className="input-field pl-9 py-2"
                        />
                    </div>

                    {/* Type filter */}
                    <div className="flex items-center gap-1 bg-background-surface border border-border rounded-lg p-1">
                        {(['all', 'test_cases', 'gherkin', 'step_defs'] as const).map((type) => {
                            const label = type === 'all' ? 'All' : typeConfig[type].label;
                            const count = counts[type];
                            return (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${filterType === type
                                        ? 'bg-primary text-white'
                                        : 'text-foreground-subtle hover:text-foreground hover:bg-background-card'
                                        }`}
                                >
                                    {label} ({count})
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="card flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
                        <History className="w-10 h-10 text-foreground-subtle mb-4" />
                        <h3 className="text-base font-semibold text-foreground mb-2">
                            {history.length === 0 ? 'No generations yet' : 'No results found'}
                        </h3>
                        <p className="text-sm text-foreground-subtle">
                            {history.length === 0
                                ? 'Start by generating test cases from your requirements.'
                                : 'Try adjusting your search or filter criteria.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        <p className="text-xs text-foreground-subtle mb-3">
                            Showing {filtered.length} of {history.length} generation{history.length !== 1 ? 's' : ''}
                        </p>
                        {filtered.map((gen) => (
                            <HistoryCard key={gen.id} generation={gen} />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
