import { expect, type Locator, type Page, test } from '@playwright/test';
import { HEADER_TRANSLATIONS, type Language, MENUBAR_TRANSLATION } from '@utils/testData/languages';
import { BaseComponent } from './base.component';

export abstract class HeaderComponent extends BaseComponent {
  protected abstract readonly languagePickerButton: Locator;
  protected abstract readonly languageModal: Locator;

  private readonly accommodationButton = this.root.locator('[id="accommodations"]');
  private readonly flightsButton = this.root.locator('[id="flights"]');
  private readonly carsButton = this.root.locator('[id="cars"]');
  private readonly attractionsButton = this.root.locator('[id="attractions"]');
  private readonly airportTaxisButton = this.root.locator('[id="airport_taxis"]');

  constructor(page: Page) {
    super(page.getByTestId('web-shell-header-mfe'));
  }

  /** Makes the language picker button reachable (e.g. opens the burger menu on mobile). */
  protected abstract revealLanguagePicker(): Promise<void>;

  async checkMenubarTranslations(language: Language): Promise<void> {
    await test.step(`Verify the menu bar elements are translated into ${language}`, async () => {
      const texts = MENUBAR_TRANSLATION[language];

      const checks = [
        { locator: this.accommodationButton, expected: texts.accommodation },
        { locator: this.flightsButton, expected: texts.flights },
        { locator: this.carsButton, expected: texts.cars },
        { locator: this.attractionsButton, expected: texts.attractions },
        { locator: this.airportTaxisButton, expected: texts.airportTaxis },
      ];

      for (const { locator, expected } of checks) {
        await expect(locator).toHaveText(expected);
      }
    });
  }

  async checkLanguageInHeader(language: Language): Promise<void> {
    await test.step(`Verify ${language} language in header`, async () => {
      await this.revealLanguagePicker();
      await expect(this.languagePickerButton).toHaveAttribute(
        'aria-label',
        HEADER_TRANSLATIONS[language].headerLabel,
      );
    });
  }

  async openLanguageSelectionModal(): Promise<void> {
    await test.step('Open Language Selection Modal', async () => {
      await this.revealLanguagePicker();

      // After a language change Booking can ignore the first click while the page is still loading
      await expect(async () => {
        if (!(await this.languageModal.isVisible())) {
          await this.languagePickerButton.click();
        }
        await expect(this.languageModal).toBeVisible({ timeout: 2_000 });
      }).toPass({ timeout: 15_000 });
    });
  }
}
