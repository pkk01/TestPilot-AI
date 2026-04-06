'use client';

import { TestCase, CoverageResult } from '@/types/generation.types';
import { Check, Copy, Download, FileText, Package, Sparkles, RefreshCw, ChevronUp } from 'lucide-react';
import { LoaderFive } from '../ui/loader';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useRef, useState } from 'react';
import { TabId } from './GenerationTabs';
import CoverageAnalysis from './CoverageAnalysis';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface AIOutputViewerProps {
    activeTab: TabId;
    testCases: TestCase[] | null;
    gherkin: string | null;
    stepDefs: string | null;
    isLoading: boolean;
    coverageResult?: CoverageResult | null;
    isCoverageLoading?: boolean;
    coverageError?: string | null;
}

const EDITOR_THEME = 'vs-dark';
const EDITOR_OPTIONS = {
    readOnly: true,
    minimap: { enabled: false },
    fontSize: 13,
    lineNumbers: 'on' as const,
    scrollBeyondLastLine: false,
    wordWrap: 'on' as const,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
    padding: { top: 16, bottom: 16 },
    renderLineHighlight: 'none' as const,
    overviewRulerBorder: false,
    scrollbar: {
        vertical: 'auto' as const,
        horizontal: 'auto' as const,
    },
};

function SkeletonShimmer() {
    return (
        <div className="space-y-2">
            <div className="skeleton-line w-full" />
            <div className="skeleton-line w-[85%]" />
            <div className="skeleton-line w-[60%]" />
        </div>
    );
}

