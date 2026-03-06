'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Project } from '@/types/project.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Clock, FolderOpen, Loader2, Plus, X } from 'lucide-react';
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
            <div className="p-6 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground mb-1.5">Projects</h1>
                        <p className="text-sm text-foreground-muted">
                            Organize your test generations by project.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Project
                    </button>
                </div>

                {/* Create Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                        <div className="card w-full max-w-md animate-slide-up">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-base font-semibold text-foreground">Create New Project</h2>
                                <button onClick={() => setShowForm(false)} className="btn-ghost p-1.5">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        Project Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                        placeholder="e.g. E-commerce Login Module"
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        Description <span className="text-foreground-subtle text-xs">(optional)</span>
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Brief description of this project..."
                                        rows={3}
                                        className="input-field resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 mt-5">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    disabled={createMutation.isPending || !name.trim()}
                                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                                >
                                    {createMutation.isPending ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" />Creating...</>
                                    ) : (
                                        <><Plus className="w-4 h-4" />Create Project</>
                                    )}
                                </button>
                            </div>

                            {createMutation.isError && (
                                <p className="text-xs text-red-400 mt-3">
                                    {createMutation.error?.message || 'Failed to create project'}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Projects Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="card flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
                        <FolderOpen className="w-10 h-10 text-foreground-subtle mb-4" />
                        <h3 className="text-base font-semibold text-foreground mb-2">No projects yet</h3>
                        <p className="text-sm text-foreground-subtle mb-5">
                            Create a project to organize your test generations.
                        </p>
                        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Create First Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {projects.map((project) => (
                            <div key={project.id} className="card hover:border-border-light transition-colors group">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                        <FolderOpen className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-foreground truncate">
                                            {project.name}
                                        </h3>
                                        {project.description && (
                                            <p className="text-xs text-foreground-subtle mt-0.5 line-clamp-2">
                                                {project.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-foreground-subtle">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                        Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
