import { expect, Page, test } from '@playwright/test';
import type { TestDate } from '@utils/dates';
import { formatOccupancy, type Occupancy } from '@utils/testData/search';
import { BaseComponent } from './base.component';

type OccupancyCounter = 'group_adults' | 'group_children' | 'no_rooms';

export class SearchComponent extends BaseComponent {
  private readonly destinationInput = this.root.locator('#searchbox-horizontal-destination-input');
  private readonly suggestionsList = this.page.locator('#autocomplete-results');
  private readonly suggestion = (name: string, region: string) =>
    this.suggestionsList.getByRole('option', { name: `${name} ${region}`, exact: true });
  private readonly datePicker = this.page.getByTestId('searchbox-datepicker-calendar');
  private readonly dateCell = (date: TestDate) => this.datePicker.locator(`[data-date="${date.iso}"]`);
  private readonly checkInDisplay = this.root.getByTestId('date-display-field-start');
  private readonly checkOutDisplay = this.root.getByTestId('date-display-field-end');
  private readonly occupancyButton = this.root.getByTestId('occupancy-config');
  private readonly occupancyPopup = this.page.getByTestId('occupancy-popup');
  private readonly occupancyDoneButton = this.occupancyPopup.getByRole('button', { name: 'Done' }); // TODO: language-dependent locator, works only for English UI
  private readonly searchButton = this.root.locator('button[type="submit"]');

  constructor(page: Page) {
    super(page, 'form:has(#searchbox-horizontal-destination-input)');
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
    });
  }

  public async verifyDatesValue(checkIn: TestDate, checkOut: TestDate): Promise<void> {
    await test.step(`Verify dates field shows "${checkIn.display} — ${checkOut.display}"`, async () => {
      await expect(this.checkInDisplay).toHaveText(checkIn.displayPattern);
      await expect(this.checkOutDisplay).toHaveText(checkOut.displayPattern);
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
