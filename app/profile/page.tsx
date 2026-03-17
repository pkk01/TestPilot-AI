'use client';

import { GenerationHeatmap } from '@/components/dashboard/GenerationHeatmap';
import { GenerationTrend } from '@/components/dashboard/GenerationTrend';
import { StatCard } from '@/components/dashboard/StatCard';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { createClient } from '@/lib/supabase/client-ssr';
import { Generation } from '@/types/generation.types';
import { Project } from '@/types/project.types';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
    Calendar,
    FlaskConical,
    FolderOpen,
    GitBranch,
    Mail,
    MapPin,
    Shield,
    Sparkles,
    UserCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

async function fetchAllHistory(): Promise<Generation[]> {
    const res = await fetch('/api/history?limit=100');
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
};

export default function ProfilePage() {
    const [user, setUser] = useState<{ name: string; email: string; createdAt: string } | null>(null);
    const supabase = createClient();

    const { data: allHistory = [] } = useQuery({ queryKey: ['history-all-profile'], queryFn: fetchAllHistory });
    const { data: projects = [] } = useQuery({ queryKey: ['projects-profile'], queryFn: fetchProjects });

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser({
                    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                    email: user.email || '',
                    createdAt: user.created_at || new Date().toISOString(),
                });
            }
        };
        getUser();
    }, [supabase]);

    const stats = [
        { label: 'Total Projects', value: projects.length, icon: FolderOpen, color: 'text-emerald-400' },
        { label: 'Total Generations', value: allHistory.length, icon: Sparkles, color: 'text-primary' },
        { label: 'Test Cases', value: allHistory.filter(g => g.generation_type === 'test_cases').length, icon: FlaskConical, color: 'text-violet-400' },
        { label: 'Feature Files', value: allHistory.filter(g => g.generation_type === 'gherkin').length, icon: GitBranch, color: 'text-orange-400' },
    ];

    return (
        <DashboardLayout>
            <div className="p-10 max-w-[1400px] mx-auto space-y-8 animate-fade-slide-in">
                {/* Profile Header Card */}
                <div className="card-rich p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <UserCircle className="w-48 h-48 text-primary" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                        <div className="w-32 h-32 rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0 shadow-2xl shadow-primary/10">
                            <UserCircle className="w-20 h-20 text-primary" />
                        </div>
                        
                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-4xl font-black text-foreground tracking-tight mb-1">
                                    {user?.name || 'Loading...'}
                                </h1>
                                <p className="text-primary font-bold tracking-[0.2em] uppercase text-xs">TestPilot AI Architect</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-foreground-subtle text-sm">
                                    <Mail className="w-4 h-4 text-primary/60" />
                                    {user?.email}
                                </div>
                                <div className="flex items-center gap-2 text-foreground-subtle text-sm">
                                    <Calendar className="w-4 h-4 text-primary/60" />
                                    Joined {user ? format(new Date(user.createdAt), 'MMMM yyyy') : '...'}
                                </div>
                                <div className="flex items-center gap-2 text-foreground-subtle text-sm">
                                    <MapPin className="w-4 h-4 text-primary/60" />
                                    Remote
                                </div>
                                <div className="flex items-center gap-2 text-foreground-subtle text-sm">
                                    <Shield className="w-4 h-4 text-primary/60" />
                                    Verified Account
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button className="btn-primary py-2 px-6 rounded-xl text-xs font-bold uppercase tracking-wider">
                                    Edit Profile
                                </button>
                                <button className="btn-secondary py-2 px-6 rounded-xl text-xs font-bold uppercase tracking-wider bg-background-card">
                                    Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Activity Heatmap */}
                    <div className="col-span-12 lg:col-span-8 h-[400px]">
                        <GenerationHeatmap generations={allHistory} />
                    </div>

                    {/* Trend Graph */}
                    <div className="col-span-12 lg:col-span-4 h-[400px]">
                        <GenerationTrend generations={allHistory} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
