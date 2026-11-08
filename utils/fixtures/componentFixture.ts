import * as components from '@features/components';
import { test as base } from '@playwright/test';

type ComponentTestFixture = {
  headerComponent: components.HeaderComponent;
  heroBannerComponent: components.HeroBannerComponent;
  languageSelectionModal: components.LanguageSelectionModal;
  searchComponent: components.SearchComponent;
  discountOfferModal: components.DiscountOfferModal;
};

export const componentTest = base.extend<ComponentTestFixture>({
  headerComponent: async ({ page, isMobile }, use) => {
    await use(
      isMobile ? new components.MobileHeaderComponent(page) : new components.DesktopHeaderComponent(page),
    );
  },

  heroBannerComponent: async ({ page }, use) => {
    await use(new components.HeroBannerComponent(page));
  },

  languageSelectionModal: async ({ page, isMobile }, use) => {
    await use(new components.LanguageSelectionModal(page, isMobile));
  },

  searchComponent: async ({ page, isMobile }, use) => {
    await use(
      isMobile ? new components.MobileSearchComponent(page) : new components.DesktopSearchComponent(page),
    );
  },

  discountOfferModal: async ({ page }, use) => {
    await use(new components.DiscountOfferModal(page));
  },
});
