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

4. Create a `.env` file in the project root:

```
BASE_URL=<url-of-the-application-under-test>
```

## Available Scripts

| Script | Description |
|---|---|
| `npm test` | Run all tests on all Playwright projects |
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

## Project Structure

```
booking-automation/
├── tests/e2e/               Automated tests
├── utils/                   Shared helpers (viewports)
├── .husky/                  Git hooks
├── biome.json               Biome configuration
├── playwright.config.ts     Playwright configuration
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