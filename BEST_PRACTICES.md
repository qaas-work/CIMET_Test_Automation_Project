
# Playwright Best Practices

## Philosophy

### Think like an End User, Not a Developer
- Automated tests should verify that the application code works for end users and avoid relying on implementation details.
- The end user will see or interact with what is rendered on the page, so your test should typically only see/interact with the same rendered output.
- Users will not typically use, see, or even know about aspects like function names, arrays, or CSS classes.

### Avoid Testing Third-Party Dependencies
- Only test what you control.
- Don't try to test links to external sites or third-party servers that you do not control.
- Instead of verifying whether the Stripe integration is functioning correctly, test how your application handles Stripe downtime by displaying an appropriate message to users.

---

## Best Practices for Playwright

### Use User-Friendly Selectors
- Prefer text-based or role-based locators over XPath or CSS selectors.
- Use `getByRole`, `getByText`, `getByTestId`, or `data-testid`.
- It is mentioned by the official documentation of the playwright. [Source](https://playwright.dev/docs/best-practices#use-locators)

### Make Tests as Isolated as Possible
- Each test should be completely isolated and run independently with its own local storage, session storage, data, cookies, etc.
- Each test should create its own data and not rely on leftovers from previous tests.
- If a test needs setup, it should perform that setup itself.
- **Example**: Instead of assuming a product is already added to the cart, explicitly add it in the test. 
- If the "Add to Cart" test fails, all dependent tests will also fail, which is beneficial as it highlights impacted functionalities.
```
test('Add product to cart', async ({ page }) => {

    // Add the product to the cart
    await page.goto('https://yourstore.com/product/123');
    await page.click('text=Add to Cart');
    await expect(page.locator('.cart-badge')).toHaveText('1');

});

test('Checkout products in cart', async ({ page }) => {

    // Add the product to the cart
    await page.goto('https://yourstore.com/product/123');
    await page.click('text=Add to Cart');
    await expect(page.locator('.cart-badge')).toHaveText('1');

    // Proceed to checkout
    await page.click('text=Checkout');
    await expect(page).toHaveURL('https://yourstore.com/checkout');

});
```


### Leverage Auto-Waiting & Retries
- Playwright waits automatically for elements to be ready before interacting.
``` 
  await page.getByText('Welcome, User').waitFor();
```
- Avoid using manual waits (`setTimeout` or `waitForTimeout`) leads to flaky tests.
```
  await page.waitForTimeout(5000);
```

- You can also configure timeouts in `playwright.config.ts`.
```
import { defineConfig } from '@playwright/test'

export default defineConfig({
  timeout: 3000, // 30 seconds timeout for each test
  user: {
    actionTimeout: 5000, // 5 seconds for each action
    navigationTimeout: 15000, // 15 seconds for page navigation
})
```

### Store & Reuse Authentication State
- Use storage state to avoid logging in every test.
```ts
  await context.storageState({ path: 'auth.json' });
```
- **Trade-off**: Without auth state, tests take more time. With auth state, tests are not fully isolated.
- **Hybrid Approach**: Test authentication separately and then use auth state for other tests.

### Use API Requests for Faster Test Setup
- Set up test data via API calls instead of UI interactions.
- **Example**: Instead of manually creating a post via UI, use an API call to generate the post, then test commenting via UI.

### Intercept and Mock API Requests
- Intercepting APIs helps verify if the API returns the correct status codes and response data, it also ensure that the application handles API responses correctly.

```ts
test('should intercept user profile API call and verify response', async ({ page }) => {
  let interceptedResponse;

  await page.route('**/api/user', async (route) => {
    interceptedResponse = await route.fetch();
    await route.continue();
  });

  await page.goto('https://example.com/profile');

  expect(interceptedResponse).toBeDefined();
  expect(interceptedResponse.status()).toBe(200);
  expect(interceptedResponse.headers()['content-type']).toContain('application/json');
});
```

- Mocking API responses prevents tests from failing due to backend downtime, network issues, or data inconsistencies.
- You can simulate different API behaviors (e.g., success, failure, timeout) to test edge cases

```ts
test('should display user data from mocked API', async ({ page }) => {
  await page.route('**/api/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ name: 'John Doe', role: 'QA Engineer' }),
    });
  });

  await page.goto('https://example.com/profile');
  await expect(page.locator('.username')).toHaveText('John Doe');
```

### Use Page Object Model (POM) for Maintainability
- Create reusable Page Object Models (POM) for cleaner tests.
- Each page in the application should have its own class with methods representing interactions.

```ts
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

- Store test data in a separate file instead of hardcoding values.
```
import testData from '../data/testData.json';
import { LoginPage } from '../pages/LoginPage';

test('should login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.login(testData.validUser.email, testData.validUser.password);
});
```
- Instead of initializing page objects inside tests, use Playwright fixtures to manage them efficiently.
- POM should handle only UI interactions, while assertions should be in test files.
```
test('should display username on profile', async ({ profilePage }) => {
  await profilePage.goto();
  const username = await profilePage.getUsernameText();
  expect(username).toBe('John Doe'); // Assertion stays in the test
});
```

### Handle Flaky Tests with Retries & Debugging
- **What is a flaky test?** A test that sometimes passes and sometimes fails without code changes.
- **How to avoid flaky tests?**
  - Retry flaky tests: `npx playwright test --retries=2`
  - Use proper wait strategies.
```
await page.locator('.username').waitFor(); // Good Example (wait for element to appear)
await page.waitForResponse('**/api/user'); // Good Example (wait for network response)
```
  - Run each test independently to avoid shared state issues.
  - Clear cookies, storage, and cache before running each test.


### Describe-it Blocks

- A describe block groups related tests together. You should group tests based on:

- **Group Test by Feature or Page**
```
test.describe('User Profile Page', () => {
  test('should display user details correctly', async ({ page }) => { /* Test logic */ });
  test('should allow updating profile information', async ({ page }) => { /* Test logic */ });
  test('should display an error for invalid input', async ({ page }) => { /* Test logic */ });
});
```
- **Group Tests by User Session Type**
```
test.describe('Profile Access', () => {
  test.describe('Logged-in User', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('#email', 'user@example.com');
      await page.fill('#password', 'password123');
      await page.click('button[type="submit"]');
    });

    test('should allow editing profile', async ({ page }) => { /* Test logic */ });
    test('should display order history', async ({ page }) => { /* Test logic */ });
  });

  test.describe('Guest User', () => {
    test('should redirect guest user to login page', async ({ page }) => { /* Test logic */ });
  });
});

