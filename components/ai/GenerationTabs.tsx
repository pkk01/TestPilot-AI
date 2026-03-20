'use client';

import { BarChart3, Code2, FlaskConical, GitBranch } from 'lucide-react';

export type TabId = 'test_cases' | 'gherkin' | 'step_defs' | 'coverage';

interface Tab {
    id: TabId;
    label: string;
    icon: React.ElementType;
    description: string;
}

const tabs: Tab[] = [
    {
        id: 'test_cases',
        label: 'Test Cases',
        icon: FlaskConical,
        description: 'Manual test cases with steps',
    },
    {
        id: 'gherkin',
        label: 'Gherkin',
        icon: GitBranch,
        description: 'BDD feature file',
    },
    {
        id: 'step_defs',
        label: 'Step Definitions',
        icon: Code2,
        description: 'Selenium Java skeletons',
    },
    {
        id: 'coverage',
        label: 'Coverage',
        icon: BarChart3,
        description: 'AI-powered coverage analysis',
    },
];

interface GenerationTabsProps {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
    hasOutput: {
        test_cases: boolean;
        gherkin: boolean;
        step_defs: boolean;
        coverage: boolean;
    };
}

export default function GenerationTabs({ activeTab, onTabChange, hasOutput }: GenerationTabsProps) {
    return (
        <div className="flex items-center border-b border-border gap-0 overflow-x-auto scrollbar-hide">
            {tabs.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                const hasData = hasOutput[id];
                return (
                    <button
                        key={id}
                        onClick={() => onTabChange(id)}
                        className={`tab-button flex items-center gap-2 relative shrink-0 whitespace-nowrap ${isActive ? 'tab-button-active' : ''}`}
                    >
                        <Icon className="w-5 h-5 text-gray-400 hover:text-indigo-400 transition-colors duration-150" />
                        <span className="hidden sm:inline">{label}</span>
                        {hasData && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary absolute top-1.5 right-1" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
