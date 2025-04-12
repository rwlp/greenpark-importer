const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    '<rootDir>/src/lib/**/*.ts',
  ],
  moduleNameMapper: {
    "^@/(.*)$": path.join(__dirname, '/src/$1')
  },
  moduleDirectories: [
    "node_modules",
    path.join(__dirname, './src/*')
  ],
  transform: {
    "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest",
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  transformIgnorePatterns: [
    "node_modules/(?!variables/.*)"
  ],
  testMatch: [
    "<rootDir>/tests/**/*.test.ts"
  ]
};
