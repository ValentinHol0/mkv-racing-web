import './commands';
import '../../src/styles/index.css';
import { mount } from 'cypress/react18';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

Cypress.Commands.add('mount', (component, options = {}) => {
  const wrapped = React.createElement(MemoryRouter, null, component);
  return mount(wrapped, options);
});
