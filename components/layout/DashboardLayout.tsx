'use client';

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
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
    Search,
    Settings,
    Sparkles,
    UserCircle
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
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
                setUserEmail(user.email ?? null);
            }
        }
        getUser()
    }, [supabase])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5 shrink-0" /> },
        { href: '/projects', label: 'Projects', icon: <Folder className="h-5 w-5 shrink-0" /> },
        { href: '/generate', label: 'Generate Tests', icon: <Sparkles className="h-5 w-5 shrink-0" /> },
        { href: '/history', label: 'History', icon: <History className="h-5 w-5 shrink-0" /> },
    ];

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground">
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10 bg-background border-r border-border">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        <Link 
                            href="/dashboard"
                            className={cn(
                                "flex items-center h-12 mb-8 transition-all duration-300 hover:opacity-80 group/logo",
                                open ? "gap-3 px-2" : "justify-center px-0"
                            )}
                        >
                            <div className={cn(
                                "rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 transition-all duration-300 group-hover/logo:scale-105",
                                open ? "w-10 h-10" : "w-8 h-8"
                            )}>
                                <FlaskConical className={cn(
                                    "text-white transition-all duration-300",
                                    open ? "w-5 h-5" : "w-4 h-4"
                                )} />
                            </div>
                            {open && (
                                <div className="flex flex-col animate-in fade-in duration-500 overflow-hidden">
                                    <div className="flex items-center gap-0.5 whitespace-nowrap">
                                        <span className="font-extrabold text-foreground text-xl tracking-tighter uppercase italic">Test</span>
                                        <span className="font-extrabold text-primary text-xl tracking-tighter uppercase italic">Pilot</span>
                                    </div>
                                    <span className="text-[10px] font-medium text-primary/80 tracking-[0.2em] uppercase -mt-1 pl-0.5 whitespace-nowrap">AI Engine</span>
                                </div>
                            )}
                        </Link>

                        <div className="space-y-1">
                            {navItems.map((link) => (
                                <SidebarLink
                                    key={link.href}
                                    link={link}
                                    className={cn(
                                        "px-2 rounded-xl transition-colors",
                                        pathname === link.href ? "bg-primary/10 text-primary font-semibold" : "text-foreground-muted hover:bg-background-card-hover hover:text-foreground"
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <SidebarLink
                            link={{
                                label: "Settings",
                                href: "#",
                                icon: <Settings className="h-5 w-5 shrink-0 text-foreground-subtle" />,
                            }}
                            className="px-2 text-foreground-muted hover:text-foreground"
                        />
                        <div onClick={handleSignOut} className="cursor-pointer">
                            <SidebarLink
                                link={{
                                    label: "Logout",
                                    href: "#",
                                    icon: <LogOut className="h-5 w-5 shrink-0 text-foreground-subtle" />,
                                }}
                                className="px-2 text-foreground-muted hover:text-foreground"
                            />
                        </div>

                        {/* Profile Section */}
                        <div className="pt-4 border-t border-border">
                            <SidebarLink
                                link={{
                                    label: userName || "User",
                                    href: "#",
                                    icon: (
                                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                            <UserCircle className="w-5 h-5 text-primary" />
                                        </div>
                                    ),
                                }}
                                className="px-2"
                            />
                        </div>
                    </div>
                </SidebarBody>
            </Sidebar>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-background-surface overflow-hidden relative">
                {/* Header / Top Bar */}
                <header className="h-16 flex items-center justify-between px-8 bg-background/50 backdrop-blur-xl border-b border-border z-10">
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search tasks, projects..."
                                className="w-full bg-background-card border-none rounded-xl py-2 pl-11 pr-14 text-sm focus:ring-2 focus:ring-primary/20 transition-all border border-border"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-background px-1.5 py-0.5 rounded border border-border">
                                <Command className="w-3 h-3 text-foreground-subtle" />
                                <span className="text-[10px] font-bold text-foreground-subtle">K</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-xl bg-background-card hover:bg-background-card-hover text-foreground-subtle hover:text-foreground transition-all relative border border-border">
                                <Bell className="w-4 h-4" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background-card" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 pl-6 border-l border-border">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-foreground leading-none mb-1">{userName}</p>
                                <p className="text-[10px] text-foreground-subtle leading-none">{userEmail}</p>
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
