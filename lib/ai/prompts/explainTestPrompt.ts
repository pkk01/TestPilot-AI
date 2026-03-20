export function getExplainTestPrompt(
    testCase: string,
    steps: string[],
    expected: string
): string {
    return `You are a senior QA engineer.

Explain the purpose of the following test case in a clear and concise way.

Test Case:
${testCase}

Steps:
${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Expected Result:
${expected}

Your explanation should include:
1. What this test is verifying
2. Why it is important
3. What kind of bug it prevents

Keep it simple, professional, and under 80 words.`;
}
