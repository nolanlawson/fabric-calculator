export default {
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  transform: {
    '^.+\\.svelte$': ['svelte-jester']
  },
  moduleFileExtensions: ['js', 'ts', 'svelte'],
  extensionsToTreatAsEsm: ['.ts', '.svelte'],
  testPathIgnorePatterns: ['node_modules'],
  transformIgnorePatterns: ['node_modules'],
  bail: false,
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom'
}
