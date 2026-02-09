/**
 * Unit Test Setup File
 * Configuration specific to unit tests
 */

import { Logger } from '@nestjs/common';

const unitTestLogger = new Logger('UnitTests');

process.env.NODE_ENV = 'test';
process.env.TEST_TYPE = 'unit';

const originalConsole = global.console;

beforeAll(() => {
  unitTestLogger.log('Setting up unit test environment...');

  global.console = {
    ...originalConsole,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
});

afterAll(() => {
  unitTestLogger.log('Cleaning up unit test environment...');
  global.console = originalConsole;
});

jest.setTimeout(30000);

global.testUtils = {
  createMockUser: (overrides = {}) => ({
    id: '68fa610c3a50f116c7311d73',
    email: 'jhadi@mailinator.com',
    role: 'MEMBER',
    ...overrides,
  }),

  createMockRequest: (overrides = {}) => ({
    user: { id: '68fa610c3a50f116c7311d73', role: 'MEMBER' },
    body: {},
    params: {},
    query: {},
    ...overrides,
  }),
};