function TestCaseCard({ tc, index }: { tc: TestCase; index: number }) {
    const [explanation, setExplanation] = useState<string | null>(null);
    const [isExplaining, setIsExplaining] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const priorityClass =
        tc.priority === 'High' ? 'badge-high' : tc.priority === 'Low' ? 'badge-low' : 'badge-medium';

    const handleExplain = async () => {
        // If already have explanation, just toggle expand
        if (explanation) {
            setIsExpanded(prev => !prev);
            return;
        }

        // Fetch explanation
        setIsExplaining(true);
        setIsExpanded(true);
        setError(null);

        try {
            const res = await fetch('/api/explain-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    testCase: tc.title,
                    steps: tc.steps,
                    expected: tc.expected_result,
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to explain test case');
            }

            const data = await res.json();
            setExplanation(data.explanation);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsExplaining(false);
        }
    };

    return (
        <div className="card mb-3 animate-slide-up">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono text-foreground-subtle bg-background-surface px-2 py-0.5 rounded flex-shrink-0">
                        {tc.id || `TC${String(index + 1).padStart(3, '0')}`}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground truncate">{tc.title}</h3>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
                    <button
                        onClick={handleExplain}
                        disabled={isExplaining}
                        className="btn-ghost text-[11px] flex items-center gap-1 py-1 px-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isExplaining ? (
                            <>
                                <Sparkles className="w-3 h-3 animate-pulse" />
                                <span>Explaining…</span>
                            </>
                        ) : isExpanded && explanation ? (
                            <>
                                <ChevronUp className="w-3 h-3" />
                                <span>Collapse</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-3 h-3" />
                                <span>Explain</span>
                            </>
                        )}
                    </button>
                    <button
                        className="btn-ghost text-[11px] flex items-center gap-1 py-1 px-2 rounded-md opacity-60 cursor-default"
                        title="Coming soon"
                    >
                        <RefreshCw className="w-3 h-3" />
                        <span>Improve</span>
                    </button>
                    <span className={`badge ${priorityClass}`}>{tc.priority}</span>
                </div>
            </div>

            {tc.preconditions && (
                <div className="mb-2.5">
                    <p className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider mb-1">
                        Preconditions
                    </p>
                    <p className="text-xs text-foreground-muted">{tc.preconditions}</p>
                </div>
            )}

            <div className="mb-2.5">
                <p className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider mb-1.5">
                    Steps
                </p>
                <ol className="space-y-1">
                    {tc.steps.map((step, i) => (
                        <li key={i} className="flex gap-2 text-xs text-foreground-muted">
                            <span className="text-foreground-subtle font-mono flex-shrink-0">{i + 1}.</span>
                            <span>{step}</span>
                        </li>
                    ))}
                </ol>
            </div>

            <div>
                <p className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider mb-1">
                    Expected Result
                </p>
                <p className="text-xs text-foreground-muted">{tc.expected_result}</p>
            </div>

            {/* Expandable Explanation Panel */}
            <div
                ref={panelRef}
                className="explanation-panel-wrapper"
                style={{
                    maxHeight: isExpanded ? '300px' : '0px',
                    opacity: isExpanded ? 1 : 0,
                }}
            >
                <div className="explanation-panel">
                    <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-sm leading-none">💡</span>
                        <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
                            Why this test matters
                        </span>
                    </div>

                    {isExplaining ? (
                        <SkeletonShimmer />
                    ) : error ? (
                        <p className="text-xs text-red-400">{error}</p>
                    ) : explanation ? (
                        <p className="text-xs text-foreground-muted leading-[1.6]">
                            {explanation}
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default function AIOutputViewer({
    activeTab,
    testCases,
    gherkin,
    stepDefs,
    isLoading,
    coverageResult,
    isCoverageLoading,
    coverageError,
}: AIOutputViewerProps) {
    const [copied, setCopied] = useState(false);
    const [exporting, setExporting] = useState<'selenium' | 'playwright' | null>(null);
    const [exportError, setExportError] = useState<string | null>(null);

    const canExport = !!(gherkin || stepDefs || (testCases && testCases.length > 0));

    const handleExport = async (framework: 'selenium' | 'playwright') => {
        setExporting(framework);
        setExportError(null);
        try {
            const res = await fetch('/api/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ framework, gherkin, stepDefs, testCases }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Export failed');
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = framework === 'selenium' ? 'automation-selenium.zip' : 'automation-playwright.zip';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err: any) {
            setExportError(err.message || 'Export failed. Please try again.');
        } finally {
            setExporting(null);
        }
    };

    const getContent = useCallback((): string => {
        switch (activeTab) {
            case 'test_cases':
                return testCases ? JSON.stringify({ testCases }, null, 2) : '';
            case 'gherkin':
                return gherkin || '';
            case 'step_defs':
                return stepDefs || '';
            case 'coverage':
                return '';
        }
    }, [activeTab, testCases, gherkin, stepDefs]);

    const getLanguage = () => {
        switch (activeTab) {
            case 'test_cases': return 'json';
            case 'gherkin': return 'gherkin';
            case 'step_defs': return 'java';
            case 'coverage': return 'json';
        }
    };

    const getFileExtension = () => {
        switch (activeTab) {
            case 'test_cases': return 'json';
            case 'gherkin': return 'feature';
            case 'step_defs': return 'java';
            case 'coverage': return 'json';
        }
    };

    const getFileName = () => {
        switch (activeTab) {
            case 'test_cases': return 'test_cases.json';
            case 'gherkin': return 'tests.feature';
            case 'step_defs': return 'StepDefinitions.java';
            case 'coverage': return 'coverage_analysis.json';
        }
    };

    const hasContent = activeTab === 'test_cases' ? !!testCases?.length
        : activeTab === 'gherkin' ? !!gherkin
            : activeTab === 'step_defs' ? !!stepDefs
                : !!coverageResult;

    const handleCopy = async () => {
        const content = getContent();
        if (!content) return;
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const content = getContent();
        if (!content) return;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = getFileName();
        a.click();
        URL.revokeObjectURL(url);
    };

    // Loading state phrases (must be above all early returns — React hooks rule)
    const loadingSubtitle = useMemo(() => {
        const phrases = [
            'Crafting precision test scenarios for you…',
            'Turning your vision into testable specs…',
            'Almost there — quality takes a moment…',
            'Weaving through edge cases and scenarios…',
            'Engineering bulletproof test coverage…',
        ];
        return phrases[Math.floor(Math.random() * phrases.length)];
    }, []);

    // Coverage tab — delegate entirely to CoverageAnalysis component
    if (activeTab === 'coverage') {
        return (
            <CoverageAnalysis
                coverageResult={coverageResult || null}
                isLoading={!!isCoverageLoading}
                error={coverageError}
            />
        );
    }

    // Loading state

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 animate-fade-in shadow-[inset_0_0_100px_rgba(var(--primary-rgb),0.02)]">
                <LoaderFive text="Analyzing requirement..." />
                <div className="text-center mt-4">
                    <p className="text-xs text-foreground-subtle italic">
                        {loadingSubtitle}
                    </p>
                </div>
            </div>
        );
    }

    // Empty state
    if (!hasContent) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
                <div className="w-14 h-14 rounded-xl bg-background-card border border-border flex items-center justify-center">
                    <FileText className="w-6 h-6 text-foreground-subtle" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-foreground mb-1">
                        No output yet
                    </p>
                    <p className="text-xs text-foreground-subtle max-w-[260px]">
                        Enter a requirement and click Generate to see AI-generated test artifacts here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 animate-fade-in">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-background-surface">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-foreground-subtle bg-background-card px-2 py-0.5 rounded">
                        {getFileName()}
                    </span>
                    {activeTab === 'test_cases' && testCases && (
                        <span className="text-xs text-foreground-subtle">
                            {testCases.length} test case{testCases.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleCopy} className="btn-ghost text-xs flex items-center gap-1.5 py-1.5 px-2.5">
                        {copied ? (
                            <><Check className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400">Copied!</span></>
                        ) : (
                            <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
                        )}
                    </button>
                    <button onClick={handleDownload} className="btn-ghost text-xs flex items-center gap-1.5 py-1.5 px-2.5">
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                {activeTab === 'test_cases' && testCases ? (
                    <div className="p-4 space-y-0">
                        {testCases.map((tc, i) => (
                            <TestCaseCard key={tc.id || i} tc={tc} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="h-full min-h-[500px]">
                        <MonacoEditor
                            height="100%"
                            language={getLanguage()}
                            value={getContent()}
                            theme={EDITOR_THEME}
                            options={EDITOR_OPTIONS}
                        />
                    </div>
                )}
            </div>

            {/* Export Automation Section */}
            {canExport && (
                <div className="border-t border-border bg-background-surface px-4 py-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold text-foreground uppercase tracking-wider">Export Automation</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={() => handleExport('selenium')}
                                disabled={!!exporting}
                                className="btn-ghost text-xs flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all disabled:opacity-50"
                            >
                                {exporting === 'selenium' ? (
                                    <><LoaderFive size="sm" text="" className="gap-0" /><span>Preparing...</span></>
                                ) : (
                                    <><Download className="w-3.5 h-3.5" /><span>Selenium (Java)</span></>
                                )}
                            </button>
                            <button
                                onClick={() => handleExport('playwright')}
                                disabled={!!exporting}
                                className="btn-ghost text-xs flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all disabled:opacity-50"
                            >
                                {exporting === 'playwright' ? (
                                    <><LoaderFive size="sm" text="" className="gap-0" /><span>Preparing...</span></>
                                ) : (
                                    <><Download className="w-3.5 h-3.5" /><span>Playwright (TS)</span></>
                                )}
                            </button>
                        </div>
                    </div>
                    {exportError && (
                        <div className="mt-2 p-2 rounded-lg bg-red-900/20 border border-red-900/50">
                            <p className="text-xs text-red-400">{exportError}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
