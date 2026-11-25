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
  layout: {
    desktop: '@desktop',
    mobile: '@mobile',
  },
  owner: {
    annaSydoruk: '@anna.sydoruk',
    serhiiHoncharuk: '@serhii.honcharuk',
    dmytroAtchalko: '@dmytro.atchalko',
    olehBabenko: '@oleh.babenko',
  },
} as const;
