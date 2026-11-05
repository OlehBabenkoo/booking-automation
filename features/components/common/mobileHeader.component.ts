import { expect, test } from '@playwright/test';
import { HeaderComponent } from './header.component';

export class MobileHeaderComponent extends HeaderComponent {
  private readonly burgerMenuButton = this.root.getByTestId('header-mobile-menu-button');
  private readonly burgerMenu = this.page.getByTestId('header-mobile-menu-modal');
  protected readonly languagePickerButton = this.burgerMenu.getByTestId(
    'header-mobile-menu-language-picker-menu-item',
  );
  protected readonly languageModal = this.page.getByTestId('header-mobile-menu-language-picker-modal');

  protected async revealLanguagePicker(): Promise<void> {
    if (!(await this.burgerMenu.isVisible())) {
      await this.openBurgerMenu();
    }
  }

  async openBurgerMenu(): Promise<void> {
    await test.step('Open the burger menu', async () => {
      // After a language change Booking can ignore the first click while the page is still loading
      await expect(async () => {
        if (!(await this.burgerMenu.isVisible())) {
          await this.burgerMenuButton.click();
        }
        await expect(this.burgerMenu).toBeVisible({ timeout: 2_000 });
      }).toPass({ timeout: 15_000 });
    });
  }
}
