import { ArrowUpRight, TrendingUp, LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    trend?: string;
    icon: LucideIcon;
    color: string;
}

export function StatCard({ label, value, trend, icon: Icon, color }: StatCardProps) {
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
