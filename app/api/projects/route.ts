import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(100),
    description: z.string().max(500).optional(),
});

// GET /api/projects - List all projects
export async function GET() {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('id', user.id)
            .single();

        // If user record doesn't exist yet (migration latency), wait slightly and retry once
        if (userError || !userData) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const { data: retryUser } = await supabase
                .from('users')
                .select('id')
                .eq('id', user.id)
                .single();

            if (!retryUser) {
                // Manually sync if trigger failed or is too slow
                console.log('Syncing user to public.users table:', user.id);
                const { error: upsertError } = await supabase.from('users').upsert({
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.full_name || user.email?.split('@')[0]
                });
                if (upsertError) {
                    console.error('Failed to sync user:', upsertError);
                } else {
                    console.log('Successfully synced user:', user.id);
                }
            }
        }

        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // If no projects exist, create one automatically
        if (!data || data.length === 0) {
            const { data: newProject, error: createError } = await supabase
                .from('projects')
                .insert({
                    name: 'Personal Project',
                    description: 'Your default workspace for test generations.',
                    user_id: user.id
                })
                .select()
                .single();

            if (createError) {
                console.error('Failed to create default project:', createError);
            } else {
                return NextResponse.json({ success: true, data: [newProject] });
            }
        }

        return NextResponse.json({ success: true, data: data || [] });
    } catch (error) {
        console.error('Get projects error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const parsed = CreateProjectSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: parsed.error.errors[0].message },
                { status: 400 }
            );
        }

        const { name, description } = parsed.data;

        const { data, error } = await supabase
            .from('projects')
            .insert({
                name,
                description: description || null,
                user_id: user.id,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (error) {
        console.error('Create project error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create project' },
            { status: 500 }
        );
    }
}
