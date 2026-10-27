import { LANGUAGES } from '@utils/data/languages.js';
import { pageTest as test } from '../../utils/fixtures/pageFixtures.js';

test.describe('Language Selector', () => {
  const englishUS = LANGUAGES.englishUS;
  const englishGB = LANGUAGES.englishGB;
  const ukrainian = LANGUAGES.ukrainian;
  const expectedUaUrl = '/index.uk.html';

  test.beforeEach(async ({ homePage, isMobile }) => {
    test.skip(isMobile === true, 'Mobile page objects are not implemented yet');
    await homePage.open();
    await homePage.dismissSignInInfo(); //clean temporary method from homepage
  });

  test('TC-LANG-001 - Verify the language selector shows suggested and all languages, marks the language in use, and keeps it when closed without a choice', async ({
    homePage,
    isMobile,
  }) => {
    test.skip(isMobile === true, 'Mobile page objects are not implemented yet');
    await homePage.header.openLanguageSelectionModal();
    await homePage.languageSelectionModal.checkLanguageGroupsAreVisibleAndNotEmpty();
    await homePage.languageSelectionModal.checkLanguageInAllLanguages(englishGB.code);
    await homePage.languageSelectionModal.checkLanguageInAllLanguages(ukrainian.code);
    await homePage.languageSelectionModal.checkIfLanguageIsSelected(englishUS.code);
    await homePage.languageSelectionModal.closeLanguageModalAndVerifyPageIsNotReloaded();
    await homePage.header.checkLanguageInHeader(englishUS.code);
    await homePage.searchbox.checkSearchButtonText(englishUS.code);
    //await homePage.searchbox.checkDestinationContainerPlaceholderText(englishUS.code);
    // Placeholder Text changes every run and it`s dependent on the promotions
  });

  test('TC-LANG-002 - Verify choosing Ukrainian applies it to the header and the search form and the selector marks it as the language in use', async ({
    homePage,
    isMobile,
  }) => {
    test.skip(isMobile === true, 'Mobile page objects are not implemented yet');
    await homePage.header.openLanguageSelectionModal();
    await homePage.languageSelectionModal.selectLanguageAndVerifyPageIsReloaded(ukrainian.code);
    await homePage.checkUrl(expectedUaUrl);
    await homePage.header.checkLanguageInHeader(ukrainian.code);
    await homePage.header.checkRegistrationTranslation(ukrainian.code);
    await homePage.header.checkMenubarTranslations(ukrainian.code);
    // await homePage.heroBanner.checkHeroTitleTranslation(ukrainian.heroBannerTitle);
    //  hero title is changed randomly and we cannot cover all the cases
    await homePage.searchbox.checkSearchBoxTranslations(ukrainian.code);
    await homePage.header.openLanguageSelectionModal();
    await homePage.languageSelectionModal.checkIfLanguageIsSelected(ukrainian.code);
    await homePage.languageSelectionModal.checkIfLanguageIsNotSelected(englishUS.code);
  });
});
