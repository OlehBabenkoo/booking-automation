import { test as base } from '@playwright/test';
import { HomePage } from '../../src/po/pages/index.js';

type Layout = 'mobile' | 'desktop';

type PageFixtures = {
  homePage: HomePage;
  layout: Layout;
};

export const pageTest = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  layout: async ({ isMobile }, use) => {
    await use(isMobile ? 'mobile' : 'desktop');
  },
});
