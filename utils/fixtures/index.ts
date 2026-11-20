import { mergeTests } from '@playwright/test';
import { accountSettingsFixture, authFixture, passkeyFixture } from './authFixture';
import { componentTest } from './componentFixture';
import { pageTest } from './pageFixture';
import { promoFixture } from './promoFixture';

export const test = mergeTests(componentTest, pageTest, promoFixture);
export const authTest = mergeTests(test, authFixture);
export const accountSettingsTest = mergeTests(test, accountSettingsFixture);
export const passkeyTest = mergeTests(test, passkeyFixture);

export { expect } from '@playwright/test';
