import { expect, Locator, Page, test } from '@playwright/test';
import { BaseComponent } from './common/base.component';

export class HeroBannerComponent extends BaseComponent {
  constructor(page: Page) {
    super(page.locator("[id='HeroBannerDesktop']"));
  }

  private get heroBannerTitle(): Locator {
    return this.root.getByTestId('herobanner-title1');
  }

  async checkHeroTitleTranslation(expectedText: string): Promise<void> {
    await test.step('Verify the page heading translation', async () => {
      await expect(this.heroBannerTitle).toHaveText(expectedText);
    });
  }
}
