describe('MKV Racing Screenshot Capture', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it('captures screenshots of all pages and auth modal', () => {
    // 1. Dashboard
    cy.visit('/');
    cy.get('[data-testid="dashboard-page"]').should('be.visible');
    cy.wait(600);
    cy.screenshot('01_dashboard_page', { overwrite: true });

    // 2. Auth Modal
    cy.get('[data-testid="open-auth-btn"]').click();
    cy.get('[data-testid="auth-modal"]').should('be.visible');
    cy.wait(500);
    cy.screenshot('02_auth_modal', { overwrite: true });
    cy.get('[aria-label="Close modal"]').click();

    // 3. Servers Page
    cy.contains('nav a', 'Servers').click();
    cy.get('[data-testid="servers-page"]').should('be.visible');
    cy.wait(500);
    cy.screenshot('03_servers_page', { overwrite: true });

    // 4. Garage Page
    cy.contains('nav a', 'Garage').click();
    cy.get('[data-testid="garage-page"]').should('be.visible');
    cy.wait(500);
    cy.screenshot('04_garage_page', { overwrite: true });

    // 5. Telemetry / Statistics Page
    cy.contains('nav a', 'Telemetry').click();
    cy.get('[data-testid="statistics-page"]').should('be.visible');
    cy.wait(500);
    cy.screenshot('05_telemetry_page', { overwrite: true });

    // 6. Pilot Profile Page
    cy.contains('nav a', 'Pilot Profile').click();
    cy.get('[data-testid="profile-page"]').should('be.visible');
    cy.wait(500);
    cy.screenshot('06_profile_page', { overwrite: true });

    // 7. Console Logs Page
    cy.contains('nav a', 'Console Logs').click();
    cy.get('[data-testid="logs-page"]').should('be.visible');
    cy.wait(500);
    cy.screenshot('07_logs_page', { overwrite: true });
  });
});
