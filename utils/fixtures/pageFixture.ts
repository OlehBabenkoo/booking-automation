import * as pages from '@features/pages';
import { test as base } from '@playwright/test';

type PageTestFixture = {
  homePage: pages.home;
  searchResultsPage: pages.searchResults;
};

export const pageTest = base.extend<PageTestFixture>({
  homePage: async ({ page }, use) => {
    await use(new pages.home(page));
  },
  searchResultsPage: async ({ page }, use) => {
    await use(new pages.searchResults(page));
  },
});
