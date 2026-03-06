// ============================================================
// Project Types
// ============================================================

export interface User {
    id: string;
    email: string | null;
    name: string | null;
    created_at: string;
}

export interface Project {
    id: string;
    user_id: string | null;
    name: string;
    description: string | null;
    created_at: string;
}

export interface CreateProjectInput {
    name: string;
    description?: string;
    user_id?: string;
}
