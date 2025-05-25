import type { Config } from 'jest';
import { createDefaultPreset } from 'ts-jest';

const config: Config = {
  ...createDefaultPreset(),
  testEnvironment: 'jsdom',
  verbose: true,
  collectCoverage: true,
  moduleNameMapper: {
    '^@core$': '<rootDir>/src/core',
    '^@utils$': '<rootDir>/src/utils',
    '^@$': '<rootDir>/src',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
