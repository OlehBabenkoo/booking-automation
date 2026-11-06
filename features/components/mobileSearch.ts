import { expect, Page } from '@playwright/test';
import { type Language, SEARCHBOX_TRANSLATIONS } from '@utils/testData/languages';
import { SearchComponent } from './search';

const notImplemented = (method: string): never => {
  throw new Error(
    `MobileSearchComponent.${method}() is not implemented yet: mobile search flow is not supported`,
  );
};

export class MobileSearchComponent extends SearchComponent {
  protected readonly destinationInput = this.root.getByTestId('searchbox-destination-input');
  protected readonly destinationContainer = this.root.locator('label', {
    has: this.page.getByTestId('searchbox-destination-input'),
  });
  private readonly datesButton = this.root.getByRole('button', { name: /^(Select dates|Виберіть дати)$/ });
  protected readonly occupancyContainer = this.root.getByRole('button', {
    name: /^(Select occupancy|Виберіть місткість)$/,
  });
  protected readonly searchButton = this.root.locator('button[type="submit"]');

  constructor(page: Page) {
    super(page.locator('#SearchBoxMobile form'));
  }

  // The mobile dates field is pre-filled with today/tomorrow, so only its translated title is checked
  protected async checkDatesTranslation(language: Language): Promise<void> {
    await expect(this.datesButton).toHaveAccessibleName(SEARCHBOX_TRANSLATIONS[language].searchBoxDatesTitle);
  }

  async fillDestination(): Promise<void> {
    notImplemented('fillDestination');
  }

  async verifyDestinationValue(): Promise<void> {
    notImplemented('verifyDestinationValue');
  }

  async verifySuggestion(): Promise<void> {
    notImplemented('verifySuggestion');
  }

  async selectSuggestion(): Promise<void> {
    notImplemented('selectSuggestion');
  }

  async verifySuggestionsClosed(): Promise<void> {
    notImplemented('verifySuggestionsClosed');
  }

  async verifyDatePickerOpened(): Promise<void> {
    notImplemented('verifyDatePickerOpened');
  }

  async selectDates(): Promise<void> {
    notImplemented('selectDates');
  }

  async verifyDatesValue(): Promise<void> {
    notImplemented('verifyDatesValue');
  }

  async setOccupancy(): Promise<void> {
    notImplemented('setOccupancy');
  }

  async verifyOccupancyValue(): Promise<void> {
    notImplemented('verifyOccupancyValue');
  }

  async clickSearch(): Promise<void> {
    notImplemented('clickSearch');
  }
}
