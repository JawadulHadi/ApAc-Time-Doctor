module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
    '!src/scripts/**',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/__tests__/**',
    '!src/config/**',
    '!src/core/interceptors/**',
    '!src/shared/utils/gcs.utils.ts',
    '!src/shared/helpers/email.helper.ts',
  ],
  coverageDirectory: './coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  testTimeout: 30000,
  verbose: true,
  bail: false,
  maxWorkers: '50%',

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    '^@/core/(.*)$': '<rootDir>/src/core/$1',
    '^@/common/(.*)$': '<rootDir>/src/shared/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],

  setupFilesAfterEnv: ['<rootDir>/src/scripts/setup-test-jest.ts'],

  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test-results',
        outputName: 'junit.xml',
        ancestorSeparator: ' › ',
        uniqueOutputName: 'false',
        suiteNameTemplate: '{filepath}',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}'
      }
    ]
  ],



  errorOnDeprecated: true,
  notify: false,

  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/'
  ]
};