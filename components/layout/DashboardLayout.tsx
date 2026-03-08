'use client';

import { createClient } from '@/lib/supabase/client-ssr';
import {
    ChevronRight,
    FlaskConical,
    FolderOpen,
    History,
    LayoutDashboard,
    LogOut,
    Sparkles,
    UserCircle
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/projects', label: 'Projects', icon: FolderOpen },
    { href: '/generate', label: 'Generate Tests', icon: Sparkles },
    { href: '/history', label: 'History', icon: History },
];

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [userName, setUserName] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const name = user.user_metadata?.full_name || user.email;
                setUserName(name ?? null)
            }
        }
        getUser()
    }, [supabase])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <aside className="w-[260px] flex-shrink-0 bg-background-surface border-r border-border flex flex-col">
                {/* Logo */}
                <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                        <FlaskConical className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-foreground text-sm tracking-tight">TestPilot</span>
                        <span className="font-bold text-primary text-sm tracking-tight"> AI</span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    <p className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider px-3 mb-3">
                        Navigation
                    </p>
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href || pathname.startsWith(href + '/');
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                            >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                <span className="flex-1">{label}</span>
                                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / User Profile */}
                <div className="p-4 border-t border-border">
                    <div className="flex items-center justify-between group p-2 -mx-2 rounded-md hover:bg-background-card transition-colors cursor-pointer" onClick={handleSignOut}>
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border flex-shrink-0">
                                <UserCircle className="w-4 h-4 text-foreground-subtle" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-foreground truncate">
                                    {userName || 'Loading...'}
                                </p>
                                <p className="text-[10px] text-foreground-subtle">
                                    Sign Out
                                </p>
                            </div>
                        </div>
                        <LogOut className="w-4 h-4 text-foreground-muted opacity-0 group-hover:opacity-100 group-hover:text-red-400 transition-all" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
