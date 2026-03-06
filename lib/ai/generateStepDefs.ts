import { getStepDefsPrompt } from '@/lib/ai/prompts/stepDefsPrompt';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function generateStepDefs(gherkinContent: string): Promise<string> {
    const prompt = getStepDefsPrompt(gherkinContent);

    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        temperature: 0.1,
        max_tokens: 4096,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error('No response received from Groq API');
    }

    // Clean up markdown code fences if present
    const cleaned = content
        .replace(/^```java\n?/gim, '')
        .replace(/^```\n?$/gim, '')
        .trim();

    return cleaned;
}
