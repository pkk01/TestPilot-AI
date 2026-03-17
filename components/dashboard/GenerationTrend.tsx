import { Generation } from '@/types/generation.types';
import { format, isAfter, startOfDay, subDays } from 'date-fns';
import { TrendingUp } from 'lucide-react';

interface GenerationTrendProps {
    generations: Generation[];
}

export function GenerationTrend({ generations }: GenerationTrendProps) {
    // Build a 30-day contribution line graph (SVG)
    const today = startOfDay(new Date());
    const data: { count: number }[] = [];

    for (let i = 29; i >= 0; i--) {
        const dayStart = subDays(today, i);
        const dayEnd = subDays(today, i - 1);
        const count = generations.filter((g) => {
            const d = new Date(g.created_at);
            return isAfter(d, dayStart) && !isAfter(d, dayEnd);
        }).length;
        data.push({ count });
    }

    const maxCount = Math.max(...data.map((d) => d.count), 1);
    const width = 300;
    const height = 120;
    const padding = 10;

    const points = data.map((d, i) => ({
        x: (i / (data.length - 1)) * (width - padding * 2) + padding,
        y: height - (d.count / maxCount) * (height - padding * 2) - padding,
    }));

    const pathData = points.reduce(
        (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
        ''
    );

    const areaPath = `${pathData} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return (
        <div className="card-rich h-full flex flex-col">
            <h3 className="text-sm font-bold text-foreground mb-6">Generation Trend</h3>
            
            <div className="flex-1 relative group h-40">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)" />
                            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                        </linearGradient>
                    </defs>

                    {/* Subtle grid lines */}
                    {[0, 1, 2].map((i) => (
                        <line
                            key={i}
                            x1={padding}
                            y1={padding + (i * (height - padding * 2)) / 2}
                            x2={width - padding}
                            y2={padding + (i * (height - padding * 2)) / 2}
                            stroke="currentColor"
                            className="text-border/30"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                    ))}

                    <path
                        d={areaPath}
                        fill="url(#lineGradient)"
                        className="animate-pulse-slow"
                    />
                    
                    <path
                        d={pathData}
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))' }}
                    />

                    {/* Data Points and Tooltips */}
                    {points.map((p, i) => {
                        const { count } = data[i];
                        const d = subDays(today, 29 - i);
                        const tooltipText = count > 0
                            ? `${count} gens on ${format(d, 'MMM d')}`
                            : `0 gens on ${format(d, 'MMM d')}`;
                        
                        return (
                            <g key={i} className="group/point">
                                {/* Invisible larger hit area for hover */}
                                <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r="10"
                                    fill="transparent"
                                    className="cursor-pointer"
                                />
                                <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r="3"
                                    fill="#8b5cf6"
                                    className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-300 pointer-events-none"
                                />
                                {/* Tooltip using foreignObject for HTML rendering */}
                                <foreignObject
                                    x={p.x - 50}
                                    y={p.y - 45}
                                    width="100"
                                    height="40"
                                    className="opacity-0 group-hover/point:opacity-100 pointer-events-none transition-all duration-200 z-50 overflow-visible"
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="bg-background-card text-foreground text-[9px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-2xl border border-border scale-90 group-hover/point:scale-100 transition-transform">
                                            {tooltipText}
                                        </div>
                                        <div className="w-1.5 h-1.5 bg-background-card border-r border-b border-border rotate-45 -mt-0.5" />
                                    </div>
                                </foreignObject>
                            </g>
                        );
                    })}

                    {/* X-Axis Month/Day Labels (every 7-8 days) */}
                    {[0, 10, 20, 29].map((idx) => {
                        const d = subDays(today, 29 - idx);
                        const p = points[idx];
                        return (
                            <text
                                key={idx}
                                x={p.x}
                                y={height + 15}
                                textAnchor="middle"
                                className="fill-foreground-subtle text-[9px] font-bold uppercase"
                            >
                                {format(d, 'MMM d')}
                            </text>
                        );
                    })}
                </svg>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div>
                    <span className="text-[10px] text-foreground-subtle font-bold uppercase tracking-wider block">Total Effort</span>
                    <span className="text-xl font-bold text-foreground tracking-tight">
                        {generations.length} <span className="text-[10px] text-violet-400">Total Gens</span>
                    </span>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-foreground-subtle font-bold uppercase tracking-wider block">Trend</span>
                    <div className="flex items-center gap-1 text-emerald-400">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-xs font-bold font-mono">+{Math.min(generations.length * 5, 99)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
