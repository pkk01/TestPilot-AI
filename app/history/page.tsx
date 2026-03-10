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
    Search,
    Trash2,
} from 'lucide-react';
import { LoaderFive } from '@/components/ui/loader';
import Link from 'next/link';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

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
    const [isDeleting, setIsDeleting] = useState(false);
    const queryClient = useQueryClient();
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

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this generation history? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/history?id=${generation.id}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (data.success) {
                queryClient.invalidateQueries({ queryKey: ['history'] });
            } else {
                throw new Error(data.error || 'Failed to delete');
            }
        } catch (error: any) {
            console.error('Delete error:', error);
            alert(error.message || 'Failed to delete generation');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="card-rich hover:border-primary/20 transition-all group">
            <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-background-surface border border-border flex items-center justify-center flex-shrink-0 group-hover:border-primary/30 transition-colors">
                    <Icon className={`w-5 h-5 ${config.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate mb-1">
                        {generation.requirement_text}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-foreground-subtle uppercase tracking-wider">
                            {format(new Date(generation.created_at), 'MMM d, yyyy · HH:mm')}
                        </span>
                        <span className="text-[10px] text-foreground-subtle font-black opacity-20">·</span>
                        <span className="text-[10px] font-bold text-foreground-subtle uppercase tracking-wider">
                            {formatDistanceToNow(new Date(generation.created_at), { addSuffix: true })}
                        </span>
                    </div>
                </div>

                {/* Badge + Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`badge text-[9px] uppercase tracking-tighter font-black ${config.cls}`}>{config.label}</span>
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg bg-background-surface hover:bg-background-card-hover text-foreground-subtle hover:text-foreground transition-all"
                        title="Copy output"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-primary" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 rounded-lg bg-background-surface hover:bg-red-500/10 text-foreground-subtle hover:text-red-500 transition-all disabled:opacity-50"
                        title="Delete generation"
                    >
                        {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                    </button>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="p-2 rounded-lg bg-background-surface hover:bg-background-card-hover text-foreground-subtle hover:text-foreground transition-all"
                        title="Toggle preview"
                    >
                        {expanded ? (
                            <ChevronDown className="w-4 h-4 text-primary" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Expandable preview */}
            {expanded && (
                <div className="mt-4 pt-4 border-t border-border animate-slide-up">
                    <pre className="text-xs text-foreground-muted bg-background-surface border border-border rounded-xl p-4 overflow-x-auto max-h-80 overflow-y-auto font-mono leading-relaxed whitespace-pre-wrap">
                        {getOutputText().slice(0, 5000)}
                        {getOutputText().length > 5000 ? '\n\n... (truncated)' : ''}
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
            <div className="p-10 max-w-[1400px] mx-auto animate-fade-slide-in">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Generation History</h1>
                    <p className="text-sm text-foreground-subtle">
                        All AI-generated test artifacts are stored here for future reference.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                    {/* Search */}
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by requirement..."
                            className="input-field pl-12 py-3 shadow-xl shadow-black/10 border-none bg-background-card"
                        />
                    </div>

                    {/* Type filter */}
                    <div className="flex items-center gap-1 bg-background-card border border-border rounded-xl p-1.5 shadow-xl shadow-black/10">
                        {(['all', 'test_cases', 'gherkin', 'step_defs'] as const).map((type) => {
                            const label = type === 'all' ? 'All' : typeConfig[type].label;
                            const count = counts[type];
                            return (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${filterType === type
                                        ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-[1.05]'
                                        : 'text-foreground-subtle hover:text-foreground hover:bg-background-card-hover'
                                        }`}
                                >
                                    {label} <span className="opacity-50 ml-1">({count})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoaderFive text="Loading history..." />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="card-rich flex flex-col items-center justify-center py-24 text-center max-w-lg mx-auto">
                        <div className="w-16 h-16 rounded-2xl bg-background-surface border border-border flex items-center justify-center mb-6">
                            <History className="w-8 h-8 text-foreground-subtle" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">
                            {history.length === 0 ? 'No generations yet' : 'No results found'}
                        </h3>
                        <p className="text-sm text-foreground-subtle mb-8 max-w-[280px]">
                            {history.length === 0
                                ? 'Start by generating test cases from your requirements.'
                                : 'Try adjusting your search or filter criteria.'}
                        </p>
                        {history.length === 0 && (
                            <Link href="/generate" className="btn-primary py-3 px-8 rounded-xl font-bold uppercase tracking-widest text-xs">
                                Generate Tests
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-[0.2em]">
                                Showing {filtered.length} Results
                            </p>
                        </div>
                        {filtered.map((gen) => (
                            <HistoryCard key={gen.id} generation={gen} />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
