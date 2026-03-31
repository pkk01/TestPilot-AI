// ============================================================
// GET /api/usage — Returns current user's daily AI usage
// ============================================================

import { getDailyUsage } from '@/lib/security/aiGuard';
import { withApiGuard } from '@/lib/security/apiGuard';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    return withApiGuard(
        request,
        async ({ user, supabase }) => {
            const usage = await getDailyUsage(user.id, supabase);
            return NextResponse.json({ success: true, data: usage });
        },
        { skipRateLimit: true } // Lightweight endpoint, don't rate-limit
    );
}
