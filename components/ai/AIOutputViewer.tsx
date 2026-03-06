'use client';

import { TestCase } from '@/types/generation.types';
import { Check, Copy, Download, FileText } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { TabId } from './GenerationTabs';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface AIOutputViewerProps {
    activeTab: TabId;
    testCases: TestCase[] | null;
    gherkin: string | null;
    stepDefs: string | null;
    isLoading: boolean;
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

function TestCaseCard({ tc, index }: { tc: TestCase; index: number }) {
    const priorityClass =
        tc.priority === 'High' ? 'badge-high' : tc.priority === 'Low' ? 'badge-low' : 'badge-medium';

    return (
        <div className="card mb-3 animate-slide-up">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono text-foreground-subtle bg-background-surface px-2 py-0.5 rounded flex-shrink-0">
                        {tc.id || `TC${String(index + 1).padStart(3, '0')}`}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground truncate">{tc.title}</h3>
                </div>
                <span className={`badge flex-shrink-0 ${priorityClass}`}>{tc.priority}</span>
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
        </div>
    );
}

export default function AIOutputViewer({
    activeTab,
    testCases,
    gherkin,
    stepDefs,
    isLoading,
}: AIOutputViewerProps) {
    const [copied, setCopied] = useState(false);

    const getContent = useCallback((): string => {
        switch (activeTab) {
            case 'test_cases':
                return testCases ? JSON.stringify({ testCases }, null, 2) : '';
            case 'gherkin':
                return gherkin || '';
            case 'step_defs':
                return stepDefs || '';
        }
    }, [activeTab, testCases, gherkin, stepDefs]);

    const getLanguage = () => {
        switch (activeTab) {
            case 'test_cases': return 'json';
            case 'gherkin': return 'gherkin';
            case 'step_defs': return 'java';
        }
    };

    const getFileExtension = () => {
        switch (activeTab) {
            case 'test_cases': return 'json';
            case 'gherkin': return 'feature';
            case 'step_defs': return 'java';
        }
    };

    const getFileName = () => {
        switch (activeTab) {
            case 'test_cases': return 'test_cases.json';
            case 'gherkin': return 'tests.feature';
            case 'step_defs': return 'StepDefinitions.java';
        }
    };

    const hasContent = activeTab === 'test_cases' ? !!testCases?.length
        : activeTab === 'gherkin' ? !!gherkin
            : !!stepDefs;

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

    // Loading state
    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-foreground mb-1">
                        Generating test artifacts...
                    </p>
                    <p className="text-xs text-foreground-subtle">
                        Groq AI is analyzing your requirement
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
        </div>
    );
}
