'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Generation } from '@/types/generation.types';
import { Project } from '@/types/project.types';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, Code2, FlaskConical, FolderOpen, GitBranch, History, Sparkles, TrendingUp } from 'lucide-react';
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

export default function DashboardPage() {
    const { data: history = [] } = useQuery({ queryKey: ['history-recent'], queryFn: fetchHistory });
    const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });

    const stats = [
        { label: 'Total Generations', value: history.length >= 5 ? '5+' : history.length, icon: Sparkles, color: 'text-primary' },
        { label: 'Projects', value: projects.length, icon: FolderOpen, color: 'text-emerald-400' },
        { label: 'Test Cases', value: history.filter(g => g.generation_type === 'test_cases').length, icon: FlaskConical, color: 'text-violet-400' },
        { label: 'Feature Files', value: history.filter(g => g.generation_type === 'gherkin').length, icon: GitBranch, color: 'text-orange-400' },
    ];

    return (
        <DashboardLayout>
            <div className="p-6 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground mb-1.5">
                        Dashboard
                    </h1>
                    <p className="text-sm text-foreground-muted">
                        Welcome to TestPilot AI — your AI-powered QA testing assistant.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {stats.map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="card">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider">{label}</p>
                                <Icon className={`w-4 h-4 ${color}`} />
                            </div>
                            <p className="text-3xl font-bold text-foreground">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Quick Actions */}
                    <div className="col-span-1">
                        <h2 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h2>
                        <div className="space-y-2.5">
                            <Link href="/generate" className="card flex items-center gap-3 hover:border-primary/50 transition-colors group">
                                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground">Generate Tests</p>
                                    <p className="text-xs text-foreground-subtle">AI-powered test generation</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-foreground-subtle group-hover:text-primary transition-colors" />
                            </Link>

                            <Link href="/projects" className="card flex items-center gap-3 hover:border-emerald-500/50 transition-colors group">
                                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                                    <FolderOpen className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground">Projects</p>
                                    <p className="text-xs text-foreground-subtle">Manage your projects</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-foreground-subtle group-hover:text-emerald-400 transition-colors" />
                            </Link>

                            <Link href="/history" className="card flex items-center gap-3 hover:border-violet-500/50 transition-colors group">
                                <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500/20 transition-colors">
                                    <History className="w-4 h-4 text-violet-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground">History</p>
                                    <p className="text-xs text-foreground-subtle">View past generations</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-foreground-subtle group-hover:text-violet-400 transition-colors" />
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-foreground">Recent Generations</h2>
                            <Link href="/history" className="text-xs text-primary hover:text-primary-hover transition-colors">
                                View all →
                            </Link>
                        </div>

                        {history.length === 0 ? (
                            <div className="card flex flex-col items-center justify-center py-12 text-center">
                                <TrendingUp className="w-8 h-8 text-foreground-subtle mb-3" />
                                <p className="text-sm font-medium text-foreground mb-1">No generations yet</p>
                                <p className="text-xs text-foreground-subtle mb-4">
                                    Start by generating test cases from your requirements.
                                </p>
                                <Link href="/generate" className="btn-primary text-sm px-4 py-2">
                                    Generate Tests
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {history.map((gen) => {
                                    const config = typeConfig[gen.generation_type];
                                    const Icon = config.icon;
                                    return (
                                        <div key={gen.id} className="card flex items-center gap-3 hover:border-border-light transition-colors">
                                            <div className="w-8 h-8 rounded-lg bg-background-surface border border-border flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-3.5 h-3.5 text-foreground-muted" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-foreground truncate">
                                                    {gen.requirement_text.slice(0, 80)}
                                                    {gen.requirement_text.length > 80 ? '...' : ''}
                                                </p>
                                                <p className="text-xs text-foreground-subtle">
                                                    {formatDistanceToNow(new Date(gen.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                            <span className={`badge flex-shrink-0 ${config.cls}`}>{config.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
