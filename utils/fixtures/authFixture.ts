import { existsSync } from 'node:fs';
import { chmod, open, rename, rm, stat } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';
import { SignInPage } from '@features/pages';
import { type APIRequest, type Browser, test as base, type FullProject } from '@playwright/test';
import { type Account, passkeyAccount, settingsAccount, sharedAccount } from '@utils/helpers/accounts';
import { deviceStateFile, loadPasskey, passkeyFile, sessionFile } from '@utils/helpers/authState';
import { hideWebdriverFlag } from '@utils/helpers/browser';
import { signInWithEmailCode } from '@utils/helpers/signIn';

const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;
const LOCK_STALE_MS = 3 * 60 * 1000;
const HOME_URL = 'https://www.booking.com/index.en-gb.html';

function contextOptions(projectUse: FullProject['use']) {
  const { viewport, userAgent, deviceScaleFactor, isMobile, hasTouch, locale, baseURL } = projectUse;
  return { viewport, userAgent, deviceScaleFactor, isMobile, hasTouch, locale, baseURL };
}

async function withLock(file: string, fn: () => Promise<void>): Promise<void> {
  const lock = `${file}.lock`;
  for (;;) {
    try {
      await (await open(lock, 'wx')).close();
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      const age = await stat(lock).then(
        (s) => Date.now() - s.mtimeMs,
        () => 0,
      );
      if (age > LOCK_STALE_MS) await rm(lock, { force: true });
      await sleep(1_000);
    }
  }
  try {
    await fn();
  } finally {
    await rm(lock, { force: true });
  }
}

async function isUsable(request: APIRequest, file: string, userAgent?: string): Promise<boolean> {
  const age = await stat(file).then(
    (s) => Date.now() - s.mtimeMs,
    () => Number.POSITIVE_INFINITY,
  );
  if (age > SESSION_MAX_AGE_MS) return false;
  const context = await request.newContext({ storageState: file, userAgent });
  try {
    return (await (await context.get(HOME_URL)).text()).includes('data-testid="header-profile"');
  } finally {
    await context.dispose();
  }
}

async function createSession(
  browser: Browser,
  projectUse: FullProject['use'],
  account: Account,
  file: string,
): Promise<void> {
  const context = await browser.newContext(contextOptions(projectUse));
  try {
    await hideWebdriverFlag(context);
    await signInWithEmailCode(new SignInPage(await context.newPage(), !!projectUse.isMobile), account);
    const tmp = `${file}.${process.pid}.tmp`;
    await context.storageState({ path: tmp });
    await chmod(tmp, 0o600);
    await rename(tmp, file);
  } finally {
    await context.close();
  }
}

function savedSessionFixture(accountFor: (project: string) => Account) {
  return base.extend<object, { sessionState: string }>({
    sessionState: [
      async ({ browser, playwright }, use, workerInfo) => {
        const projectUse = workerInfo.project.use;
        const account = accountFor(workerInfo.project.name);
        const file = sessionFile(account);
        await withLock(file, async () => {
          if (!(await isUsable(playwright.request, file, projectUse.userAgent))) {
            await createSession(browser, projectUse, account, file);
          }
        });
        await use(file);
      },
      { scope: 'worker', timeout: 180_000 },
    ],
    storageState: async ({ sessionState }, use) => {
      await use(sessionState);
    },
  });
}

export const authFixture = savedSessionFixture(sharedAccount);

export const accountSettingsFixture = savedSessionFixture(settingsAccount);

export const passkeyFixture = base.extend({
  storageState: async ({}, use) => {
    const account = passkeyAccount();
    if (!existsSync(passkeyFile(account)) || !existsSync(deviceStateFile(account))) {
      throw new Error(
        'No passkey in .auth/: run npm run auth:passkey (CI: set PASSKEY_JSON and PASSKEY_DEVICE_JSON)',
      );
    }
    await use(deviceStateFile(account));
  },
  context: async ({ context }, use) => {
    await hideWebdriverFlag(context);
    await loadPasskey(context, passkeyAccount());
    await use(context);
  },
});
