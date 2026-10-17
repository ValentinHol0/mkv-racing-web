import React from 'react';
import { AuthModal } from '../../src/features/auth/AuthModal';

describe('AuthModal Component Unit Test', () => {
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

    cy.get('@loginSuccessSpy').should('have.been.called');
  });

  it('invokes Steam OpenID SSO callback', () => {
    const onLoginSuccess = cy.spy().as('steamLoginSpy');
    cy.mount(<AuthModal isOpen={true} onClose={() => {}} onLoginSuccess={onLoginSuccess} />);

    cy.get('[data-testid="steam-sso-btn"]').click();
    cy.get('@steamLoginSpy').should('have.been.called');
  });
});
