import { expect, Page } from '@playwright/test';
import { DiscountOfferModal } from '@features/components';

export abstract class BasePage {
  protected readonly discountOfferModal: DiscountOfferModal;

  constructor(
    protected readonly page: Page,
    protected readonly path: string,
    protected readonly isMobile: boolean,
  ) {
    this.discountOfferModal = new DiscountOfferModal(page);
  }

  protected async waitForPageReady(): Promise<void> {}

  async open(url: string = this.path): Promise<void> {
    await this.page.goto(url);
    await this.waitForPageReady();

    // the discount modal is desktop-only
    if (!this.isMobile) {
      await this.discountOfferModal.ensureDismissed();
    }
  }

  async checkUrl(expectedUrl: string): Promise<void> {
    await expect(this.page.url()).toContain(expectedUrl);
  }
}
