const words = [
  { word_a: 'hola', word_b: 'hello', hint: 'greeting' },
  { word_a: 'uno', word_b: 'one', hint: 'number' },
  { word_a: 'gris', word_b: 'grey', hint: 'color' },
];

describe('FlashWord Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/words', words).as('defaultWords');
    cy.intercept('GET', '/api/times', []).as('defaultTimes');
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
    cy.contains('No leaderboard scores yet.').should('be.visible');
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

  it('displays an error message when the words API returns an HTTP error', () => {
    cy.intercept('GET', '/api/words', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('getWords');

    cy.visit('http://localhost:5173/');
    cy.wait('@getWords');

    cy.contains('Error: API call failed.').should('be.visible');
  });

  it('displays an error message when the words API has a network error', () => {
    cy.intercept('GET', '/api/words', { forceNetworkError: true }).as(
      'getWords'
    );

    cy.visit('http://localhost:5173/');
    cy.wait('@getWords');

    cy.contains('Error: API call failed.').should('be.visible');
  });

  it('displays an error message when the words API response cannot be parsed', () => {
    cy.intercept('GET', '/api/words', {
      body: 'not valid JSON',
      headers: { 'content-type': 'application/json' },
    }).as('getWords');

    cy.visit('http://localhost:5173/');
    cy.wait('@getWords');

    cy.contains('Error: API call failed.').should('be.visible');
  });

  it('displays leaderboard scores from highest rank to lowest score, including legacy entries', () => {
    cy.intercept('GET', '/api/times', {
      body: [
        { id: 'legacy', name: 'Legacy', time: '45' },
        {
          id: 'fast',
          name: 'Fast',
          time: 30,
          incorrectAttempts: 1,
          score: 40,
        },
        { id: 'slow', name: 'Slow', time: 80 },
      ],
    }).as('getLeaderboard');

    cy.visit('http://localhost:5173/');
    cy.wait('@getLeaderboard');

    cy.get('[data-cy="leaderboard-entry"]').should('have.length', 3);
    cy.get('[data-cy="leaderboard-entry"]')
      .eq(0)
      .should('contain', 'Fast')
      .and('contain', 'score 40');
    cy.get('[data-cy="leaderboard-entry"]')
      .eq(1)
      .should('contain', 'Legacy')
      .and('contain', 'score 45');
    cy.get('[data-cy="leaderboard-entry"]')
      .eq(2)
      .should('contain', 'Slow')
      .and('contain', 'score 80');
  });

  it('submits completion time plus incorrect-answer penalties to the leaderboard', () => {
    cy.clock(0);
    cy.intercept('POST', '/api/times', (request) => {
      request.reply({
        statusCode: 201,
        body: { id: 'new-score', ...request.body },
      });
    }).as('postScore');

    cy.visit('http://localhost:5173/');
    cy.wait('@defaultWords');
    cy.wait('@defaultTimes');
    cy.get('[data-cy="correct-count"]').should('be.visible');
    cy.tick(5000);

    cy.get('[data-cy="hola-card"] [data-cy="translation"]')
      .type('wrong{enter}')
      .clear()
      .type('hello{enter}');
    cy.get('[data-cy="uno-card"] [data-cy="translation"]').type('one{enter}');
    cy.get('[data-cy="gris-card"] [data-cy="translation"]').type('grey{enter}');

    cy.get('[data-cy="score-form"]').should('be.visible');
    cy.get('[data-cy="game-score"]').should('contain', 'Your score: 15');
    cy.get('[data-cy="player-name"]').type('Ada');
    cy.get('[data-cy="score-form"] button').click();

    cy.wait('@postScore').its('request.body').should('deep.equal', {
      name: 'Ada',
      time: 5,
      incorrectAttempts: 1,
      score: 15,
    });
    cy.get('[data-cy="score-submitted"]').should('be.visible');
    cy.get('[data-cy="leaderboard-entry"]')
      .should('have.length', 1)
      .and('contain', 'Ada')
      .and('contain', 'score 15');
  });

  it('shows an error when the leaderboard cannot be loaded', () => {
    cy.intercept('GET', '/api/times', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('getLeaderboard');

    cy.visit('http://localhost:5173/');
    cy.wait('@getLeaderboard');

    cy.contains('Unable to load the leaderboard.').should('be.visible');
  });

  it('shows an error when score submission fails', () => {
    cy.intercept('POST', '/api/times', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('postScore');

    cy.visit('http://localhost:5173/');
    cy.get('[data-cy="hola-card"] [data-cy="translation"]').type(
      'hello{enter}'
    );
    cy.get('[data-cy="uno-card"] [data-cy="translation"]').type('one{enter}');
    cy.get('[data-cy="gris-card"] [data-cy="translation"]').type('grey{enter}');
    cy.get('[data-cy="player-name"]').type('Ada');
    cy.get('[data-cy="score-form"] button').click();

    cy.wait('@postScore');
    cy.contains('Unable to submit your score. Please try again.').should(
      'be.visible'
    );
  });
});
