# Booking Automation

## Prerequisites

- Node.js 26 or higher
- npm package manager

## Installation
1. Clone the repository:
```Bash
git clone <repository-url>
cd booking-automation
```

2. Install dependencies:
```Bash
npm install
```

3. Install Playwright browsers:
```Bash
npx playwright install
```
## Available Scripts

#TypeScript compilation check
```Bash
npm run tsc
```

#Format project files with Biome
```Bash
npm run format
```
#Run Biome linting
```Bash
npm run lint
```
#Run Biome formatting and linting checks
```Bash
npm run check
```

## Project Structure
booking-automation/
├── src/        Source TypeScript code
├── tests/      Automated tests
├── .husky/     Git hooks
├── biome.json  Biome configuration
├── package.json
├── tsconfig.json
└── README.md


## Running Playwright Tests

Playwright will be added in a later setup step.
After Playwright is configured, run tests with:

```Bash
npx playwright test
```
## Code Quality

The project uses Biome for formatting and linting.
Before each commit, Husky runs:

```Bash
npx lint-staged
```

lint-staged applies Biome checks to staged TypeScript and JavaScript files.
You can run the same checks manually with:
```Bash
npm run check
```

## Branching and Commit Strategy

### Main Branch

This project uses one default long-lived branch: `main`.

The `main` branch must remain green, deployable, and runnable. Changes may be merged into `main` only through a Pull Request.

### Branch Naming

Use the following format:

```text
<type>/<short-description>
```

Keep branch names under approximately 50 characters. Use one of these initial branch types:

- `feat/` - New tests, page objects, or services
- `fix/` - Fixes for broken or flaky tests
- `chore/` - Dependencies, configuration, CI, or tooling changes
- `refactor/` - Restructuring without behavior changes
- `docs/` - README and documentation changes

### Short-Lived Branches

- Create branches from the latest `main`, or from another short-lived branch when dependent work has not yet been merged.
- Keep one branch focused on one task or ticket.
- Merge short-lived branches back into `main` through a Pull Request.

### Commit Messages

Use Conventional Commits and align the commit type with the branch type:

```text
feat(searchResults): implement sorting test
chore(ci): configure new workflow
```