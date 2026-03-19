import { Generation } from '@/types/generation.types';
import { format, isAfter, startOfDay, subDays } from 'date-fns';

interface GenerationHeatmapProps {
    generations: Generation[];
}

export function GenerationHeatmap({ generations }: GenerationHeatmapProps) {
    // Build a 4-week heatmap (28 days)
    const today = startOfDay(new Date());
    const days: { date: Date; count: number }[] = [];

    for (let i = 27; i >= 0; i--) {
        const dayStart = subDays(today, i);
        const dayEnd = subDays(today, i - 1);
        const count = generations.filter((g) => {
            const d = new Date(g.created_at);
            return isAfter(d, dayStart) && !isAfter(d, dayEnd);
        }).length;
        days.push({ date: dayStart, count });
    }

    const getColor = (count: number) => {
        if (count === 0) return 'bg-background-card/70 border-border-light/70';
        if (count < 3) return 'bg-violet-900/60 border-violet-700/60';
        if (count < 6) return 'bg-violet-700/70 border-violet-500/70';
        if (count < 10) return 'bg-violet-500/85 border-violet-300/85';
        return 'bg-violet-400 border-violet-300 shadow-[0_0_12px_rgba(167,139,250,0.4)]';
    };

    // Group into weeks for the grid layout
    const weeks = [];
    for (let i = 0; i < 4; i++) {
        weeks.push(days.slice(i * 7, (i + 1) * 7));
    }

    return (
        <div className="card-rich h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground">Generation Activity</h3>
                <div className="flex items-center gap-1.5 overflow-hidden">
                    {[0, 2, 5, 8, 12].map((lvl) => (
                        <div key={lvl} className={`w-2 h-2 rounded-[2px] ${getColor(lvl)}`} />
                    ))}
                    <span className="text-[9px] text-foreground-subtle ml-1 uppercase font-bold">Density</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                {/* Month labels */}
                <div className="grid grid-cols-4 gap-3 mb-2 w-fit">
                    {weeks.map((week, i) => {
                        const firstDay = week[0].date;
                        const isMonthStart = i === 0 || firstDay.getDate() <= 7;
                        return (
                            <span key={i} className="text-[9px] text-foreground-subtle font-bold uppercase truncate">
                                {isMonthStart ? format(firstDay, 'MMM') : ''}
                            </span>
                        );
                    })}
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {weeks.map((week, wi) => (
                        <div key={wi} className="grid grid-rows-7 gap-1.5">
                            {week.map((day, di) => {
                                const tooltipText = day.count > 0
                                    ? `${day.count} generations on ${format(day.date, 'MMM d')}`
                                    : `No activity on ${format(day.date, 'MMM d')}`;
                                return (
                                    <div key={di} className="relative group">
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 scale-90 group-hover:scale-100">
                                            <div className="bg-background-card text-foreground text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-2xl border border-border">
                                                {tooltipText}
                                            </div>
                                            <div className="w-2 h-2 bg-background-card border-r border-b border-border rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1" />
                                        </div>

                                        <div
                                            className={`w-6 h-6 rounded-md border transition-all duration-300 cursor-pointer hover:scale-110 ${getColor(day.count)}`}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4 flex justify-between px-2">
                <span className="text-[10px] text-foreground-subtle font-bold uppercase tracking-wider">Older</span>
                <span className="text-[10px] text-foreground-subtle font-bold uppercase tracking-wider">Today</span>
            </div>
        </div>
    );
}
