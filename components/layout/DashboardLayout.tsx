'use client';

import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { createClient } from '@/lib/supabase/client-ssr';
import { cn } from "@/lib/utils";
import {
    Bell,
    Command,
    FlaskConical,
    Folder,
    History,
    LayoutDashboard,
    LogOut,
    Settings,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [userName, setUserName] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
            }
        }
        getUser()
    }, [supabase])

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/projects', label: 'Projects', icon: Folder },
        { href: '/generate', label: 'Generate Tests', icon: Sparkles },
        { href: '/history', label: 'History', icon: History },
    ];

    const initials = (userName || 'U').slice(0, 1).toUpperCase();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground">
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-8 bg-background border-r border-border">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        <Link
                            href="/dashboard"
                            className={cn(
                                "flex items-center h-9 mb-6 transition-all duration-150",
                                open ? "gap-2 px-2" : "justify-center px-0"
                            )}
                        >
                            <div className={cn(
                                "rounded-md border border-primary/40 bg-primary/15 flex items-center justify-center shrink-0",
                                open ? "w-8 h-8" : "w-7 h-7"
                            )}>
                                <FlaskConical className={cn(
                                    "text-primary",
                                    open ? "w-4 h-4" : "w-3.5 h-3.5"
                                )} />
                            </div>
                            {open && (
                                <span className="font-display text-[15px] font-semibold tracking-tight truncate">
                                    <span className="text-foreground">Test</span>
                                    <span className="text-primary">Pilot</span>
                                    <span className="text-foreground"> AI</span>
                                </span>
                            )}
                        </Link>

                        <nav className="space-y-1">
                            {navItems.map((link) => (
                                <Link
                                    key={link.href}
                                    className={cn(
                                        "group relative flex items-center h-9 overflow-hidden transition-colors duration-150 ease-out",
                                        open ? "px-3" : "justify-center px-0",
                                        pathname === link.href ? "text-foreground" : "text-foreground-muted hover:text-foreground"
                                    )}
                                    href={link.href}
                                >
                                    <span
                                        className={cn(
                                            "absolute left-0 top-1 bottom-1 w-[2px] origin-top bg-primary transition-transform duration-150 ease-out",
                                            pathname === link.href ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                                        )}
                                    />
                                    <link.icon className="h-4 w-4 shrink-0" />
                                    {open ? <span className="ml-2 text-[13px] font-medium">{link.label}</span> : null}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-border">
                        <Link
                            href="/profile"
                            className={cn(
                                "group relative flex items-center h-9 text-foreground-muted hover:text-foreground transition-colors duration-150",
                                open ? "px-3" : "justify-center px-0"
                            )}
                        >
                            <div className="w-6 h-6 rounded-full border border-border bg-background-card text-[10px] font-medium flex items-center justify-center">
                                {initials}
                            </div>
                            {open ? <span className="ml-2 text-[13px] truncate">{userName || 'User'}</span> : null}
                        </Link>
                        <Link
                            href="/profile"
                            className={cn(
                                "group relative flex items-center h-9 text-foreground-muted hover:text-foreground transition-colors duration-150",
                                open ? "px-3" : "justify-center px-0"
                            )}
                        >
                            <Settings className="h-4 w-4 shrink-0" />
                            {open ? <span className="ml-2 text-[13px]">Settings</span> : null}
                        </Link>

                        {open ? (
                            <div className="px-3 pt-2 mt-1 border-t border-border/60">
                                <a
                                    href="https://github.com/pkk01"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Developer GitHub profile"
                                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 hover:bg-primary/15 transition-colors duration-150"
                                >
                                    <span className="w-1 h-1 rounded-full bg-primary" />
                                    <p className="text-[10px] text-primary/90 tracking-[0.06em] font-mono">
                                        built by Pratham
                                    </p>
                                </a>
                            </div>
                        ) : null}
                    </div>
                </SidebarBody>
            </Sidebar>

            <main className="flex-1 flex flex-col min-w-0 bg-background-surface overflow-hidden relative">
                <header className="h-14 flex items-center px-6 bg-background/70 backdrop-blur-md border-b border-border z-10 relative">
                    <button
                        type="button"
                        className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background-card/80 px-4 py-1.5 text-[12px] text-foreground-muted hover:text-foreground hover:border-border-light transition-colors duration-150"
                    >
                        <Command className="w-3.5 h-3.5" />
                        <span>Search or jump to...</span>
                        <span className="font-mono text-[10px] text-foreground-subtle">⌘K</span>
                    </button>

                    <div className="ml-auto flex items-center gap-2">
                        <button
                            type="button"
                            className="p-2 rounded-md text-foreground-subtle hover:text-foreground hover:bg-background-card transition-colors duration-150 border border-transparent hover:border-border"
                        >
                            <Bell className="w-4 h-4" />
                        </button>

                        <div className="relative group/profile">
                            <button
                                type="button"
                                className="w-7 h-7 rounded-full border border-border bg-background-card text-[10px] font-medium text-foreground flex items-center justify-center"
                                aria-label="Profile menu"
                            >
                                {initials}
                            </button>

                            <div className="absolute right-0 top-full mt-0 w-36 rounded-md border border-border bg-background-card p-1 opacity-0 pointer-events-none translate-y-1 group-hover/profile:opacity-100 group-hover/profile:pointer-events-auto group-hover/profile:translate-y-0 group-focus-within/profile:opacity-100 group-focus-within/profile:pointer-events-auto group-focus-within/profile:translate-y-0 transition-all duration-150 z-20">
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="w-full inline-flex items-center gap-2 rounded-sm px-2 py-1.5 text-[12px] text-foreground-muted hover:text-foreground hover:bg-white/5 transition-colors duration-150"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}
