'use client';

import { CoverageResult } from '@/types/generation.types';
import { AlertTriangle, BarChart3, CheckCircle2, Lightbulb, XCircle } from 'lucide-react';
import { LoaderFive } from '../ui/loader';

interface CoverageAnalysisProps {
    coverageResult: CoverageResult | null;
    isLoading: boolean;
    error?: string | null;
}

function getScoreColor(score: number): string {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
}

function getBarColor(coverage: number): string {
    if (coverage >= 80) return 'bg-gradient-to-r from-indigo-500 to-cyan-400';
    if (coverage >= 60) return 'bg-gradient-to-r from-indigo-500 to-cyan-400';
    if (coverage >= 40) return 'bg-gradient-to-r from-indigo-500 to-cyan-400';
    return 'bg-gradient-to-r from-indigo-500 to-cyan-400';
}

function getBarTrackColor(coverage: number): string {
    if (coverage >= 80) return 'bg-gray-800';
    if (coverage >= 60) return 'bg-gray-800';
    if (coverage >= 40) return 'bg-gray-800';
    return 'bg-gray-800';
}

function getBarGlow(coverage: number): string {
    if (coverage >= 80) return 'shadow-[0_0_12px_rgba(16,185,129,0.3)]';
    if (coverage >= 60) return 'shadow-[0_0_12px_rgba(234,179,8,0.3)]';
    if (coverage >= 40) return 'shadow-[0_0_12px_rgba(249,115,22,0.3)]';
    return 'shadow-[0_0_12px_rgba(239,68,68,0.3)]';
}

function ScoreGauge({ score }: { score: number }) {
    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const colorClass = getScoreColor(score);

    return (
        <div className="relative w-36 h-36 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                {/* Background track */}
                <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="currentColor"
                    className="text-white/5"
                    strokeWidth="8"
                />
                {/* Score arc */}
                <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className={colorClass}
                    stroke="currentColor"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                        transition: 'stroke-dashoffset 1.2s ease-out',
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${colorClass}`}>
                    {score}%
                </span>
                <span className="text-[10px] text-foreground-subtle uppercase tracking-wider mt-0.5">
                    Coverage
                </span>
            </div>
        </div>
    );
}

function HeatmapBar({ scenario, coverage }: { scenario: string; coverage: number }) {
    return (
        <div className="group">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-foreground-muted truncate max-w-[70%]" title={scenario}>
                    {scenario}
                </span>
                <span className={`text-xs font-mono font-semibold ${getScoreColor(coverage)}`}>
                    {coverage}%
                </span>
            </div>
            <div className={`w-full h-2 rounded-full ${getBarTrackColor(coverage)} overflow-hidden`}>
                <div
                    className={`h-full rounded-full ${getBarColor(coverage)} ${getBarGlow(coverage)} transition-all duration-500 ease-out`}
                    style={{ width: `${coverage}%` }}
                />
            </div>
        </div>
    );
}

export default function CoverageAnalysis({ coverageResult, isLoading, error }: CoverageAnalysisProps) {
    // Loading state
    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 animate-fade-in shadow-[inset_0_0_100px_rgba(var(--primary-rgb),0.02)]">
                <LoaderFive text="Analyzing requirement coverage..." />
                <div className="text-center mt-4">
                    <p className="text-xs text-foreground-subtle">
                        AI is evaluating test coverage gaps
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
                <div className="w-14 h-14 rounded-xl bg-red-900/20 border border-red-900/40 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-foreground mb-1">
                        Coverage analysis unavailable
                    </p>
                    <p className="text-xs text-foreground-subtle max-w-[280px]">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    // Empty state
    if (!coverageResult) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
                <div className="w-14 h-14 rounded-xl bg-background-card border border-border flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-foreground-subtle" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-foreground mb-1">
                        No coverage data yet
                    </p>
                    <p className="text-xs text-foreground-subtle max-w-[280px]">
                        Generate test cases first to see the AI-powered coverage analysis and heatmap.
                    </p>
                </div>
            </div>
        );
    }

    const { coverage_score, covered, missing, recommendations, heatmap } = coverageResult;

    return (
        <div className="flex-1 overflow-auto animate-fade-in">
            <div className="p-6 space-y-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <h2 className="text-lg font-medium text-foreground">Test Coverage Analysis</h2>
                </div>

                {/* Score + Heatmap Row */}
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
                    {/* Score Gauge Card */}
                    <div className="card flex flex-col items-center justify-center py-5">
                        <ScoreGauge score={coverage_score} />
                        <p className="text-[10px] text-foreground-subtle mt-3 text-center uppercase tracking-wider">
                            Overall Score
                        </p>
                    </div>

                    {/* Heatmap Card */}
                    <div className="card">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-4 rounded-full bg-primary" />
                            <h3 className="text-sm font-medium text-foreground">
                                Coverage Heatmap
                            </h3>
                        </div>
                        {heatmap.length > 0 ? (
                            <div className="space-y-3.5">
                                {heatmap.map((item, i) => (
                                    <HeatmapBar
                                        key={i}
                                        scenario={item.scenario}
                                        coverage={item.coverage}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-foreground-subtle">No heatmap data available.</p>
                        )}
                    </div>
                </div>

                {/* Covered + Missing Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Covered Scenarios */}
                    <div className="card">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1 h-4 rounded-full bg-emerald-500" />
                            <h3 className="text-sm font-medium text-foreground">
                                Covered Scenarios
                            </h3>
                            <span className="ml-auto text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                {covered.length}
                            </span>
                        </div>
                        {covered.length > 0 ? (
                            <ul className="space-y-2">
                                {covered.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-xs text-foreground-muted">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-foreground-subtle">No covered scenarios found.</p>
                        )}
                    </div>

                    {/* Missing Scenarios */}
                    <div className="card">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1 h-4 rounded-full bg-red-500" />
                            <h3 className="text-sm font-medium text-foreground">
                                Missing Scenarios
                            </h3>
                            <span className="ml-auto text-[10px] font-mono text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                                {missing.length}
                            </span>
                        </div>
                        {missing.length > 0 ? (
                            <ul className="space-y-2">
                                {missing.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-xs text-foreground-muted">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-foreground-subtle">No missing scenarios — great coverage!</p>
                        )}
                    </div>
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <div className="card">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1 h-4 rounded-full bg-yellow-500" />
                            <h3 className="text-sm font-medium text-foreground">
                                Recommendations
                            </h3>
                        </div>
                        <ul className="space-y-2">
                            {recommendations.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 cursor-pointer hover:text-indigo-400 transition-all duration-150">
                                    <Lightbulb className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-xs text-foreground-muted">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
