import { getTestCasePrompt } from '@/lib/ai/prompts/testcasesPrompt';
import { TestCase } from '@/types/generation.types';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function generateTestCases(requirement: string): Promise<TestCase[]> {
    const prompt = getTestCasePrompt(requirement);

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

    if (!parsed.testCases || !Array.isArray(parsed.testCases)) {
        throw new Error('Invalid response structure: missing testCases array');
    }

    return parsed.testCases as TestCase[];
}
