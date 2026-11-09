/** Playwright test tags: filter runs with `--grep`, e.g. `npx playwright test --grep @smoke`. */
export const TAG = {
  smoke: '@smoke',
  regression: '@regression',

  search: '@search',
  language: '@language',
} as const;
