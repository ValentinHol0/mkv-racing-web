import React from 'react';
import { ServerCard } from '../../src/features/dashboard/ServerCard';

describe('ServerCard Component Unit Test', () => {
  const mockServer = {
    id: 'srp-tokyo-01',
    name: '[MKV] SHUTO REVIVAL | HIGHWAY TRAFFIC',
    region: 'Japan (Tokyo C1)',
    track: 'Shuto Expressway C1 Outer Loop',
    clients: 48,
    maxClients: 70,
    maxSlots: 170,
    ping: 24,
    tickRate: 40,
    weather: 'Pure 3.10 Rain FX',
    joinUrl: 'acmanager://ui/quick/server?server_ip=185.190.140.12&server_port=9601',
  };

  it('renders server telemetry metrics, name, and slot capacity', () => {
    cy.mount(<ServerCard server={mockServer} />);

    cy.get('[data-testid="server-name"]').should(
      'contain.text',
      '[MKV] SHUTO REVIVAL | HIGHWAY TRAFFIC'
    );
    cy.get('[data-testid="server-clients"]').should('contain.text', '48/70');
    cy.get('[data-testid="server-ping"]').should('contain.text', '24 ms');
    cy.contains('40 Hz').should('be.visible');
    cy.contains('Pure 3.10 Rain FX').should('be.visible');
  });

  it('triggers onConnect callback with server payload when clicking connect button', () => {
    const onConnectSpy = cy.spy().as('onConnectSpy');
    cy.mount(<ServerCard server={mockServer} onConnect={onConnectSpy} />);

    cy.get('[data-testid="connect-button"]').click();
    cy.get('@onConnectSpy').should('have.been.calledOnceWith', mockServer);
  });
});
