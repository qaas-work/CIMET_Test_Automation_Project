import { test as base } from '@playwright/test';
import { createTestLogger } from '../utils/logger';

// Define test fixtures
export const test = base.extend<{ logger: ReturnType<typeof createTestLogger> }>({
    logger: async ({ }, use, testInfo) => {

        const logger = createTestLogger(testInfo.titlePath); // Create logger with test name
        await use(logger); // Provide logger to tests

    },
});


test.beforeEach(async ({ page, logger }) => {
    logger.info("Before Each Hook - Test started");

    // Capture browser console logs
    // page.on("console", (msg) => {
    //     logger.info(`Browser console log: ${msg.text()}`);
    // });

    // // Capture network request logs
    // page.on("request", (request) => {
    //     logger.info(`Request: ${request.method()} ${request.url()}`);
    // });

    // // Capture network response logs
    // page.on("response", async (response) => {
    //     logger.info(`Response: ${response.status()} ${response.url()}`);
    // });
});

test.afterEach(async ({ page, logger }, testInfo) => {

    if (testInfo.status !== 'passed') {

        const errorMessage = testInfo.error?.message ?? "Error not found";
        const cleanMessage = errorMessage.replace(/\x1B\[[0-9;]*[mK]/g, "");

        // Extract relevant lines
        const formattedError = cleanMessage
            .split("\n") // Split into lines
            .map(line => line.trim()) // Trim spaces
            .filter(line => 
                line.startsWith("Error") || 
                line.startsWith("Timed out") || 
                line.startsWith("Locator:") || 
                line.startsWith("Expected") || 
                line.startsWith("Received")
            ) // Keep only required lines
            .join(" | "); // Reformat into a structured output


        logger.error(`Test failed: ${formattedError}`);

        // Capture screenshot on failure
        await testInfo.attach('Failure Screenshot', {
            contentType: 'image/png',
            body: await page.screenshot(),
        });

        // Optional: Pause only on failure
        // await page.pause();
    } else {
        logger.info(`Test passed in ${testInfo.duration}ms`);
    }

    // Close the page after the test
    await page.close();
});
