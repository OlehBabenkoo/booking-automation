import { passkeyTest as test } from '@utils/fixtures';

test('TC-SIGNIN-006: User with a passkey signs in without a verification code', {
  tag: ['@passkey', '@FR-SIGNIN-009'],
}, async ({ signInPage, headerComponent }) => {
  test.slow();

  await test.step('1. Open the Sign in page and let Booking accept the passkey', async () => {
    await signInPage.signInWithPasskey();
  });

  await test.step('2. Check the user is signed in', async () => {
    await headerComponent.verifySignedIn();
  });
});
