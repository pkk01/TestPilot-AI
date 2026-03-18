'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Generation } from '@/types/generation.types';
import { Project } from '@/types/project.types';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import {
    ArrowRight,
    ArrowUp,
    Dot,
    FlaskConical,
    GitBranch,
    Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

async function fetchHistory(): Promise<Generation[]> {
    const res = await fetch('/api/history?limit=5');
    const data = await res.json();
    return data.success ? data.data : [];
}

async function fetchProjects(): Promise<Project[]> {
    const res = await fetch('/api/projects');
    const data = await res.json();
    return data.success ? data.data : [];
}

const typeConfig = {
    test_cases: { label: 'TEST CASES', icon: FlaskConical, dot: 'text-primary' },
    gherkin: { label: 'GHERKIN', icon: GitBranch, dot: 'text-cyan-400' },
    step_defs: { label: 'STEP DEFS', icon: Sparkles, dot: 'text-primary' },
};

export default function DashboardPage() {
    const [heroInput, setHeroInput] = useState('');
    const router = useRouter();
    const heroInputRef = useRef<HTMLTextAreaElement | null>(null);
    const { data: history = [] } = useQuery({ queryKey: ['history-recent'], queryFn: fetchHistory });
    const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });

    const stats = [
        { label: 'Total Projects', value: projects.length, trend: '↑12%', tone: 'text-primary' },
        { label: 'Generations', value: history.length >= 5 ? '5+' : history.length, trend: '↑24%', tone: 'text-primary' },
        { label: 'Test Cases', value: history.filter(g => g.generation_type === 'test_cases').length, trend: 'stable', tone: 'text-yellow-400' },
        { label: 'Feature Files', value: history.filter(g => g.generation_type === 'gherkin').length, trend: '↑5%', tone: 'text-primary' },
    ];

    const latestGeneration = history[0] || null;
    const latestProjectName = useMemo(() => {
        if (!latestGeneration?.project_id) return 'Personal Project';
        return projects.find((project) => project.id === latestGeneration.project_id)?.name || 'Personal Project';
    }, [latestGeneration, projects]);

    const testCaseCount = history.filter((g) => g.generation_type === 'test_cases').length;
    const gherkinCount = history.filter((g) => g.generation_type === 'gherkin').length;
    const coveragePercentage = history.length === 0 ? 0 : Math.min(100, Math.round((testCaseCount / Math.max(history.length, 1)) * 100));
    const missingScenarios = Math.max(0, gherkinCount * 3 - testCaseCount);

    const historyWithProject = history.map((generation) => ({
        ...generation,
        projectName: projects.find((project) => project.id === generation.project_id)?.name || 'Personal Project',
    }));

    useEffect(() => {
        const textareaElement = heroInputRef.current;
        if (!textareaElement) return;

        textareaElement.style.height = '0px';
        textareaElement.style.height = `${textareaElement.scrollHeight}px`;
    }, [heroInput]);

    const handleHeroSend = () => {
        const requirement = heroInput.trim();
        if (!requirement) return;

        const params = new URLSearchParams({
            requirement,
            autoGenerate: '1',
        });

        router.push(`/generate?${params.toString()}`);
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
                <section className="space-y-5">
                    <h2 className="text-[34px] md:text-[42px] leading-tight font-light text-foreground tracking-tight">What are you testing today?</h2>

                    <div className="rounded-2xl border border-border bg-background-card px-3 py-2 flex items-end gap-2">
                        <textarea
                            ref={heroInputRef}
                            value={heroInput}
                            onChange={(event) => setHeroInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' && !event.shiftKey) {
                                    event.preventDefault();
                                    handleHeroSend();
                                }
                            }}
                            placeholder="Paste requirement, story, or flow"
                            rows={1}
                            className="w-full min-h-[38px] resize-none overflow-hidden bg-transparent px-2 py-1.5 text-[15px] leading-6 text-foreground placeholder:text-foreground-subtle focus:outline-none"
                        />

                        <button
                            type="button"
                            onClick={handleHeroSend}
                            disabled={heroInput.trim().length === 0}
                            className="h-9 w-9 flex items-center justify-center rounded-xl bg-primary text-white border border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors duration-150"
                            aria-label="Send requirement"
                        >
                            <ArrowUp className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-[13px]">
                        <Link href="/generate" className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover transition-colors duration-150">
                            <span className="text-[10px]">⬡</span>
                            Generate Test Cases
                        </Link>
                        <Link href="/generate" className="inline-flex items-center gap-1.5 text-foreground-muted hover:text-foreground transition-colors duration-150">
                            <span className="text-[10px]">⬡</span>
                            Gherkin
                        </Link>
                        <Link href="/generate" className="inline-flex items-center gap-1.5 text-foreground-muted hover:text-foreground transition-colors duration-150">
                            <span className="text-[10px]">⬡</span>
                            Coverage Analysis
                        </Link>
                    </div>
                </section>

                <section className="border-y border-border">
                    <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
                        {stats.map((stat) => (
                            <div key={stat.label} className="px-4 py-4">
                                <p className="text-[11px] text-foreground-muted uppercase tracking-[0.1em]">{stat.label}</p>
                                <div className="mt-2 flex items-end justify-between gap-2">
                                    <p className="mono-stat text-[30px] leading-none">{stat.value}</p>
                                    <div className="flex items-center gap-1.5 text-[11px] text-foreground-muted font-mono">
                                        <Dot className={`w-4 h-4 -m-1 ${stat.tone}`} />
                                        <span>{stat.trend}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    <div className="xl:col-span-8 space-y-8">
                        <div className="space-y-3">
                            <h3 className="section-label">Resume Where You Left Off</h3>
                            {latestGeneration ? (
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-4">
                                    <div className="min-w-0">
                                        <p className="text-[15px] font-medium text-foreground truncate">{latestProjectName}</p>
                                        <p className="text-[13px] text-foreground-muted mt-1 capitalize">Generated {latestGeneration.generation_type.replace('_', ' ')}</p>
                                        <p className="text-[11px] text-foreground-subtle mt-1">{formatDistanceToNow(new Date(latestGeneration.created_at), { addSuffix: true })}</p>
                                    </div>
                                    <Link
                                        href="/generate"
                                        className="inline-flex items-center justify-center px-3 py-1.5 text-[12px] font-medium border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors duration-200"
                                    >
                                        Continue
                                    </Link>
                                </div>
                            ) : (
                                <p className="text-[13px] text-foreground-subtle">No activity yet.</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="section-label">Recent Generations</h3>
                                <Link href="/history" className="text-[12px] text-foreground-muted hover:text-foreground transition-colors duration-150">View all</Link>
                            </div>

                            <div className="border-t border-border">
                                {historyWithProject.length === 0 ? (
                                    <div className="py-8 text-[13px] text-foreground-subtle">No generations yet.</div>
                                ) : (
                                    historyWithProject.map((gen) => {
                                        const config = typeConfig[gen.generation_type];
                                        const Icon = config.icon;
                                        return (
                                            <Link
                                                key={gen.id}
                                                href="/history"
                                                className="grid grid-cols-[20px_minmax(0,1fr)_auto_auto_20px] items-center gap-3 py-3 border-b border-border text-[13px] hover:bg-white/5 transition-colors duration-150"
                                            >
                                                <Icon className="w-4 h-4 text-foreground-muted" />
                                                <p className="text-foreground truncate">{gen.projectName}</p>
                                                <span className="inline-flex items-center gap-1 rounded-sm border border-border bg-background-card px-2 py-0.5 text-[11px] font-mono text-foreground-muted tracking-[0.06em]">
                                                    <span className={config.dot}>●</span>
                                                    {config.label}
                                                </span>
                                                <span className="text-[11px] text-foreground-muted">{formatDistanceToNow(new Date(gen.created_at), { addSuffix: true })}</span>
                                                <ArrowRight className="w-3.5 h-3.5 text-foreground-subtle" />
                                            </Link>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-4 space-y-8">
                        <div className="space-y-3">
                            <h3 className="section-label">Coverage</h3>
                            <p className="mono-stat text-[44px] leading-none">{coveragePercentage}%</p>
                            <div className="relative h-px bg-border overflow-hidden">
                                <div className="absolute left-0 top-0 h-px bg-primary" style={{ width: `${coveragePercentage}%` }} />
                            </div>
                            <p className="text-[12px] text-foreground-muted">Missing scenarios: {missingScenarios}</p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="section-label">AI Suggestions</h3>
                            <ul className="space-y-2 border-l-2 border-border-light pl-3">
                                {[
                                    'Add edge cases for login',
                                    'Improve payment coverage',
                                    'Generate API tests',
                                ].map((suggestion) => (
                                    <li key={suggestion} className="text-[13px] text-foreground-muted">→ {suggestion}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}
