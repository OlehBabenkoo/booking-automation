import { mergeTests } from '@playwright/test';
import { componentTest } from './componentFixture';
import { pageTest } from './pageFixture';

export const test = mergeTests(componentTest, pageTest);

export { expect } from '@playwright/test';
