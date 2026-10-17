import './commands';

beforeEach(() => {
  // Reset viewport and state before each test run
  cy.viewport(1280, 720);
});

// Suppress uncaught exceptions from third-party scripts or protocols
Cypress.on('uncaught:exception', (_err, _runnable) => {
  return false;
});
