import { Locator, Page } from '@playwright/test';

export abstract class BaseComponent {
  constructor(protected readonly root: Locator) {}

  protected get page(): Page {
    return this.root.page();
  }

  get rootEl() {
    return this.root;
  }
}
