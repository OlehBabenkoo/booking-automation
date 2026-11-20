import { mergeTests } from '@playwright/test';
import { componentTest } from './componentFixture';
import { pageTest } from './pageFixture';
import { promoFixture } from './promoFixture';

export const test = mergeTests(componentTest, pageTest, promoFixture);

export { expect } from '@playwright/test';
