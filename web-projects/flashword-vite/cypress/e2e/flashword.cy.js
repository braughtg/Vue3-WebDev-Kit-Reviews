describe('FlashWord Tests', () => {
  it('displays an error when loading words fails', () => {
    cy.intercept('GET', '/api/words', {
      statusCode: 500,
    }).as('loadWords');

    cy.visit('http://localhost:5173/');

    cy.wait('@loadWords').its('response.statusCode').should('equal', 500);
    cy.contains('There was an error when loading the words.').should(
      'be.visible'
    );
    cy.get('[data-cy="app-header"]').should('not.exist');
  });

  it('displays an error when loading words encounters a network error', () => {
    cy.intercept('GET', '/api/words', {
      forceNetworkError: true,
    }).as('loadWords');

    cy.visit('http://localhost:5173/');

    cy.wait('@loadWords');
    cy.contains('There was an error when loading the words.').should(
      'be.visible'
    );
    cy.get('[data-cy="app-header"]').should('not.exist');
  });

  it('displays an error when loading words returns invalid JSON', () => {
    cy.intercept('GET', '/api/words', {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
      },
      body: '{"invalid":',
    }).as('loadWords');

    cy.visit('http://localhost:5173/');

    cy.wait('@loadWords').its('response.statusCode').should('equal', 200);
    cy.contains('There was an error when loading the words.').should(
      'be.visible'
    );
    cy.get('[data-cy="app-header"]').should('not.exist');
  });

  it('Check initial page state', () => {
    cy.visit('http://localhost:5173/');

    // Get the app-header element and check its contents.
    cy.get('[data-cy="app-header"]').should('contain', 'FlashWord');

    // Get the correct-count element and check its contents.
    cy.get('[data-cy="correct-count"]').should(
      'contain',
      'You have answered 0 out of 3'
    );
  });

  it('Check word cards', () => {
    cy.visit('http://localhost:5173/');

    // Check that each of the word card's is displayed.
    cy.get('[data-cy="hola-card"]').should('be.visible');
    // check that hola-card does not have the css class correct.
    cy.get('[data-cy="hola-card"]').should('not.have.class', 'correct');
    // Check that the hola-card is displaying the correct word.
    cy.get('[data-cy="hola-card"]')
      .find('[data-cy="word"]')
      .should('be.visible')
      .should('contain', 'hola');
    // Check that the hola-card input field is empty.
    cy.get('[data-cy="hola-card"]')
      .find('[data-cy="translation"]')
      .should('be.visible')
      .should('have.value', '');

    cy.get('[data-cy="uno-card"]').should('be.visible');
    cy.get('[data-cy="uno-card"]').should('not.have.class', 'correct');
    cy.get('[data-cy="uno-card"]')
      .find('[data-cy="word"]')
      .should('be.visible')
      .should('contain', 'uno');
    cy.get('[data-cy="uno-card"]')
      .find('[data-cy="translation"]')
      .should('be.visible')
      .should('have.value', '');

    cy.get('[data-cy="gris-card"]').should('be.visible');
    cy.get('[data-cy="gris-card"]').should('not.have.class', 'correct');
    cy.get('[data-cy="gris-card"]')
      .find('[data-cy="word"]')
      .should('be.visible')
      .should('contain', 'gris');
    cy.get('[data-cy="gris-card"]')
      .find('[data-cy="translation"]')
      .should('be.visible')
      .should('have.value', '');
  });
});
