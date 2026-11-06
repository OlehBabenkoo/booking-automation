import { expect, Page, test } from '@playwright/test';
import { BaseComponent } from './common/base.component';

export class HeroBannerComponent extends BaseComponent {
  private readonly heroBannerTitle = this.root.getByTestId('herobanner-title1');

  constructor(page: Page) {
    super(page.locator("[id='HeroBannerDesktop']"));
  }

  async checkHeroTitleTranslation(expectedText: string): Promise<void> {
    await test.step('Verify the page heading translation', async () => {
      await expect(this.heroBannerTitle).toHaveText(expectedText);
    });
  }
}
