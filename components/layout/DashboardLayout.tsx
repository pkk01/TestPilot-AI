'use client';

import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { createClient } from '@/lib/supabase/client-ssr';
import { cn } from "@/lib/utils";
import {
    Bell,
    ChevronDown,
    Command,
    FlaskConical,
    Folder,
    History,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    Sparkles,
    UserCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CommandPalette } from './CommandPalette';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

type NavItem = {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    items: NavItem[];
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [userName, setUserName] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [isMac, setIsMac] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        Generation: true,
        Account: true,
    });
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    useEffect(() => {
        setIsMac(typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0);
        
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
            }
        };

        getUser();
    }, [supabase]);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    const topNavItems: NavItem[] = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/projects', label: 'Projects', icon: Folder },
    ];

    const groupedNavItems: NavGroup[] = [
        {
            label: 'Generation',
            icon: Sparkles,
            items: [
                { href: '/generate', label: 'Generate Tests', icon: Sparkles },
                { href: '/history', label: 'History', icon: History },
            ],
        },
        {
            label: 'Account',
            icon: UserCircle,
            items: [
                { href: '/profile', label: 'Profile', icon: UserCircle },
                { href: '/profile', label: 'Settings', icon: Settings },
            ],
        },
    ];

    const collapsedNavItems: NavItem[] = [
        ...topNavItems,
        ...groupedNavItems.flatMap((group) => group.items),
    ];

    const initials = (userName || 'U').slice(0, 1).toUpperCase();

    const toggleGroup = (groupLabel: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupLabel]: !prev[groupLabel],
        }));
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground">
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-8 bg-background-surface border-none shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-20">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        <Link
                            href="/dashboard"
                            className={cn(
                                "flex items-center h-10 mb-6 transition-all duration-150",
                                open ? "gap-2 px-3" : "justify-center px-0"
                            )}
                        >
                            <div className={cn(
                                "rounded-xl border border-border-light bg-background-card flex items-center justify-center shrink-0",
                                open ? "w-8 h-8" : "w-7 h-7"
                            )}>
                                <FlaskConical className={cn(
                                    "text-primary",
                                    open ? "w-4 h-4" : "w-3.5 h-3.5"
                                )} />
                            </div>

                            {open && (
                                <span className="font-display text-[18px] font-semibold tracking-tight truncate">
                                    <span className="text-foreground">Test</span>
                                    <span className="text-primary">Pilot</span>
                                    <span className="text-foreground"> AI</span>
                                </span>
                            )}
                        </Link>

                        <nav className="space-y-1">
                            {open ? (
                                <>
                                    {topNavItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                "group relative flex items-center h-10 rounded-lg overflow-hidden transition-colors duration-150 ease-out px-3 gap-2",
                                                pathname === item.href ? "text-primary bg-background-card" : "text-foreground-muted hover:text-foreground"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "absolute left-0 top-1 bottom-1 w-[2px] origin-top bg-primary transition-transform duration-150 ease-out",
                                                    pathname === item.href ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                                                )}
                                            />
                                            <item.icon className="h-4 w-4 shrink-0" />
                                            <span className="text-[13px] font-medium leading-none">{item.label}</span>
                                        </Link>
                                    ))}

                                    <div className="h-2" />

                                    {groupedNavItems.map((group) => (
                                        <div key={group.label} className="space-y-1">
                                            <button
                                                type="button"
                                                onClick={() => toggleGroup(group.label)}
                                                className="w-full flex items-center h-10 text-foreground-muted hover:text-foreground rounded-lg transition-colors duration-150 px-3 justify-between"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <group.icon className="h-4 w-4 shrink-0" />
                                                    <span className="text-[13px] font-semibold leading-none">{group.label}</span>
                                                </div>
                                                <ChevronDown
                                                    className={cn(
                                                        "h-4 w-4 transition-transform duration-150",
                                                        expandedGroups[group.label] ? "rotate-0" : "-rotate-90"
                                                    )}
                                                />
                                            </button>

                                            {expandedGroups[group.label] && group.items.map((item) => (
                                                <Link
                                                    key={`${group.label}-${item.label}`}
                                                    href={item.href}
                                                    onClick={() => setOpen(false)}
                                                    className="group relative flex items-center h-10 rounded-lg text-foreground-muted hover:text-primary hover:bg-background-card/50 transition-colors duration-150 ml-6 px-3 gap-2"
                                                >
                                                    <item.icon className="h-4 w-4 shrink-0" />
                                                    <span className="text-[13px] font-medium leading-none">{item.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    ))}
                                </>
                            ) : (
                                collapsedNavItems.map((item) => (
                                    <Link
                                        key={`collapsed-${item.href}-${item.label}`}
                                        href={item.href}
                                        className={cn(
                                            "group relative flex items-center justify-center h-10 rounded-lg transition-colors duration-150",
                                            pathname === item.href ? "text-primary bg-background-card" : "text-foreground-muted hover:text-foreground hover:bg-background-card/50"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4 shrink-0" />
                                    </Link>
                                ))
                            )}
                        </nav>
                    </div>

                    {open ? (
                        <div className="px-3 pt-1 mt-1">
                            <a
                                href="https://github.com/pkk01"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Developer GitHub profile"
                                className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 hover:bg-primary/15 transition-colors duration-150"
                            >
                                <span className="w-1 h-1 rounded-full bg-primary" />
                                <p className="text-[10px] text-primary/90 tracking-[0.06em] font-mono">
                                    Buid by Pratham Kumar
                                </p>
                            </a>
                        </div>
                    ) : null}
                </SidebarBody>
            </Sidebar>

            <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative">
                <header className="h-14 flex items-center px-4 md:px-6 bg-background/50 backdrop-blur-xl border-none z-10 relative">
                    {/* Mobile hamburger */}
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="md:hidden p-2 -ml-1 mr-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-card transition-colors"
                        aria-label="Open navigation"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => window.dispatchEvent(new CustomEvent('toggle-command-palette'))}
                        className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2 rounded-full border border-primary/20 bg-background-bright/40 pl-4 pr-1.5 py-1.5 text-[13px] font-display text-foreground-muted hover:text-primary hover:border-primary/40 hover:bg-background-bright/60 transition-all duration-300 shadow-[0_0_30px_rgba(192,193,255,0.05)] backdrop-blur-2xl"
                    >
                        <Command className="w-3.5 h-3.5 mr-1" />
                        <span>Search or jump to...</span>
                        <kbd className="ml-2 inline-flex h-6 items-center gap-1 rounded border border-white/5 bg-white/5 px-2 font-mono text-[10px] font-medium text-foreground-muted opacity-100 uppercase">
                            <span className="text-xs">{isMac ? '⌘' : 'Ctrl'}</span>K
                        </kbd>
                    </button>

                    <div className="ml-auto flex items-center gap-3">
                        <button
                            type="button"
                            className="p-2 rounded-md text-foreground-subtle hover:text-foreground hover:bg-background-card transition-colors duration-150 border border-transparent hover:border-border"
                        >
                            <Bell className="w-4 h-4" />
                        </button>

                        <div className="relative" ref={profileRef}>
                            <button
                                type="button"
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 rounded-lg px-3 py-1.5 border border-border/50 bg-background-card/50 hover:bg-background-card hover:border-border transition-all duration-150"
                                aria-label="Profile menu"
                            >
                                <div className="w-6 h-6 rounded-full border border-border bg-background text-[10px] font-medium text-foreground flex items-center justify-center">
                                    {initials}
                                </div>
                                <span className="text-[13px] font-medium text-foreground hidden sm:inline">{userName || 'User'}</span>
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-full mt-1 w-36 rounded-md border border-border bg-background-card p-1 z-20 shadow-lg">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfileOpen(false);
                                            handleSignOut();
                                        }}
                                        className="w-full inline-flex items-center gap-2 rounded-sm px-2 py-2 text-[12px] text-foreground-muted hover:text-foreground hover:bg-white/5 transition-colors duration-150"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {children}
                </div>
            </main>
            
            <CommandPalette />
        </div>
    );
}