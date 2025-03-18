import { Page } from "@playwright/test";
import { createTestLogger } from "../utils/logger";

export class BasePage {
  protected page: Page;
  protected logger: ReturnType<typeof createTestLogger>;

  constructor(page: Page, logger: ReturnType<typeof createTestLogger>) {
    this.page = page;
    this.logger = logger;
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }
}
