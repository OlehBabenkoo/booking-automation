import { expect, Locator, Page } from '@playwright/test';
import { Language, SEARCHBOX_TRANSLATIONS } from '@utils/data/languages';
import { BaseComponent } from './base.component';

export class SearchboxComponent extends BaseComponent {
  //searchbox-layout-vertical for mobile
  constructor(page: Page) {
    super(page.getByTestId('searchbox-layout-wide'));
  }

  private get searchButton(): Locator {
    return this.root.getByRole('button', { name: /^(Search|Шукати)$/ });
  }

  private get searchBoxdestinationContainer(): Locator {
    return this.root.getByTestId('destination-container');
  }

  private get searchBoxdestinationPlaceholder(): Locator {
    return this.root
      .getByTestId('destination-container')
      .locator('[placeholder="Where are you going?"], [placeholder="Куди ви вирушаєте?"]');
  }

  private get searchBoxDatesContainer(): Locator {
    return this.root.getByTestId('searchbox-dates-container');
  }

  private get searchBoxStartDate(): Locator {
    return this.root.getByTestId('date-display-field-start');
  }

  private get searchBoxEndDate(): Locator {
    return this.root.getByTestId('date-display-field-end');
  }

  private get searchBoxOccupancyContainer(): Locator {
    return this.root.locator('.b7c1d87e07'); //no other IDs or names
  }

  private get searchBoxOccupancyConfiguration(): Locator {
    return this.root.locator('[id$="-occupancy-label"]');
  }

  async checkSearchButtonText(language: Language): Promise<void> {
    await expect(this.searchButton).toHaveText(SEARCHBOX_TRANSLATIONS[language].searchButtonText);
  }

  // async checkDestinationContainerPlaceholderText(expectedText: string): Promise<void> {
  //     await expect(this.searchBoxdestinationPlaceholder).toHaveAttribute("placeholder", expectedText);
  // }

  async checkDestinationContainerPlaceholderText(language: Language): Promise<void> {
    await expect(this.searchBoxdestinationPlaceholder).toHaveAttribute(
      'placeholder',
      SEARCHBOX_TRANSLATIONS[language].searchBoxDestinationPlaceholderText,
    );
  }

  async checkDestinationContainerTitle(expectedText: string): Promise<void> {
    await expect(this.searchBoxdestinationContainer).toHaveText(expectedText);
  }

  async checkSearchBoxTranslations(language: Language): Promise<void> {
    const texts = SEARCHBOX_TRANSLATIONS[language];

    const checks = [
      { locator: this.searchBoxdestinationContainer, expected: texts.searchBoxDestinationTitle }, //
      // { locator: this.searchBoxdestinationContainer, expected: texts.searchBoxDestinationTitle},// реализовано не тестом, надо по другому сткчаться, не через цикл
      { locator: this.searchBoxDatesContainer, expected: texts.searchBoxDates }, //
      { locator: this.searchBoxOccupancyContainer, expected: texts.searchBoxOccupancyTitle },
      { locator: this.searchButton, expected: texts.searchButtonText },
    ];

    for (const { locator, expected } of checks) {
      await expect(locator).toHaveText(expected);
    }
    await expect(this.searchBoxdestinationPlaceholder).toHaveAttribute(
      'placeholder',
      texts.searchBoxDestinationPlaceholderText,
    );
  }
}
