---
applyTo: 'web-projects/flashword-vite/**/*'
description: Review Criteria for Extension 06 - Cypress
---

- Read the pull request body.
- If the "Type of Work" is Extension and the "Topic" is "06 - Cypress" then apply the criterion below for this review. Otherwise do not apply this criteria in your review.
- Review web-projects/flashword-vite/src/App.vue, web-projects/flashword-vite/src/components/*.vue, and web-projects/flashword-vite/cypress/e2e/flashword.cy.js checking for the content in the following sections:

## Workflow

- The pull request contains at least three commits.
  - The commit messages briefly describe the changes made in the commit.

## Non-AI Extensions

- The `it` for "Check initial page state" in `flashword.cy.js` tests that the "Great work, you have completed all the words!" message does not exist.
  - A `data-cy` attribute with a meaningful value has been added to the element containing the message in `App.vue`.
  - The `it` uses the `data-cy` attribute to `get` the element.
  - The `should` uses the `not.exist` assertion to check that the element does not exist.
- The `describe` in `flashword.cy.js` contains a test that typing text into a `WordCard`'s `text` input sets the `value` of that input.
  - This test is contained in its own `it` with a descriptive title.
  - The `it` uses the `data-cy` attribute to `get` the `WordCard` component element.
  - `find` is used to find the `text` element within the `WordCard` component.
  - `type` is used to type a word into the `text` element.
  - The `should` uses the `have.value` assertion to check that the `text` element has the correct value.
- The `it` for "Check initial page state" in `flashword.cy.js` makes the test for the 0/3 words completed less brittle.
  - The display of `{{ correctCount }}` in `App.vue` is surrounded with a `<span>` with a `data-cy` attribute with a meaningful value.
  - The display of `{{ wordCount }}` is `App.vue` is surrounded with a `<span>` with a `data-cy` attribute with a meaningful value.
  - The `it` uses the `data-cy` attributes to `get` the `<span>` elements.
  - The `should` uses the `have.text` assertion to check the contents of the `<span>` elements.

## Extensions with AI

## AI Reflection

- The pull request has a comment that responds to each of the questions posed under the heading "AI Reflection" in the issue associated with the pull request. Responses must contain more than a restatement of the question in order to satisfy this criteria.

- If you applied this criteria, skip all other path specific instructions.
