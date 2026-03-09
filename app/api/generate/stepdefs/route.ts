import { generateStepDefs } from '@/lib/ai/generateStepDefs';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
    gherkin: z.string().min(10, 'Gherkin content must be at least 10 characters').max(10000),
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

        const { gherkin, projectId } = parsed.data;

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
        const javaCode = await generateStepDefs(gherkin);

        // Store in Supabase
        const { data: generation, error: dbError } = await supabase
            .from('generations')
            .insert({
                project_id: projectId,
                requirement_text: gherkin.slice(0, 500), // Store the gherkin as requirement
                generation_type: 'step_defs',
                ai_output: { javaCode },
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
        }

        return NextResponse.json({
            success: true,
            data: {
                javaCode,
                generationId: generation?.id || null,
            },
        });
    } catch (error) {
        console.error('Step defs generation error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate step definitions',
            },
            { status: 500 }
        );
    }
}
