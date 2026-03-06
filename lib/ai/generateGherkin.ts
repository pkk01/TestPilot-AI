import { getGherkinPrompt } from '@/lib/ai/prompts/gherkinPrompt';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function generateGherkin(requirement: string): Promise<string> {
    const prompt = getGherkinPrompt(requirement);

    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        temperature: 0.2,
        max_tokens: 4096,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error('No response received from Groq API');
    }

    // Clean up any accidental markdown fences
    const cleaned = content
        .replace(/^```[gherkin|feature|cucumber]?\n?/gim, '')
        .replace(/^```\n?$/gim, '')
        .trim();

    return cleaned;
}
