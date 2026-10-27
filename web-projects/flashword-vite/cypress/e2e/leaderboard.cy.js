const words = [
  { word_a: 'hola', word_b: 'hello', id: 'hola' },
  { word_a: 'uno', word_b: 'one', id: 'uno' },
  { word_a: 'gris', word_b: 'grey', id: 'gris' },
];

function loadGame() {
  cy.intercept('GET', '/api/words', { body: words }).as('getWords');
  cy.visit('/');
  cy.wait('@getWords');
  cy.get('[data-cy="hola-card"]').should('be.visible');
}

function completeGame() {
  cy.get('[data-cy="hola-card"] [data-cy="translation"]').type('hello{enter}');
  cy.get('[data-cy="uno-card"] [data-cy="translation"]').type('one{enter}');
  cy.get('[data-cy="gris-card"] [data-cy="translation"]').type('grey{enter}');
  cy.get('#completed').should('be.visible');
}

describe('FlashWord leaderboard', () => {
  it('loads and displays the five fastest times when the game is completed', () => {
    cy.clock(Date.UTC(2026, 0, 1));
    cy.intercept('GET', '/api/times', {
      body: [
        { name: 'Slow', time: 90, id: 'slow' },
        { name: 'Second', time: '12', id: 'second' },
        { name: 'Fast', time: 4, id: 'fast' },
        { name: 'Fourth', time: 25, id: 'fourth' },
        { name: 'Fifth', time: 30, id: 'fifth' },
        { name: 'Sixth', time: 35, id: 'sixth' },
        { name: 'Third', time: 18, id: 'third' },
      ],
    }).as('getTimes');

    loadGame();
    cy.get('@getTimes.all').should('have.length', 0);
    cy.tick(12345);
    completeGame();

    cy.wait('@getTimes');
    cy.get('[data-cy="completion-time"]').should(
      'contain',
      'Your time: 12.35 seconds'
    );
    cy.get('[data-cy="leaderboard-entry"]').should('have.length', 5);
    cy.get('[data-cy="leaderboard-list"]').should(
      'contain',
      'Fast — 4 seconds'
    );
    cy.get('[data-cy="leaderboard-entry"]').eq(1).should('contain', 'Second');
    cy.get('[data-cy="leaderboard-entry"]').eq(2).should('contain', 'Third');
    cy.get('[data-cy="leaderboard-list"]').should('not.contain', 'Slow');
  });

  it('submits a trimmed name and completion time, then displays the refreshed list', () => {
    cy.clock(Date.UTC(2026, 0, 1));
    const initialTimes = [{ name: 'Previous', time: 20, id: 'previous' }];
    const updatedTimes = [{ name: 'Ada', time: 22.35, id: 'ada' }];
    let getCount = 0;

    cy.intercept('GET', '/api/times', (request) => {
      getCount++;
      request.reply({
        body: getCount === 1 ? initialTimes : updatedTimes,
      });
    }).as('getTimes');
    cy.intercept('POST', '/api/times', {
      delay: 300,
      statusCode: 201,
      body: { name: 'Ada', time: 22.35, id: 'ada' },
    }).as('postTime');

    loadGame();
    cy.tick(22345);
    completeGame();
    cy.wait('@getTimes');

    cy.get('[data-cy="player-name"]').type('  Ada  ');
    cy.get('[data-cy="submit-time"]').click();
    cy.get('[data-cy="submit-time"]').should('be.disabled');
    cy.wait('@postTime')
      .its('request.body')
      .should('deep.equal', { name: 'Ada', time: 22.35 });
    cy.wait('@getTimes');

    cy.get('[data-cy="submit-time"]').should('be.enabled');
    cy.get('[role="status"]').should('contain', 'Your time was submitted.');
    cy.get('[data-cy="leaderboard-entry"]').should(
      'contain',
      'Ada — 22.35 seconds'
    );
  });

  it('shows a leaderboard error without hiding the completed game when GET fails', () => {
    cy.intercept('GET', '/api/times', { forceNetworkError: true }).as(
      'getTimes'
    );

    loadGame();
    completeGame();
    cy.wait('@getTimes');

    cy.get('#completed').should('be.visible');
    cy.get('#leaderboard-error')
      .should('be.visible')
      .and('contain', 'Unable to load the leaderboard.');
  });

  it('shows an error when the leaderboard response is malformed', () => {
    cy.intercept('GET', '/api/times', {
      body: 'invalid-json',
      headers: { 'content-type': 'application/json' },
    }).as('getTimes');

    loadGame();
    completeGame();
    cy.wait('@getTimes');

    cy.get('#completed').should('be.visible');
    cy.get('#leaderboard-error')
      .should('be.visible')
      .and('contain', 'Unable to load the leaderboard.');
  });

  it('rejects a whitespace-only name without sending a POST', () => {
    cy.intercept('GET', '/api/times', { body: [] }).as('getTimes');
    cy.intercept('POST', '/api/times').as('postTime');

    loadGame();
    completeGame();
    cy.wait('@getTimes');

    cy.get('[data-cy="player-name"]').type('   ');
    cy.get('[data-cy="submit-time"]').click();
    cy.get('#leaderboard-error')
      .should('be.visible')
      .and('contain', 'Please enter your name.');
    cy.get('@postTime.all').should('have.length', 0);
  });

  it('shows a submission error when POST fails', () => {
    cy.intercept('GET', '/api/times', { body: [] }).as('getTimes');
    cy.intercept('POST', '/api/times', { statusCode: 500 }).as('postTime');

    loadGame();
    completeGame();
    cy.wait('@getTimes');

    cy.get('[data-cy="player-name"]').type('Ada');
    cy.get('[data-cy="submit-time"]').click();
    cy.wait('@postTime');
    cy.get('#leaderboard-error')
      .should('be.visible')
      .and('contain', 'Unable to submit your time.');
  });
});
