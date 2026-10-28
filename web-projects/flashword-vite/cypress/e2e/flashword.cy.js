describe('FlashWord Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/words', {
      body: [
        { word_a: 'hola', word_b: 'hello', hint: 'greeting' },
        { word_a: 'uno', word_b: 'one', hint: 'number' },
        { word_a: 'gris', word_b: 'grey', hint: 'color' },
      ],
    }).as('loadWords');
    cy.intercept('GET', '/api/times', { body: [] }).as('loadLeaderboard');
  });

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

  it('displays an empty leaderboard', () => {
    cy.visit('http://localhost:5173/');

    cy.wait('@loadLeaderboard');
    cy.get('[data-cy="leaderboard-empty"]').should('contain', 'No scores yet.');
  });

  it('shows the ten fastest scores with name as a tie-breaker', () => {
    const scores = [
      { id: 1, name: 'Zoe', time: 12 },
      { id: 2, name: 'Mia', time: 8 },
      { id: 3, name: 'Kai', time: 10 },
      { id: 4, name: 'Eli', time: 8 },
      { id: 5, name: 'Ana', time: 17 },
      { id: 6, name: 'Noah', time: 14 },
      { id: 7, name: 'Luz', time: 19 },
      { id: 8, name: 'Ivy', time: 11 },
      { id: 9, name: 'Omar', time: 16 },
      { id: 10, name: 'Bea', time: 13 },
      { id: 11, name: 'Uma', time: 20 },
      { id: 12, name: 'Tao', time: 9 },
    ];
    cy.intercept('GET', '/api/times', { body: scores }).as('loadScores');

    cy.visit('http://localhost:5173/');

    cy.wait('@loadScores');
    cy.get('[data-cy="leaderboard-row"]').should('have.length', 10);
    cy.get('[data-cy="leaderboard-row"]')
      .first()
      .should('contain', 'Eli')
      .and('contain', '00:08');
    cy.get('[data-cy="leaderboard-row"]')
      .eq(1)
      .should('contain', 'Mia')
      .and('contain', '00:08');
    cy.get('[data-cy="leaderboard-row"]').last().should('contain', 'Ana');
  });

  it('submits a completed game time and refreshes the leaderboard', () => {
    const scores = [];
    cy.clock();
    cy.intercept('GET', '/api/times', (request) => {
      request.reply(scores);
    }).as('loadScores');
    cy.intercept('POST', '/api/times', (request) => {
      scores.push({ id: 1, ...request.body });
      request.reply({ statusCode: 201, body: scores[0] });
    }).as('saveScore');

    cy.visit('http://localhost:5173/');
    cy.wait('@loadWords');
    cy.wait('@loadScores');
    cy.tick(65000);
    cy.get('[data-cy="hola-card"] [data-cy="translation"]').type(
      'hello{enter}'
    );
    cy.get('[data-cy="uno-card"] [data-cy="translation"]').type('one{enter}');
    cy.get('[data-cy="gris-card"] [data-cy="translation"]').type('grey{enter}');

    cy.get('[data-cy="game-timer"]').should('contain', '01:05');
    cy.get('[data-cy="player-name"]').type('  Ada  ');
    cy.contains('button', 'Save time').click();

    cy.wait('@saveScore')
      .its('request.body')
      .should('deep.equal', { name: 'Ada', time: 65 });
    cy.contains('Your time has been added to the leaderboard.').should(
      'be.visible'
    );
    cy.get('[data-cy="leaderboard-row"]').should('contain', 'Ada');
    cy.get('[data-cy="leaderboard-row"]').should('contain', '01:05');
  });

  it('requires a non-blank name before submitting a time', () => {
    cy.intercept('POST', '/api/times').as('saveScore');
    cy.visit('http://localhost:5173/');
    cy.wait('@loadWords');
    cy.get('[data-cy="hola-card"] [data-cy="translation"]').type(
      'hello{enter}'
    );
    cy.get('[data-cy="uno-card"] [data-cy="translation"]').type('one{enter}');
    cy.get('[data-cy="gris-card"] [data-cy="translation"]').type('grey{enter}');

    cy.get('[data-cy="player-name"]').type('   ');
    cy.contains('button', 'Save time').click();

    cy.contains('Enter your name to save your time.').should('be.visible');
    cy.get('@saveScore.all').should('have.length', 0);
  });

  it('prevents duplicate submissions while a time is being saved', () => {
    cy.intercept('POST', '/api/times', {
      statusCode: 201,
      delay: 500,
      body: { id: 1, name: 'Ada', time: 0 },
    }).as('saveScore');
    cy.visit('http://localhost:5173/');
    cy.wait('@loadWords');
    cy.get('[data-cy="hola-card"] [data-cy="translation"]').type(
      'hello{enter}'
    );
    cy.get('[data-cy="uno-card"] [data-cy="translation"]').type('one{enter}');
    cy.get('[data-cy="gris-card"] [data-cy="translation"]').type('grey{enter}');
    cy.get('[data-cy="player-name"]').type('Ada');
    cy.contains('button', 'Save time').click();

    cy.contains('button', 'Saving...').should('be.disabled');
    cy.get('form').submit();
    cy.wait('@saveScore');
    cy.get('@saveScore.all').should('have.length', 1);
  });

  it('reports leaderboard load failures and allows retrying', () => {
    let requestCount = 0;
    cy.intercept('GET', '/api/times', (request) => {
      requestCount++;
      if (requestCount === 1) {
        request.reply({ statusCode: 500 });
      } else {
        request.reply([]);
      }
    }).as('loadScores');

    cy.visit('http://localhost:5173/');
    cy.wait('@loadScores');
    cy.contains('Unable to load the leaderboard.').should('be.visible');
    cy.contains('button', 'Try again').click();

    cy.wait('@loadScores');
    cy.get('[data-cy="leaderboard-empty"]').should('be.visible');
  });

  it('reports score submission failures and leaves the form available to retry', () => {
    cy.intercept('POST', '/api/times', { statusCode: 500 }).as('saveScore');
    cy.visit('http://localhost:5173/');
    cy.wait('@loadWords');
    cy.get('[data-cy="hola-card"] [data-cy="translation"]').type(
      'hello{enter}'
    );
    cy.get('[data-cy="uno-card"] [data-cy="translation"]').type('one{enter}');
    cy.get('[data-cy="gris-card"] [data-cy="translation"]').type('grey{enter}');
    cy.get('[data-cy="player-name"]').type('Ada');
    cy.contains('button', 'Save time').click();

    cy.wait('@saveScore').its('response.statusCode').should('equal', 500);
    cy.contains('Unable to save your time. Please try again.').should(
      'be.visible'
    );
    cy.get('[data-cy="player-name"]').should('be.visible');
    cy.contains('button', 'Save time').should('be.enabled');
  });
});
