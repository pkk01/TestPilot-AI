'use client';

import { Code2, FlaskConical, GitBranch } from 'lucide-react';

export type TabId = 'test_cases' | 'gherkin' | 'step_defs';

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
];

interface GenerationTabsProps {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
    hasOutput: {
        test_cases: boolean;
        gherkin: boolean;
        step_defs: boolean;
    };
}

export default function GenerationTabs({ activeTab, onTabChange, hasOutput }: GenerationTabsProps) {
    return (
        <div className="flex items-center border-b border-border gap-0">
            {tabs.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                const hasData = hasOutput[id];
                return (
                    <button
                        key={id}
                        onClick={() => onTabChange(id)}
                        className={`tab-button flex items-center gap-2 relative ${isActive ? 'tab-button-active' : ''}`}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{label}</span>
                        {hasData && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary absolute top-1.5 right-1" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
