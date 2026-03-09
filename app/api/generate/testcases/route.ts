import { generateTestCases } from '@/lib/ai/generateTestCases';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
    requirement: z.string().min(10, 'Requirement must be at least 10 characters').max(5000),
    projectId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();

        // Enforce authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const parsed = RequestSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: parsed.error.errors[0].message },
                { status: 400 }
            );
        }

        const { requirement, projectId } = parsed.data;

        if (!projectId) {
            return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
        }

        // Verify project ownership
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('id')
            .eq('id', projectId)
            .eq('user_id', user.id)
            .single();

        if (projectError || !project) {
            return NextResponse.json({ success: false, error: 'Unauthorized: Project not found or access denied' }, { status: 403 });
        }

        // Call AI service
        const testCases = await generateTestCases(requirement);

        // Store in Supabase
        const { data: generation, error: dbError } = await supabase
            .from('generations')
            .insert({
                project_id: projectId,
                requirement_text: requirement,
                generation_type: 'test_cases',
                ai_output: { testCases },
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
            // Return results even if DB save fails
        }

        return NextResponse.json({
            success: true,
            data: {
                testCases,
                generationId: generation?.id || null,
            },
        });
    } catch (error) {
        console.error('Test cases generation error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate test cases',
            },
            { status: 500 }
        );
    }
}
