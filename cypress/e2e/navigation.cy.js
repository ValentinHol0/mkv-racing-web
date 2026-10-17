describe('MKV Racing Single-Page Application Route Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('navigates seamlessly between all 6 domain pages without full page reload', () => {
    // 1. Dashboard
    cy.get('[data-testid="dashboard-page"]').should('be.visible');
    cy.contains('MKV RACING INFRASTRUCTURE CONTROL').should('be.visible');

    // 2. Servers
    cy.contains('nav a', 'Servers').click();
    cy.url().should('include', '/servers');
    cy.get('[data-testid="servers-page"]').should('be.visible');
    cy.contains('SERVER CLUSTERS & NETWORK NODES').should('be.visible');

    // 3. Garage
    cy.contains('nav a', 'Garage').click();
    cy.url().should('include', '/garage');
    cy.get('[data-testid="garage-page"]').should('be.visible');
    cy.contains('VIRTUAL GARAGE & 3D SHOWCASE').should('be.visible');

    // 4. Statistics / Telemetry
    cy.contains('nav a', 'Telemetry').click();
    cy.url().should('include', '/statistics');
    cy.get('[data-testid="statistics-page"]').should('be.visible');
    cy.contains('TELEMETRY ANALYTICS & SECTOR TIMINGS').should('be.visible');

    // 5. Pilot Profile
    cy.contains('nav a', 'Pilot Profile').click();
    cy.url().should('include', '/profile');
    cy.get('[data-testid="profile-page"]').should('be.visible');
    cy.contains('PILOT CAREER FLEET MILEAGE').should('be.visible');

    // 6. Console Logs
    cy.contains('nav a', 'Console Logs').click();
    cy.url().should('include', '/logs');
    cy.get('[data-testid="logs-page"]').should('be.visible');
    cy.contains('CONSOLE TERMINAL & SYSTEM LOGS').should('be.visible');

    // Return to Dashboard via Brand Logo
    cy.contains('MKV RACING').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    cy.get('[data-testid="dashboard-page"]').should('be.visible');
  });
});
