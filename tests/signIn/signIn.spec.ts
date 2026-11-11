import { test } from '@utils/fixtures';
import { INVALID_EMAIL_CASES } from '@utils/testData/signIn';

test.describe('Sign In', () => {
  test.beforeEach(async ({ signInPage }) => {
    await signInPage.open();
  });

  for (const testCase of INVALID_EMAIL_CASES) {
    test(`TC-SIGNIN-001: Verify error for ${testCase.title}`, async ({ signInPage }) => {
      await test.step('1. Enter email and click "Continue with email"', async () => {
        await signInPage.submitEmail(testCase.email);
      });

      await test.step('2. Check the error message', async () => {
        await signInPage.verifyEmailError(testCase.expectedError);
      });
    });
  }
});
