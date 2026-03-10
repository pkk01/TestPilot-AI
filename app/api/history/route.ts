import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/history - Fetch all generation history
export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');
        const limit = parseInt(searchParams.get('limit') || '50');

        // First handle authorization: get all project IDs the user owns
        const { data: userProjects, error: projectsError } = await supabase
            .from('projects')
            .select('id')
            .eq('user_id', user.id);

        if (projectsError) throw projectsError;

        const userProjectIds = userProjects.map(p => p.id);

        if (userProjectIds.length === 0) {
            return NextResponse.json({ success: true, data: [] });
        }

        let query = supabase
            .from('generations')
            .select(`
        *,
        projects!inner (
          id,
          name,
          user_id
        )
      `)
            // Important security step: Only show generations for projects this user owns
            .in('project_id', userProjectIds)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (projectId) {
            // Additional check to make sure they aren't fetching a project they don't own
            if (!userProjectIds.includes(projectId)) {
                return NextResponse.json({ success: false, error: 'Unauthorized access to project' }, { status: 403 });
            }
            query = query.eq('project_id', projectId);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Get history error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch generation history' },
            { status: 500 }
        );
    }
}

// DELETE /api/history - Delete a specific generation
export async function DELETE(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'Generation ID is required' }, { status: 400 });
        }

        // Verify ownership: generation -> project -> user
        const { data: generation, error: genError } = await supabase
            .from('generations')
            .select(`
                id,
                project_id,
                projects!inner (
                    user_id
                )
            `)
            .eq('id', id)
            .single();

        if (genError || !generation) {
            return NextResponse.json({ success: false, error: 'Generation not found' }, { status: 404 });
        }

        // @ts-ignore - projects is joined
        if (generation.projects.user_id !== user.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const { error: deleteError } = await supabase
            .from('generations')
            .delete()
            .eq('id', id);

        if (deleteError) throw deleteError;

        return NextResponse.json({ success: true, message: 'Generation deleted successfully' });
    } catch (error) {
        console.error('Delete generation error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete generation' },
            { status: 500 }
        );
    }
}