```
- **Group Tests by Shared Data Dependency**
```
test.describe('New User Registration', () => {
  let testUserEmail: string;

  test.beforeAll(async () => {
    testUserEmail = `user${Date.now()}@example.com`; // Generate unique email
  });

  test('should register a new user', async ({ page }) => {
    await page.goto('/register');
    await page.fill('#email', testUserEmail);
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('.success-message')).toHaveText('Registration successful');
  });

  test('should allow newly registered user to log in', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', testUserEmail);
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('.welcome-message')).toHaveText('Welcome!');
  });
});

```
- **Group Tests by User Roles (Admin vs. Regular User)**
```
test.describe('Dashboard Access', () => {
  test.describe('Admin User', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('#email', 'admin@example.com');
      await page.fill('#password', 'adminpass');
      await page.click('button[type="submit"]');
    });

    test('should see admin controls', async ({ page }) => {
      await expect(page.locator('#admin-panel')).toBeVisible();
    });
  });

  test.describe('Regular User', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('#email', 'user@example.com');
      await page.fill('#password', 'userpass');
      await page.click('button[type="submit"]');
    });

    test('should not see admin controls', async ({ page }) => {
      await expect(page.locator('#admin-panel')).not.toBeVisible();
    });
  });
});

```


### Logging and Reports

- Capture Screenshots for Debugging
  - Playwright supports automatic screenshots on failure.
- Capturing video is useful for debugging complex UI flows.
- HTML reports provide a detailed test summary with execution time, failures, and logs.
- Log API Requests and Responses for Debugging.
