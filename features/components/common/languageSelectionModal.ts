import { expect, Locator, Page, test } from '@playwright/test';
import type { Language } from '@utils/testData/languages';
import { BaseComponent } from './base.component';

export class LanguageSelectionModal extends BaseComponent {
  constructor(page: Page) {
    super(page.getByTestId('selection-modal'));
  }

  private get closeLanguageModalButton(): Locator {
    return this.root.getByTestId('selection-modal-close');
  }
  // сломается на укр
  private get suggestedLanguageItems(): Locator {
    return this.root.getByRole('list', { name: 'Suggested for you' }).getByTestId('selection-item');
  }
  // сломается на укр
  private get allLanguageItems(): Locator {
    return this.root.getByRole('list', { name: 'All languages' }).getByTestId('selection-item');
  }

  private languageButton(language: Language): Locator {
    return this.root.getByTestId(/^(All languages|Усі мови)$/).locator(`button[lang="${language}"]`);
  }

  async selectLanguageAndVerifyPageIsReloaded(language: Language): Promise<void> {
    await test.step('Select a language and verify the page is reloaded', async () => {
      const initialTimeOrigin = await this.page.evaluate(() => performance.timeOrigin);
      await this.languageButton(language).click();
      await expect(this.root).toBeHidden();
      const currentTimeOrigin = await this.page.evaluate(() => performance.timeOrigin);
      expect(currentTimeOrigin).not.toBe(initialTimeOrigin);
    });
  }

  async clickCloseModalButton(): Promise<void> {
    await test.step('Close modal window', async () => {
      await this.closeLanguageModalButton.click();
    });
  }

  async checkLanguageGroupsAreVisibleAndNotEmpty(): Promise<void> {
    await test.step('Verify the Suggested and All language groups are visible and not empty', async () => {
      await expect(this.suggestedLanguageItems.first()).toBeVisible();
      await expect(this.allLanguageItems.first()).toBeVisible();
    });
  }

  async checkLanguageInAllLanguages(language: Language): Promise<void> {
    await test.step(`Verify the ${language} language is present in All languages group`, async () => {
      await expect(this.languageButton(language)).toBeVisible();
    });
  }

  async checkIfLanguageIsSelected(language: Language): Promise<void> {
    await test.step(`Verify the ${language} language is selected`, async () => {
      await expect(this.languageButton(language)).toHaveAttribute('aria-pressed', 'true');
    });
  }

  async checkIfLanguageIsNotSelected(language: Language): Promise<void> {
    await test.step(`Verify the ${language} is not selected`, async () => {
      await expect(this.languageButton(language)).toHaveAttribute('aria-pressed', 'false');
    });
  }

  async closeLanguageModalAndVerifyPageIsNotReloaded(): Promise<void> {
    await test.step('Close the Language modal and verify the page is not reloaded', async () => {
      const initialTimeOrigin = await this.page.evaluate(() => performance.timeOrigin);
      await this.clickCloseModalButton();
      await expect(this.root).toBeHidden();
      const currentTimeOrigin = await this.page.evaluate(() => performance.timeOrigin);

      expect(currentTimeOrigin).toBe(initialTimeOrigin);
    });
  }
}
