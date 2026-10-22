import * as components from '@features/components';
import { test as base } from '@playwright/test';

type ComponentTestFixture = {
  searchComponent: components.search;
};

export const componentTest = base.extend<ComponentTestFixture>({
  searchComponent: async ({ page }, use) => {
    await use(new components.search(page));
  },
});
