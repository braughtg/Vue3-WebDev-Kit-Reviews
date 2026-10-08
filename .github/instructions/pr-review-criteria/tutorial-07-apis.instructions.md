---
applyTo: 'web-projects/flashword-vite/**/*.vue'
description: Review Criteria for Tutorial 07 - APIs
---

- Read the pull request body.
- If the "Type of Work" is Tutorial and the "Topic" is "07 - Vue Lifecycle Hooks and API Calls" then apply the criterion below for this review. Otherwise do not apply this criteria in your review.
- Allow for small variances in variable, attribute and method names.
- Review web-projects/flashword-vite/src/App.vue, web-projects/flashword-vite/src/components/_.vue and web-projects/cypress/e2e/_.cy.js checking for the content in the following sections:

## Workflow

- The pull request contains at least four commits.
  - The commit messages briefly describe the changes made in the commit. Messages about merging `main` branch should be considered descriptive.

## The Vue Lifecycle Hooks

- The `<script>` section of `App.vue` contains a `created` lifecycle hook function.

## Using `fetch` to Send a Request to an API

- The `created` lifecycle hook function is declared as `async`.
- The `created` lifecycle hook function calls `fetch` with the endpoint `/api/words`.
  - The code in `created` uses `await` when it calls `fetch`.

## Getting JSON Data from a Response

- The `words` property in the Vue `data` is initialized to an empty array.
- The `created` lifecycle hook function calls `.json()` on the response from `fetch.
  - The code in `created` uses `await` when it calls `.json()`.

## Handling API Request Errors

- The `created` lifecycle hook function has an `if` statement that checks `!response.ok`.
  - The body of the `if` statement `throw`s a new `Error`.
- The `created` lifecycle hook contains a `try`/`catch` statement.
  - The `try` block contains the call to `fetch`.
  - The `try` block contains the `if` statement that checks `!response.ok`.
  - The `try` block contains the call to `.json`.
  - The `catch` block writes the error to `console.error`.

- If you applied this criteria, skip all other path specific instructions.
