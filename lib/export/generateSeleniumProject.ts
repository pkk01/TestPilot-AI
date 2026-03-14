// ============================================================
// Selenium + Cucumber (Java/Maven) Project Generator
// ============================================================

import { TestCase } from '@/types/generation.types';

export interface ProjectFile {
    path: string;
    content: string;
}

// --------------- Templates ---------------

function generatePomXml(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.testpilot</groupId>
    <artifactId>automation-selenium</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <selenium.version>4.18.1</selenium.version>
        <cucumber.version>7.15.0</cucumber.version>
    </properties>

    <dependencies>
        <!-- Selenium -->
        <dependency>
            <groupId>org.seleniumhq.selenium</groupId>
            <artifactId>selenium-java</artifactId>
            <version>\${selenium.version}</version>
        </dependency>

        <!-- Cucumber -->
        <dependency>
            <groupId>io.cucumber</groupId>
            <artifactId>cucumber-java</artifactId>
            <version>\${cucumber.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>io.cucumber</groupId>
            <artifactId>cucumber-junit</artifactId>
            <version>\${cucumber.version}</version>
            <scope>test</scope>
        </dependency>

        <!-- JUnit -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>

        <!-- WebDriverManager -->
        <dependency>
            <groupId>io.github.bonigarcia</groupId>
            <artifactId>webdrivermanager</artifactId>
            <version>5.7.0</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.5</version>
            </plugin>
        </plugins>
    </build>
</project>`;
}

function generateTestRunner(): string {
    return `package runner;

import org.junit.runner.RunWith;
import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;

@RunWith(Cucumber.class)
@CucumberOptions(
    features = "src/test/resources/features",
    glue = "steps",
    plugin = {
        "pretty",
        "html:target/cucumber-reports.html",
        "json:target/cucumber-reports.json"
    },
    monochrome = true
)
public class TestRunner {
}`;
}

function generateBaseStepDefs(): string {
    return `package steps;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import io.cucumber.java.After;
import io.cucumber.java.Before;

public class BaseSteps {
    protected static WebDriver driver;

    @Before
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
    }

    @After
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}`;
}

// --------------- Main Generator ---------------

export function generateSeleniumProject(
    gherkin: string | null,
    stepDefs: string | null,
    testCases: TestCase[] | null
): ProjectFile[] {
    const files: ProjectFile[] = [];
    const root = 'automation-selenium';

    // pom.xml
    files.push({ path: `${root}/pom.xml`, content: generatePomXml() });

    // Test Runner
    files.push({
        path: `${root}/src/test/java/runner/TestRunner.java`,
        content: generateTestRunner(),
    });

    // Base Steps (WebDriver setup/teardown)
    files.push({
        path: `${root}/src/test/java/steps/BaseSteps.java`,
        content: generateBaseStepDefs(),
    });

    // Step Definitions — use AI-generated or fallback
    const stepDefsContent = stepDefs
        ? ensurePackageDeclaration(stepDefs)
        : generateFallbackStepDefs(testCases);

    files.push({
        path: `${root}/src/test/java/steps/StepDefinitions.java`,
        content: stepDefsContent,
    });

    // Feature file
    const featureContent = gherkin || generateFallbackFeature(testCases);
    files.push({
        path: `${root}/src/test/resources/features/tests.feature`,
        content: featureContent,
    });

    // README
    files.push({
        path: `${root}/README.md`,
        content: `# Automation Project — Selenium + Cucumber

Generated by **TestPilot AI**

## Prerequisites
- Java 11+
- Maven 3.6+
- Chrome browser

## Run Tests
\`\`\`bash
mvn test
\`\`\`

## Reports
After running tests, open \`target/cucumber-reports.html\` in your browser.
`,
    });

    return files;
}

// --------------- Helpers ---------------

function ensurePackageDeclaration(code: string): string {
    if (!code.trimStart().startsWith('package ')) {
        return `package steps;\n\n${code}`;
    }
    return code;
}

function generateFallbackStepDefs(testCases: TestCase[] | null): string {
    const steps = testCases?.flatMap((tc) => tc.steps) ?? [];
    const uniqueSteps = Array.from(new Set(steps));

    const methods = uniqueSteps.map((step, i) => {
        const methodName = `step${i + 1}`;
        return `    @io.cucumber.java.en.Given("${escapeJava(step)}")
    public void ${methodName}() {
        // TODO: Implement step — ${step}
    }`;
    });

    return `package steps;

import org.openqa.selenium.WebDriver;

public class StepDefinitions extends BaseSteps {

${methods.join('\n\n')}
}`;
}

function generateFallbackFeature(testCases: TestCase[] | null): string {
    if (!testCases?.length) {
        return 'Feature: Generated Tests\n\n  Scenario: Sample\n    Given a placeholder step\n';
    }

    const scenarios = testCases.map((tc) => {
        const stepsText = tc.steps
            .map((s, i) => `    ${i === 0 ? 'Given' : 'And'} ${s}`)
            .join('\n');
        return `  Scenario: ${tc.title}\n${stepsText}\n    Then ${tc.expected_result}`;
    });

    return `Feature: Generated Tests\n\n${scenarios.join('\n\n')}\n`;
}

function escapeJava(s: string): string {
    return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
