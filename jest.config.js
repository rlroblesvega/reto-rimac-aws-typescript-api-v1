module.exports = {
  testMatch: [
    '**/*.test.ts',
    '**/*.steps.ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts', 'json', 'feature'],
};