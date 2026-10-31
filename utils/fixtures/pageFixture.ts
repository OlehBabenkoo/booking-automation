import * as pages from '@features/pages';
import { test as base } from '@playwright/test';

type Layout = 'mobile' | 'desktop';

type PageTestFixture = {
  homePage: pages.HomePage;
  searchResultsPage: pages.SearchResultsPage;
  layout: Layout;
};

export const pageTest = base.extend<PageTestFixture>({
  homePage: async ({ page }, use) => {
    await use(new pages.HomePage(page));
  },

  searchResultsPage: async ({ page }, use) => {
    await use(new pages.SearchResultsPage(page));
  },

  layout: async ({ isMobile }, use) => {
    await use(isMobile ? 'mobile' : 'desktop');
  },
});
