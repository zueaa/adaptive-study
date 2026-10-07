process.env.TZ = 'UTC'

const customJestConfig = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
}

try {
  const nextJest = require('next/jest')
  const createJestConfig = nextJest({
    dir: './',
  })
  module.exports = createJestConfig({
    ...customJestConfig,
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
  })
} catch (e) {
  module.exports = customJestConfig
}

