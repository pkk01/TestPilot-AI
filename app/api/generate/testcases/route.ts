import { generateTestCases } from '@/lib/ai/generateTestCases';
import { withAIApiGuard } from '@/lib/security/apiGuard';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
    requirement: z.string().min(10, 'Requirement must be at least 10 characters').max(5000),
    projectId: z.string().uuid().optional(),
    batchId: z.string().min(1, 'Batch ID is required'),
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { success: false, error: parsed.error.errors[0].message },
            { status: 400 }
        );
    }

    const { requirement, projectId, batchId } = parsed.data;

    if (!projectId) {
        return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    return withAIApiGuard(
        request,
        requirement,
        batchId,
        '/api/generate/testcases',
        async ({ user, supabase, logUsage }) => {
            // Verify project ownership
            const { data: project, error: projectError } = await supabase
                .from('projects')
                .select('id')
                .eq('id', projectId)
                .eq('user_id', user.id)
                .single();

            if (projectError || !project) {
                return NextResponse.json(
                    { success: false, error: 'Unauthorized: Project not found or access denied' },
                    { status: 403 }
                );
            }

            // Call AI service
            const testCases = await generateTestCases(requirement);

            // Log AI usage (this batch counts as 1 daily action)
            await logUsage();

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
            }

            return NextResponse.json({
                success: true,
                data: {
                    testCases,
                    generationId: generation?.id || null,
                },
            });
        }
    );
}
