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
    Building2,
    Calendar,
    Clock3,
    FlaskConical,
    FolderOpen,
    GitBranch,
    Github,
    Globe,
    Instagram,
    Linkedin,
    Link as LinkIcon,
    Mail,
    MapPin,
    Save,
    Shield,
    Sparkles,
    Twitter,
    User,
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

type UserProfile = {
    name: string;
    email: string;
    createdAt: string;
    bio: string;
    pronouns: string;
    company: string;
    location: string;
    website: string;
    displayProBadge: boolean;
    displayLocalTime: boolean;
    socialLink1: string;
    socialLink2: string;
    socialLink3: string;
    socialLink4: string;
};

const pronounOptions = ['Don’t specify', 'he/him', 'she/her', 'they/them', 'any pronouns'];

const getBaseForm = (email: string): UserProfile => ({
    name: email?.split('@')[0] || 'User',
    email,
    createdAt: new Date().toISOString(),
    bio: '',
    pronouns: 'Don’t specify',
    company: '',
    location: '',
    website: '',
    displayProBadge: true,
    displayLocalTime: false,
    socialLink1: '',
    socialLink2: '',
    socialLink3: '',
    socialLink4: '',
});

const normalizeUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed}`;
};

const getSocialMeta = (url: string) => {
    const lowered = url.toLowerCase();

    if (lowered.includes('linkedin.com')) {
        return { icon: Linkedin, name: 'LinkedIn', placeholder: 'LinkedIn profile URL' };
    }
    if (lowered.includes('instagram.com')) {
        return { icon: Instagram, name: 'Instagram', placeholder: 'Instagram profile URL' };
    }
    if (lowered.includes('github.com')) {
        return { icon: Github, name: 'GitHub', placeholder: 'GitHub profile URL' };
    }
    if (lowered.includes('twitter.com') || lowered.includes('x.com')) {
        return { icon: Twitter, name: 'X / Twitter', placeholder: 'X/Twitter profile URL' };
    }

    return { icon: LinkIcon, name: 'Social', placeholder: 'Social profile URL' };
};

const getReadableUrl = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

const getSocialUsername = (url: string) => {
    try {
        const parsed = new URL(normalizeUrl(url));
        const segments = parsed.pathname.split('/').filter(Boolean);
        const lastSegment = segments[segments.length - 1];

        if (lastSegment) {
            return decodeURIComponent(lastSegment).replace(/^@/, '');
        }
    } catch {
        return getReadableUrl(url);
    }

    return getReadableUrl(url);
};

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [draft, setDraft] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [timeLabel, setTimeLabel] = useState('');
    const supabase = createClient();

    const { data: allHistory = [] } = useQuery({ queryKey: ['history-all-profile'], queryFn: fetchAllHistory });
    const { data: projects = [] } = useQuery({ queryKey: ['projects-profile'], queryFn: fetchProjects });

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const base = getBaseForm(user.email || '');
                const nextProfile: UserProfile = {
                    ...base,
                    name: user.user_metadata?.full_name || base.name,
                    createdAt: user.created_at || new Date().toISOString(),
                    bio: user.user_metadata?.bio || '',
                    pronouns: user.user_metadata?.pronouns || 'Don’t specify',
                    company: user.user_metadata?.company || '',
                    location: user.user_metadata?.location || '',
                    website: user.user_metadata?.website || '',
                    displayProBadge: user.user_metadata?.display_pro_badge ?? true,
                    displayLocalTime: user.user_metadata?.display_local_time ?? false,
                    socialLink1: user.user_metadata?.social_link_1 || '',
                    socialLink2: user.user_metadata?.social_link_2 || '',
                    socialLink3: user.user_metadata?.social_link_3 || '',
                    socialLink4: user.user_metadata?.social_link_4 || '',
                };

                setProfile(nextProfile);
                setDraft(nextProfile);
            }
        };
        getUser();
    }, [supabase]);

    useEffect(() => {
        if (!profile?.displayLocalTime) {
            setTimeLabel('');
            return;
        }

        const updateTime = () => {
            setTimeLabel(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [profile?.displayLocalTime]);

    const updateDraft = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
        setDraft(prev => (prev ? { ...prev, [key]: value } : prev));
    };

    const handleCancelEdit = () => {
        setDraft(profile);
        setIsEditing(false);
        setSaveMessage(null);
    };

    const handleSaveProfile = async () => {
        if (!draft) return;

        setIsSaving(true);
        setSaveMessage(null);

        const sanitized: UserProfile = {
            ...draft,
            name: draft.name.trim() || draft.email.split('@')[0] || 'User',
            website: normalizeUrl(draft.website),
            socialLink1: normalizeUrl(draft.socialLink1),
            socialLink2: normalizeUrl(draft.socialLink2),
            socialLink3: normalizeUrl(draft.socialLink3),
            socialLink4: normalizeUrl(draft.socialLink4),
        };

        const { data: authData } = await supabase.auth.getUser();
        const userId = authData.user?.id;

        if (!userId) {
            setIsSaving(false);
            setSaveMessage('Unable to save profile right now. Please sign in again.');
            return;
        }

        const { error: authError } = await supabase.auth.updateUser({
            data: {
                full_name: sanitized.name,
                bio: sanitized.bio,
                pronouns: sanitized.pronouns,
                company: sanitized.company,
                location: sanitized.location,
                website: sanitized.website,
                display_pro_badge: sanitized.displayProBadge,
                display_local_time: sanitized.displayLocalTime,
                social_link_1: sanitized.socialLink1,
                social_link_2: sanitized.socialLink2,
                social_link_3: sanitized.socialLink3,
                social_link_4: sanitized.socialLink4,
            },
        });

        if (authError) {
            setIsSaving(false);
            setSaveMessage(authError.message || 'Failed to save profile.');
            return;
        }

        await supabase
            .from('users')
            .update({ name: sanitized.name })
            .eq('id', userId);

        setProfile(sanitized);
        setDraft(sanitized);
        setIsSaving(false);
        setIsEditing(false);
        setSaveMessage('Profile updated successfully.');
    };

    const stats = [
        { label: 'Total Projects', value: projects.length, icon: FolderOpen, color: 'text-emerald-400' },
        { label: 'Total Generations', value: allHistory.length, icon: Sparkles, color: 'text-primary' },
        { label: 'Test Cases', value: allHistory.filter(g => g.generation_type === 'test_cases').length, icon: FlaskConical, color: 'text-violet-400' },
        { label: 'Feature Files', value: allHistory.filter(g => g.generation_type === 'gherkin').length, icon: GitBranch, color: 'text-orange-400' },
    ];

    const socialLinks = profile
        ? [profile.socialLink1, profile.socialLink2, profile.socialLink3, profile.socialLink4]
            .filter(link => link.trim().length > 0)
            .map(link => normalizeUrl(link))
        : [];

    return (
        <DashboardLayout>
            <div className="p-4 md:p-10 max-w-[1400px] mx-auto space-y-6 md:space-y-8 animate-fade-slide-in">
                {/* Profile Header Card */}
                <div className="card-rich p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <UserCircle className="w-48 h-48 text-primary" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start relative z-10">
                        <div className="w-20 h-20 md:w-32 md:h-32 rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0 shadow-2xl shadow-primary/10">
                            <UserCircle className="w-12 h-12 md:w-20 md:h-20 text-primary" />
                        </div>
                        
                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-2xl md:text-4xl font-black text-foreground tracking-tight mb-1">
                                    {profile?.name || 'Loading...'}
                                </h1>
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-primary font-bold tracking-[0.2em] uppercase text-xs">TestPilot AI Architect</p>
                                    {profile?.displayProBadge && (
                                        <span className="badge text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/30">
                                            Pro
                                        </span>
                                    )}
                                </div>
                                {profile?.bio && (
                                    <p className="text-sm text-foreground-subtle mt-3 max-w-2xl leading-relaxed">{profile.bio}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-foreground-subtle text-sm">
                                    <Mail className="w-4 h-4 text-primary/60" />
                                    {profile?.email}
                                </div>
                                <div className="flex items-center gap-2 text-foreground-subtle text-sm">
                                    <Calendar className="w-4 h-4 text-primary/60" />
                                    Joined {profile ? format(new Date(profile.createdAt), 'MMMM yyyy') : '...'}
                                </div>
                                <div className="flex items-center gap-2 text-foreground-subtle text-sm">
                                    <MapPin className="w-4 h-4 text-primary/60" />
                                    {profile?.location || 'Remote'}
                                </div>
                                <div className="flex items-center gap-2 text-foreground-subtle text-sm">
                                    <Shield className="w-4 h-4 text-primary/60" />
                                    Verified Account
                                </div>
                                {profile?.company && (
                                    <div className="flex items-center gap-2 text-foreground-subtle text-sm">
                                        <Building2 className="w-4 h-4 text-primary/60" />
                                        {profile.company}
                                    </div>
                                )}
                                {profile?.website && (
                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-foreground-subtle text-sm hover:text-primary transition-colors"
                                    >
                                        <Globe className="w-4 h-4 text-primary/60" />
                                        {profile.website.replace(/^https?:\/\//, '')}
                                    </a>
                                )}
                                {profile?.displayLocalTime && timeLabel && (
                                    <div className="flex items-center gap-2 text-foreground-subtle text-sm">
                                        <Clock3 className="w-4 h-4 text-primary/60" />
                                        Local time: {timeLabel}
                                    </div>
                                )}
                            </div>

                            {socialLinks.length > 0 && (
                                <div className="pt-1">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-foreground-muted font-bold mb-2">Social Accounts</p>
                                    <div className="flex flex-wrap gap-2">
                                        {socialLinks.map((link, index) => {
                                            const meta = getSocialMeta(link);
                                            const Icon = meta.icon;
                                            return (
                                                <a
                                                    key={`${link}-${index}`}
                                                    href={link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background-surface/60 px-3 py-1.5 text-xs text-foreground-muted hover:text-foreground hover:border-primary/40 transition-all"
                                                    title={`${meta.name}: ${getReadableUrl(link)}`}
                                                >
                                                    <Icon className="w-3.5 h-3.5 text-primary" />
                                                    <span className="max-w-[190px] truncate">{getSocialUsername(link)}</span>
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    className="btn-primary py-2 px-6 rounded-xl text-xs font-bold uppercase tracking-wider"
                                    onClick={() => {
                                        setDraft(profile);
                                        setSaveMessage(null);
                                        setIsEditing(true);
                                    }}
                                >
                                    Edit Profile
                                </button>
                                <button className="btn-secondary py-2 px-6 rounded-xl text-xs font-bold uppercase tracking-wider bg-background-card">
                                    Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {isEditing && draft && (
                    <div className="card-rich p-4 md:p-8 space-y-6 animate-fade-slide-in">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-black text-foreground tracking-tight">Edit Profile</h2>
                                <p className="text-sm text-foreground-subtle mt-1">Customize your public profile details in TestPilot AI.</p>
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Profile Settings</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div>
                                <label className="text-xs uppercase tracking-wider text-foreground-subtle font-bold mb-2 block">Name</label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-foreground-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        className="input-field pl-10"
                                        value={draft.name}
                                        onChange={(e) => updateDraft('name', e.target.value)}
                                        placeholder="Your display name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wider text-foreground-subtle font-bold mb-2 block">Pronouns</label>
                                <select
                                    className="input-field"
                                    value={draft.pronouns}
                                    onChange={(e) => updateDraft('pronouns', e.target.value)}
                                >
                                    {pronounOptions.map((option) => (
                                        <option key={option} value={option} className="bg-background-card">
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="lg:col-span-2">
                                <label className="text-xs uppercase tracking-wider text-foreground-subtle font-bold mb-2 block">Bio</label>
                                <textarea
                                    className="input-field min-h-[110px] resize-y"
                                    value={draft.bio}
                                    onChange={(e) => updateDraft('bio', e.target.value)}
                                    maxLength={260}
                                    placeholder="Share what you build, test, or automate..."
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wider text-foreground-subtle font-bold mb-2 block">Company</label>
                                <div className="relative">
                                    <Building2 className="w-4 h-4 text-foreground-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        className="input-field pl-10"
                                        value={draft.company}
                                        onChange={(e) => updateDraft('company', e.target.value)}
                                        placeholder="Company"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wider text-foreground-subtle font-bold mb-2 block">Location</label>
                                <div className="relative">
                                    <MapPin className="w-4 h-4 text-foreground-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        className="input-field pl-10"
                                        value={draft.location}
                                        onChange={(e) => updateDraft('location', e.target.value)}
                                        placeholder="City, Country"
                                    />
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <label className="text-xs uppercase tracking-wider text-foreground-subtle font-bold mb-2 block">Website</label>
                                <div className="relative">
                                    <Globe className="w-4 h-4 text-foreground-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        className="input-field pl-10"
                                        value={draft.website}
                                        onChange={(e) => updateDraft('website', e.target.value)}
                                        placeholder="https://your-site.com"
                                    />
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-3 rounded-xl border border-border bg-background-surface/30 p-4">
                                <p className="text-xs uppercase tracking-wider text-foreground-subtle font-bold">Social Accounts</p>
                                {[draft.socialLink1, draft.socialLink2, draft.socialLink3, draft.socialLink4].map((value, index) => (
                                    <div key={index} className="relative">
                                        {(() => {
                                            const meta = getSocialMeta(value);
                                            const Icon = meta.icon;

                                            return (
                                                <Icon className="w-4 h-4 text-foreground-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                                            );
                                        })()}
                                        <input
                                            className="input-field pl-10"
                                            value={value}
                                            onChange={(e) => updateDraft((`socialLink${index + 1}` as keyof UserProfile), e.target.value as UserProfile[keyof UserProfile])}
                                            placeholder={(() => {
                                                const meta = getSocialMeta(value);
                                                return index < 2 ? meta.placeholder : `Optional ${meta.placeholder.toLowerCase()}`;
                                            })()}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <label className="flex items-center gap-3 rounded-xl border border-border bg-background-surface/30 p-4 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={draft.displayProBadge}
                                        onChange={(e) => updateDraft('displayProBadge', e.target.checked)}
                                        className="accent-primary"
                                    />
                                    <span className="text-sm text-foreground">Display PRO badge</span>
                                </label>
                                <label className="flex items-center gap-3 rounded-xl border border-border bg-background-surface/30 p-4 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={draft.displayLocalTime}
                                        onChange={(e) => updateDraft('displayLocalTime', e.target.checked)}
                                        className="accent-primary"
                                    />
                                    <span className="text-sm text-foreground">Display current local time</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="btn-primary py-2 px-6 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : 'Save Profile'}
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                                className="btn-secondary py-2 px-6 rounded-xl text-xs font-bold uppercase tracking-wider bg-background-card"
                            >
                                Cancel
                            </button>
                            {saveMessage && (
                                <p className="text-xs text-foreground-subtle font-medium">{saveMessage}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </div>

                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    {/* Activity Heatmap */}
                    <div className="col-span-12 lg:col-span-8 h-[300px] md:h-[400px] overflow-x-auto">
                        <GenerationHeatmap generations={allHistory} />
                    </div>

                    {/* Trend Graph */}
                    <div className="col-span-12 lg:col-span-4 h-[300px] md:h-[400px]">
                        <GenerationTrend generations={allHistory} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
