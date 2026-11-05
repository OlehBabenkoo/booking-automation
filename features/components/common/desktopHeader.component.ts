import { expect, test } from '@playwright/test';
import { HEADER_TRANSLATIONS, type Language } from '@utils/testData/languages';
import { HeaderComponent } from './header.component';

export class DesktopHeaderComponent extends HeaderComponent {
  protected readonly languagePickerButton = this.root.getByTestId('header-language-picker-trigger');
  protected readonly languageModal = this.page.getByTestId('selection-modal');
  private readonly listPropertyButton = this.root.getByTestId('header-custom-action-button');
  private readonly signUpButton = this.root.getByTestId('header-sign-up-button');
  private readonly signInButton = this.root.getByTestId('header-sign-in-button');

  protected async revealLanguagePicker(): Promise<void> {
    // The language picker is always visible in the desktop header
  }

  async checkRegistrationTranslation(language: Language): Promise<void> {
    await test.step(`Verify registration bar is translated into ${language}`, async () => {
      const texts = HEADER_TRANSLATIONS[language];

      const checks = [
        { locator: this.listPropertyButton, expected: texts.listProperty },
        { locator: this.signUpButton, expected: texts.signUp },
        { locator: this.signInButton, expected: texts.signIn },
      ];

      for (const { locator, expected } of checks) {
        await expect(locator).toHaveText(expected);
      }
    });
  }
}
