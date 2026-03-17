'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Generation } from '@/types/generation.types';
import { Project } from '@/types/project.types';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow, subDays, startOfDay, isAfter, format } from 'date-fns';
import {
    ArrowUpRight,
    Code2,
    FlaskConical,
    FolderOpen,
    GitBranch,
    Plus,
    Sparkles,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';

import { GenerationHeatmap } from '@/components/dashboard/GenerationHeatmap';
import { GenerationTrend } from '@/components/dashboard/GenerationTrend';
import { StatCard } from '@/components/dashboard/StatCard';

async function fetchHistory(): Promise<Generation[]> {
    const res = await fetch('/api/history?limit=5');
    const data = await res.json();
    return data.success ? data.data : [];
}

async function fetchAllHistory(): Promise<Generation[]> {
    const res = await fetch('/api/history?limit=50');
    const data = await res.json();
    return data.success ? data.data : [];
}

async function fetchProjects(): Promise<Project[]> {
    const res = await fetch('/api/projects');
    const data = await res.json();
    return data.success ? data.data : [];
}

const typeConfig = {
    test_cases: { label: 'Test Cases', icon: FlaskConical, cls: 'badge-test-cases' },
    gherkin: { label: 'Gherkin', icon: GitBranch, cls: 'badge-gherkin' },
    step_defs: { label: 'Step Defs', icon: Code2, cls: 'badge-step-defs' },
};


export default function DashboardPage() {
    const { data: history = [] } = useQuery({ queryKey: ['history-recent'], queryFn: fetchHistory });
    const { data: allHistory = [] } = useQuery({ queryKey: ['history-all'], queryFn: fetchAllHistory });
    const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });

    const stats = [
        { label: 'Total Projects', value: projects.length, trend: '+12%', icon: FolderOpen, color: 'text-emerald-400' },
        { label: 'Generations', value: history.length >= 5 ? '5+' : history.length, trend: '+24%', icon: Sparkles, color: 'text-primary' },
        { label: 'Test Cases', value: history.filter(g => g.generation_type === 'test_cases').length, trend: 'stable', icon: FlaskConical, color: 'text-violet-400' },
        { label: 'Feature Files', value: history.filter(g => g.generation_type === 'gherkin').length, trend: '+5%', icon: GitBranch, color: 'text-orange-400' },
    ];

    return (
        <DashboardLayout>
            <div className="p-10 max-w-[1600px] mx-auto space-y-10 animate-fade-slide-in">
                {/* Header */}
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
                        <p className="text-sm text-foreground-subtle">
                            Plan, prioritize, and accomplish your tasks with ease.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/projects" className="btn-secondary flex items-center gap-2 py-2 px-5 rounded-xl border-none bg-background-card hover:bg-background-card-hover transition-all font-bold text-xs uppercase tracking-wider">
                            Import Data
                        </Link>
                        <Link href="/generate" className="btn-primary flex items-center gap-2 py-2 px-5 rounded-xl bg-primary text-black hover:bg-primary-hover transition-all font-bold text-xs uppercase tracking-wider">
                            <Plus className="w-4 h-4" />
                            Add Project
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Analytics Section */}
                    <div className="col-span-12 lg:col-span-4 h-[350px]">
                        <GenerationHeatmap generations={allHistory} />
                    </div>

                    <div className="col-span-12 lg:col-span-3 h-[350px]">
                        <GenerationTrend generations={allHistory} />
                    </div>

                    {/* Recent Generations List */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-foreground">Recent Projects</h2>
                            <Link href="/history" className="text-xs text-primary font-bold hover:underline">
                                View all
                            </Link>
                        </div>

                        <div className="space-y-3 flex-1">
                            {history.length === 0 ? (
                                <div className="card-rich flex flex-col items-center justify-center py-12 text-center h-full">
                                    <TrendingUp className="w-8 h-8 text-foreground-subtle mb-3" />
                                    <p className="text-sm font-medium text-foreground mb-1">No generations yet</p>
                                    <p className="text-xs text-foreground-subtle">
                                        Start by generating test cases from your requirements.
                                    </p>
                                </div>
                            ) : (
                                history.map((gen) => {
                                    const config = typeConfig[gen.generation_type];
                                    const Icon = config.icon;
                                    return (
                                        <div key={gen.id} className="card-rich py-4 flex items-center gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-background-surface border border-border flex items-center justify-center flex-shrink-0 group-hover:border-primary/50 transition-colors">
                                                <Icon className="w-5 h-5 text-foreground-muted group-hover:text-primary transition-colors" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-foreground truncate mb-0.5">
                                                    {gen.requirement_text}
                                                </p>
                                                <p className="text-[10px] text-foreground-subtle font-medium uppercase tracking-wider">
                                                    Due date: {formatDistanceToNow(new Date(gen.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                            <span className={`badge text-[9px] uppercase tracking-tighter font-black ${config.cls}`}>
                                                {config.label}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
