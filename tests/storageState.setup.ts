import { test as setup } from '@utils/fixtures/index';
import fs from 'fs';
import path from 'path';
import { storageStateFilePath } from '@utils/storageStatePath';

setup('Storage state setup', async ({ page, context, discountOfferModal }) => {
  await page.goto('/');
  await discountOfferModal.waitForModalToLoad();
  await discountOfferModal.dismissModal();

  const state = await context.storageState();
  const dir = path.dirname(storageStateFilePath);

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(storageStateFilePath, JSON.stringify(state, null, 2));
});
