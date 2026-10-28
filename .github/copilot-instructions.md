# Copilot instructions for Vue3-WebDev-Kit

## Repository shape

This repository is a teaching kit rather than a single app. The actual work happens in self-contained projects under `web-projects/`:

- `web-projects/first-website/` is the introductory static HTML/CSS/JS exercise.
- `web-projects/flashword/` is the older, non-Vite version of the word-learning app.
- `web-projects/flashword-vite/` is the Vue 3 + Vite app used for the modern Vue tutorial.
- `web-projects/backend/db.json` acts as the mock API data source for the Vite app (`/api/words` in the browser).

The repo root mainly contains course materials, tooling, and automation (`README.md`, `CONTRIBUTING.md`, `docs/`, `.github/`, linting config). Prefer app-local commands when working inside a project directory rather than assuming the root config covers the whole repo.

## Build, lint, and test commands

Use the repo-level commands for project-wide checks:

```bash
npm install
npm run lint
npm run format
npm run spell
npm run linkcheck
```

For this codebase, the important app-local workflow is the Vite project:

```bash
cd web-projects/flashword-vite
npm install
npm run dev
npm run build
npm run test:e2e
```

For a single Cypress spec:

```bash
cd web-projects/flashword-vite
npx cypress run --spec cypress/e2e/flashword.cy.js
```

For a single-file lint check when working in a Vue or JS file:

```bash
npx eslint web-projects/flashword-vite/src/App.vue
```

There is no repo-wide unit test suite. Tests are app-local and usually live next to the project that owns them (for example, Cypress specs in `web-projects/flashword-vite/cypress/e2e/`).

## High-level architecture

This project is designed to teach incremental web development patterns:

- The root repo is a course kit; it stores instructions and shared tooling, not application runtime logic.
- `web-projects/first-website/` is a plain static site: HTML in the project root and styles/scripts as folders.
- `web-projects/flashword-vite/` uses the Vue 3 Options API pattern (`src/App.vue`, `src/components/`, `src/main.js`) and is built with Vite.
- The app loads word data via a fetch to `/api/words`; in practice this is backed by the mock backend in `web-projects/backend/db.json` during the tutorial flow.
- The repository is intentionally split by tutorial/extension. Each project is meant to be built and run independently, with its own `package.json` and app entrypoint.

When changing code, start by identifying the relevant tutorial project first; avoid editing multiple apps at once unless a task explicitly spans them.

## Key conventions

- Keep each tutorial/extension self-contained. Files for one app live under that app's folder; do not move logic into the root project unless the task explicitly requires it.
- Follow the existing Vue tutorial style: component-based UI in `.vue` files, simple Options API component definitions, and local state/data in each component when it is part of the exercise.
- Prefer app-local commands over root-level commands when validating a single project; the root config is useful for repo-wide hygiene, but the app is the source of truth for build and test behavior.
- Preserve the educational structure of the project: tutorial work is intentionally straightforward and incremental, with localized HTML/CSS/JS or Vue files rather than a large abstraction layer.
- If you are making a commit in a tutorial context, follow existing repo guidance in `CONTRIBUTING.md`, including attribution trailers for AI-assisted work when required.
- Do not edit generated build output under `dist/` unless the task specifically calls for it. The repo's lint config may flag generated files, so prefer source files and app project folders.

## Copilot Pull Request Reviews

- You are only to perform a pull request review. Do not make any changes to the code in the pull request. Do not add any commits to the pull request.
- If there are new commits since the last review, you must perform a new review. Do not rely on your previous review.
- When reviewing a pull request read the body of the pull request and identify the "Type of Work" and the "Topic".
- If no "Type of Work" or "Topic" is checked in the task list or more than one "Type of Work" or more than one "Topic" is checked, leave a comment on the pull request asking the author to check exactly one "Type of Work" and exactly one "Topic" and do not perform the review.
- Use the custom instructions file in the `.github/instructions/pr-review-criteria` directory that matches the "Type of Work" and the "Topic" as the instructions for the review.
- Use only the criteria in the custom instructions when performing the review. Do not use any other criteria.
- Allow for typos and small differences when evaluating if variable, attribute, or function names meet the criteria.
- Generate the results of the review using one table for each level 2 heading in the custom instructions.
- Prefix each table with the level 2 heading text from the custom instructions.
- Make the columns the same width in all of the tables so that they align properly.
- Use the characters ✅ for "Status" if the requirement is met and ❌ if the requirement is not met.
- Write the table of results into a comment on the pull request.
