'use client';

import AIOutputViewer from '@/components/ai/AIOutputViewer';
import GenerationTabs, { TabId } from '@/components/ai/GenerationTabs';
import ProjectSelector from '@/components/ai/ProjectSelector';
import RequirementInput from '@/components/ai/RequirementInput';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { LoaderFive } from '@/components/ui/loader';
import { CoverageResult, TestCase } from '@/types/generation.types';
import { Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface GenerationState {
    test_cases: TestCase[] | null;
    gherkin: string | null;
    step_defs: string | null;
    coverage: CoverageResult | null;
}

function GenerateContent() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<TabId>('test_cases');
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCoverageLoading, setIsCoverageLoading] = useState(false);
    const [coverageError, setCoverageError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [outputs, setOutputs] = useState<GenerationState>({
        test_cases: null,
        gherkin: null,
        step_defs: null,
        coverage: null,
    });

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
                    // Find the latest of each type
                    const latestTC = data.data.find((g: any) => g.generation_type === 'test_cases');
                    const latestGherkin = data.data.find((g: any) => g.generation_type === 'gherkin');
                    const latestStepDefs = data.data.find((g: any) => g.generation_type === 'step_defs');

                    // Load coverage from the latest test_cases generation if available
                    const coverageData = latestTC?.coverage_result || null;

                    setOutputs({
                        test_cases: latestTC ? latestTC.ai_output.testCases : null,
                        gherkin: latestGherkin ? latestGherkin.ai_output.feature : null,
                        step_defs: latestStepDefs ? latestStepDefs.ai_output.javaCode : null,
                        coverage: coverageData,
                    });
                } else {
                    // Reset if no history found
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
        setIsLoading(true);
        setError(null);
        setCoverageError(null);
        // Clear previous coverage while new generation is in progress
        setOutputs(prev => ({ ...prev, coverage: null }));

        try {
            // Generate all three in parallel for best UX
            const [testCasesRes, gherkinRes] = await Promise.all([
                fetch('/api/generate/testcases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ requirement, projectId: selectedProjectId }),
                }),
                fetch('/api/generate/gherkin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ requirement, projectId: selectedProjectId }),
                }),
            ]);

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
                        body: JSON.stringify({ gherkin: newGherkin, projectId: selectedProjectId }),
                    });
                    const stepDefsData = await stepDefsRes.json();
                    if (stepDefsData.success) {
                        stepDefsContent = stepDefsData.data.javaCode;
                    }
                } catch {
                    // Step defs optional, won't block the rest
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
                setError('Generation failed. Please check your API keys and try again.');
            }

            // After generation succeeds, trigger coverage analysis in the background
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
                        }),
                    });
                    const coverageData = await coverageRes.json();
                    if (coverageData.success) {
                        setOutputs(prev => ({ ...prev, coverage: coverageData.data }));
                    } else {
                        setCoverageError(coverageData.error || 'Coverage analysis failed.');
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

    return (
        <DashboardLayout>
            <div className="flex h-full">
                {/* Left Panel */}
                <div className="w-[400px] flex-shrink-0 border-r border-border bg-background-surface flex flex-col">
                    <div className="px-6 py-5 border-b border-border">
                        <div className="flex items-center gap-2 mb-0.5">
                            <Sparkles className="w-5 h-5 text-gray-400" />
                            <h1 className="text-lg font-medium text-foreground">Generate Tests</h1>
                        </div>
                        <p className="text-sm text-gray-400 pl-7">
                            AI-powered test artifact generation
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <ProjectSelector
                            selectedProjectId={selectedProjectId}
                            onSelect={setSelectedProjectId}
                        />

                        <RequirementInput
                            onGenerate={handleGenerate}
                            isLoading={isLoading}
                            activeTab={activeTab}
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
                    {/* Tabs */}
                    <div className="border-b border-border bg-background-surface px-4">
                        <GenerationTabs
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            hasOutput={hasOutput}
                        />
                    </div>

                    {/* Output Viewer */}
                    <div className="flex-1 overflow-hidden flex flex-col">
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
