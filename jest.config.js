module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/src', '<rootDir>/test'],
	testMatch: ['<rootDir>/test/**/*.spec.ts'],
	transform: {
		'^.+\\.ts$': ['ts-jest', {
			tsconfig: {
				types: ['jest', 'node']
			}
		}],
	},
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/**/*.d.ts',
		'!src/**/index.ts',
	],
	coverageDirectory: 'coverage',
	coverageReporters: ['html', 'lcov', 'text-summary'],
	setupFilesAfterEnv: [],
	moduleFileExtensions: ['ts', 'js', 'json'],
	testTimeout: 30000,
	verbose: true,
}; 