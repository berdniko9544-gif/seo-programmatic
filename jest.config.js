module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/tests/e2e/',
    '/.claude/',
    '/.open-next/',
    '/test-results/',
    '/playwright-report/',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/.claude/',
    '<rootDir>/.open-next/',
    '<rootDir>/test-results/',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true,
        },
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
  },
  collectCoverageFrom: [
    'src/utils/seo-metadata.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 100,
      lines: 85,
      statements: 85,
    },
  },
};
