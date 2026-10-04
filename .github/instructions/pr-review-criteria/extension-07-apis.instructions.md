---
applyTo: 'web-projects/flashword-vite/**/*'
description: Review Criteria for Extension 07 - Vue Lifecycle Hooks and API Calls
---

- Read the pull request body.
- If the "Type of Work" is Extension and the "Topic" is "07 - Vue Lifecycle Hooks and API Calls" then apply the criterion below for this review. Otherwise do not apply this criteria in your review.
- Review web-projects/flashword-vite/src/App.vue, web-projects/flashword-vite/src/components/*.vue, and web-projects/flashword-vite/cypress/e2e/flashword.cy.js checking for the content in the following sections:

## Workflow

- The pull request contains at least three commits.
  - The commit messages briefly describe the changes made in the commit.

## Non-AI Extensions

- An error message is displayed and the game content is hidden if an API error occurs when fetching the words.
  - A flag property is added to the Vue `data`
  - The flag property is initialized to false.
  - The flag property is set to true in created if an API error occurs.
  - <div> elements are used with v-if to show or hide the message and game elements based on the flag property.

## Testing Extensions with the "Agent" agent

- `cypress/e2e/flashword.cy.js` contains a test for an http error.
  - The test checks that the game content is hidden.
  - The test checks that the error message is shown.
- `cypress/e2e/flashword.cy.js` contains a test for a network error.
  - The test checks that the game content is hidden.
  - The test checks that the error message is shown.
- `cypress/e2e/flashword.cy.js` contains a test for a json parsing error.
  - The test checks that the game content is hidden.
  - The test checks that the error message is shown.

## Extensions with AI

Extensions with the "Plan" Agent

- The FlashWord game in `App.vue` has a leaderboard function
  - The leaderboard displays the users names and the times it took them to complete the game.
  - A user can enter their name and time when they complete the game.
- The names and times on the leaderboard are fetched from the `api/times` endpoint.
- When a user enters their name and time the data is POST ed to the `api/times` endpoint.

## AI Reflection

- The pull request has a comment that responds to each of the questions posed under the heading "AI Reflection" in the issue associated with the pull request. Responses must contain more than a restatement of the question in order to satisfy this criteria.

- If you applied this criteria, skip all other path specific instructions.
