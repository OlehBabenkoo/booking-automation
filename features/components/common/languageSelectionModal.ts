import { expect, type Locator, type Page, test } from '@playwright/test';
import type { Language } from '@utils/testData/languages';
import { BaseComponent } from './base.component';

export class LanguageSelectionModal extends BaseComponent {
  private readonly closeLanguageModalButton: Locator;
  private readonly suggestedLanguageItems = this.root
    .getByRole('list', { name: /^(Suggested for you|Рекомендовано для вас)$/ })
    .getByTestId('selection-item');
  private readonly allLanguageItems = this.root
    .getByRole('list', { name: /^(All languages|Усі мови)$/ })
    .getByTestId('selection-item');
  private readonly languageButton = (language: Language) =>
    this.root.getByTestId(/^(All languages|Усі мови)$/).locator(`button[lang="${language}"]`);

  constructor(page: Page, isMobile: boolean) {
    super(page.getByTestId(isMobile ? 'header-mobile-menu-language-picker-modal' : 'selection-modal'));
    this.closeLanguageModalButton = isMobile
      ? this.root.getByRole('button', { name: /^(Close language selector|Закрити меню вибору мови)$/ })
      : this.root.getByTestId('selection-modal-close');
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
