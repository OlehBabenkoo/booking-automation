# Booking Automation

Playwright + TypeScript end-to-end tests.

## Prerequisites

- Node.js 26 or higher
- npm
- Google Chrome (the `chrome-*` projects run on the installed Chrome channel)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd booking-automation
```

2. Install dependencies (this also sets up Git hooks via Husky):

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
npx playwright install chrome
```

4. Copy `.env.example` to `.env` and fill it in. Every variable is described in
   [Test Accounts and Sign-In](#test-accounts-and-sign-in). `.env` is git-ignored: never commit it.

```bash
cp .env.example .env
```

## Available Scripts

| Script | Description |
|---|---|
| `npm test` | Run all tests on all Playwright projects, except `@otp` |
| `npm run test:otp` | Run the email-code sign-in tests (`@otp`), one at a time |
| `npm run auth:passkey` | Register the passkey for the passkey test (one-off, headed) |
| `npm run test:ui` | Run tests in Playwright UI mode |
| `npm run tsc` | TypeScript compilation check (no emit) |
| `npm run check` | Biome lint + format + import order check (read-only) |
| `npm run lint` | Biome lint, applies safe fixes (`--write`) |
| `npm run format` | Biome format, rewrites files (`--write`) |

## Running Tests

`npm test` runs every test on four Playwright projects:

| Project | Device profile | Viewport |
|---|---|---|
| `chrome-desktop` | Desktop Chrome | 1920×1080 |
| `chrome-mobile` | Pixel 7 | 412×915 (device native) |
| `safari-desktop` | Desktop Safari (WebKit) | 1920×1080 |
| `safari-mobile` | iPhone XR (WebKit) | 414×896 (device native) |

Run a single project:

```bash
npx playwright test --project=chrome-desktop
```

Note: `safari-*` projects use Playwright's WebKit build, which is not real Safari.

### Tags

| Tag | Meaning |
|---|---|
| `@otp` | Signs in with a real email code. Skipped by `npm test`; run with `npm run test:otp` |
| `@passkey` | Signs in with the registered passkey; skipped if no passkey is registered |
| `@FR-<FEATURE>-<NNN>` | SRS requirement the test covers, for the Traceability Matrix |

Run the tests of one requirement:

```bash
npx playwright test --grep @FR-SIGNIN-002
```

## Test Accounts and Sign-In

### Accounts

Tests never hard-code an account: they ask for one by role (`utils/helpers/accounts.ts`), and every role
reads its inbox from `.env`. Inboxes are [Dead Simple Email](https://deadsimple.email) inboxes, read through
its REST API to get Booking's verification codes (`utils/helpers/deadSimpleEmail.ts`).

| Role | `.env` variables | Used by |
|---|---|---|
| Sign-in, one per project | `DSE_EMAIL_<PROJECT>` | `@otp` tests: sign in with a code, wrong code, new code, sign out |
| Shared session | `DSE_EMAIL_SHARED` | `authTest`: every other test that needs a signed-in user |
| Account settings, one per project | `DSE_EMAIL_SETTINGS_<PROJECT>` | `accountSettingsTest`: tests that change account-wide data |
| Passkey | the `chrome-desktop` sign-in account | `passkeyTest`: TC-SIGNIN-006 |

`<PROJECT>` is the project name in upper case: `CHROME_DESKTOP`, `CHROME_MOBILE`, `SAFARI_DESKTOP`, `SAFARI_MOBILE`.
The inboxes use `DSE_API_KEY`; settings inboxes use `DSE_API_KEY_SETTINGS` if it is set.
A Booking account is created automatically the first time its inbox signs in with a code.

Why the accounts are split this way:

- Booking limits sign-ins per mailbox ("Too many attempts"), so each project signs in to its own account.
- Tests that change account-wide data (profile, display settings) run on the project's own account, so
  parallel projects and the shared session never see the change. They must restore what they change.
- Language and currency chosen in the header are stored in the browser, not the account, so they are safe anywhere.
- Never run two test runs against the same set of inboxes at the same time: they would read each other's codes.

### Fixtures

| Fixture | Starts the test | Notes |
|---|---|---|
| `test` | signed out | default |
| `authTest` | signed in to the shared account | must not sign out or change account-wide data |
| `accountSettingsTest` | signed in to the project's settings account | must restore what it changes |
| `passkeyTest` | signed out, holding the passkey | Booking signs it in on the Sign in page |

`authTest` and `accountSettingsTest` sign in once with an email code, save the session to `.auth/` and reuse it
across tests and runs. Before using a saved session they check it is still signed in and less than 12 hours old,
otherwise one worker signs in again while the others wait.

### Passkey

Booking accepts a passkey from Playwright's virtual authenticator, but ends these sessions within ~3–4 minutes,
while email-code sessions survive being saved and reused. So passkeys are only used for the short passkey
sign-in test, and saved sessions always come from an email code.

Booking offers the passkey only to a browser that enrolled it, so registration saves both the passkey and that
browser's signed-out state. Register again if the passkey test starts getting an email code instead:

```bash
npm run auth:passkey
```

It costs two email codes (sign-in and enrollment confirmation).

### Saved state

Everything lives in `.auth/` (git-ignored: it holds private keys and session cookies):

| File | Content |
|---|---|
| `session-<account>.json` | Saved signed-in session (created and refreshed automatically) |
| `passkey-<account>.json` | Passkey private key |
| `device-<account>.json` | Signed-out browser state Booking needs to offer the passkey |

Deleting a session file is always safe: the next run signs in again.

### Booking quirks handled by the framework

- Automated browsers get a CAPTCHA on sign-in; `hideWebdriverFlag()` hides `navigator.webdriver`.
- Server-rendered widgets ignore clicks until React is ready; `waitForInteractive()` waits for that.
- Marketing dialogs cover the page: `DiscountOfferModal` closes the discount offer in `BasePage.open()`,
  `promoFixture` closes seasonal deal sheets (e.g. Black Friday) on any page.

## Project Structure

```
booking-automation/
├── features/
│   ├── components/              Page components (header, search, modals)
│   └── pages/                   Page Objects
├── tests/
│   ├── languageSelection/
│   ├── search/
│   ├── signIn/                  Sign-in, sign-out and passkey tests
│   └── setup/                   Passkey registration (npm run auth:passkey)
├── utils/
│   ├── fixtures/                test, authTest, accountSettingsTest, passkeyTest
│   ├── helpers/                 Accounts, email codes, saved state, browser helpers
│   └── testData/
├── .auth/                       Saved sessions and passkey (git-ignored)
├── .github/workflows/           CI
├── .husky/                      Git hooks
├── playwright.config.ts         Main configuration (excludes @otp)
├── playwright.otp.config.ts     @otp tests, one at a time
├── playwright.passkeys.config.ts  Passkey registration
├── biome.json
├── tsconfig.json
└── package.json
```

## Git Conventions

`main` is protected and always green. All changes go through Pull Requests.
Direct commits to `main` are blocked by a Git hook.

### Branch names

Format: `<type>/<short-description>`: lowercase kebab-case, up to 50 characters.

| Type | Use for |
|---|---|
| `feat` | New tests, page objects, services |
| `fix` | Fixing a broken or flaky test |
| `chore` | Dependencies, configs, CI, tooling |
| `refactor` | Restructuring with no behavior change |
| `docs` | README and documentation |

Example: `feat/search-results-sorting`

One branch = one task. Create branches from the latest `main`.

### Commit messages

[Conventional Commits](https://www.conventionalcommits.org/). The commit type must match the branch type. Scope is optional, the header is up to 72 characters.

```
feat(searchResults): implement sorting test
chore(ci): configure new workflow
```

## Git Hooks

Hooks are installed automatically by `npm install` (Husky).

| Hook | What it does |
|---|---|
| `pre-commit` | Validates the branch name, blocks commits to `main`, runs Biome on staged files (`lint-staged`) |
| `commit-msg` | Validates the commit message format and that its type matches the branch type |
| `pre-push` | Runs `npm run tsc` and `npm run check` on the whole project |

To run the pre-push checks manually:

```bash
npm run tsc && npm run check
```