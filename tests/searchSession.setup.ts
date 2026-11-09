import fs from 'node:fs';
import path from 'node:path';
import { daysFromToday } from '@utils/dates';
import { test as setup } from '@utils/fixtures';
import { searchSessionFilePath } from '@utils/storageStatePath';

const MAX_ATTEMPTS = 10;
const CHECK_URL = `/searchresults.en-gb.html?${new URLSearchParams({
  dest_id: '-1044367',
  dest_type: 'city',
  checkin: daysFromToday(30).iso,
  checkout: daysFromToday(31).iso,
  group_adults: '1',
  no_rooms: '1',
  group_children: '0',
  lang: 'en-gb',
})}`;

setup('Search session setup', async ({ context, homePage, discountOfferModal }) => {
  setup.setTimeout(MAX_ATTEMPTS * 30_000);
  const statuses: number[] = [];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const found = await setup.step(`Attempt ${attempt}: start a new session and check search`, async () => {
      await context.clearCookies();
      await homePage.open();
      await discountOfferModal.waitForModalToLoad();
      await discountOfferModal.dismissModal();

      const response = await context.request.get(CHECK_URL, { maxRedirects: 0 });
      statuses.push(response.status());

      return response.status() === 200;
    });

    if (found) break;
  }

  if (statuses.at(-1) !== 200) {
    const message = `No session got search results in ${MAX_ATTEMPTS} attempts (statuses: ${statuses.join(', ')}). Search tests will likely hit the landing page.`;
    console.warn(message);
    setup.info().annotations.push({ type: 'warning', description: message });
  }

  fs.mkdirSync(path.dirname(searchSessionFilePath), { recursive: true });
  await context.storageState({ path: searchSessionFilePath });
});
