'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Generation } from '@/types/generation.types';
import { Project } from '@/types/project.types';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
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
    test_cases: { label: 'Test Cases', icon: FlaskConical, cls: 'badge-test-cases' },
    gherkin: { label: 'Gherkin', icon: GitBranch, cls: 'badge-gherkin' },
    step_defs: { label: 'Step Defs', icon: Code2, cls: 'badge-step-defs' },
};

function StatCard({ label, value, trend, icon: Icon, color }: any) {
    return (
        <div className="card-rich flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-background-surface border border-border`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <button className="p-1.5 rounded-full hover:bg-background-surface text-foreground-subtle transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
            <div>
                <p className="text-xs font-bold text-foreground-subtle uppercase tracking-wider mb-1">{label}</p>
                <div className="flex items-end gap-3">
                    <h3 className="text-3xl font-bold text-foreground tracking-tight">{value}</h3>
                    {trend && (
                        <div className="flex items-center gap-1 mb-1 px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                            <TrendingUp className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-bold text-primary">{trend}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProjectAnalytics() {
    return (
        <div className="card-rich h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold text-foreground">Generation Activity</h3>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-[10px] text-foreground-subtle">Successful</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex items-end justify-between gap-2 px-2">
                {[40, 70, 45, 90, 65, 50, 40].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full relative h-32 bg-background-surface rounded-t-lg overflow-hidden">
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/40 to-primary/10 group-hover:from-primary/60 transition-all rounded-t-lg"
                                style={{ height: `${height}%` }}
                            />
                        </div>
                        <span className="text-[10px] text-foreground-subtle">{'SMTWTFS'[i]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProjectHealth() {
    return (
        <div className="card-rich h-full flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-bold text-foreground self-start mb-8">Project Progress</h3>
            <div className="relative w-40 h-20 mb-4">
                <svg viewBox="0 0 100 50" className="w-full h-full transform transition-all duration-1000">
                    <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-background-surface"
                    />
                    <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray="125.6"
                        strokeDashoffset="75"
                        className="text-primary"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-end">
                    <span className="text-2xl font-bold text-foreground leading-none">41%</span>
                    <span className="text-[10px] text-foreground-subtle mt-1 font-medium">Completed</span>
                </div>
            </div>
            <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[10px] text-foreground-subtle">Success</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-background-surface" />
                    <span className="text-[10px] text-foreground-subtle">Pending</span>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { data: history = [] } = useQuery({ queryKey: ['history-recent'], queryFn: fetchHistory });
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
                        <ProjectAnalytics />
                    </div>

                    <div className="col-span-12 lg:col-span-3 h-[350px]">
                        <ProjectHealth />
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
