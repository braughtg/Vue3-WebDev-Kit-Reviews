// AI-generated code: this test coverage exercises the scoring rules, solved-card locking, and browser-local leaderboard behavior the app now implements.
describe('FlashWord', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.intercept('GET', '/api/words', {
      statusCode: 200,
      body: [
        { word_a: 'hola', word_b: 'hello', hint: 'greeting' },
        { word_a: 'uno', word_b: 'one', hint: 'number' },
        { word_a: 'gris', word_b: 'grey', hint: 'color' },
      ],
    }).as('loadWords');
  });

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

  it('scores a run, locks solved cards, and saves a completed result', () => {
    cy.visit('/');
    cy.wait('@loadWords');

    cy.get('.player-name input').type('Alice');
    cy.contains('.card', 'hola').find('input').type('hello{enter}');
    cy.contains('.card', 'hola').should('contain.text', 'hello');
    cy.contains('You have answered 1 out of 3 and your score is 10').should(
      'be.visible'
    );

    cy.contains('.card', 'uno').find('input').type('wrong{enter}');
    cy.contains('.card', 'uno').find('input').type('wrong{enter}');
    cy.contains('.card', 'uno').find('input').type('one{enter}');
    cy.contains('.card', 'uno').should('contain.text', 'one');
    cy.contains('You have answered 2 out of 3 and your score is 11').should(
      'be.visible'
    );

    cy.contains('.card', 'gris').find('input').type('grey{enter}');
    cy.contains('.card', 'gris').should('contain.text', 'grey');
    cy.contains('Great work, you have completed all the words!').should(
      'be.visible'
    );

    cy.window().then((win) => {
      const entries = JSON.parse(
        win.localStorage.getItem('flashword-leaderboard')
      );
      expect(entries).to.have.length(1);
      expect(entries[0].playerName).to.equal('Alice');
      expect(entries[0].score).to.equal(21);
    });
  });

  it('shows the leaderboard button, ranks completed runs, and resets game state without clearing saved entries', () => {
    cy.visit('/');
    cy.wait('@loadWords');

    cy.contains('Show leaderboard').click();
    cy.contains('No completed runs yet.').should('be.visible');

    cy.window().then((win) => {
      const saved = [
        { playerName: 'Beta', score: 20, completedAt: Date.now() - 1000 },
        { playerName: 'Alpha', score: 30, completedAt: Date.now() - 2000 },
      ];
      win.localStorage.setItem('flashword-leaderboard', JSON.stringify(saved));
    });

    cy.reload();
    cy.wait('@loadWords');
    cy.contains('Show leaderboard').click();
    cy.get('#leaderboard li').first().should('contain.text', 'Alpha');
    cy.get('#leaderboard li').eq(1).should('contain.text', 'Beta');

    cy.get('.player-name input').type('Charlie');
    cy.contains('.card', 'hola').find('input').type('hello{enter}');
    cy.contains('.card', 'uno').find('input').type('one{enter}');
    cy.contains('.card', 'gris').find('input').type('grey{enter}');
    cy.contains('Great work, you have completed all the words!').should(
      'be.visible'
    );

    cy.contains('Start another game').click();
    cy.contains('You have answered 0 out of 3 and your score is 0').should(
      'be.visible'
    );
    cy.window().then((win) => {
      const entries = JSON.parse(
        win.localStorage.getItem('flashword-leaderboard')
      );
      expect(entries.length).to.be.greaterThan(0);
    });
  });
});
