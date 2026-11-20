import { expect } from '@playwright/test';
import type { Account } from './accounts';

const API = 'https://api.deadsimple.email/v1';
const VERIFICATION_SENDER = 'noreply-iam@booking.com';
const CODE_PATTERN = /(?<![\p{L}\p{N}])[A-Z0-9]{6}(?![\p{L}\p{N}])/u;

type DseInboxList = { data?: { inboxes?: { inbox_id: string; email: string }[] } };
type DseMessage = {
  direction: 'inbound' | 'outbound';
  from_email: string;
  to: string[];
  subject?: string;
  created_at: string;
};
type DseMessageList = { data?: { messages?: DseMessage[] } };

const authHeaders = (apiKey: string) => ({ Authorization: `Bearer ${apiKey}` });

async function findInboxId({ email, apiKey }: Account): Promise<string> {
  const response = await fetch(`${API}/inboxes`, { headers: authHeaders(apiKey) });
  if (!response.ok) {
    throw new Error(`Dead Simple Email list inboxes failed: ${response.status} ${response.statusText}`);
  }
  const body = (await response.json()) as DseInboxList;
  const inbox = body.data?.inboxes?.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!inbox) throw new Error(`Dead Simple Email inbox ${email} not found for this API key`);
  return inbox.inbox_id;
}

async function listMessages(inboxId: string, apiKey: string): Promise<DseMessage[] | undefined> {
  const response = await fetch(
    `${API}/inboxes/${encodeURIComponent(inboxId)}/messages?limit=20&include_spam=true`,
    {
      headers: authHeaders(apiKey),
    },
  );
  if (response.status === 429) return undefined;
  if (!response.ok) {
    throw new Error(`Dead Simple Email list messages failed: ${response.status} ${response.statusText}`);
  }
  const body = (await response.json()) as DseMessageList;
  return body.data?.messages ?? [];
}

function isVerificationEmail(message: DseMessage, to: string, since: number): boolean {
  return (
    message.direction === 'inbound' &&
    message.from_email.toLowerCase() === VERIFICATION_SENDER &&
    message.to.some((address) => address.toLowerCase() === to.toLowerCase()) &&
    Date.parse(message.created_at) >= since
  );
}

export async function getVerificationCode({
  account,
  since,
  timeout = 60_000,
}: {
  account: Account;
  since: number;
  timeout?: number;
}): Promise<string> {
  const to = account.email;
  const inboxId = await findInboxId(account);
  let code: string | undefined;

  await expect
    .poll(
      async () => {
        const newest = ((await listMessages(inboxId, account.apiKey)) ?? [])
          .filter((message) => isVerificationEmail(message, to, since))
          .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
        for (const message of newest) {
          code = message.subject?.match(CODE_PATTERN)?.[0];
          if (code) return code;
        }
        return undefined;
      },
      { message: `Verification code email to ${to} was not received`, timeout, intervals: [5_000] },
    )
    .toBeDefined();

  return code as string;
}
