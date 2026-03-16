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

function ProjectAnalytics({ generations }: { generations: Generation[] }) {
    // Build a 4-week heatmap (28 days)
    const today = startOfDay(new Date());
    const days: { date: Date; count: number }[] = [];

    for (let i = 27; i >= 0; i--) {
        const dayStart = subDays(today, i);
        const dayEnd = subDays(today, i - 1);
        const count = generations.filter((g) => {
            const d = new Date(g.created_at);
            return isAfter(d, dayStart) && !isAfter(d, dayEnd);
        }).length;
        days.push({ date: dayStart, count });
    }

    const getColor = (count: number) => {
        if (count === 0) return 'bg-background-surface/50 border-white/5';
        if (count < 3) return 'bg-violet-900/40 border-violet-800/40';
        if (count < 6) return 'bg-violet-700/60 border-violet-600/60';
        if (count < 10) return 'bg-violet-500/80 border-violet-400/80';
        return 'bg-violet-400 border-violet-300 shadow-[0_0_12px_rgba(167,139,250,0.4)]';
    };

    // Group into weeks for the grid layout
    const weeks = [];
    for (let i = 0; i < 4; i++) {
        weeks.push(days.slice(i * 7, (i + 1) * 7));
    }

    return (
        <div className="card-rich h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground">Generation Activity</h3>
                <div className="flex items-center gap-1.5 overflow-hidden">
                    {[0, 2, 5, 8, 12].map((lvl) => (
                        <div key={lvl} className={`w-2 h-2 rounded-[2px] ${getColor(lvl)}`} />
                    ))}
                    <span className="text-[9px] text-foreground-subtle ml-1 uppercase font-bold">Density</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                {/* Month labels */}
                <div className="grid grid-cols-4 gap-3 mb-2 w-fit">
                    {weeks.map((week, i) => {
                        const firstDay = week[0].date;
                        const isMonthStart = i === 0 || firstDay.getDate() <= 7;
                        return (
                            <span key={i} className="text-[9px] text-foreground-subtle font-bold uppercase truncate">
                                {isMonthStart ? format(firstDay, 'MMM') : ''}
                            </span>
                        );
                    })}
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {weeks.map((week, wi) => (
                        <div key={wi} className="grid grid-rows-7 gap-1.5">
                            {week.map((day, di) => {
                                const tooltipText = day.count > 0
                                    ? `${day.count} generations on ${format(day.date, 'MMM d')}`
                                    : `No activity on ${format(day.date, 'MMM d')}`;
                                return (
                                    <div key={di} className="relative group">
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 scale-90 group-hover:scale-100">
                                            <div className="bg-background-card text-foreground text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-2xl border border-border">
                                                {tooltipText}
                                            </div>
                                            <div className="w-2 h-2 bg-background-card border-r border-b border-border rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1" />
                                        </div>

                                        <div
                                            className={`w-6 h-6 rounded-md border transition-all duration-300 cursor-pointer hover:scale-110 ${getColor(day.count)}`}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4 flex justify-between px-2">
                <span className="text-[10px] text-foreground-subtle font-bold uppercase tracking-wider">Older</span>
                <span className="text-[10px] text-foreground-subtle font-bold uppercase tracking-wider">Today</span>
            </div>
        </div>
    );
}

function ProjectHealth({ projects, generations }: { projects: Project[]; generations: Generation[] }) {
    // Build a 30-day contribution line graph (SVG)
    const today = startOfDay(new Date());
    const data: { count: number }[] = [];

    for (let i = 29; i >= 0; i--) {
        const dayStart = subDays(today, i);
        const dayEnd = subDays(today, i - 1);
        const count = generations.filter((g) => {
            const d = new Date(g.created_at);
            return isAfter(d, dayStart) && !isAfter(d, dayEnd);
        }).length;
        data.push({ count });
    }

    const maxCount = Math.max(...data.map((d) => d.count), 1);
    const width = 300;
    const height = 120;
    const padding = 10;

    const points = data.map((d, i) => ({
        x: (i / (data.length - 1)) * (width - padding * 2) + padding,
        y: height - (d.count / maxCount) * (height - padding * 2) - padding,
    }));

    const pathData = points.reduce(
        (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
        ''
    );

    const areaPath = `${pathData} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return (
        <div className="card-rich h-full flex flex-col">
            <h3 className="text-sm font-bold text-foreground mb-6">Generation Trend</h3>
            
            <div className="flex-1 relative group h-40">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)" />
                            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                        </linearGradient>
                    </defs>

                    {/* Subtle grid lines */}
                    {[0, 1, 2].map((i) => (
                        <line
                            key={i}
                            x1={padding}
                            y1={padding + (i * (height - padding * 2)) / 2}
                            x2={width - padding}
                            y2={padding + (i * (height - padding * 2)) / 2}
                            stroke="currentColor"
                            className="text-border/30"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                    ))}

                    <path
                        d={areaPath}
                        fill="url(#lineGradient)"
                        className="animate-pulse-slow"
                    />
                    
                    <path
                        d={pathData}
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))' }}
                    />

                    {/* Data Points and Tooltips */}
                    {points.map((p, i) => {
                        const { count } = data[i];
                        const d = subDays(today, 29 - i);
                        const tooltipText = count > 0
                            ? `${count} gens on ${format(d, 'MMM d')}`
                            : `0 gens on ${format(d, 'MMM d')}`;
                        
                        return (
                            <g key={i} className="group/point">
                                {/* Invisible larger hit area for hover */}
                                <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r="10"
                                    fill="transparent"
                                    className="cursor-pointer"
                                />
                                <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r="3"
                                    fill="#8b5cf6"
                                    className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-300 pointer-events-none"
                                />
                                {/* Tooltip using foreignObject for HTML rendering */}
                                <foreignObject
                                    x={p.x - 50}
                                    y={p.y - 45}
                                    width="100"
                                    height="40"
                                    className="opacity-0 group-hover/point:opacity-100 pointer-events-none transition-all duration-200 z-50 overflow-visible"
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="bg-background-card text-foreground text-[9px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-2xl border border-border scale-90 group-hover/point:scale-100 transition-transform">
                                            {tooltipText}
                                        </div>
                                        <div className="w-1.5 h-1.5 bg-background-card border-r border-b border-border rotate-45 -mt-0.5" />
                                    </div>
                                </foreignObject>
                            </g>
                        );
                    })}

                    {/* X-Axis Month/Day Labels (every 7-8 days) */}
                    {[0, 10, 20, 29].map((idx) => {
                        const d = subDays(today, 29 - idx);
                        const p = points[idx];
                        return (
                            <text
                                key={idx}
                                x={p.x}
                                y={height + 15}
                                textAnchor="middle"
                                className="fill-foreground-subtle text-[9px] font-bold uppercase"
                            >
                                {format(d, 'MMM d')}
                            </text>
                        );
                    })}
                </svg>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div>
                    <span className="text-[10px] text-foreground-subtle font-bold uppercase tracking-wider block">Total Effort</span>
                    <span className="text-xl font-bold text-foreground tracking-tight">
                        {generations.length} <span className="text-[10px] text-violet-400">Total Gens</span>
                    </span>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-foreground-subtle font-bold uppercase tracking-wider block">Trend</span>
                    <div className="flex items-center gap-1 text-emerald-400">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-xs font-bold font-mono">+{Math.min(generations.length * 5, 99)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

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
                        <ProjectAnalytics generations={allHistory} />
                    </div>

                    <div className="col-span-12 lg:col-span-3 h-[350px]">
                        <ProjectHealth projects={projects} generations={allHistory} />
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
