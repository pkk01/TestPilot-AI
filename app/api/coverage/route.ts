import { analyzeCoverage } from '@/lib/ai/analyzeCoverage';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
    requirement: z.string().min(10, 'Requirement must be at least 10 characters').max(5000),
    testCases: z.any(),
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

        const { requirement, testCases, projectId } = parsed.data;

        // Verify project ownership if projectId is provided
        if (projectId) {
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
        }

        // Call AI service
        const coverageResult = await analyzeCoverage(requirement, testCases);

        // Optionally store coverage result in the latest generation record
        if (projectId) {
            try {
                const { data: latestGen } = await supabase
                    .from('generations')
                    .select('id')
                    .eq('project_id', projectId)
                    .eq('generation_type', 'test_cases')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (latestGen) {
                    await supabase
                        .from('generations')
                        .update({ coverage_result: coverageResult })
                        .eq('id', latestGen.id);
                }
            } catch {
                // Non-critical — coverage result is still returned even if DB save fails
                console.error('Failed to save coverage result to database');
            }
        }

        return NextResponse.json({
            success: true,
            data: coverageResult,
        });
    } catch (error) {
        console.error('Coverage analysis error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to analyze coverage',
            },
            { status: 500 }
        );
    }
}
