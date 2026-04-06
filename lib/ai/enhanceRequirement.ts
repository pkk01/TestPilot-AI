import { getEnhancePrompt } from '@/lib/ai/prompts/enhancePrompt';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export interface EnhanceResult {
    invalid: boolean;
    enhanced?: string;
    improvements?: string[];
    reason?: string;
    suggestion?: string;
}

export async function enhanceRequirement(rawInput: string): Promise<EnhanceResult> {
    const prompt = getEnhancePrompt(rawInput);

    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        temperature: 0.4,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error('No response received from Groq API');
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Could not parse JSON from AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
        invalid: !!parsed.invalid,
        enhanced: parsed.enhanced || undefined,
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : undefined,
        reason: parsed.reason || undefined,
        suggestion: parsed.suggestion || undefined,
    };
}
