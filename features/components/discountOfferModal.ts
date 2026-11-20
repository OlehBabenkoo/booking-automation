import { expect, type BrowserContext, type Page, test } from '@playwright/test';
import { BaseComponent } from './common/base.component';

const sessionsWithModalHandled = new WeakSet<BrowserContext>();

export class DiscountOfferModal extends BaseComponent {
  private readonly dismissButton = this.root.getByRole('button', { name: 'Dismiss' });

  constructor(page: Page) {
    super(page.getByRole('dialog', { name: 'Window offering discounts' }));
  }

  async ensureDismissed(): Promise<void> {
    const session = this.root.page().context();
    if (sessionsWithModalHandled.has(session)) return;

    const appeared = await this.root.waitFor({ state: 'visible', timeout: 5_000 }).then(
      () => true,
      () => false,
    );
    if (appeared) await this.dismiss();

    sessionsWithModalHandled.add(session);
  }

  async dismiss(): Promise<void> {
    await test.step('Dismiss discount offer modal', async () => {
      await this.dismissButton.click();
      await expect(this.root).toBeHidden();
    });
    sessionsWithModalHandled.add(this.root.page().context());
  }
}
