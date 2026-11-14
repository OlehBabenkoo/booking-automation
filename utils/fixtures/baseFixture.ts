import { test as base } from '@playwright/test';
import { DiscountOfferModal } from '@features/components/index';

type BaseFixture = {
  dismissDiscountOfferModal: void;
};

export const baseTest = base.extend<BaseFixture>({
  dismissDiscountOfferModal: [
    async ({ page, isMobile }, use) => {
      if (!isMobile) {
        const discountOfferModal = new DiscountOfferModal(page);

        await page.addLocatorHandler(
          discountOfferModal.rootEl,
          async () => {
            await discountOfferModal.dismissModal();
          },
          { times: 1 },
        );
      }

      await use();
    },
    { auto: true },
  ],
});
