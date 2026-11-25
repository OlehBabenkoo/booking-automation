import { expect, Page, test } from '@playwright/test';
import type { TestDate } from '@utils/dates';
import { type Language, SEARCHBOX_TRANSLATIONS } from '@utils/testData/languages';
import { SearchComponent } from './search';

export class DesktopSearchComponent extends SearchComponent {
  protected readonly destinationContainer = this.root.getByTestId('destination-container');
  protected readonly destinationInput = this.root.locator('#searchbox-horizontal-destination-input');
  private readonly datesContainer = this.root.getByTestId('searchbox-dates-container');
  private readonly checkInDisplay = this.root.getByTestId('date-display-field-start');
  private readonly checkOutDisplay = this.root.getByTestId('date-display-field-end');
  protected readonly occupancyContainer = this.root.locator('.b7c1d87e07'); //no other IDs or names
  protected readonly occupancyButton = this.root.getByTestId('occupancy-config');

  constructor(page: Page) {
    super(page.locator('form:has(#searchbox-horizontal-destination-input)'));
  }

  protected async checkDatesTranslation(language: Language): Promise<void> {
    await expect(this.datesContainer).toHaveText(SEARCHBOX_TRANSLATIONS[language].searchBoxDates);
  }

  public async fillDestination(value: string): Promise<void> {
    await test.step(`Fill in "Destination" input with "${value}" value`, async () => {
      await this.destinationInput.fill(value);
    });
  }

  public async verifyDatesValue(checkIn: TestDate, checkOut: TestDate): Promise<void> {
    await test.step(`Verify dates field shows "${checkIn.display} — ${checkOut.display}"`, async () => {
      await expect(this.checkInDisplay).toHaveText(checkIn.displayPattern);
      await expect(this.checkOutDisplay).toHaveText(checkOut.displayPattern);
    });
  }

  public async verifyOccupancyValue(value: string): Promise<void> {
    await test.step(`Verify occupancy field shows "${value}"`, async () => {
      await expect(this.occupancyButton).toHaveText(value);
    });
  }

  public async checkDestinationContainerPlaceholderText(language: Language): Promise<void> {
    await test.step(`Verify "Destination" placeholder for "${language}" language`, async () => {
      await expect(this.destinationInput).toHaveAttribute(
        'placeholder',
        SEARCHBOX_TRANSLATIONS[language].searchBoxDestinationPlaceholderText,
      );
    });
  }

  public async checkDestinationContainerTitle(expectedText: string): Promise<void> {
    await test.step(`Verify "Destination" container shows "${expectedText}"`, async () => {
      await expect(this.destinationContainer).toHaveText(expectedText);
    });
  }
}
