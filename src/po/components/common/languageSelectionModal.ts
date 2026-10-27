import { expect, Locator, Page } from '@playwright/test';
import { LANGUAGES } from '@utils/data/languages';
import { BaseComponent } from './base.component';

type Language = 'ua' | 'en-us' | 'en-gb';

export class LanguageSelectionModal extends BaseComponent {
  private readonly page: Page;

  constructor(page: Page) {
    super(page.getByTestId('selection-modal'));
    this.page = page;
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

  private get ukrainianLanguageButton(): Locator {
    return this.root.getByTestId(/^(All languages|Усі мови)$/).getByRole('button', { name: 'Українська' });
  }

  private get englishUSLanguageButton(): Locator {
    return this.root.getByTestId(/^(All languages|Усі мови)$/).getByRole('button', { name: 'English (US)' });
  }

  private languageButton(language: Language): Locator {
    return language === LANGUAGES.ukrainian.code
      ? this.ukrainianLanguageButton
      : this.englishUSLanguageButton;
  }

  async selectLanguageAndVerifyPageIsReloaded(language: Language): Promise<void> {
    const initialTimeOrigin = await this.page.evaluate(() => performance.timeOrigin);
    await this.languageButton(language).click();
    await expect(this.root).toBeHidden();
    const currentTimeOrigin = await this.page.evaluate(() => performance.timeOrigin);
    expect(currentTimeOrigin).not.toBe(initialTimeOrigin);
  }

  async clickCloseModalButton(): Promise<void> {
    await this.closeLanguageModalButton.click();
  }

  async checkLanguageGroupsAreVisibleAndNotEmpty(): Promise<void> {
    await expect(this.suggestedLanguageItems.first()).toBeVisible();
    await expect(this.allLanguageItems.first()).toBeVisible();
  }

  async checkLanguageInAllLanguages(language: Language): Promise<void> {
    await expect(this.languageButton(language)).toBeVisible();
  }

  async checkIfLanguageIsSelected(language: Language): Promise<void> {
    await expect(this.languageButton(language)).toHaveAttribute('aria-pressed', 'true');
  }

  async checkIfLanguageIsNotSelected(language: Language): Promise<void> {
    await expect(this.languageButton(language)).toHaveAttribute('aria-pressed', 'false');
  }

  async closeLanguageModalAndVerifyPageIsNotReloaded(): Promise<void> {
    const initialTimeOrigin = await this.page.evaluate(() => performance.timeOrigin);
    await this.clickCloseModalButton();
    await expect(this.root).toBeHidden();
    const currentTimeOrigin = await this.page.evaluate(() => performance.timeOrigin);

    expect(currentTimeOrigin).toBe(initialTimeOrigin);
  }
}
