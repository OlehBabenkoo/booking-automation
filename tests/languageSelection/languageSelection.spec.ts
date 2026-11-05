import { DesktopHeaderComponent } from '@features/components';
import { test } from '@utils/fixtures';
import { LANGUAGES } from '@utils/testData/languages';

test.describe('Language Selector', () => {
  test.slow(({ browserName }) => browserName === 'webkit', 'Booking renders slowly in WebKit');

  const englishGB = LANGUAGES.englishGB;
  const ukrainian = LANGUAGES.ukrainian;
  const expectedUaUrl = '/index.uk.html';

  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('TC-LANG-001 - Verify the language selector shows suggested and all languages, marks the language in use, and keeps it when closed without a choice', async ({
    headerComponent,
    languageSelectionModal,
    searchComponent,
  }) => {
    await test.step('1. Click the language selector button in the header', async () => {
      await headerComponent.openLanguageSelectionModal();
    });

    await test.step('2. Check the groups in the dialog', async () => {
      await languageSelectionModal.checkLanguageGroupsAreVisibleAndNotEmpty();
    });

    await test.step('3. Find "English (UK)" and "Українська" in the "All languages" group.', async () => {
      await languageSelectionModal.checkLanguageInAllLanguages(englishGB.code);
      await languageSelectionModal.checkLanguageInAllLanguages(ukrainian.code);
    });

    await test.step('4. Check which language is marked.', async () => {
      await languageSelectionModal.checkIfLanguageIsSelected(englishGB.code);
    });

    await test.step('5. Click the close (X) button without choosing a language', async () => {
      await languageSelectionModal.closeLanguageModalAndVerifyPageIsNotReloaded();
    });

    await test.step('6. Check the header and the search form', async () => {
      await headerComponent.checkLanguageInHeader(englishGB.code);
      await searchComponent.checkSearchButtonText(englishGB.code);
    });
  });

  test('TC-LANG-002 - Verify choosing Ukrainian applies it to the header and the search form and the selector marks it as the language in use', async ({
    homePage,
    headerComponent,
    languageSelectionModal,
    searchComponent,
  }) => {
    await test.step('1. Click the language selector button in the header', async () => {
      await headerComponent.openLanguageSelectionModal();
    });

    await test.step('2. Click "Українська" in the "All languages" group', async () => {
      await languageSelectionModal.selectLanguageAndVerifyPageIsReloaded(ukrainian.code);
      await homePage.checkUrl(expectedUaUrl);
    });

    await test.step('3. Check the texts of the header and the search form', async () => {
      await headerComponent.checkLanguageInHeader(ukrainian.code);
      // The registration bar is shown only in the desktop header
      if (headerComponent instanceof DesktopHeaderComponent) {
        await headerComponent.checkRegistrationTranslation(ukrainian.code);
      }
      await headerComponent.checkMenubarTranslations(ukrainian.code);
      await searchComponent.checkSearchBoxTranslations(ukrainian.code);
    });

    await test.step('4. Click the language selector button in the header.', async () => {
      await headerComponent.openLanguageSelectionModal();
      await languageSelectionModal.checkIfLanguageIsSelected(ukrainian.code);
      await languageSelectionModal.checkIfLanguageIsNotSelected(englishGB.code);
    });
  });
});
