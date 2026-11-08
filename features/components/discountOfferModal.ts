import { expect, Page, test } from '@playwright/test';
import { BaseComponent } from './common/base.component';

export class DiscountOfferModal extends BaseComponent {
  private readonly dismissButton = this.root.getByRole('button', { name: 'Dismiss' });

  constructor(page: Page) {
    super(page.getByRole('dialog', { name: 'Window offering discounts' }));
  }

  async waitForModalToLoad() {
    await test.step('Wait Dismiss Discount offering modal to display', async ({}) => {
      await this.root.waitFor({ state: 'visible' });
    });
  }

  async dismissModal() {
    await test.step('Dismiss modal', async ({}) => {
      await this.dismissButton.click();
      await expect(this.root).toBeHidden();
    });
  }
}
