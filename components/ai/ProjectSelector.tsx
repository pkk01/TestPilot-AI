'use client';

import { Project } from '@/types/project.types';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronDown, FolderOpen, Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProjectSelectorProps {
    selectedProjectId: string;
    onSelect: (projectId: string) => void;
}

async function fetchProjects(): Promise<Project[]> {
    const res = await fetch('/api/projects');
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
}

export default function ProjectSelector({ selectedProjectId, onSelect }: ProjectSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const { data: projects = [], refetch } = useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
    });

    const selectedProject = projects.find((p) => p.id === selectedProjectId);
    const displayName = selectedProject?.name || 'Select Project';

    const handleCreate = async () => {
        if (!newProjectName.trim()) return;
        setIsCreating(true);
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newProjectName.trim() }),
            });
            const data = await res.json();
            if (data.success) {
                refetch();
                onSelect(data.data.id);
                setNewProjectName('');
                setShowCreate(false);
                setIsOpen(false);
            }
        } finally {
            setIsCreating(false);
        }
    };

    // Auto-select first project if none selected
    useEffect(() => {
        if (!selectedProjectId && projects.length > 0) {
            onSelect(projects[0].id);
        }
    }, [projects, selectedProjectId, onSelect]);

    // Close on outside click
    useEffect(() => {
        const handler = () => setIsOpen(false);
        if (isOpen) document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, [isOpen]);

    return (
        <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
                Project
            </label>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between gap-2 input-field py-2.5 cursor-pointer transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <FolderOpen className="w-5 h-5 text-gray-400 hover:text-indigo-400 flex-shrink-0 transition-colors duration-150" />
                        <span className="text-sm truncate">{displayName}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-foreground-subtle flex-shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#111827]/95 border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in backdrop-blur">
                        <div className="max-h-48 overflow-y-auto">
                            {projects.map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() => { onSelect(project.id); setIsOpen(false); }}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-white/5 text-sm text-foreground transition-all duration-150"
                                >
                                    <FolderOpen className="w-3.5 h-3.5 text-foreground-subtle" />
                                    <span className="flex-1 text-left truncate">{project.name}</span>
                                    {selectedProjectId === project.id && (
                                        <Check className="w-3.5 h-3.5 text-primary" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="border-t border-border p-2">
                            {!showCreate ? (
                                <button
                                    onClick={() => setShowCreate(true)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-all duration-150"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    New Project
                                </button>
                            ) : (
                                <div className="flex gap-2 p-1">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                        placeholder="Project name..."
                                        className="input-field py-1.5 text-sm flex-1"
                                    />
                                    <button
                                        onClick={handleCreate}
                                        disabled={isCreating || !newProjectName.trim()}
                                        className="btn-primary px-3 py-1.5 text-sm"
                                    >
                                        {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Add'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
