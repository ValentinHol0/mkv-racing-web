// Custom Cypress commands for MKV Racing test suite

Cypress.Commands.add('loginPilot', (email = 'pilot@mkvracing.com', token = 'MKV-PRO-2026') => {
  cy.window().then((win) => {
    win.localStorage.setItem(
      'mkv-racing-auth',
      JSON.stringify({
        isAuthenticated: true,
        user: {
          name: 'Valentin Holomidov',
          email: email,
          callsign: 'ApexPredator_UA',
          steamId: '76561198000000001',
          role: 'Pro Pilot',
          tier: 'Level 42 Pro Tier',
          safetyScore: 98.4,
          token: token,
        },
      })
    );
  });
});
