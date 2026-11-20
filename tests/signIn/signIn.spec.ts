import { test } from '@utils/fixtures';
import { signInAccount } from '@utils/helpers/accounts';
import { hideWebdriverFlag } from '@utils/helpers/browser';
import { getVerificationCode } from '@utils/helpers/deadSimpleEmail';
import { signInWithEmailCode } from '@utils/helpers/signIn';
import { INVALID_EMAIL_CASES } from '@utils/testData/signIn';

test.describe('Sign In', () => {
  test.beforeEach(async ({ context, signInPage }) => {
    await hideWebdriverFlag(context);
    await signInPage.open();
  });

  for (const testCase of INVALID_EMAIL_CASES) {
    test(`TC-SIGNIN-001: Verify error for ${testCase.title}`, {
      tag: '@FR-SIGNIN-002',
    }, async ({ signInPage }) => {
      await test.step('1. Enter email and click "Continue with email"', async () => {
        await signInPage.submitEmail(testCase.email);
      });

      await test.step('2. Check the error message', async () => {
        await signInPage.verifyEmailError(testCase.expectedError);
      });
    });
  }

  test(
    'TC-SIGNIN-002: Sign in with a verification code from email',
    { tag: ['@otp', '@FR-SIGNIN-001', '@FR-SIGNIN-003'] },
    async ({ signInPage }, testInfo) => {
      test.slow();

      const account = signInAccount(testInfo.project.name);
      let since = 0;
      let code = '';

      await test.step('1. Enter email and click "Continue with email"', async () => {
        since = Date.now();
        await signInPage.submitEmail(account.email);
      });

      await test.step('2. Get the verification code from email', async () => {
        code = await getVerificationCode({ account, since });
      });

      await test.step('3. Enter the code and click "Verify email"', async () => {
        await signInPage.enterVerificationCode(code);
      });

      await test.step('4. Check the user is signed in', async () => {
        await signInPage.verifySignedIn();
      });
    },
  );

  test(
    'TC-SIGNIN-003: Incorrect verification code is rejected and the user can try again',
    { tag: ['@otp', '@FR-SIGNIN-004'] },
    async ({ signInPage }, testInfo) => {
      test.slow();

      const account = signInAccount(testInfo.project.name);
      let since = 0;
      let code = '';

      await test.step('1. Enter email and click "Continue with email"', async () => {
        since = Date.now();
        await signInPage.submitEmail(account.email);
      });

      await test.step('2. Get the verification code from email', async () => {
        code = await getVerificationCode({ account, since });
      });

      await test.step('3. Enter a code that differs from the real one in every character', async () => {
        const incorrectCode = [...code].map((char) => (char === 'A' ? 'B' : 'A')).join('');
        await signInPage.enterVerificationCode(incorrectCode);
      });

      await test.step('4. Check the code is rejected', async () => {
        await signInPage.verifyCodeRejected();
      });

      await test.step('5. Enter the correct code and check the user is signed in', async () => {
        await signInPage.enterVerificationCode(code);
        await signInPage.verifySignedIn();
      });
    },
  );

  test(
    'TC-SIGNIN-004: User can request a new verification code and sign in with it',
    { tag: ['@otp', '@FR-SIGNIN-005'] },
    async ({ signInPage }, testInfo) => {
      test.setTimeout(180_000);

      const account = signInAccount(testInfo.project.name);
      let since = 0;
      let code = '';

      await test.step('1. Enter email and wait for the first code', async () => {
        since = Date.now();
        await signInPage.submitEmail(account.email);
        await getVerificationCode({ account, since });
      });

      await test.step('2. Request a new code and wait for a new email', async () => {
        since = Date.now();
        await signInPage.requestNewCode();
        code = await getVerificationCode({ account, since });
      });

      await test.step('3. Enter the code from the new email and check the user is signed in', async () => {
        await signInPage.enterVerificationCode(code);
        await signInPage.verifySignedIn();
      });
    },
  );

  test(
    'TC-SIGNIN-005: Signed-in user can sign out, ending the session',
    { tag: ['@otp', '@FR-SIGNIN-008'] },
    async ({ page, signInPage, headerComponent }, testInfo) => {
      test.slow();

      await test.step('1. Sign in with a verification code from email', async () => {
        await signInWithEmailCode(signInPage, signInAccount(testInfo.project.name));
      });

      await test.step('2. Sign out via the profile menu', async () => {
        await headerComponent.signOut();
      });

      await test.step('3. Reload and check the user is still signed out', async () => {
        await page.reload();
        await headerComponent.verifySignedOut();
      });
    },
  );
});
