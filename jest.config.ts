import type { Config } from 'jest';
import { createDefaultPreset } from 'ts-jest';

const config: Config = {
  ...createDefaultPreset(),
  testEnvironment: 'jsdom',
  verbose: true,
  collectCoverage: true,
};

export default config;
