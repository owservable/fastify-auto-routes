'use strict';

// Mock must be at the very top to avoid hoisting issues
jest.mock('../../src/functions/add.action.route');

import addActionRoutes from '../../src/functions/add.action.routes';
import addActionRoute from '../../src/functions/add.action.route';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Helper function to handle Windows file locking issues
const cleanupFolder = (folderPath: string, retries: number = 3): void => {
	if (!fs.existsSync(folderPath)) return;

	for (let i = 0; i < retries; i++) {
		try {
			fs.rmSync(folderPath, {recursive: true});
			return;
		} catch (error: any) {
			if (error.code === 'EBUSY' && i < retries - 1) {
				// Wait a bit and try again
				const delay = Math.pow(2, i) * 100; // 100ms, 200ms, 400ms
				const start = Date.now();
				while (Date.now() - start < delay) {
					// Busy wait
				}
				continue;
			}
			throw error;
		}
	}
};

const mockAddActionRoute = addActionRoute as jest.Mock;

describe('addActionRoutes', () => {
	let fastify: any;
	let consoleLogSpy: jest.SpyInstance;

	beforeEach(() => {
		jest.clearAllMocks();
		mockAddActionRoute.mockReset();
		consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {
			// Mock console.log to avoid test output
		});
		fastify = {
			register: jest.fn(),
			route: jest.fn(),
			get: jest.fn(),
			post: jest.fn(),
			put: jest.fn(),
			delete: jest.fn(),
			patch: jest.fn(),
			head: jest.fn(),
			options: jest.fn()
		};
	});

	afterEach(() => {
		consoleLogSpy.mockRestore();
	});

	it('should process action with single route config', async () => {
		const testFolder = path.join(__dirname, '../test-actions-single');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});

		// Create action subfolder
		const actionFolder = path.join(testFolder, 'single-action');
		fs.mkdirSync(actionFolder, {recursive: true});

		// Create action file that returns single config
		const actionFile = path.join(actionFolder, 'single-action.js');
		fs.writeFileSync(
			actionFile,
			`
      class SingleAction {
        async routes() {
          return {
            method: 'GET',
            url: '/single',
            handler: async (request, reply) => {
              return { message: 'single' };
            }
          };
        }
        
        async asController() {
          return true;
        }
      }
      
      module.exports = { default: SingleAction };
    `
		);

		await addActionRoutes(fastify, testFolder, 'single-action');

		expect(mockAddActionRoute).toHaveBeenCalledTimes(1);
		expect(mockAddActionRoute).toHaveBeenCalledWith(
			fastify,
			expect.any(Object), // action instance
			expect.objectContaining({
				method: 'GET',
				url: '/single'
			}),
			false // verbose
		);

		// Cleanup
		fs.rmSync(testFolder, {recursive: true});
	});

	it('should process action with array of route configs', async () => {
		const testFolder = path.join(__dirname, '../test-actions-array-configs');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});

		// Create action subfolder
		const actionFolder = path.join(testFolder, 'array-action');
		fs.mkdirSync(actionFolder, {recursive: true});

		// Create action file that returns array of configs
		const actionFile = path.join(actionFolder, 'array-action.js');
		fs.writeFileSync(
			actionFile,
			`
      class ArrayAction {
        async routes() {
          return [
            {
              method: 'GET',
              url: '/array1',
              handler: async (request, reply) => {
                return { message: 'array1' };
              }
            },
            {
              method: 'POST',
              url: '/array2',
              handler: async (request, reply) => {
                return { message: 'array2' };
              }
            }
          ];
        }
        
        async asController() {
          return true;
        }
      }
      
      module.exports = { default: ArrayAction };
    `
		);

		await addActionRoutes(fastify, testFolder, 'array-action');

		expect(mockAddActionRoute).toHaveBeenCalledTimes(2);
		expect(mockAddActionRoute).toHaveBeenNthCalledWith(
			1,
			fastify,
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/array1'
			}),
			false
		);
		expect(mockAddActionRoute).toHaveBeenNthCalledWith(
			2,
			fastify,
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/array2'
			}),
			false
		);

		// Cleanup
		fs.rmSync(testFolder, {recursive: true});
	});

	it('should handle verbose logging', async () => {
		const testFolder = path.join(__dirname, '../test-actions-verbose-logging');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});

		// Create action subfolder
		const actionFolder = path.join(testFolder, 'verbose-action');
		fs.mkdirSync(actionFolder, {recursive: true});

		// Create action file
		const actionFile = path.join(actionFolder, 'verbose-action.js');
		fs.writeFileSync(
			actionFile,
			`
      class VerboseAction {
        async routes() {
          return {
            method: 'GET',
            url: '/verbose',
            handler: async (request, reply) => {
              return { message: 'verbose' };
            }
          };
        }
        
        async asController() {
          return true;
        }
      }
      
      module.exports = { default: VerboseAction };
    `
		);

		await addActionRoutes(fastify, testFolder, 'verbose-action', true);

		// Verify verbose logging
		expect(consoleLogSpy).toHaveBeenCalledWith('\n[@owservable/fastify-auto-routes] -> addActionRoutes:', 'verbose-action');
		expect(consoleLogSpy).toHaveBeenCalledWith('[@owservable/fastify-auto-routes] -> Initializing route', expect.stringContaining('verbose-action.js'));

		expect(mockAddActionRoute).toHaveBeenCalledTimes(1);
		expect(mockAddActionRoute).toHaveBeenCalledWith(
			fastify,
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: '/verbose'
			}),
			true // verbose = true
		);

		// Cleanup
		fs.rmSync(testFolder, {recursive: true});
	});

	it('should skip actions without routes method', async () => {
		const testFolder = path.join(__dirname, '../test-actions-no-routes');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});

		// Create action subfolder
		const actionFolder = path.join(testFolder, 'no-routes-action');
		fs.mkdirSync(actionFolder, {recursive: true});

		// Create action file without routes method
		const actionFile = path.join(actionFolder, 'no-routes-action.js');
		fs.writeFileSync(
			actionFile,
			`
      class NoRoutesAction {
        // Missing routes method
        async asController() {
          return true;
        }
      }
      
      module.exports = { default: NoRoutesAction };
    `
		);

		await addActionRoutes(fastify, testFolder, 'no-routes-action');

		expect(mockAddActionRoute).not.toHaveBeenCalled();

		// Cleanup
		cleanupFolder(testFolder);
	});

	it('should skip actions without asController method', async () => {
		const testFolder = path.join(__dirname, '../test-actions-no-ascontroller');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});

		// Create action subfolder
		const actionFolder = path.join(testFolder, 'no-ascontroller-action');
		fs.mkdirSync(actionFolder, {recursive: true});

		// Create action file without asController method
		const actionFile = path.join(actionFolder, 'no-ascontroller-action.js');
		fs.writeFileSync(
			actionFile,
			`
      class NoAsControllerAction {
        async routes() {
          return {
            method: 'GET',
            url: '/no-ascontroller',
            handler: async (request, reply) => {
              return { message: 'no-ascontroller' };
            }
          };
        }
        // Missing asController method
      }
      
      module.exports = { default: NoAsControllerAction };
    `
		);

		await addActionRoutes(fastify, testFolder, 'no-ascontroller-action');

		expect(mockAddActionRoute).not.toHaveBeenCalled();

		// Cleanup
		fs.rmSync(testFolder, {recursive: true});
	});

	it('should handle empty action folders', async () => {
		const testFolder = path.join(__dirname, '../test-actions-empty-addroutes');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});

		await expect(addActionRoutes(fastify, testFolder, 'nonexistent-action')).resolves.not.toThrow();

		expect(mockAddActionRoute).not.toHaveBeenCalled();

		// Cleanup
		fs.rmSync(testFolder, {recursive: true});
	});

	it('should handle actions with non-function routes property', async () => {
		const testFolder = path.join(__dirname, '../test-actions-non-function-routes');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});

		// Create action subfolder
		const actionFolder = path.join(testFolder, 'non-function-routes-action');
		fs.mkdirSync(actionFolder, {recursive: true});

		// Create action file with non-function routes property
		const actionFile = path.join(actionFolder, 'non-function-routes-action.js');
		fs.writeFileSync(
			actionFile,
			`
      class NonFunctionRoutesAction {
        routes = 'not a function';
        
        async asController() {
          return true;
        }
      }
      
      module.exports = { default: NonFunctionRoutesAction };
    `
		);

		await addActionRoutes(fastify, testFolder, 'non-function-routes-action');

		expect(mockAddActionRoute).not.toHaveBeenCalled();

		// Cleanup
		fs.rmSync(testFolder, {recursive: true});
	});
});
