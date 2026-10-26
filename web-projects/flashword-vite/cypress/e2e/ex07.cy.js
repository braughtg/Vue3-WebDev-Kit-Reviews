describe('FlashWord API errors', () => {
  it('hides the game and displays an error when the words request has a network error', () => {
    cy.intercept('GET', '/api/words', { forceNetworkError: true }).as(
      'getWords'
    );

    cy.visit('/');

    cy.wait('@getWords');
    cy.get('#error-message')
      .should('be.visible')
      .and('contain', 'Something went wrong. Please try again later.');
    cy.get('[data-cy="correct-count"]').should('not.exist');
    cy.get('#cards').should('not.exist');
  });

  it('hides the game and displays an error when the words request has a network error', () => {
    cy.intercept('GET', '/api/words', { forceNetworkError: true }).as(
      'getWords'
    );

    cy.visit('/');

    cy.wait('@getWords').should('have.property', 'error');
    cy.get('#error-message')
      .should('be.visible')
      .and('contain', 'Something went wrong. Please try again later.');
    cy.get('[data-cy="correct-count"]').should('not.exist');
    cy.get('#cards').should('not.exist');
  });

  it('hides the game and displays an error when parsing words fails due to invalid JSON', () => {
    cy.intercept('GET', '/api/words', {
      statusCode: 200,
      body: 'invalid-json-content',
      headers: { 'content-type': 'application/json' },
    }).as('getWords');

    cy.visit('/');

    cy.wait('@getWords');
    cy.get('#error-message')
      .should('be.visible')
      .and('contain', 'Something went wrong. Please try again later.');
    cy.get('[data-cy="correct-count"]').should('not.exist');
    cy.get('#cards').should('not.exist');
  });
});
