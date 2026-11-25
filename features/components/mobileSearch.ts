import { expect, Page, test } from '@playwright/test';
import { type TestDate, toDateRangePattern } from '@utils/dates';
import { type Language, SEARCHBOX_TRANSLATIONS } from '@utils/testData/languages';
import { SearchComponent } from './search';

export class MobileSearchComponent extends SearchComponent {
  protected readonly destinationInput = this.root.getByTestId('searchbox-destination-input');
  // The form input is a read-only trigger covered by its label; typing happens in a separate sheet
  protected readonly destinationContainer = this.root.locator('label', {
    has: this.page.getByTestId('searchbox-destination-input'),
  });
  private readonly destinationSheetInput = this.page.locator('input[name="searchbox-destination"]');
  private readonly datesButton = this.root.getByRole('button', { name: /^(Select dates|Виберіть дати)$/ });
  private readonly datesValue = this.datesButton.locator('.SearchBoxTrigger_label');
  private readonly datesDoneButton = this.page
    .getByRole('dialog')
    .filter({ has: this.page.getByTestId('searchbox-datepicker') })
    .getByRole('button', { name: 'Done' }); // TODO: language-dependent locator, works only for English UI
  protected readonly occupancyContainer = this.root.getByRole('button', {
    name: /^(Select occupancy|Виберіть місткість)$/,
  });
  protected readonly occupancyButton = this.occupancyContainer;
  private readonly occupancyValue = this.occupancyContainer.locator('.SearchBoxTrigger_label');

  constructor(page: Page) {
    super(page.locator('#SearchBoxMobile form'));
  }

  // The mobile dates field is pre-filled with today/tomorrow, so only its translated title is checked
  protected async checkDatesTranslation(language: Language): Promise<void> {
    await expect(this.datesButton).toHaveAccessibleName(SEARCHBOX_TRANSLATIONS[language].searchBoxDatesTitle);
  }

  protected override async applyDates(): Promise<void> {
    await this.datesDoneButton.click();
    await expect(this.datePicker).toBeHidden();
  }

  public async fillDestination(value: string): Promise<void> {
    await test.step(`Fill in "Destination" input with "${value}" value`, async () => {
      // Booking shows the form before its script is ready, and an early tap only focuses the read-only input.
      // The search box writes its state to history.state once it can handle taps, so wait for that first
      await this.page.waitForFunction(
        () => history.state?.__webShellSearchBoxAutocompleteActive !== undefined,
      );
      await this.destinationContainer.click();
      await this.destinationSheetInput.fill(value);
    });
  }

  public async verifyDatesValue(checkIn: TestDate, checkOut: TestDate): Promise<void> {
    await test.step(`Verify dates field shows "${checkIn.display} - ${checkOut.display}"`, async () => {
      await expect(this.datesValue).toHaveText(toDateRangePattern(checkIn, checkOut));
    });
  }

  public async verifyOccupancyValue(value: string): Promise<void> {
    await test.step(`Verify occupancy field shows "${value}"`, async () => {
      await expect(this.occupancyValue).toHaveText(value);
    });
  }
}
