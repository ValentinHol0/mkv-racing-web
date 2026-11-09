import React from 'react';
import { AuthModal } from '../../src/features/auth/AuthModal';

const PILOT = {
  callsign: 'ApexPredator_UA',
  name: 'Valentin Holomidov',
  tier: 'Level 42 Pro Tier',
  license: 'PRO',
  rating: 420,
};

describe('AuthModal Component Unit Test', () => {
  beforeEach(() => {
    // Хук useAuth звертається до MKV API — у компонентних тестах відповіді підміняються
    cy.intercept('POST', '/api/v1/auth/login', { token: 'test.token', user: PILOT }).as('login');
    cy.intercept('POST', '/api/v1/auth/steam', { token: 'test.token', user: PILOT }).as('steam');
  });

  it('validates empty inputs and prevents submission', () => {
    const onLoginSuccess = cy.spy().as('loginSpy');
    cy.mount(<AuthModal isOpen={true} onClose={() => {}} onLoginSuccess={onLoginSuccess} />);

    cy.get('[data-testid="login-submit-btn"]').click();
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
    cy.get('@loginSpy').should('not.have.been.called');
  });

  it('validates short password constraint', () => {
    cy.mount(<AuthModal isOpen={true} onClose={() => {}} />);

    cy.get('[data-testid="email-input"]').type('pilot@mkvracing.com');
    cy.get('[data-testid="password-input"]').type('123');
    cy.get('[data-testid="login-submit-btn"]').click();

    cy.contains('Password must be at least 6 characters').should('be.visible');
  });

  it('successfully submits valid pilot credentials and triggers callback', () => {
    const onLoginSuccess = cy.spy().as('loginSuccessSpy');
    cy.mount(<AuthModal isOpen={true} onClose={() => {}} onLoginSuccess={onLoginSuccess} />);

    cy.get('[data-testid="email-input"]').type('pilot@mkvracing.com');
    cy.get('[data-testid="password-input"]').type('SecretPassword123');
    cy.get('[data-testid="login-submit-btn"]').click();

    cy.wait('@login').its('request.body').should('deep.equal', {
      login: 'pilot@mkvracing.com',
      password: 'SecretPassword123',
    });
    cy.get('@loginSuccessSpy').should('have.been.calledWith', PILOT);
  });

  it('shows API error for invalid credentials', () => {
    cy.intercept('POST', '/api/v1/auth/login', {
      statusCode: 401,
      body: { code: 'BAD_CREDENTIALS', message: 'Invalid email/callsign or security token' },
    });
    cy.mount(<AuthModal isOpen={true} onClose={() => {}} />);

    cy.get('[data-testid="email-input"]').type('pilot@mkvracing.com');
    cy.get('[data-testid="password-input"]').type('WrongPass1');
    cy.get('[data-testid="login-submit-btn"]').click();

    cy.get('[data-testid="auth-error"]').should('contain', 'Invalid email/callsign');
  });

  it('invokes Steam OpenID SSO callback', () => {
    const onLoginSuccess = cy.spy().as('steamLoginSpy');
    cy.mount(<AuthModal isOpen={true} onClose={() => {}} onLoginSuccess={onLoginSuccess} />);

    cy.get('[data-testid="steam-sso-btn"]').click();
    cy.wait('@steam');
    cy.get('@steamLoginSpy').should('have.been.called');
  });
});
