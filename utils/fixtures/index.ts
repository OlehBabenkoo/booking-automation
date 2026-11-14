import { mergeTests } from '@playwright/test';
import { componentTest } from './componentFixture';
import { pageTest } from './pageFixture';
import { baseTest } from './baseFixture';

export const test = mergeTests(componentTest, pageTest, baseTest);

export { expect } from '@playwright/test';
