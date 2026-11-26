import { expect, type Locator, test } from '@playwright/test';
import type { TestDate } from '@utils/dates';
import { type Language, SEARCHBOX_TRANSLATIONS } from '@utils/testData/languages';
import { formatOccupancy, type Occupancy } from '@utils/testData/search';
import { BaseComponent } from './common/base.component';

type OccupancyCounter = 'group_adults' | 'group_children' | 'no_rooms';

export abstract class SearchComponent extends BaseComponent {
  protected abstract readonly destinationContainer: Locator;
  protected abstract readonly destinationInput: Locator;
  protected abstract readonly occupancyContainer: Locator;
  protected abstract readonly occupancyButton: Locator;

  private readonly suggestionsList = this.page.locator('#autocomplete-results');
  private readonly suggestion = (name: string, region: string) =>
    this.suggestionsList.getByRole('option', { name: `${name} ${region}`, exact: true });
  protected readonly datePicker = this.page.getByTestId('searchbox-datepicker-calendar');
  private readonly dateCell = (date: TestDate) => this.datePicker.locator(`[data-date="${date.iso}"]`);
  private readonly occupancyPopup = this.page.getByTestId('occupancy-popup');
  private readonly occupancyDoneButton = this.occupancyPopup.getByRole('button', { name: 'Done' }); // TODO: language-dependent locator, works only for English UI
  protected readonly searchButton = this.root.locator('button[type="submit"]');

  /** The dates field differs between layouts: empty on desktop, pre-filled with today/tomorrow on mobile. */
  protected abstract checkDatesTranslation(language: Language): Promise<void>;

  abstract fillDestination(value: string): Promise<void>;
  abstract verifyDatesValue(checkIn: TestDate, checkOut: TestDate): Promise<void>;
  abstract verifyOccupancyValue(value: string): Promise<void>;

  protected async applyDates(): Promise<void> {}

  public async verifyDestinationValue(value: string): Promise<void> {
    await test.step(`Verify "Destination" input has "${value}" value`, async () => {
      await expect(this.destinationInput).toHaveValue(value);
    });
  }

  public async verifySuggestion(name: string, region: string): Promise<void> {
    await test.step(`Verify suggestion "${name} ${region}" is visible in the suggestions list`, async () => {
      await expect(this.suggestion(name, region)).toBeVisible();
    });
  }

  public async selectSuggestion(name: string, region: string): Promise<void> {
    await test.step(`Select suggestion "${name} ${region}"`, async () => {
      await this.suggestion(name, region).click();
    });
  }

  public async verifySuggestionsClosed(): Promise<void> {
    await test.step('Verify suggestions list is closed', async () => {
      await expect(this.suggestionsList).toBeHidden();
    });
  }

  public async verifyDatePickerOpened(): Promise<void> {
    await test.step('Verify date picker is opened', async () => {
      await expect(this.datePicker).toBeVisible();
    });
  }

  public async selectDates(checkIn: TestDate, checkOut: TestDate): Promise<void> {
    await test.step(`Select "${checkIn.display}" - "${checkOut.display}" dates`, async () => {
      await this.dateCell(checkIn).click();
      await this.dateCell(checkOut).click();
      await this.applyDates();
    });
  }

  public async setOccupancy(occupancy: Occupancy): Promise<void> {
    const { adults, children, rooms } = occupancy;

    await test.step(`Set occupancy to "${formatOccupancy(occupancy)}"`, async () => {
      await this.occupancyButton.click();
      await this.setOccupancyCounter('group_adults', adults);
      await this.setOccupancyCounter('group_children', children);
      await this.setOccupancyCounter('no_rooms', rooms);
      await this.occupancyDoneButton.click();
      await expect(this.occupancyPopup).toBeHidden();
    });
  }

  public async clickSearch(): Promise<void> {
    await test.step('Click "Search" button', async () => {
      await this.searchButton.click();
    });
  }

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

  private async setOccupancyCounter(counter: OccupancyCounter, target: number): Promise<void> {
    const input = this.occupancyPopup.locator(`#${counter}`);
    const buttons = input.locator('xpath=..').locator('button');
    let current = Number(await input.getAttribute('aria-valuenow'));

    while (current !== target) {
      const step = current < target ? 1 : -1;

      await (step > 0 ? buttons.last() : buttons.first()).click();
      current += step;
      await expect(input).toHaveAttribute('aria-valuenow', String(current));
    }
  }
}
