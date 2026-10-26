describe('FlashWord API errors', () => {
  it('displays an error message when fetching words returns an HTTP error', () => {
    cy.intercept('GET', '/api/words', {
      statusCode: 500,
      body: {},
    }).as('getWords');

    cy.visit('/');

    cy.wait('@getWords').its('response.statusCode').should('eq', 500);
    cy.get('#error-message')
      .should('be.visible')
      .and('contain', 'Something went wrong. Please try again later.');
    cy.get('[data-cy="correct-count"]').should('not.exist');
    cy.get('#cards').should('not.exist');
  });

  it('displays an error message when fetching words has a network error', () => {
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
});
