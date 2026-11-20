import type { BrowserContext, Locator } from '@playwright/test';

export async function hideWebdriverFlag(context: BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'webdriver', {
      get: () => false,
      configurable: true,
    });
  });
}

// WebKit on Linux (CI) has no native WebAuthn; Playwright's stand-in tells the page passkeys are unsupported,
// so Booking never asks for one. Must run before context.credentials.install().
export async function provideWebAuthnApi(context: BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    if (typeof globalThis.PublicKeyCredential === 'function') return;
    const toBuffer = (base64url: string) => {
      let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0)).buffer;
    };
    type CredentialDescriptorJSON = { id: string };
    function PublicKeyCredential() {
      throw new TypeError('Illegal constructor');
    }
    Object.assign(PublicKeyCredential, {
      isConditionalMediationAvailable: async () => true,
      isUserVerifyingPlatformAuthenticatorAvailable: async () => true,
      getClientCapabilities: async () => ({
        conditionalGet: true,
        conditionalCreate: true,
        passkeyPlatformAuthenticator: true,
        userVerifyingPlatformAuthenticator: true,
      }),
      parseRequestOptionsFromJSON: (options: {
        challenge: string;
        allowCredentials?: CredentialDescriptorJSON[];
      }) => ({
        ...options,
        challenge: toBuffer(options.challenge),
        allowCredentials: (options.allowCredentials ?? []).map((c) => ({ ...c, id: toBuffer(c.id) })),
      }),
      parseCreationOptionsFromJSON: (options: {
        challenge: string;
        user: { id: string };
        excludeCredentials?: CredentialDescriptorJSON[];
      }) => ({
        ...options,
        challenge: toBuffer(options.challenge),
        user: { ...options.user, id: toBuffer(options.user.id) },
        excludeCredentials: (options.excludeCredentials ?? []).map((c) => ({ ...c, id: toBuffer(c.id) })),
      }),
    });
    Object.defineProperty(globalThis, 'PublicKeyCredential', {
      value: PublicKeyCredential,
      configurable: true,
      writable: true,
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
