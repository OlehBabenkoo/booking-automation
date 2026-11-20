import { DiscountOfferModal } from '@features/components';
import { test as base } from '@playwright/test';

export const promoFixture = base.extend<{ dismissPromoDialogs: void }>({
  dismissPromoDialogs: [
    async ({ page }, use) => {
      const closeButton = page.getByRole('button', { name: /^Close sheet$/ }).filter({ visible: true });
      const discountOffer = new DiscountOfferModal(page).rootEl;
      await page.addLocatorHandler(
        page.getByRole('dialog').filter({ has: closeButton }).first(),
        async () => {
          if (await discountOffer.isVisible()) return;
          await closeButton.last().click();
        },
        { noWaitAfter: true },
      );
      await use();
    },
    { auto: true },
  ],
});
