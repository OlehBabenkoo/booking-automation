/** Playwright test tags: filter runs with `--grep`, e.g. `npx playwright test --grep @smoke`. */
export const TAG = {
  type: {
    smoke: '@smoke',
    regression: '@regression',
  },
  area: {
    search: '@search',
    language: '@language',
  },
  owner: {
    annaSydoruk: '@anna.sydoruk',
    serhiiHoncharuk: '@serhii.honcharuk',
    dmytroAtchalko: '@dmytro.atchalko',
    olehBabenko: '@oleh.babenko',
  },
} as const;
