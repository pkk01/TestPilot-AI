import { explainTest } from '@/lib/ai/explainTest';
import { withAIApiGuard } from '@/lib/security/apiGuard';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const RequestSchema = z.object({
    testCase: z.string().min(1, 'Test case title is required'),
    steps: z.array(z.string()).min(1, 'At least one step is required'),
    expected: z.string().min(1, 'Expected result is required'),
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

    const { testCase, steps, expected } = parsed.data;

    // Explain-test is a standalone AI action — gets its own unique batchId
    // This counts as 1 separate daily AI use
    const batchId = uuidv4();
    const inputText = `${testCase} ${steps.join(' ')} ${expected}`;

    return withAIApiGuard(
        request,
        inputText,
        batchId,
        '/api/explain-test',
        async ({ logUsage }) => {
            const explanation = await explainTest(testCase, steps, expected);

            // Log AI usage (unique batchId = 1 daily action)
            await logUsage();

            return NextResponse.json({ explanation });
        }
    );
}
