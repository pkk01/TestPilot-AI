import { explainTest } from '@/lib/ai/explainTest';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
    testCase: z.string().min(1, 'Test case title is required'),
    steps: z.array(z.string()).min(1, 'At least one step is required'),
    expected: z.string().min(1, 'Expected result is required'),
});

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();

        // Enforce authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const parsed = RequestSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: parsed.error.errors[0].message },
                { status: 400 }
            );
        }

        const { testCase, steps, expected } = parsed.data;

        const explanation = await explainTest(testCase, steps, expected);

        return NextResponse.json({ explanation });
    } catch (error) {
        console.error('Explain test error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : 'Failed to explain test case',
            },
            { status: 500 }
        );
    }
}
