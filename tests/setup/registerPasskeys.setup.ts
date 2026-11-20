import { chmod } from 'node:fs/promises';
import { DesktopHeaderComponent } from '@features/components';
import { expect, test } from '@utils/fixtures';
import { passkeyAccount } from '@utils/helpers/accounts';
import { deviceStateFile, savePasskey } from '@utils/helpers/authState';
import { hideWebdriverFlag } from '@utils/helpers/browser';
import { getVerificationCode } from '@utils/helpers/deadSimpleEmail';
import { signInWithEmailCode } from '@utils/helpers/signIn';

test('Register a passkey for the passkey account', async ({
  context,
  page,
  signInPage,
  securitySettingsPage,
}) => {
  test.slow();

  const account = passkeyAccount();
  await hideWebdriverFlag(context);
  await context.credentials.install();

  await test.step(`Sign in as ${account.email} with a verification code from email`, async () => {
    await signInWithEmailCode(signInPage, account);
  });

  await test.step('Add a passkey in Security settings and save it', async () => {
    await securitySettingsPage.open();
    const since = Date.now();
    await securitySettingsPage.startAddingPasskey();
    await securitySettingsPage.confirmEnrollmentWithCode(await getVerificationCode({ account, since }));

    await expect
      .poll(async () => (await context.credentials.get()).length, {
        message: 'Booking did not register a passkey in the virtual authenticator',
      })
      .toBe(1);
    const [passkey] = await context.credentials.get();
    await savePasskey(account, passkey);
  });

  await test.step('Sign out and save the browser state Booking needs to offer the passkey', async () => {
    await page.goto('/');
    await new DesktopHeaderComponent(page).signOut();
    await context.storageState({ path: deviceStateFile(account) });
    await chmod(deviceStateFile(account), 0o600);
  });
});
