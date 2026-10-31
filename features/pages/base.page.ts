import { expect, Page } from '@playwright/test';

export abstract class BasePage {
  constructor(
    protected readonly page: Page,
    protected readonly path: string,
  ) {}

  async open(): Promise<void> {
    await this.page.goto(this.path);
  }
  async checkUrl(expectedUrl: string): Promise<void> {
    await expect(this.page.url()).toContain(expectedUrl);
  }
}
