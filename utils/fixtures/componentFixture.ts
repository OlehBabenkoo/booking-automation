import * as components from '@features/components';
import { test as base } from '@playwright/test';

type ComponentTestFixture = {
  headerComponent: components.HeaderComponent;
  heroBannerComponent: components.HeroBannerComponent;
  languageSelectionModal: components.LanguageSelectionModal;
  searchComponent: components.SearchComponent;
};

export const componentTest = base.extend<ComponentTestFixture>({
  headerComponent: async ({ page }, use) => {
    await use(new components.HeaderComponent(page));
  },

  heroBannerComponent: async ({ page }, use) => {
    await use(new components.HeroBannerComponent(page));
  },

  languageSelectionModal: async ({ page }, use) => {
    await use(new components.LanguageSelectionModal(page));
  },

  searchComponent: async ({ page }, use) => {
    await use(new components.SearchComponent(page));
  },
});
