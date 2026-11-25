import * as pages from '@features/pages';
import { test as base } from '@playwright/test';

type Layout = 'mobile' | 'desktop';

type PageTestFixture = {
  homePage: pages.HomePage;
  searchResultsPage: pages.SearchResultsPage;
  signInPage: pages.SignInPage;
  securitySettingsPage: pages.SecuritySettingsPage;
  layout: Layout;
};

export const pageTest = base.extend<PageTestFixture>({
  homePage: async ({ page, isMobile }, use) => {
    await use(new pages.HomePage(page, isMobile));
  },

  searchResultsPage: async ({ page }, use) => {
    await use(new pages.SearchResultsPage(page));
  },
  signInPage: async ({ page, isMobile }, use) => {
    await use(new pages.SignInPage(page, isMobile));
  },
  securitySettingsPage: async ({ page, isMobile }, use) => {
    await use(new pages.SecuritySettingsPage(page, isMobile));
  },
  layout: async ({ isMobile }, use) => {
    await use(isMobile ? 'mobile' : 'desktop');
  },
});
