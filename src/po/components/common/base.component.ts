import { Locator } from '@playwright/test';

export abstract class BaseComponent {
  constructor(protected readonly root: Locator) {}

  get rootEl() {
    return this.root;
  }
}
