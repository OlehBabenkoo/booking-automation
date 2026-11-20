import type { BrowserContext, Locator } from '@playwright/test';

export async function hideWebdriverFlag(context: BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'webdriver', {
      get: () => false,
      configurable: true,
    });
  });
}

export async function waitForInteractive(locator: Locator): Promise<void> {
  await locator.waitFor();
  const element = await locator.elementHandle();
  await locator
    .page()
    .waitForFunction((el) => !!el && Object.keys(el).some((key) => key.startsWith('__reactProps$')), element);
}

export function leftSignInPage(url: URL): boolean {
  return url.hostname.endsWith('booking.com') && url.hostname !== 'account.booking.com';
}
