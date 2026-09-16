---
applyTo: 'web-projects/flashword-vite/**/*.vue'
description: Review Criteria for Tutorial 05 - Vue 4
---

- Read the pull request body.
- If the "Type of Work" is Tutorial and the "Topic" is "05 - Vue4" then apply the criterion below for this review. Otherwise do not apply this criteria in your review.
- Allow for small variances in variable, attribute and method names.
- Review web-projects/flashword-vite/src/App.vue checking for the content in the following sections:

## Workflow

- The pull request contains at least two commits.
- The commit messages briefly describe the changes made in the commit.

## Single File Components

- `WordCard.vue` defines a Vue single file component named `WordCard`.
  - The `script` element has a prop for the word to be displayed.
  - The `script` element has a method that checks the answer and emits an event if the answer is correct.
  - The `template` element displays the word and provides a `text` input for the user to enter an answer.
  - The `style` element is `scoped`.
  - The `style` element defines CSS classes that are applied to elements in the `template.
- `App.vue` uses a `v-for` to create one `WordCard` element for each object in the `words` array.
  - The object from `words` is passed as a prop to the `WordCard` element.
  - A `v-on` handles the event emitted by the `WordCard` component when the user enters a correct answer.

## Linting Issues

- The prop for the word in `WordCards.vue` is declared to be of type `Object`.
- The `WordCards` component has an `emits` property that declares the event that it emits when the answer is correct.
- The `WordCards` component has `data` properties for `correct` and `answer`.
- The `WordCards` component does not modify the `correct` property of its prop.
- The `WordCards` component does not modify the `answer` property using of its prop via `v-model`.
- The `v-for` used to create the `WordCards` in `App.vue` includes a `v-bind:key` directive
  - The `key` is bound to the `word_a` property of the object from `words`.

- If you applied this criteria, skip all other path specific instructions.
