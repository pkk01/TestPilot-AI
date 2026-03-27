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
            <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8 space-y-8 md:space-y-10">
                <section className="space-y-4 md:space-y-5">
                    <h2 className="font-display text-[26px] md:text-[32px] lg:text-[40px] leading-tight font-black text-foreground tracking-tight">What are you testing today?</h2>

                    <div className="rounded-2xl border-none bg-background-highest px-4 py-3 flex items-end gap-3 transition-all duration-300 focus-within:bg-background-bright">
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
                        <Link href="/generate" className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover transition-colors duration-150 font-medium">
                            <span className="text-[10px]">⬡</span>
                            Generate Test Cases
                        </Link>
                        <Link href="/generate" className="inline-flex items-center gap-1.5 text-foreground-muted hover:text-foreground transition-colors duration-150 font-medium">
                            <span className="text-[10px]">⬡</span>
                            Gherkin
                        </Link>
                        <Link href="/generate" className="inline-flex items-center gap-1.5 text-foreground-muted hover:text-foreground transition-colors duration-150 font-medium">
                            <span className="text-[10px]">⬡</span>
                            Coverage Analysis
                        </Link>
                    </div>
                </section>

                <section>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 bg-background-surface rounded-[2rem] p-6 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                        {stats.map((stat) => (
                            <div key={stat.label} className="p-4 bg-background-highest rounded-2xl hover:bg-background-bright transition-colors duration-300">
                                <p className="text-[10px] text-foreground-muted uppercase tracking-[0.2em] font-bold">{stat.label}</p>
                                <div className="mt-2 flex items-end justify-between gap-2">
                                <p className="font-display text-[40px] md:text-[40px] leading-none font-black tracking-tight text-foreground">{stat.value}</p>
                                    <div className="flex items-center gap-1.5 text-[11px] text-foreground-muted font-mono font-bold">
                                        <Dot className={`w-4 h-4 -m-1 ${stat.tone}`} />
                                        <span>{stat.trend}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                    <div className="lg:col-span-8 space-y-6 md:space-y-8">
                        <div className="space-y-3">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-foreground-muted font-bold">Resume Where You Left Off</h3>
                            {latestGeneration ? (
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-background-highest rounded-2xl p-5 hover:bg-background-bright transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                                    <div className="min-w-0">
                                        <p className="font-display text-[15px] font-bold text-foreground truncate tracking-tight">{latestProjectName}</p>
                                        <p className="text-[15px] text-foreground-muted mt-1 capitalize font-medium">Generated {latestGeneration.generation_type.replace('_', ' ')}</p>
                                        <p className="text-[12px] text-foreground-subtle mt-1 font-semibold">{formatDistanceToNow(new Date(latestGeneration.created_at), { addSuffix: true })}</p>
                                    </div>
                                    <Link
                                        href="/generate"
                                        className="inline-flex items-center justify-center px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors duration-200"
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
                                <h3 className="text-[10px] uppercase tracking-[0.2em] text-foreground-muted font-bold">Recent Generations</h3>
                                <Link href="/history" className="text-[12px] text-foreground-muted hover:text-foreground transition-colors duration-150 font-medium">View all</Link>
                            </div>

                            <div className="mt-4 space-y-2">
                                {historyWithProject.length === 0 ? (
                                    <div className="py-8 text-[13px] text-foreground-subtle bg-background-card/30 rounded-2xl text-center">No generations yet.</div>
                                ) : (
                                    historyWithProject.map((gen) => {
                                        const config = typeConfig[gen.generation_type];
                                        const Icon = config.icon;
                                        return (
                                            <Link
                                                key={gen.id}
                                                href="/history"
                                                className="flex items-center gap-3 py-3 px-4 rounded-xl text-[13px] bg-background-highest hover:bg-background-bright transition-all duration-200 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
                                            >
                                                <Icon className="w-4 h-4 text-primary shrink-0" />
                                                <p className="text-foreground truncate font-semibold flex-1 min-w-0">{gen.projectName}</p>
                                                <span className="hidden sm:inline-flex items-center gap-1 rounded-sm bg-background-surface px-2 py-0.5 text-[11px] font-mono text-foreground-muted tracking-[0.06em] shrink-0">
                                                    <span className={config.dot}>●</span>
                                                    {config.label}
                                                </span>
                                                <span className="text-[11px] text-foreground-muted font-medium shrink-0 hidden md:inline">{formatDistanceToNow(new Date(gen.created_at), { addSuffix: true })}</span>
                                                <ArrowRight className="w-3.5 h-3.5 text-foreground-subtle shrink-0" />
                                            </Link>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6 md:space-y-8">
                        <div className="space-y-3">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-foreground-muted font-bold">Coverage</h3>
                            <p className="font-display text-[56px] leading-none font-black tracking-tight text-foreground">{coveragePercentage}%</p>
                            <div className="relative h-px bg-background-highest overflow-hidden">
                                <div className="absolute left-0 top-0 h-px bg-primary" style={{ width: `${coveragePercentage}%` }} />
                            </div>
                            <p className="text-[12px] text-foreground-muted font-medium">Missing scenarios: {missingScenarios}</p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[11px] uppercase tracking-[0.15em] text-foreground-muted font-bold pl-2">AI Suggestions</h3>
                            <ul className="space-y-3 relative z-10">
                                {[
                                    'Add edge cases for login',
                                    'Improve payment coverage',
                                    'Generate API tests',
                                ].map((suggestion) => (
                                    <li key={suggestion} className="flex items-center text-[14px] text-foreground font-medium bg-background-highest py-3.5 px-6 rounded-full border border-border/50 hover:bg-background-bright transition-all cursor-pointer shadow-sm">
                                        <span className="text-primary font-light mr-3">→</span> {suggestion}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}
