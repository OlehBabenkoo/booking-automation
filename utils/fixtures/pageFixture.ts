import * as pages from '@features/pages';
import { componentTest } from './componentFixture';

type PageTestFixture = {
  homePage: pages.home;
  searchResultsPage: pages.searchResults;
};

export const pageTest = componentTest.extend<PageTestFixture>({
  homePage: async ({ page }, use) => {
    await use(new pages.home(page));
  },
  searchResultsPage: async ({ page }, use) => {
    await use(new pages.searchResults(page));
  },
});
