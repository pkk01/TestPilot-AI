import { generateGherkin } from '@/lib/ai/generateGherkin';
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
        const resolvedProjectId = projectId || '00000000-0000-0000-0000-000000000001';

        // Call AI service
        const feature = await generateGherkin(requirement);

        // Store in Supabase
        const { data: generation, error: dbError } = await supabase
            .from('generations')
            .insert({
                project_id: resolvedProjectId,
                requirement_text: requirement,
                generation_type: 'gherkin',
                ai_output: { feature },
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
        }

        return NextResponse.json({
            success: true,
            data: {
                feature,
                generationId: generation?.id || null,
            },
        });
    } catch (error) {
        console.error('Gherkin generation error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate Gherkin scenarios',
            },
            { status: 500 }
        );
    }
}
