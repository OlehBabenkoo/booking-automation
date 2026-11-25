import type { SearchComponent } from '@features/components';
import { test } from '@utils/fixtures';
import {
  formatOccupancy,
  getLvivSearch,
  type SearchData,
  toSearchParams,
  toSearchSummaryPattern,
} from '@utils/testData/search';
import { TAG } from '@utils/testData/tags';

const fillSearchForm = async (searchComponent: SearchComponent, search: SearchData): Promise<void> => {
  const { destinationText, destination, checkIn, checkOut, occupancy } = search;
  const occupancyText = formatOccupancy(occupancy);

  await test.step('1. Type the destination text in the destination field', async () => {
    await searchComponent.fillDestination(destinationText);
    await searchComponent.verifySuggestion(destination.name, destination.region);
  });

  await test.step('2. Choose the destination from the suggestions', async () => {
    await searchComponent.selectSuggestion(destination.name, destination.region);
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
};

test.describe('Search', { tag: [TAG.type.regression, TAG.area.search, TAG.owner.annaSydoruk] }, () => {
  test.beforeEach(async ({ homePage, context }) => {
    await context.addInitScript(() => {
      Object.defineProperty(Navigator.prototype, 'webdriver', {
        get: () => false,
        configurable: true,
      });
    });

    await homePage.open();
  });

  test.describe('Desktop', { tag: TAG.layout.desktop }, () => {
    test('TC-SEARCH-001: Verify the search results match the search criteria', {
      tag: TAG.type.smoke,
    }, async ({ searchComponent, searchResultsPage }) => {
      const search = getLvivSearch();
      const { destination, checkIn, checkOut, occupancy } = search;

      await fillSearchForm(searchComponent, search);

      await test.step('5. Click the "Search" button', async () => {
        await searchComponent.clickSearch();
        await searchResultsPage.verifyOpened();
        await searchResultsPage.verifyHeading(new RegExp(`^${destination.name}: [\\d,]+ properties found$`));
      });

      await test.step('6. Check the search form on the Search Results page', async () => {
        await searchComponent.verifyDestinationValue(destination.name);
        await searchComponent.verifyDatesValue(checkIn, checkOut);
        await searchComponent.verifyOccupancyValue(formatOccupancy(occupancy));
      });
    });
  });

  test.describe('Mobile', { tag: TAG.layout.mobile }, () => {
    test('TC-SEARCH-001: Verify the search results match the search criteria', {
      tag: TAG.type.smoke,
    }, async ({ searchComponent, searchResultsPage }) => {
      const search = getLvivSearch();

      await fillSearchForm(searchComponent, search);

      await test.step('5. Click the "Search" button', async () => {
        await searchComponent.clickSearch();
        await searchResultsPage.verifyOpened();
        await searchResultsPage.verifyPropertyCardsVisible();
      });

      // On mobile the Search Results page collapses the search form into a summary bar
      await test.step('6. Check the search form on the Search Results page', async () => {
        await searchResultsPage.verifySearchSummary(toSearchSummaryPattern(search));
        await searchResultsPage.verifySearchParams(toSearchParams(search));
      });
    });
  });
});
