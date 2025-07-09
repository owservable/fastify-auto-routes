'use strict';

import * as fs from 'fs';
import * as path from 'path';
import addFastifyRoutes from '../../src/functions/add.fastify.routes';

describe('add.fastify.routes.ts tests', () => {
	const testDir = path.join(__dirname, '../../test-temp');
	
	beforeEach(() => {
		// Clean up any existing test directory
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, { recursive: true, force: true });
		}
		// Create fresh test directory
		fs.mkdirSync(testDir, { recursive: true });
	});
	
	afterEach(() => {
		// Clean up test directory
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, { recursive: true, force: true });
		}
	});

	it('addFastifyRoutes exists', () => {
		expect(addFastifyRoutes).toBeDefined();
		expect(typeof addFastifyRoutes).toBe('function');
	});

	it('should handle verbose logging when enabled', () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		const mockFastify = { route: jest.fn() } as any;
		
		addFastifyRoutes(mockFastify, testDir, true);
		
		expect(consoleSpy).toHaveBeenCalledWith('\n[@owservable/fastify-auto-routes] -> addFastifyRoutes:', testDir);
		
		consoleSpy.mockRestore();
	});

	it('should not log when verbose is disabled', () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		const mockFastify = { route: jest.fn() } as any;
		
		addFastifyRoutes(mockFastify, testDir, false);
		
		expect(consoleSpy).not.toHaveBeenCalledWith('\n[@owservable/fastify-auto-routes] -> addFastifyRoutes:', testDir);
		
		consoleSpy.mockRestore();
	});

	it('should handle empty directories', () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		const mockFastify = { route: jest.fn() } as any;
		
		addFastifyRoutes(mockFastify, testDir, true);
		
		expect(consoleSpy).toHaveBeenCalledWith('\n[@owservable/fastify-auto-routes] -> addFastifyRoutes:', testDir);
		expect(consoleSpy).toHaveBeenCalledWith('[@owservable/fastify-auto-routes] -> addFastifyRoutes:', testDir, '0 files');
		expect(mockFastify.route).not.toHaveBeenCalled();
		
		consoleSpy.mockRestore();
	});

	it('should skip non-TypeScript/JavaScript files', () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		const mockFastify = { route: jest.fn() } as any;
		
		// Create a non-JS/TS file
		const textFile = path.join(testDir, 'readme.txt');
		fs.writeFileSync(textFile, 'This is a text file');
		
		addFastifyRoutes(mockFastify, testDir, true);
		
		expect(consoleSpy).toHaveBeenCalledWith('\n[@owservable/fastify-auto-routes] -> addFastifyRoutes:', testDir);
		expect(consoleSpy).toHaveBeenCalledWith('[@owservable/fastify-auto-routes] -> addFastifyRoutes:', testDir, '1 files');
		expect(mockFastify.route).not.toHaveBeenCalled();
		
		consoleSpy.mockRestore();
	});

	it('should handle subdirectories', () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		const mockFastify = { route: jest.fn() } as any;
		
		// Create a subdirectory
		const subDir = path.join(testDir, 'api');
		fs.mkdirSync(subDir, { recursive: true });
		
		// Create an empty subdirectory
		const emptyDir = path.join(testDir, 'empty');
		fs.mkdirSync(emptyDir, { recursive: true });
		
		addFastifyRoutes(mockFastify, testDir, true);
		
		expect(consoleSpy).toHaveBeenCalledWith('\n[@owservable/fastify-auto-routes] -> addFastifyRoutes:', testDir);
		expect(consoleSpy).toHaveBeenCalledWith('[@owservable/fastify-auto-routes] -> addFastifyRoutes:', testDir, 'subfolders:', '2 subfolders');
		expect(consoleSpy).toHaveBeenCalledWith('\n[@owservable/fastify-auto-routes] -> addFastifyRoutes:', subDir);
		expect(consoleSpy).toHaveBeenCalledWith('\n[@owservable/fastify-auto-routes] -> addFastifyRoutes:', emptyDir);
		
		consoleSpy.mockRestore();
	});

	it('should handle directories that do not exist', () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		const mockFastify = { route: jest.fn() } as any;
		const nonExistentDir = path.join(testDir, 'nonexistent');
		
		// This should throw an error since the directory doesn't exist
		expect(() => {
			addFastifyRoutes(mockFastify, nonExistentDir, true);
		}).toThrow();
		
		consoleSpy.mockRestore();
	});
});
