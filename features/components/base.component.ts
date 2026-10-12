import type { Locator, Page } from "@playwright/test";

export abstract class BaseComponent {
  protected root: Locator;

  constructor(
    public readonly page: Page,
    rootSelector: string,
  ) {
    this.root = this.page.locator(rootSelector);
  }
}
