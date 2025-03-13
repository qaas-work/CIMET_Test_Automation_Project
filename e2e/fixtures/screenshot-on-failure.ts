import { test as base } from '@playwright/test';

export const test = base.extend({});

test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== 'passed') {
        await testInfo.attach('Failure Screenshot', {
            contentType: 'image/png',
            body: await page.screenshot(),
        });
    }
});