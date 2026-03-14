// ============================================================
// POST /api/export — Generate automation framework ZIP
// ============================================================

import { generatePlaywrightProject } from '@/lib/export/generatePlaywrightProject';
import { generateSeleniumProject } from '@/lib/export/generateSeleniumProject';
import { TestCase } from '@/types/generation.types';
import archiver from 'archiver';
import { NextRequest } from 'next/server';
import { PassThrough } from 'stream';

interface ExportRequestBody {
    framework: 'selenium' | 'playwright';
    gherkin: string | null;
    stepDefs: string | null;
    testCases: TestCase[] | null;
}

export async function POST(req: NextRequest) {
    try {
        const body: ExportRequestBody = await req.json();
        const { framework, gherkin, stepDefs, testCases } = body;

        // --- Validation ---
        if (!framework || !['selenium', 'playwright'].includes(framework)) {
            return new Response(
                JSON.stringify({ error: 'Invalid framework. Use "selenium" or "playwright".' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!gherkin && !stepDefs && (!testCases || testCases.length === 0)) {
            return new Response(
                JSON.stringify({ error: 'No test artifacts provided. Generate tests first.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // --- Generate project files ---
        const files =
            framework === 'selenium'
                ? generateSeleniumProject(gherkin, stepDefs, testCases)
                : generatePlaywrightProject(gherkin, stepDefs, testCases);

        // --- Create ZIP archive ---
        const passThrough = new PassThrough();
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(passThrough);

        for (const file of files) {
            archive.append(file.content, { name: file.path });
        }

        await archive.finalize();

        // --- Collect buffer from stream ---
        const chunks: Buffer[] = [];
        for await (const chunk of passThrough) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        const zipBuffer = Buffer.concat(chunks);

        const filename =
            framework === 'selenium'
                ? 'automation-selenium.zip'
                : 'automation-playwright.zip';

        return new Response(zipBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': String(zipBuffer.length),
            },
        });
    } catch (error) {
        console.error('Export error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to generate export. Please try again.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
