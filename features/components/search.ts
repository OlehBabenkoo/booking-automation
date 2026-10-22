import { expect, Page, test } from '@playwright/test';
import type { TestDate } from '@utils/dates';
import { formatOccupancy, type Occupancy } from '@utils/testData/search';
import { BaseComponent } from './base.component';

type OccupancyCounter = 'group_adults' | 'group_children' | 'no_rooms';

export class SearchComponent extends BaseComponent {
  private readonly destinationInput = this.root.locator('#searchbox-horizontal-destination-input');
  private readonly suggestionsList = this.page.locator('#autocomplete-results');
  private readonly suggestions = this.suggestionsList.getByRole('option');
  private readonly datePicker = this.page.getByTestId('searchbox-datepicker-calendar');
  private readonly checkInDisplay = this.root.getByTestId('date-display-field-start');
  private readonly checkOutDisplay = this.root.getByTestId('date-display-field-end');
  private readonly occupancyButton = this.root.getByTestId('occupancy-config');
  private readonly occupancyPopup = this.page.getByTestId('occupancy-popup');
  private readonly occupancyDoneButton = this.occupancyPopup.getByRole('button', { name: 'Done' });
  private readonly searchButton = this.root.locator('button[type="submit"]');

  constructor(page: Page) {
    super(page, 'form[aria-label="Search properties"]');
  }

  public async fillDestination(value: string): Promise<void> {
    await test.step(`Fill in "Destination" input with "${value}" value`, async () => {
      await this.destinationInput.fill(value);
    });
  }

  public async verifyDestinationValue(value: string): Promise<void> {
    await test.step(`Verify "Destination" input has "${value}" value`, async () => {
      await expect(this.destinationInput).toHaveValue(value);
    });
  }

  public async verifySuggestion(index: number, name: string, region: string): Promise<void> {
    await test.step(`Verify suggestion #${index + 1} is "${name}" with "${region}" under it`, async () => {
      const suggestion = this.suggestions.nth(index);

      await expect(suggestion.getByText(name, { exact: true })).toBeVisible();
      await expect(suggestion.getByText(region, { exact: true })).toBeVisible();
    });
  }

  public async selectSuggestion(index: number): Promise<void> {
    await test.step(`Select suggestion #${index + 1}`, async () => {
      await this.suggestions.nth(index).click();
    });
  }

  public async verifySuggestionsClosed(): Promise<void> {
    await test.step('Verify suggestions list is closed', async () => {
      await expect(this.suggestions).toHaveCount(0);
    });
  }

  public async verifyDatePickerOpened(): Promise<void> {
    await test.step('Verify date picker is opened', async () => {
      await expect(this.datePicker).toBeVisible();
    });
  }

  public async selectDates(checkIn: TestDate, checkOut: TestDate): Promise<void> {
    await test.step(`Select "${checkIn.display}" - "${checkOut.display}" dates`, async () => {
      await this.datePicker.locator(`[data-date="${checkIn.iso}"]`).click();
      await this.datePicker.locator(`[data-date="${checkOut.iso}"]`).click();
    });
  }

  public async verifyDatesValue(checkIn: TestDate, checkOut: TestDate): Promise<void> {
    await test.step(`Verify dates field shows "${checkIn.display} — ${checkOut.display}"`, async () => {
      await expect(this.checkInDisplay).toHaveText(checkIn.display);
      await expect(this.checkOutDisplay).toHaveText(checkOut.display);
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

  public async verifyOccupancyValue(value: string): Promise<void> {
    await test.step(`Verify occupancy field shows "${value}"`, async () => {
      await expect(this.occupancyButton).toHaveText(value);
    });
  }

  public async clickSearch(): Promise<void> {
    await test.step('Click "Search" button', async () => {
      await this.searchButton.click();
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
