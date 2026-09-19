---
applyTo: 'web-projects/flashword-vite/**/*'
description: Review Criteria for Extension 05 - Vue4
---

- Read the pull request body.
- If the "Type of Work" is Extension and the "Topic" is "05 - Vue 4" then apply the criterion below for this review. Otherwise do not apply this criteria in your review.
- Review web-projects/flashword-vite/src/App.vue and web-projects/flashword-vite/src/components/*.vue checking for the content in the following sections:

## Workflow

- The pull request contains at least three commits.
- The commit messages briefly describe the changes made in the commit.

## Non-AI Extensions

- The word objects in `App.vue` contains only three properties.
  - One property for a Spanish word to be translated.
  - One property for the English translation of the Spanish word.
  - One property for a hint.
- The property holding the Spanish word in the word objects in `App.vue` has a descriptive name.
  - The property name is not `word_a` or `wordA`.
  - The descriptive property name for the Spanish word is also used in the `WordCard` component.
- The `WordCard` component contains functionality that displays a hint when a checkbox is checked.

## Extensions with AI

- The property holding the English word in the word objects in `App.vue` has a descriptive name.
  - The property name is not `word_b` or `wordB`.
  - The descriptive property name for the English word is also used in the `WordCard` component.
- The functionality that displays the score or completion message is contained in a component.
  - The component that displays the score or completion message is used in `App.vue`.
- The component that displays the score or completion message also displays a progress bar that indicates the progress toward completion of the game.
- The pull request contains `Assisted-by:` trailers acknowledging the use of an AI model or tool as required by the workflow.
  - There should be 3 `Assisted-by:` trailers, one for each commit for an extension with AI.
- The pull request has at least one comment containing a log of the author's interaction with GitHub Copilot as required by the workflow. This comment can be identified because it contains a top level heading of "Copilot Chat Log" and a hash hidden in an HTML comment.

## AI Reflection

- The pull request has a comment that responds to each of the questions posed under the heading "AI Reflection" in the issue associated with the pull request. Responses must contain more than a restatement of the question in order to satisfy this criteria.

- If you applied this criteria, skip all other path specific instructions.
