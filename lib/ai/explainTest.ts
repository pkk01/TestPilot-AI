import { getExplainTestPrompt } from '@/lib/ai/prompts/explainTestPrompt';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function explainTest(
    testCase: string,
    steps: string[],
    expected: string
): Promise<string> {
    const prompt = getExplainTestPrompt(testCase, steps, expected);

    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        temperature: 0.3,
        max_tokens: 512,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error('No response received from Groq API');
    }

    return content.trim();
}
