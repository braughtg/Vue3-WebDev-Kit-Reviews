---
applyTo: 'web-projects/flashword-vite/**/*.vue'
description: Review Criteria for Tutorial 06 - Cypress
---

- Read the pull request body.
- If the "Type of Work" is Tutorial and the "Topic" is "06 - Cypress" then apply the criterion below for this review. Otherwise do not apply this criteria in your review.
- Allow for small variances in variable, attribute and method names.
- Review web-projects/flashword-vite/src/App.vue, web-projects/flashword-vite/src/components/_.vue and web-projects/cypress/e2e/_.cy.js checking for the content in the following sections:

## Workflow

- The pull request contains at least four commits.
  - The commit messages briefly describe the changes made in the commit.

## Installing and Running Cypress

- The `web-projects/flashword-vite/package.json` file lists Cypress as a development dependency.
- The `web-projects/flashword-vite` directory contains the `cypress directory` and a `cypress.config.js` configuration file.

## Your First Cypress Test

- The `web-projects/flashword-vite/cypress/e2e` directory contains the `spec.cy.js` file.
- The `spec.cy.js` contains a `describe` block for my first test.
- The `describe` block contains an `it` tests the Cypress Kitchen Sink page.
  - It visits `https://example.cypress.io`.
  - It clicks on the link containing the text `type`.
  - It checks that the page changed to one with a url including `/commands/actions`.
  - It types text into an element with the CSS class `.action-email`.
  - It verifies that the element with the CSS class `.action-email` contains the typed text.

## Cypress Tests for Flashword

- The `web-projects/flashword-vite/App.vue` file applies `data-cy` attributes to the elements used in the test for the initial page state.
  - The `h2` containing `FlashWord` has a `data-cy` attribute.
  - The `p` containing "You have answered ..." has a `data-cy` attribute.
- The `web-projects/flashword-vite/cypress/e2e` directory contains the `flashword.cy.js` file.
- `flashword.cy.js` contains a `describe` block for testing FlashWord.
- The `describe` block contains an `it` that tests the initial state of the page.
  - All `cy.get` statements in the `it` use `data-cy` properties to find elements.
  - The `it` tests that the header contains `FlashWord`.
  - The `it` tests that the message "You have answered 0 out of 3" is displayed.
  - The `it` tests that the message "Great work, you have completed all the words!" is not displayed.

- If you applied this criteria, skip all other path specific instructions.
