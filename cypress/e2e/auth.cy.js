describe('Pilot Authentication End-to-End Workflow', () => {
  // E2E-тести виконуються проти запущеного MKV API (npm run server) з seed-даними
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('opens auth modal, logs in via Steam OpenID SSO, and updates navbar session status', () => {
    // Check initial Guest status
    cy.contains('GUEST').should('be.visible');

    // Open modal
    cy.get('[data-testid="open-auth-btn"]').click();
    cy.get('[data-testid="auth-modal"]').should('be.visible');

    // Click Steam OpenID SSO
    cy.get('[data-testid="steam-sso-btn"]').click();

    // Verify modal closed and user logged in
    cy.get('[data-testid="auth-modal"]').should('not.exist');
    cy.contains('ONLINE').should('be.visible');
    cy.contains('ApexPredator_UA').should('be.visible');
    cy.contains(/Level \d+ Pro Tier/).should('be.visible');
  });

  it('authenticates with credentials and logs out cleanly', () => {
    cy.get('[data-testid="open-auth-btn"]').click();

    cy.get('[data-testid="email-input"]').type('pilot@mkvracing.com');
    cy.get('[data-testid="password-input"]').type('TelemetryToken2026!');
    cy.get('[data-testid="login-submit-btn"]').click();

    cy.contains('ONLINE').should('be.visible');

    // Log out
    cy.get('[data-testid="logout-btn"]').click();
    cy.contains('GUEST').should('be.visible');
  });
});
