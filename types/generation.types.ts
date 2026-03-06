// ============================================================
// Generation Types
// ============================================================

export type GenerationType = 'test_cases' | 'gherkin' | 'step_defs';

export interface TestCase {
    id: string;
    title: string;
    preconditions: string;
    steps: string[];
    expected_result: string;
    priority: 'High' | 'Medium' | 'Low';
}

export interface TestCasesOutput {
    testCases: TestCase[];
}

export interface GherkinOutput {
    feature: string;
}

export interface StepDefsOutput {
    javaCode: string;
}

export type AiOutput = TestCasesOutput | GherkinOutput | StepDefsOutput;

export interface Generation {
    id: string;
    project_id: string | null;
    requirement_text: string;
    generation_type: GenerationType;
    ai_output: AiOutput;
    created_at: string;
}

export interface CreateGenerationInput {
    project_id: string;
    requirement_text: string;
    generation_type: GenerationType;
    ai_output: AiOutput;
}
