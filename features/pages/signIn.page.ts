import { errors, expect, type Locator, type Page, test } from '@playwright/test';
import { leftSignInPage } from '@utils/helpers/browser';
import { BasePage } from './base.page.js';

export class SignInPage extends BasePage {
  private readonly continueButton = this.page.getByRole('button', {
    name: 'Continue with email',
  });
  private readonly emailInput = this.page.getByRole('textbox', {
    name: 'Email address',
  });
  private readonly emailError = this.page.locator('#username-note');
  private readonly codeInputs = this.page.getByRole('textbox', {
    name: /Enter verification code character/,
  });
  private readonly verifyButton = this.page.getByRole('button', {
    name: 'Verify email',
  });
  private readonly continueToMobileSiteButton = this.page.getByTestId('gta-interstitial-secondary-cta-test');
  private readonly tooManyAttemptsAlert = this.page.getByRole('alert').filter({
    hasText: 'Too many attempts',
  });
  private readonly incorrectCodeAlert = this.page.getByRole('alert').filter({
    hasText: 'This code is incorrect',
  });
  private readonly requestNewCodeButton = this.page.getByRole('button', { name: 'Request new code' });
  private readonly accountButton: Locator;

  constructor(page: Page, isMobile: boolean) {
    super(page, 'https://account.booking.com/sign-in?lang=en-gb', isMobile);
    this.accountButton = isMobile
      ? page.getByTestId('header-profile')
      : page.getByRole('button', { name: /Your account menu/ });
  }

  override async open(): Promise<void> {
    await test.step('Open Sign In page', async () => {
      await super.open();
      await expect(this.emailInput).toBeVisible();
    });
  }

  async signInWithPasskey(): Promise<void> {
    await test.step('Sign in with the passkey', async () => {
      await super.open();
      await this.page.waitForURL(leftSignInPage);
      if (this.isMobile) {
        await this.dismissAppInterstitial();
      }
    });
  }

  async submitEmail(email: string): Promise<void> {
    await test.step(`Submit email "${email}"`, async () => {
      await this.emailInput.fill(email);
      await this.continueButton.click();
    });
  }

  async verifyEmailError(expectedText: string): Promise<void> {
    await test.step(`Verify email error "${expectedText}"`, async () => {
      await expect(this.emailError).toBeVisible();
      await expect(this.emailError).toHaveText(expectedText);
    });
  }

  async enterVerificationCode(code: string): Promise<void> {
    await test.step(`Enter verification code "${code}"`, async () => {
      await expect(this.codeInputs).toHaveCount(code.length);
      for (const [index, char] of [...code].entries()) {
        await this.codeInputs.nth(index).fill(char);
      }
      await this.verifyButton.click();
    });
  }

  async verifyCodeRejected(): Promise<void> {
    await test.step('Verify the code is rejected and can be entered again', async () => {
      await expect(this.incorrectCodeAlert).toBeVisible();
      await expect(this.page).not.toHaveURL(/auth_success=1/);
      await expect(this.verifyButton).toBeVisible();
    });
  }

  async requestNewCode(): Promise<void> {
    await test.step('Request a new verification code', async () => {
      await expect(this.requestNewCodeButton).toBeVisible({ timeout: 70_000 });
      await this.requestNewCodeButton.click();
    });
  }

  async verifySignedIn(): Promise<void> {
    await test.step('Verify user is signed in', async () => {
      try {
        await expect(this.page).toHaveURL(/auth_success=1/);
      } catch (error) {
        if (await this.tooManyAttemptsAlert.isVisible()) {
          throw new Error(
            'Booking rate-limited sign-in ("Too many attempts. Please try again later."). Wait 15–30 min and rerun.',
          );
        }
        throw error;
      }
      if (this.isMobile) {
        await this.dismissAppInterstitial();
      }
      await expect(this.accountButton).toBeVisible();
    });
  }

  async dismissAppInterstitial(): Promise<void> {
    await test.step('Dismiss "Get the app" modal if it appears', async () => {
      try {
        await this.continueToMobileSiteButton.waitFor({
          state: 'visible',
          timeout: 10_000,
        });
      } catch (error) {
        if (error instanceof errors.TimeoutError) {
          return;
        }
        throw error;
      }
      await this.continueToMobileSiteButton.click();
      await expect(this.continueToMobileSiteButton).toBeHidden();
    });
  }
}
