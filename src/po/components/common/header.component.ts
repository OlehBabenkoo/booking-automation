import { expect, Locator, Page } from '@playwright/test';
import { HEADER_TRANSLATIONS, Language, MENUBAR_TRANSLATION } from '@utils/data/languages';
import { BaseComponent } from './base.component';

export class HeaderComponent extends BaseComponent {
  constructor(page: Page) {
    super(page.getByTestId('web-shell-header-mfe'));
  }

  private get languagePickerButton(): Locator {
    return this.root.getByTestId('header-language-picker-trigger');
  }

  private get listPropertyButton(): Locator {
    return this.root.getByTestId('header-custom-action-button');
  }

  private get signUpButton(): Locator {
    return this.root.getByTestId('header-sign-up-button');
  }

  private get signInButton(): Locator {
    return this.root.getByTestId('header-sign-in-button');
  }

  private get accommodationButton(): Locator {
    return this.root.locator('[id="accommodations"]');
  }

  private get flightsButton(): Locator {
    return this.root.locator('[id="flights"]');
  }

  private get packagesButton(): Locator {
    return this.root.locator('[id="packages"]');
  }
  private get carsButton(): Locator {
    return this.root.locator('[id="cars"]');
  }

  private get attractionsButton(): Locator {
    return this.root.locator('[id="attractions"]');
  }

  private get airportTaxisButton(): Locator {
    return this.root.locator('[id="airport_taxis"]');
  }

  async checkMenubarTranslations(language: Language): Promise<void> {
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
  }

  async checkLanguageInHeader(language: Language): Promise<void> {
    await expect(this.languagePickerButton).toHaveAttribute(
      'aria-label',
      HEADER_TRANSLATIONS[language].headerLabel,
    );
  }

  async openLanguageSelectionModal(): Promise<void> {
    await this.languagePickerButton.click();
  }

  async checkRegistrationTranslation(language: Language): Promise<void> {
    const texts = HEADER_TRANSLATIONS[language];

    const checks = [
      { locator: this.listPropertyButton, expected: texts.listProperty },
      { locator: this.signUpButton, expected: texts.signUp },
      { locator: this.signInButton, expected: texts.signIn },
    ];

    for (const { locator, expected } of checks) {
      await expect(locator).toHaveText(expected);
    }
  }
}
