import type { SignInPage } from '@features/pages';
import type { Account } from './accounts';
import { getVerificationCode } from './deadSimpleEmail';

export async function signInWithEmailCode(signInPage: SignInPage, account: Account): Promise<void> {
  await signInPage.open();
  const since = Date.now();
  await signInPage.submitEmail(account.email);
  await signInPage.enterVerificationCode(await getVerificationCode({ account, since }));
  await signInPage.verifySignedIn();
}
