import { expect, type Locator, test } from '@playwright/test';
import type { TestDate } from '@utils/dates';
import { type Language, SEARCHBOX_TRANSLATIONS } from '@utils/testData/languages';
import type { Occupancy } from '@utils/testData/search';
import { BaseComponent } from './common/base.component';

export abstract class SearchComponent extends BaseComponent {
  protected abstract readonly destinationContainer: Locator;
  protected abstract readonly destinationInput: Locator;
  protected abstract readonly occupancyContainer: Locator;
  protected abstract readonly searchButton: Locator;

  /** The dates field differs between layouts: empty on desktop, pre-filled with today/tomorrow on mobile. */
  protected abstract checkDatesTranslation(language: Language): Promise<void>;

  abstract fillDestination(value: string): Promise<void>;
  abstract verifyDestinationValue(value: string): Promise<void>;
  abstract verifySuggestion(name: string, region: string): Promise<void>;
  abstract selectSuggestion(name: string, region: string): Promise<void>;
  abstract verifySuggestionsClosed(): Promise<void>;
  abstract openDatePicker(): Promise<void>;
  abstract verifyDatePickerOpened(): Promise<void>;
  abstract selectDates(checkIn: TestDate, checkOut: TestDate): Promise<void>;
  abstract verifyDatesValue(checkIn: TestDate, checkOut: TestDate): Promise<void>;
  abstract setOccupancy(occupancy: Occupancy): Promise<void>;
  abstract verifyOccupancyValue(value: string): Promise<void>;
  abstract clickSearch(): Promise<void>;

  public async checkSearchButtonText(language: Language): Promise<void> {
    await test.step(`Verify "Search" button text for "${language}" language`, async () => {
      await expect(this.searchButton).toHaveText(SEARCHBOX_TRANSLATIONS[language].searchButtonText);
    });
  }

  public async checkSearchBoxTranslations(language: Language): Promise<void> {
    const texts = SEARCHBOX_TRANSLATIONS[language];

    await test.step(`Verify search form translations for "${language}" language`, async () => {
      const checks = [
        { locator: this.destinationContainer, expected: texts.searchBoxDestinationTitle },
        { locator: this.occupancyContainer, expected: texts.searchBoxOccupancyTitle },
        { locator: this.searchButton, expected: texts.searchButtonText },
      ];

      for (const { locator, expected } of checks) {
        await expect(locator).toHaveText(expected);
      }
      await this.checkDatesTranslation(language);
      await expect(this.destinationInput).toHaveAttribute(
        'placeholder',
        texts.searchBoxDestinationPlaceholderText,
      );
    });
  }
}
