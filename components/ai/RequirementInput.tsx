'use client';

import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface RequirementInputProps {
    onGenerate: (requirement: string) => void;
    isLoading: boolean;
    activeTab: string;
}

const MAX_CHARS = 3000;

const PLACEHOLDER = `Example:
User should be able to log into the application using a valid email and password.

• Invalid credentials should display an error message.
• After 5 failed attempts, the account should be locked for 15 minutes.
• Users can reset their password via email verification.`;

export default function RequirementInput({
    onGenerate,
    isLoading,
    activeTab,
}: RequirementInputProps) {
    const [requirement, setRequirement] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (requirement.trim().length < 10) {
            setError('Please enter at least 10 characters describing your requirement.');
            return;
        }
        setError('');
        onGenerate(requirement.trim());
    };

    const charCount = requirement.length;
    const isOverLimit = charCount > MAX_CHARS;

    const getButtonLabel = () => {
        if (isLoading) return 'Generating...';
        switch (activeTab) {
            case 'test_cases': return 'Generate Test Cases';
            case 'gherkin': return 'Generate Gherkin';
            case 'step_defs': return 'Generate Step Defs';
            default: return 'Generate';
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Software Requirement
                </label>
                <p className="text-xs text-foreground-subtle mb-3">
                    Paste your requirement, user story, or feature description below.
                </p>
                <div className="relative">
                    <textarea
                        value={requirement}
                        onChange={(e) => {
                            setRequirement(e.target.value);
                            if (error) setError('');
                        }}
                        placeholder={PLACEHOLDER}
                        disabled={isLoading}
                        rows={14}
                        className={`
              w-full bg-background-surface border rounded-lg px-4 py-3
              text-foreground placeholder:text-foreground-subtle
              font-mono text-sm resize-none
              focus:outline-none focus:ring-1 transition-colors duration-150
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isOverLimit
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-border focus:border-primary focus:ring-primary'
                            }
            `}
                    />
                </div>

                {/* Char counter */}
                <div className="flex items-center justify-between mt-2">
                    <div>
                        {error && (
                            <p className="flex items-center gap-1.5 text-xs text-red-400">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {error}
                            </p>
                        )}
                    </div>
                    <span className={`text-xs ${isOverLimit ? 'text-red-400' : 'text-foreground-subtle'}`}>
                        {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                    </span>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={isLoading || isOverLimit || requirement.trim().length < 10}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating test artifacts...</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4" />
                        <span>{getButtonLabel()}</span>
                    </>
                )}
            </button>

            {isLoading && (
                <div className="card p-3 animate-fade-in">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <p className="text-xs text-foreground-muted">
                            AI is analyzing your requirement and generating artifacts...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
