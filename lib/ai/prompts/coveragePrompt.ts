export function getCoveragePrompt(requirement: string, testCases: string): string {
    return `You are a senior QA architect.

Analyze the following software requirement and the generated test cases.

Determine:

1. Which scenarios from the requirement are covered by the test cases
2. Which scenarios are missing from the test cases
3. Estimate a coverage score from 0 to 100
4. Recommend additional tests to improve coverage
5. For each identifiable scenario, estimate its coverage percentage (0-100)

Return ONLY valid JSON in this exact format (no markdown, no explanation):

{
  "coverage_score": <number 0-100>,
  "covered": ["<scenario 1>", "<scenario 2>"],
  "missing": ["<scenario 1>", "<scenario 2>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>"],
  "heatmap": [
    { "scenario": "<scenario name>", "coverage": <number 0-100> }
  ]
}

The heatmap array should include ALL identifiable scenarios (both covered and missing) with their estimated coverage percentage.

Requirement:

${requirement}

Test Cases:

${testCases}`;
}
