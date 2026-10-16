import { test } from '@utils/fixtures';
import { formatOccupancy, getLvivSearch } from '@utils/testData/search';

test.describe('Search', () => {
  test.skip(({ isMobile }) => isMobile, 'Mobile search box is not supported yet');

  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('Test filling in "Destination" field', async ({ searchComponent }) => {
    await searchComponent.fillDestination('Lviv');
    await searchComponent.verifyDestinationValue('Lviv');
  });

  test('TC-SEARCH-001: Verify the search results match the search criteria', async ({
    searchComponent,
    searchResultsPage,
  }) => {
    const { destinationText, destination, checkIn, checkOut, occupancy } = getLvivSearch();
    const occupancyText = formatOccupancy(occupancy);

    await test.step('1. Type the destination text in the destination field', async () => {
      await searchComponent.fillDestination(destinationText);
      await searchComponent.verifySuggestion(0, destination.name, destination.region);
    });

    await test.step('2. Choose the destination from the suggestions', async () => {
      await searchComponent.selectSuggestion(0);
      await searchComponent.verifyDestinationValue(destination.fullName);
      await searchComponent.verifySuggestionsClosed();
      await searchComponent.verifyDatePickerOpened();
    });

    await test.step('3. Select the check-in and check-out dates in the date picker', async () => {
      await searchComponent.selectDates(checkIn, checkOut);
      await searchComponent.verifyDatesValue(checkIn, checkOut);
    });

    await test.step(`4. Set the occupancy to "${occupancyText}"`, async () => {
      await searchComponent.setOccupancy(occupancy);
      await searchComponent.verifyOccupancyValue(occupancyText);
    });

    await test.step('5. Click the "Search" button', async () => {
      await searchComponent.clickSearch();
      await searchResultsPage.verifyOpened();
      await searchResultsPage.verifyHeading(new RegExp(`^${destination.name}: [\\d,]+ properties found$`));
    });

    await test.step('6. Check the search form on the Search Results page', async () => {
      await searchComponent.verifyDestinationValue(destination.name);
      await searchComponent.verifyDatesValue(checkIn, checkOut);
      await searchComponent.verifyOccupancyValue(occupancyText);
    });
  });
});
