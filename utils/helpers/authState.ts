import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { BrowserContext } from '@playwright/test';
import type { Account } from './accounts';

export const AUTH_DIR = path.resolve(__dirname, '../../.auth');

type Passkey = Awaited<ReturnType<BrowserContext['credentials']['get']>>[number];

export const sessionFile = (account: Account) => path.join(AUTH_DIR, `session-${account.id}.json`);

export const passkeyFile = (account: Account) => path.join(AUTH_DIR, `passkey-${account.id}.json`);

export const deviceStateFile = (account: Account) => path.join(AUTH_DIR, `device-${account.id}.json`);

export async function savePasskey(account: Account, passkey: Passkey): Promise<void> {
  await mkdir(AUTH_DIR, { recursive: true });
  await writeFile(passkeyFile(account), JSON.stringify(passkey, null, 2), { mode: 0o600 });
}

export async function loadPasskey(context: BrowserContext, account: Account): Promise<void> {
  const { rpId, id, privateKey, publicKey, userHandle } = JSON.parse(
    await readFile(passkeyFile(account), 'utf8'),
  ) as Passkey;
  await context.credentials.create(rpId, { id, privateKey, publicKey, userHandle });
  await context.credentials.install();
}
