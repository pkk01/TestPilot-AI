// ============================================================
// API Request / Response Types
// ============================================================

// --- Generate Test Cases ---
export interface GenerateTestCasesRequest {
    requirement: string;
    projectId?: string;
}

export interface GenerateTestCasesResponse {
    success: boolean;
    data?: {
        testCases: import('@/types/generation.types').TestCase[];
        generationId: string;
    };
    error?: string;
}

// --- Generate Gherkin ---
export interface GenerateGherkinRequest {
    requirement: string;
    projectId?: string;
}

export interface GenerateGherkinResponse {
    success: boolean;
    data?: {
        feature: string;
        generationId: string;
    };
    error?: string;
}

// --- Generate Step Definitions ---
export interface GenerateStepDefsRequest {
    gherkin: string;
    projectId?: string;
}

export interface GenerateStepDefsResponse {
    success: boolean;
    data?: {
        javaCode: string;
        generationId: string;
    };
    error?: string;
}

// --- Projects ---
export interface CreateProjectRequest {
    name: string;
    description?: string;
}

export interface ProjectsResponse {
    success: boolean;
    data?: import('@/types/project.types').Project[];
    error?: string;
}

export interface CreateProjectResponse {
    success: boolean;
    data?: import('@/types/project.types').Project;
    error?: string;
}

// --- History ---
export interface HistoryResponse {
    success: boolean;
    data?: import('@/types/generation.types').Generation[];
    error?: string;
}

// --- Generic Error ---
export interface ApiError {
    success: false;
    error: string;
}
