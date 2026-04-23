import { enhanceRequirement } from '@/lib/ai/enhanceRequirement';
import { withAIApiGuard } from '@/lib/security/apiGuard';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
    requirement: z.string().min(2, 'Input must be at least 2 characters').max(5000),
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

    const { requirement, batchId } = parsed.data;

    return withAIApiGuard(
        request,
        requirement,
        batchId,
        '/api/generate/enhance',
        async ({ logUsage }) => {
            const result = await enhanceRequirement(requirement);

            // Log AI usage
            await logUsage();

            return NextResponse.json({
                success: true,
                data: result,
            });
        }
    );
}
