'use strict';

import * as fs from 'fs';
import * as path from 'path';
import addActionRoutes from '../../src/functions/add.action.routes';

describe('add.action.routes.ts tests', () => {
	const testDir = path.join(__dirname, '../../test-temp');
	
	beforeEach(() => {
		// Create test directory if it doesn't exist
		if (!fs.existsSync(testDir)) {
			fs.mkdirSync(testDir, { recursive: true });
		}
	});
	
	afterEach(() => {
		// Clean up test directory
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, { recursive: true, force: true });
		}
	});

	it('addActionRoutes exists', () => {
		expect(addActionRoutes).toBeDefined();
		expect(typeof addActionRoutes).toBe('function');
	});

	it('should handle verbose logging when enabled', async () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		const mockFastify = {} as any;
		
		await addActionRoutes(mockFastify, testDir, 'verbose-folder', true);
		
		expect(consoleSpy).toHaveBeenCalledWith('\n[@owservable/fastify-auto-routes] -> addActionRoutes:', 'verbose-folder');
		
		consoleSpy.mockRestore();
	});

	it('should not log when verbose is disabled', async () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		const mockFastify = {} as any;
		
		await addActionRoutes(mockFastify, testDir, 'quiet-folder', false);
		
		expect(consoleSpy).not.toHaveBeenCalledWith('\n[@owservable/fastify-auto-routes] -> addActionRoutes:', 'quiet-folder');
		
		consoleSpy.mockRestore();
	});
});
