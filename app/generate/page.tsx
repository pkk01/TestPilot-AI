'use client';

import AIOutputViewer from '@/components/ai/AIOutputViewer';
import GenerationTabs, { TabId } from '@/components/ai/GenerationTabs';
import InvalidInputNotice from '@/components/ai/InvalidInputNotice';
import ProjectSelector from '@/components/ai/ProjectSelector';
import RequirementInput from '@/components/ai/RequirementInput';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AIUsageBadge from '@/components/ui/AIUsageBadge';
import { LoaderFive } from '@/components/ui/loader';
import { ValidationResult } from '@/lib/security/requirementValidator';
import { CoverageResult, TestCase } from '@/types/generation.types';
import { ShieldAlert, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface GenerationState {
    test_cases: TestCase[] | null;
    gherkin: string | null;
    step_defs: string | null;
    coverage: CoverageResult | null;
}

interface UsageData {
    used: number;
    limit: number;
    remaining: number;
}

function GenerateContent() {
    const searchParams = useSearchParams();
    const initialRequirement = searchParams.get('requirement') ?? '';
    const autoGenerate = searchParams.get('autoGenerate') === '1';
    const [activeTab, setActiveTab] = useState<TabId>('test_cases');
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCoverageLoading, setIsCoverageLoading] = useState(false);
    const [coverageError, setCoverageError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [rateLimitError, setRateLimitError] = useState<string | null>(null);
    const [usage, setUsage] = useState<UsageData | null>(null);
    const [invalidInput, setInvalidInput] = useState<ValidationResult | null>(null);
    const [outputs, setOutputs] = useState<GenerationState>({
        test_cases: null,
        gherkin: null,
        step_defs: null,
        coverage: null,
    });

    // Fetch initial usage on mount
    useEffect(() => {
        const fetchUsage = async () => {
            try {
                const res = await fetch('/api/usage');
                const data = await res.json();
                if (data.success && data.data) {
                    setUsage(data.data);
                }
            } catch {
                // Silent — badge won't show
            }
        };
        fetchUsage();
    }, []);

    useEffect(() => {
        const pId = searchParams.get('projectId');
        if (pId) {
            setSelectedProjectId(pId);
        }
    }, [searchParams]);

    // Load project history when selectedProjectId changes
    useEffect(() => {
        if (!selectedProjectId) return;

        const loadProjectHistory = async () => {
            try {
                const res = await fetch(`/api/history?projectId=${selectedProjectId}&limit=10`);
                const data = await res.json();

                if (data.success && data.data.length > 0) {
                    const latestTC = data.data.find((g: any) => g.generation_type === 'test_cases');
                    const latestGherkin = data.data.find((g: any) => g.generation_type === 'gherkin');
                    const latestStepDefs = data.data.find((g: any) => g.generation_type === 'step_defs');
                    const coverageData = latestTC?.coverage_result || null;

                    setOutputs({
                        test_cases: latestTC ? latestTC.ai_output.testCases : null,
                        gherkin: latestGherkin ? latestGherkin.ai_output.feature : null,
                        step_defs: latestStepDefs ? latestStepDefs.ai_output.javaCode : null,
                        coverage: coverageData,
                    });
                } else {
                    setOutputs({
                        test_cases: null,
                        gherkin: null,
                        step_defs: null,
                        coverage: null,
                    });
                }
            } catch (err) {
                console.error('Failed to load project history:', err);
            }
        };

        loadProjectHistory();
    }, [selectedProjectId]);

    const handleGenerate = async (requirement: string) => {
        if (isBlocked) {
            setRateLimitError('Daily AI limit reached. Please try again tomorrow.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setCoverageError(null);
        setRateLimitError(null);
        setInvalidInput(null);
        setOutputs(prev => ({ ...prev, coverage: null }));

        // Generate a unique batchId for this entire generate action
        // All AI calls in this batch share this ID → counts as 1 daily use
        const batchId = uuidv4();

        try {
            // Generate testcases + gherkin in parallel
            const [testCasesRes, gherkinRes] = await Promise.all([
                fetch('/api/generate/testcases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ requirement, projectId: selectedProjectId, batchId }),
                }),
                fetch('/api/generate/gherkin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ requirement, projectId: selectedProjectId, batchId }),
                }),
            ]);

            // Check for rate limit errors
            if (testCasesRes.status === 429 || gherkinRes.status === 429) {
                const errorData = await (testCasesRes.status === 429 ? testCasesRes : gherkinRes).json();
                setRateLimitError(errorData.error || 'Daily AI limit reached. Please try again tomorrow.');
                setIsLoading(false);
                return;
            }

            const [tcData, gherkinData] = await Promise.all([
                testCasesRes.json(),
                gherkinRes.json(),
            ]);

            const newGherkin = gherkinData.success ? gherkinData.data.feature : null;

            // Generate step definitions from the gherkin output
            let stepDefsContent: string | null = null;
            if (newGherkin) {
                try {
                    const stepDefsRes = await fetch('/api/generate/stepdefs', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ gherkin: newGherkin, projectId: selectedProjectId, batchId }),
                    });

                    if (stepDefsRes.status === 429) {
                        // Rate limited on stepdefs — continue with what we have
                        console.warn('Step definitions rate limited');
                    } else {
                        const stepDefsData = await stepDefsRes.json();
                        if (stepDefsData.success) {
                            stepDefsContent = stepDefsData.data.javaCode;
                        }
                    }
                } catch {
                    // Step defs optional
                }
            }

            const generatedTestCases = tcData.success ? tcData.data.testCases : null;

            setOutputs({
                test_cases: generatedTestCases,
                gherkin: newGherkin,
                step_defs: stepDefsContent,
                coverage: null,
            });

            if (!tcData.success && !gherkinData.success) {
                setError(tcData.error || gherkinData.error || 'Generation failed. Please check your API keys and try again.');
            }

            // Refresh usage count after generation
            try {
                const usageRes = await fetch('/api/usage');
                const usageData = await usageRes.json();
                if (usageData.success && usageData.data) {
                    setUsage(usageData.data);
                }
            } catch {
                // Non-critical
            }

            // Trigger coverage analysis in the background
            if (generatedTestCases && generatedTestCases.length > 0) {
                setIsCoverageLoading(true);
                try {
                    const coverageRes = await fetch('/api/coverage', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            requirement,
                            testCases: generatedTestCases,
                            projectId: selectedProjectId,
                            batchId,
                        }),
                    });

                    if (coverageRes.status === 429) {
                        setCoverageError('Coverage analysis unavailable due to rate limits.');
                    } else {
                        const coverageData = await coverageRes.json();
                        if (coverageData.success) {
                            setOutputs(prev => ({ ...prev, coverage: coverageData.data }));
                        } else {
                            setCoverageError(coverageData.error || 'Coverage analysis failed.');
                        }
                    }
                } catch {
                    setCoverageError('Coverage analysis unavailable. Please try again later.');
                } finally {
                    setIsCoverageLoading(false);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const hasOutput = {
        test_cases: !!outputs.test_cases?.length,
        gherkin: !!outputs.gherkin,
        step_defs: !!outputs.step_defs,
        coverage: !!outputs.coverage,
    };

    const isProductionEnvironment = process.env.NEXT_PUBLIC_VERCEL_ENV
        ? process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
        : process.env.NODE_ENV === 'production';

    const isBlocked = isProductionEnvironment && !!usage && usage.remaining === 0;

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row h-full">
                {/* Left Panel */}
                <div className="w-full md:w-[400px] md:flex-shrink-0 border-b md:border-b-0 md:border-r border-border bg-background-surface flex flex-col min-h-0">
                    <div className="px-4 py-4 md:px-6 md:py-5 border-b border-border">
                        <div className="flex items-center justify-between mb-0.5">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-gray-400" />
                                <h1 className="text-lg font-medium text-foreground">Generate Tests</h1>
                            </div>
                            {usage && <AIUsageBadge usageOverride={usage} compact />}
                        </div>
                        <p className="text-sm text-gray-400 pl-7">
                            AI-powered test artifact generation
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                        <ProjectSelector
                            selectedProjectId={selectedProjectId}
                            onSelect={setSelectedProjectId}
                        />

                        {/* Rate limit block banner */}
                        {isBlocked && (
                            <div className="card-rich p-4 bg-red-900/20 border-red-800/40 flex items-start gap-3">
                                <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-red-400">Daily AI Limit Reached</p>
                                    <p className="text-xs text-red-400/70 mt-1">
                                        You have used all {usage.limit} AI calls for today. Your quota resets tomorrow.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Rate limit error from API response */}
                        {rateLimitError && !isBlocked && (
                            <div className="card-rich p-4 bg-amber-900/15 border-amber-800/40">
                                <p className="text-sm text-amber-400">{rateLimitError}</p>
                            </div>
                        )}

                        <RequirementInput
                            onGenerate={handleGenerate}
                            onInvalidInput={(result) => setInvalidInput(result)}
                            isLoading={isLoading}
                            activeTab={activeTab}
                            initialRequirement={initialRequirement}
                            autoGenerate={autoGenerate}
                            isRateLimited={isBlocked}
                        />

                        {error && (
                            <div className="card-rich p-4 bg-red-900/10 border-red-800/40">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel */}
                <div className="flex-1 flex flex-col min-w-0 bg-background">
                    <div className="border-b border-border bg-background-surface px-4">
                        <GenerationTabs
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            hasOutput={hasOutput}
                        />
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col">
                        {invalidInput ? (
                            <InvalidInputNotice validation={invalidInput} />
                        ) : (
                            <AIOutputViewer
                                activeTab={activeTab}
                                testCases={outputs.test_cases}
                                gherkin={outputs.gherkin}
                                stepDefs={outputs.step_defs}
                                isLoading={isLoading}
                                coverageResult={outputs.coverage}
                                isCoverageLoading={isCoverageLoading}
                                coverageError={coverageError}
                            />
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default function GeneratePage() {
    return (
        <Suspense fallback={
            <DashboardLayout>
                <div className="flex items-center justify-center h-full">
                    <LoaderFive text="Preparing workspace..." />
                </div>
            </DashboardLayout>
        }>
            <GenerateContent />
        </Suspense>
    );
}
