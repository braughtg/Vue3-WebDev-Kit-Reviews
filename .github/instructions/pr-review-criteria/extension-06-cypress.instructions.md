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
  - The `should` checks that the `<span>` element for the `correctCount` contains 0.
  - The `should` checks that the `<span>` element for the `wordCount` contains 3.

## Extensions with AI

- The `describe` in `flashword.cy.js` contains a test for typing a correct word into one of the `WordCard` components.
  - This test is contained in its own `it` with a descriptive title.
  - `data-cy` attributes are used to `get` all elements that the `it` uses.
  - `find` is used to find the `text` element within the `WordCard` component.
  - `type` is used to type a word and the `{enter}` key into the `text` element.
  - a `should` uses the `has.class` assertion to check that the `WordCard` component has the `correct` class.
  - a `should` checks that the `WordCard` component displays the correct translation.
  - a `should` checks that the `WordCard` does not display the `text` input.
  - a `should` checks that the `<span>` shows that there is 1 correct word.
- The `describe` in `flashword.cy.js` contains a test for when the user completes the game by entering all words correctly.
  - This test is contained in its own `it` with a descriptive title.
  - `data-cy` attributes are used to `get` all elements that the `it` uses.
  - `find` is used to find the `text` element within each `WordCard` component.
  - `type` is used to type a word and the `{enter}` key into the `text` element.
  - a `should` checks that the completion message is visible and has the text "Great work, you have completed all the words!".
  - a `should` checks that the message showing the number of correct words does not exit.
- The `script` and `template` in `App.vue` implement a reset feature.
  - A reset button appears on in the game.
  - Clicking the reset button clears the `text` inputs in all of the `WordCard` components.
  - Clicking the reset button removes the `correct` class from all of the `WordCard` components.
  - Clicking the reset button displays the message indicating that 0 of the words are correct.
  - Clicking the reset button hides the message that the game is complete.
- The `describe` in `flashword.cy.js` contains a test for the reset feature.
  - This test is contained in its own `it` with a descriptive title.
  - `data-cy` attributes are used to `get` all elements that the `it` uses.
  - `find` is used to find the `text` element within each `WordCard` component.
  - `type` is used to type at least one word and the `{enter}` key into the `text` element in a `WordCard` component.
  - a `should` checks that the `<span>` shows that there is at least 1 correct word before the reset button is clicked.
  - `click` is used to click on the reset button.
  - a `should` checks that the `<span>` element for the `correctCount` contains 0.
  - a `should` checks that the completion message does not exist.
  - a `should` checks that any typed words have been cleared from their `WordCard` components.
  - a `should` checks that any `WordCard` that was used does not have the `correct` class.

## AI Reflection

- The pull request has a comment that responds to each of the questions posed under the heading "AI Reflection" in the issue associated with the pull request. Responses must contain more than a restatement of the question in order to satisfy this criteria.

- If you applied this criteria, skip all other path specific instructions.
