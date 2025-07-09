'use strict';

import * as fs from 'fs';
import * as path from 'path';
import addActionRoutes from '../../src/functions/add.action.routes';

describe('add.action.routes.ts tests', () => {
	const testDir = path.join(__dirname, '../../test-temp');

	beforeEach(() => {
		// Clean up any existing test directory
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, {recursive: true, force: true});
		}
		// Create fresh test directory
		fs.mkdirSync(testDir, {recursive: true});
	});

	afterEach(() => {
		// Clean up test directory
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, {recursive: true, force: true});
		}
	});

	it('addActionRoutes exists', () => {
		expect(addActionRoutes).toBeDefined();
		expect(typeof addActionRoutes).toBe('function');
	});

	it('should handle verbose logging when enabled', async () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		const mockFastify = {route: jest.fn()} as any;

		await addActionRoutes(mockFastify, testDir, 'actions', true);

		expect(consoleSpy).toHaveBeenCalledWith('\n[@owservable/fastify-auto-routes] -> addActionRoutes:', 'actions');

		consoleSpy.mockRestore();
	});

	it('should not log when verbose is disabled', async () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		const mockFastify = {route: jest.fn()} as any;

		await addActionRoutes(mockFastify, testDir, 'actions', false);

		expect(consoleSpy).not.toHaveBeenCalledWith('\n[@owservable/fastify-auto-routes] -> addActionRoutes:', 'actions');

		consoleSpy.mockRestore();
	});

	it('should handle empty action directories', async () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		const mockFastify = {route: jest.fn()} as any;

		// Create empty action folder
		const actionFolder = path.join(testDir, 'actions');
		fs.mkdirSync(actionFolder, {recursive: true});

		await addActionRoutes(mockFastify, testDir, 'actions', true);

		expect(consoleSpy).toHaveBeenCalledWith('\n[@owservable/fastify-auto-routes] -> addActionRoutes:', 'actions');
		expect(mockFastify.route).not.toHaveBeenCalled();

		consoleSpy.mockRestore();
	});

	it('should handle non-existent action directories', async () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		const mockFastify = {route: jest.fn()} as any;

		await addActionRoutes(mockFastify, testDir, 'nonexistent', true);

		expect(consoleSpy).toHaveBeenCalledWith('\n[@owservable/fastify-auto-routes] -> addActionRoutes:', 'nonexistent');
		expect(mockFastify.route).not.toHaveBeenCalled();

		consoleSpy.mockRestore();
	});

	// it('should handle action directories with non-action files', async () => {
	// 	const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
	// 	const mockFastify = { route: jest.fn() } as any;
	//
	// 	// Create action folder with non-action files
	// 	const actionFolder = path.join(testDir, 'actions');
	// 	fs.mkdirSync(actionFolder, { recursive: true });
	//
	// 	// Create non-action files
	// 	fs.writeFileSync(path.join(actionFolder, 'config.json'), '{}');
	// 	fs.writeFileSync(path.join(actionFolder, 'regular.js'), 'module.exports = {};');
	//
	// 	await addActionRoutes(mockFastify, testDir, 'actions', true);
	//
	// 	expect(consoleSpy).toHaveBeenCalledWith('\n[@owservable/fastify-auto-routes] -> addActionRoutes:', 'actions');
	// 	expect(mockFastify.route).not.toHaveBeenCalled();
	//
	// 	consoleSpy.mockRestore();
	// });
});
