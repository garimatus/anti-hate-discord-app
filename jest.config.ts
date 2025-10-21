import type {
  TsJestTransformerOptions,
  TsConfigCompilerOptionsJson,
} from 'ts-jest'

/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          target: 'es2022',
          module: 'nodenext',
          moduleResolution: 'nodenext',
          isolatedModules: true,
          allowSyntheticDefaultImports: true,
          resolveJsonModule: true,
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          types: ['jest', 'node'],
        } as unknown as TsConfigCompilerOptionsJson,
      },
    ],
  } as TsJestTransformerOptions,
  detectOpenHandles: true,
  testTimeout: 45000,
  forceExit: true,
}
