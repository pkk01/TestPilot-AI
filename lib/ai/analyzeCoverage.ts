import { getCoveragePrompt } from '@/lib/ai/prompts/coveragePrompt';
import { CoverageResult } from '@/types/generation.types';
import Groq from 'groq-sdk';
import { z } from 'zod';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const HeatmapItemSchema = z.object({
    scenario: z.string(),
    coverage: z.number().min(0).max(100),
});

const CoverageResultSchema = z.object({
    coverage_score: z.number().min(0).max(100),
    covered: z.array(z.string()),
    missing: z.array(z.string()),
    recommendations: z.array(z.string()),
    heatmap: z.array(HeatmapItemSchema),
});

export async function analyzeCoverage(
    requirement: string,
    testCases: object
): Promise<CoverageResult> {
    const testCasesStr = JSON.stringify(testCases, null, 2);
    const prompt = getCoveragePrompt(requirement, testCasesStr);

    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        temperature: 0.3,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error('No response received from Groq API');
    }

    // Extract JSON from response (handle cases where AI wraps it in markdown)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Could not parse JSON from AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const validated = CoverageResultSchema.parse(parsed);

    return validated;
}
