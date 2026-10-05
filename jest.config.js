module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  transform: { '^.+\\.ts$': '<rootDir>/scripts/jest-transform.cjs' },
  clearMocks: true,
  collectCoverageFrom: ['dist/yup-phone.cjs.js'],
  coverageReporters: ['text', 'lcov'],
};
