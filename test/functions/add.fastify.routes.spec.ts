'use strict';

import * as fs from 'fs';
import * as path from 'path';
import addFastifyRoutes from '../../src/functions/add.fastify.routes';

describe('addFastifyRoutes', () => {
	let fastify: any;
	let consoleLogSpy: jest.SpyInstance;

	beforeEach(() => {
		jest.clearAllMocks();
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

	it('should process routes in the specified folder', () => {
		const testFolder = path.join(__dirname, '../test-routes');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});

		// Create a test route file
		const routeFile = path.join(testFolder, 'test.js');
		fs.writeFileSync(
			routeFile,
			`
      module.exports = {
        method: 'GET',
        url: '/test',
        handler: async (request, reply) => {
          return { message: 'test' };
        }
      };
    `
		);

		addFastifyRoutes(fastify, testFolder);

		expect(fastify.route).toHaveBeenCalled();

		// Cleanup
		fs.rmSync(testFolder, {recursive: true});
	});

	it('should handle array of routes', () => {
		const testFolder = path.join(__dirname, '../test-routes-array');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});

		// Create a test route file with array export
		const routeFile = path.join(testFolder, 'test.js');
		fs.writeFileSync(
			routeFile,
			`
      module.exports = [
        {
          method: 'GET',
          url: '/test1',
          handler: async (request, reply) => {
            return { message: 'test1' };
          }
        },
        {
          method: 'POST',
          url: '/test2',
          handler: async (request, reply) => {
            return { message: 'test2' };
          }
        }
      ];
    `
		);

		addFastifyRoutes(fastify, testFolder);

		expect(fastify.route).toHaveBeenCalledTimes(2);

		// Cleanup
		fs.rmSync(testFolder, {recursive: true});
	});

	it('should skip non-JS/TS files', () => {
		const testFolder = path.join(__dirname, '../test-routes-mixed');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});

		// Create various file types
		const jsFile = path.join(testFolder, 'valid.js');
		fs.writeFileSync(
			jsFile,
			`
      module.exports = {
        method: 'GET',
        url: '/valid',
        handler: async (request, reply) => {
          return { message: 'valid' };
        }
      };
    `
		);

		const txtFile = path.join(testFolder, 'invalid.txt');
		fs.writeFileSync(txtFile, 'This is not a route file');

		const mdFile = path.join(testFolder, 'README.md');
		fs.writeFileSync(mdFile, '# Documentation');

		addFastifyRoutes(fastify, testFolder);

		// Only the JS file should be processed
		expect(fastify.route).toHaveBeenCalledTimes(1);

		// Cleanup
		fs.rmSync(testFolder, {recursive: true});
	});

	it('should handle verbose logging', () => {
		const testFolder = path.join(__dirname, '../test-routes-verbose');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});

		// Create a test route file
		const routeFile = path.join(testFolder, 'test.js');
		fs.writeFileSync(
			routeFile,
			`
      module.exports = {
        method: 'GET',
        url: '/test',
        handler: async (request, reply) => {
          return { message: 'test' };
        }
      };
    `
		);

		addFastifyRoutes(fastify, testFolder, true);

		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[@owservable/fastify-auto-routes] -> addFastifyRoutes:'), expect.any(String));

		// Cleanup
		fs.rmSync(testFolder, {recursive: true});
	});

	it('should handle empty directories', () => {
		const testFolder = path.join(__dirname, '../test-routes-empty');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});

		expect(() => {
			addFastifyRoutes(fastify, testFolder);
		}).not.toThrow();

		expect(fastify.route).not.toHaveBeenCalled();

		// Cleanup
		fs.rmSync(testFolder, {recursive: true});
	});

	it('should handle subdirectories recursively', () => {
		const testFolder = path.join(__dirname, '../test-routes-recursive');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});

		// Create subdirectory
		const subDir = path.join(testFolder, 'api');
		fs.mkdirSync(subDir, {recursive: true});

		// Create route in main directory
		const mainRouteFile = path.join(testFolder, 'main.js');
		fs.writeFileSync(
			mainRouteFile,
			`
      module.exports = {
        method: 'GET',
        url: '/main',
        handler: async (request, reply) => {
          return { message: 'main' };
        }
      };
    `
		);

		// Create route in subdirectory
		const subRouteFile = path.join(subDir, 'sub.js');
		fs.writeFileSync(
			subRouteFile,
			`
      module.exports = {
        method: 'GET',
        url: '/sub',
        handler: async (request, reply) => {
          return { message: 'sub' };
        }
      };
    `
		);

		addFastifyRoutes(fastify, testFolder);

		expect(fastify.route).toHaveBeenCalledTimes(2);

		// Cleanup
		fs.rmSync(testFolder, {recursive: true});
	});

	it('should handle mixed file types correctly', () => {
		const testFolder = path.join(__dirname, '../test-routes-mixed-types');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});

		// Create valid JS file
		const jsFile = path.join(testFolder, 'route1.js');
		fs.writeFileSync(
			jsFile,
			`
      module.exports = {
        method: 'GET',
        url: '/route1',
        handler: async (request, reply) => {
          return { message: 'route1' };
        }
      };
    `
		);

		// Create invalid files that should be skipped
		const jsonFile = path.join(testFolder, 'config.json');
		fs.writeFileSync(jsonFile, '{"config": "value"}');

		const xmlFile = path.join(testFolder, 'data.xml');
		fs.writeFileSync(xmlFile, '<root><data>test</data></root>');

		addFastifyRoutes(fastify, testFolder);

		// Only JS file should be processed (TS file might fail due to compilation)
		expect(fastify.route).toHaveBeenCalledTimes(1);

		// Cleanup
		fs.rmSync(testFolder, {recursive: true});
	});

	it('should handle array of routes with verbose logging', () => {
		const testFolder = path.join(__dirname, '../test-routes-array-verbose');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, { recursive: true });
		}
		fs.mkdirSync(testFolder, { recursive: true });

		// Create a test route file with array export
		const routeFile = path.join(testFolder, 'test.js');
		fs.writeFileSync(routeFile, `
			module.exports = [
				{
					method: 'GET',
					url: '/test1',
					handler: async (request, reply) => {
						return { message: 'test1' };
					}
				},
				{
					method: 'POST',
					url: '/test2',
					handler: async (request, reply) => {
						return { message: 'test2' };
					}
				}
			];
		`);

		addFastifyRoutes(fastify, testFolder, true);

		expect(consoleLogSpy).toHaveBeenCalledWith(
			'[@owservable/fastify-auto-routes] -> addFastifyRoutes:',
			expect.stringContaining('test.js'),
			'2 routes'
		);
		expect(fastify.route).toHaveBeenCalledTimes(2);

		// Cleanup
		fs.rmSync(testFolder, { recursive: true });
	});
});
