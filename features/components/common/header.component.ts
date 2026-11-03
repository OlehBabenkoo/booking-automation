import { expect, Page, test } from '@playwright/test';
import { HEADER_TRANSLATIONS, Language, MENUBAR_TRANSLATION } from '@utils/testData/languages';
import { BaseComponent } from './base.component';

export class HeaderComponent extends BaseComponent {
  private readonly languagePickerButton = this.root.getByTestId('header-language-picker-trigger');
  private readonly listPropertyButton = this.root.getByTestId('header-custom-action-button');
  private readonly signUpButton = this.root.getByTestId('header-sign-up-button');
  private readonly signInButton = this.root.getByTestId('header-sign-in-button');
  private readonly accommodationButton = this.root.locator('[id="accommodations"]');
  private readonly flightsButton = this.root.locator('[id="flights"]');
  private readonly packagesButton = this.root.locator('[id="packages"]');
  private readonly carsButton = this.root.locator('[id="cars"]');
  private readonly attractionsButton = this.root.locator('[id="attractions"]');
  private readonly airportTaxisButton = this.root.locator('[id="airport_taxis"]');

  constructor(page: Page) {
    super(page.getByTestId('web-shell-header-mfe'));
  }

  async checkMenubarTranslations(language: Language): Promise<void> {
    await test.step(`Verify the menu bar elements are translated into ${language}`, async () => {
      const texts = MENUBAR_TRANSLATION[language];

      const checks = [
        { locator: this.accommodationButton, expected: texts.accommodation },
        { locator: this.flightsButton, expected: texts.flights },
        { locator: this.packagesButton, expected: texts.packages },
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
      await expect(this.languagePickerButton).toHaveAttribute(
        'aria-label',
        HEADER_TRANSLATIONS[language].headerLabel,
      );
    });
  }

  async openLanguageSelectionModal(): Promise<void> {
    await test.step('Open Language Selection Modal', async () => {
      const languageModal = this.page.getByTestId('selection-modal');

      // After a language change Booking can ignore the first click while the page is still loading
      await expect(async () => {
        if (!(await languageModal.isVisible())) {
          await this.languagePickerButton.click();
        }
        await expect(languageModal).toBeVisible({ timeout: 2_000 });
      }).toPass({ timeout: 15_000 });
    });
  }

  async checkRegistrationTranslation(language: Language): Promise<void> {
    await test.step(`Verify registration bar is translated into ${language}`, async () => {
      const texts = HEADER_TRANSLATIONS[language];

      const checks = [
        { locator: this.listPropertyButton, expected: texts.listProperty },
        { locator: this.signUpButton, expected: texts.signUp },
        { locator: this.signInButton, expected: texts.signIn },
      ];

      for (const { locator, expected } of checks) {
        await expect(locator).toHaveText(expected);
      }
    });
  }
}
