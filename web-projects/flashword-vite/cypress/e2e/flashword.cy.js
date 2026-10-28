describe('FlashWord', () => {
  it('shows an error when loading words returns an HTTP error', () => {
    cy.intercept('GET', '/api/words', {
      statusCode: 500,
      body: { message: 'Internal Server Error' },
    }).as('loadWords');

    cy.visit('/');

    cy.wait('@loadWords').its('response.statusCode').should('eq', 500);
    cy.contains('p', 'An Error Has Occurred. Please Come Back Later.').should(
      'be.visible'
    );
    cy.get('#cards').should('not.exist');
  });

  it('shows an error when loading words fails due to a network error', () => {
    cy.intercept('GET', '/api/words', {
      forceNetworkError: true,
    }).as('loadWords');

    cy.visit('/');

    cy.wait('@loadWords').should('have.property', 'error');
    cy.contains('p', 'An Error Has Occurred. Please Come Back Later.').should(
      'be.visible'
    );
    cy.get('#cards').should('not.exist');
  });

  it('shows an error when the words response contains invalid JSON', () => {
    cy.intercept('GET', '/api/words', {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: '{invalid json',
    }).as('loadWords');

    cy.visit('/');

    cy.wait('@loadWords').its('response.statusCode').should('eq', 200);
    cy.contains('p', 'An Error Has Occurred. Please Come Back Later.').should(
      'be.visible'
    );
    cy.get('#cards').should('not.exist');
  });
});
