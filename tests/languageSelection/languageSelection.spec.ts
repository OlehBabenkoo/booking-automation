import { test } from '@utils/fixtures';
import { LANGUAGES } from '@utils/testData/languages';

test.describe('Language Selector', () => {
  const englishGB = LANGUAGES.englishGB;
  const ukrainian = LANGUAGES.ukrainian;
  const expectedUaUrl = '/index.uk.html';

  test.beforeEach(async ({ homePage, isMobile }) => {
    test.skip(isMobile === true, 'Mobile page objects are not implemented yet');
    await homePage.open();
  });

  test('TC-LANG-001 - Verify the language selector shows suggested and all languages, marks the language in use, and keeps it when closed without a choice', async ({
    homePage,
    isMobile,
  }) => {
    test.skip(isMobile === true, 'Mobile page objects are not implemented yet');

    await test.step('1. Click the language selector button in the header', async () => {
      await homePage.header.openLanguageSelectionModal();
    });

    await test.step('2. Check the groups in the dialog', async () => {
      await homePage.languageSelectionModal.checkLanguageGroupsAreVisibleAndNotEmpty();
    });

    await test.step('3. Find "English (UK)" and "Українська" in the "All languages" group.', async () => {
      await homePage.languageSelectionModal.checkLanguageInAllLanguages(englishGB.code);
      await homePage.languageSelectionModal.checkLanguageInAllLanguages(ukrainian.code);
    });

    await test.step('4. Check which language is marked.', async () => {
      await homePage.languageSelectionModal.checkIfLanguageIsSelected(englishGB.code);
    });

    await test.step('5. Click the close (X) button without choosing a language', async () => {
      await homePage.languageSelectionModal.closeLanguageModalAndVerifyPageIsNotReloaded();
    });

    await test.step('6. Check the header and the search form', async () => {
      await homePage.header.checkLanguageInHeader(englishGB.code);
      await homePage.search.checkSearchButtonText(englishGB.code);
    });
  });

  test('TC-LANG-002 - Verify choosing Ukrainian applies it to the header and the search form and the selector marks it as the language in use', async ({
    homePage,
    isMobile,
  }) => {
    test.skip(isMobile === true, 'Mobile page objects are not implemented yet');

    await test.step('1. Click the language selector button in the header', async () => {
      await homePage.header.openLanguageSelectionModal();
    });

    await test.step('2. Click "Українська" in the "All languages" group', async () => {
      await homePage.languageSelectionModal.selectLanguageAndVerifyPageIsReloaded(ukrainian.code);
      await homePage.checkUrl(expectedUaUrl);
    });

    await test.step('3. Check the texts of the header and the search form', async () => {
      await homePage.header.checkLanguageInHeader(ukrainian.code);
      await homePage.header.checkRegistrationTranslation(ukrainian.code);
      await homePage.header.checkMenubarTranslations(ukrainian.code);
      await homePage.search.checkSearchBoxTranslations(ukrainian.code);
    });

    await test.step('4. Click the language selector button in the header.', async () => {
      await homePage.header.openLanguageSelectionModal();
      await homePage.languageSelectionModal.checkIfLanguageIsSelected(ukrainian.code);
      await homePage.languageSelectionModal.checkIfLanguageIsNotSelected(englishGB.code);
    });
  });
});
