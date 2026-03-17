'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Generation } from '@/types/generation.types';
import { Project } from '@/types/project.types';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import {
    BrainCircuit,
    Code2,
    FileCheck2,
    FlaskConical,
    FolderOpen,
    GitBranch,
    Lightbulb,
    PlayCircle,
    Plus,
    Rocket,
    Sparkles,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { StatCard } from '@/components/dashboard/StatCard';

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

function getHealthBadge(createdAt: string) {
    const hoursAgo = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    if (hoursAgo <= 24) return { label: 'Good', cls: 'bg-green-500/10 text-green-400' };
    if (hoursAgo <= 72) return { label: 'Medium', cls: 'bg-yellow-500/10 text-yellow-400' };
    return { label: 'Poor', cls: 'bg-red-500/10 text-red-400' };
}


export default function DashboardPage() {
    const [heroInput, setHeroInput] = useState('');
    const { data: history = [] } = useQuery({ queryKey: ['history-recent'], queryFn: fetchHistory });
    const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });

    const stats = [
        { label: 'Total Projects', value: projects.length, trend: '+12%', icon: FolderOpen, color: 'text-emerald-400' },
        { label: 'Generations', value: history.length >= 5 ? '5+' : history.length, trend: '+24%', icon: Sparkles, color: 'text-primary' },
        { label: 'Test Cases', value: history.filter(g => g.generation_type === 'test_cases').length, trend: 'stable', icon: FlaskConical, color: 'text-violet-400' },
        { label: 'Feature Files', value: history.filter(g => g.generation_type === 'gherkin').length, trend: '+5%', icon: GitBranch, color: 'text-orange-400' },
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

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-slide-in">
                {/* Header */}
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">Dashboard</h1>
                        <p className="text-sm text-gray-400">
                            Plan, prioritize, and accomplish your tasks with ease.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/projects" className="btn-secondary flex items-center gap-2 py-2 px-5 text-xs font-medium uppercase tracking-wider">
                            Import Data
                        </Link>
                        <Link href="/generate" className="btn-primary flex items-center gap-2 py-2 px-5 text-xs font-medium uppercase tracking-wider">
                            <Plus className="w-4 h-4" />
                            Add Project
                        </Link>
                    </div>
                </div>

                {/* Hero + Quick Actions */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <Card className="xl:col-span-2 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-200">
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold tracking-tight">Your QA assistant is ready. What do you want to test today?</CardTitle>
                            <CardDescription>Describe your requirement and jump straight into generation workflows.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <textarea
                                value={heroInput}
                                onChange={(event) => setHeroInput(event.target.value)}
                                placeholder="Paste user story, acceptance criteria, or feature flow..."
                                rows={5}
                                className="w-full rounded-xl bg-[#0B1220] border border-gray-700 px-4 py-3 text-sm text-foreground placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-150"
                            />
                            <div className="flex flex-wrap gap-3">
                                <Link href="/generate" className="btn-primary inline-flex items-center gap-2">
                                    <FileCheck2 className="w-4 h-4" />
                                    Generate Test Cases
                                </Link>
                                <Link href="/generate" className="btn-secondary inline-flex items-center gap-2">
                                    <GitBranch className="w-4 h-4" />
                                    Generate Gherkin
                                </Link>
                                <Link href="/generate" className="btn-secondary inline-flex items-center gap-2">
                                    <BrainCircuit className="w-4 h-4" />
                                    Analyze Coverage
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:border-indigo-500/30 transition-all duration-200">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Fast access to your most-used QA workflows.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/generate" className="btn-primary w-full justify-center inline-flex items-center gap-2">
                                <FlaskConical className="w-4 h-4" />
                                Generate Test Cases
                            </Link>
                            <Link href="/generate" className="btn-secondary w-full justify-center inline-flex items-center gap-2">
                                <GitBranch className="w-4 h-4" />
                                Generate Gherkin
                            </Link>
                            <Link href="/generate" className="btn-secondary w-full justify-center inline-flex items-center gap-2">
                                <BrainCircuit className="w-4 h-4" />
                                Analyze Coverage
                            </Link>
                            <Link href="/generate" className="btn-secondary w-full justify-center inline-flex items-center gap-2">
                                <Rocket className="w-4 h-4" />
                                Export Automation
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </div>

                {/* Resume + Coverage + Suggestions */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <Card className="xl:col-span-2 hover:border-indigo-500/30 transition-all duration-200">
                        <CardHeader>
                            <CardTitle>Resume Where You Left Off</CardTitle>
                            <CardDescription>Continue from your latest generation in one click.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {latestGeneration ? (
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl bg-white/5 border border-gray-800 p-4">
                                    <div className="min-w-0">
                                        <p className="text-sm text-gray-400">Project</p>
                                        <p className="text-base font-medium text-foreground truncate">{latestProjectName}</p>
                                        <p className="text-sm text-gray-400 mt-2">Last action</p>
                                        <p className="text-sm text-foreground capitalize">Generated {latestGeneration.generation_type.replace('_', ' ')}</p>
                                        <p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(new Date(latestGeneration.created_at), { addSuffix: true })}</p>
                                    </div>
                                    <Link href="/generate" className="btn-primary inline-flex items-center gap-2 w-fit">
                                        <PlayCircle className="w-4 h-4" />
                                        Continue
                                    </Link>
                                </div>
                            ) : (
                                <div className="rounded-xl bg-white/5 border border-gray-800 p-4 text-sm text-gray-400">
                                    No activity yet. Start with your first generation.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="hover:border-indigo-500/30 transition-all duration-200">
                        <CardHeader>
                            <CardTitle>Coverage Summary</CardTitle>
                            <CardDescription>Current quality signal from recent outputs.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-400">Project</p>
                                <p className="text-sm font-medium text-foreground truncate">{latestProjectName}</p>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-gray-400">Coverage</p>
                                    <p className="text-sm font-semibold text-foreground">{coveragePercentage}%</p>
                                </div>
                                <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                                    <div
                                        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                                        style={{ width: `${coveragePercentage}%` }}
                                    />
                                </div>
                            </div>
                            <div className="rounded-lg border border-gray-800 bg-white/5 p-3">
                                <p className="text-xs text-gray-400">Missing scenarios</p>
                                <p className="text-lg font-semibold text-foreground">{missingScenarios}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="hover:border-indigo-500/30 transition-all duration-200">
                    <CardHeader>
                        <CardTitle>AI Suggestions</CardTitle>
                        <CardDescription>Recommended next steps to improve test quality.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                                'Add edge cases for login',
                                'Improve payment coverage',
                                'Generate API tests',
                            ].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    className="flex items-center gap-2 rounded-xl border border-gray-800 bg-white/5 px-4 py-3 text-left text-sm text-gray-300 hover:text-indigo-400 hover:border-indigo-500/30 transition-all duration-150"
                                >
                                    <Lightbulb className="w-4 h-4 text-gray-400" />
                                    <span>{suggestion}</span>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-12 gap-6">
                    {/* Recent Generations List */}
                    <div className="col-span-12 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-foreground">Recent Projects</h2>
                            <Link href="/history" className="text-sm text-primary font-medium hover:text-indigo-400 transition-all duration-150">
                                View all
                            </Link>
                        </div>

                        <div className="space-y-3 flex-1">
                            {history.length === 0 ? (
                                <div className="card-rich flex flex-col items-center justify-center py-14 text-center h-full">
                                    <TrendingUp className="w-8 h-8 text-gray-400 mb-3" />
                                    <p className="text-sm font-medium text-foreground mb-1">No data yet — start by generating your first test case</p>
                                    <Link href="/generate" className="btn-primary mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm">
                                        Generate Now
                                    </Link>
                                </div>
                            ) : (
                                history.map((gen) => {
                                    const config = typeConfig[gen.generation_type];
                                    const Icon = config.icon;
                                    const health = getHealthBadge(gen.created_at);
                                    return (
                                        <div key={gen.id} className="card-rich py-4 flex items-center gap-4 group hover:bg-white/5 transition-all duration-150">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors duration-150" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate mb-1">
                                                    {gen.requirement_text}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Updated {formatDistanceToNow(new Date(gen.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`rounded-full px-2 py-1 text-xs font-medium ${health.cls}`}>
                                                    {health.label}
                                                </span>
                                                <span className={`badge text-[10px] uppercase tracking-tight font-semibold ${config.cls}`}>
                                                    {config.label}
                                                </span>
                                            </div>
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
