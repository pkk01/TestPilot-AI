'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Project } from '@/types/project.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Clock, FolderOpen, Loader2, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

async function fetchProjects(): Promise<Project[]> {
    const res = await fetch('/api/projects');
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

async function createProject(payload: { name: string; description?: string }): Promise<Project> {
    const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

export default function ProjectsPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const { data: projects = [], isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
    });

    const createMutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setName('');
            setDescription('');
            setShowForm(false);
        },
    });

    const handleCreate = () => {
        if (!name.trim()) return;
        createMutation.mutate({ name: name.trim(), description: description.trim() || undefined });
    };

    return (
        <DashboardLayout>
            <div className="p-10 max-w-[1400px] mx-auto animate-fade-slide-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
                        <p className="text-sm text-foreground-subtle">
                            Organize your test generations by project workspace.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary flex items-center gap-2 py-3 px-6 rounded-xl font-bold uppercase tracking-widest text-xs"
                    >
                        <Plus className="w-4 h-4" />
                        New Project
                    </button>
                </div>

                {/* Create Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                        <div className="card-rich w-full max-w-md animate-slide-up shadow-2xl shadow-primary/10">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-foreground">Create New Project</h2>
                                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg bg-background-surface hover:bg-background-card-hover text-foreground-subtle transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-foreground-subtle uppercase tracking-[0.2em] mb-2">
                                        Project Name <span className="text-primary">*</span>
                                    </label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                        placeholder="e.g. E-commerce Login Module"
                                        className="input-field py-3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-foreground-subtle uppercase tracking-[0.2em] mb-2">
                                        Description <span className="text-[10px] opacity-40 lowercase">(optional)</span>
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Brief description of this project..."
                                        rows={4}
                                        className="input-field resize-none py-3"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-10">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-foreground-subtle hover:text-foreground hover:bg-background-surface rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    disabled={createMutation.isPending || !name.trim()}
                                    className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
                                >
                                    {createMutation.isPending ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" />Creating...</>
                                    ) : (
                                        <><Plus className="w-4 h-4" />Create Project</>
                                    )}
                                </button>
                            </div>

                            {createMutation.isError && (
                                <p className="text-xs text-red-500 mt-4 text-center font-bold">
                                    {createMutation.error?.message || 'Failed to create project'}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Projects Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="card-rich flex flex-col items-center justify-center py-24 text-center max-w-lg mx-auto">
                        <div className="w-16 h-16 rounded-2xl bg-background-surface border border-border flex items-center justify-center mb-6">
                            <FolderOpen className="w-8 h-8 text-foreground-subtle" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No projects yet</h3>
                        <p className="text-sm text-foreground-subtle mb-10 max-w-[280px]">
                            Create a project to organize your test generations by module or workspace.
                        </p>
                        <button onClick={() => setShowForm(true)} className="btn-primary py-3 px-8 rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                            Create First Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => router.push(`/generate?projectId=${project.id}`)}
                                className="card-rich group cursor-pointer hover:border-primary/40 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-background-surface border border-border flex items-center justify-center flex-shrink-0 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                                        <FolderOpen className="w-6 h-6 text-foreground-muted group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate mb-1">
                                            {project.name}
                                        </h3>
                                        {project.description && (
                                            <p className="text-xs text-foreground-subtle line-clamp-2 leading-relaxed">
                                                {project.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-foreground-subtle uppercase tracking-wider">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>
                                            Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-background-surface flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
