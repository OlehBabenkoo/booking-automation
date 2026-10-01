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

## Project sctucture
booking-automation/
├── src/        Source TypeScript code
├── tests/      Automated tests
├── .husky/     Git hooks
├── biome.json  Biome configuration
├── package.json
├── tsconfig.json
└── README.md (http://readme.md/)


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