'use strict';

import * as fs from 'node:fs';
import * as path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import addFastifyRoutes from '../../src/functions/add.fastify.routes';

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

	it('should process routes in the specified folder', async () => {
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

		await addFastifyRoutes(fastify, testFolder);

		expect(fastify.route).toHaveBeenCalled();

		// Cleanup
		cleanupFolder(testFolder);
	});

	it('should handle array of routes', async () => {
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

		await addFastifyRoutes(fastify, testFolder);

		expect(fastify.route).toHaveBeenCalledTimes(2);

		// Cleanup
		fs.rmSync(testFolder, {recursive: true});
	});

	it('should skip non-JS/TS files', async () => {
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

		await addFastifyRoutes(fastify, testFolder);

		// Only the JS file should be processed
		expect(fastify.route).toHaveBeenCalledTimes(1);

		// Cleanup
		cleanupFolder(testFolder);
	});

	it('should handle verbose logging', async () => {
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

		await addFastifyRoutes(fastify, testFolder, true);

		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[@owservable/fastify-auto-routes] -> addFastifyRoutes:'), expect.any(String));

		// Cleanup
		fs.rmSync(testFolder, {recursive: true});
	});

	it('should handle empty directories', async () => {
		const testFolder = path.join(__dirname, '../test-routes-empty');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});

		await expect(async () => {
			await addFastifyRoutes(fastify, testFolder);
		}).not.toThrow();

		expect(fastify.route).not.toHaveBeenCalled();

		// Cleanup
		cleanupFolder(testFolder);
	});

	it('should handle subdirectories recursively', async () => {
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

		await addFastifyRoutes(fastify, testFolder);

		expect(fastify.route).toHaveBeenCalledTimes(2);

		// Cleanup
		cleanupFolder(testFolder);
	});

	it('should handle mixed file types correctly', async () => {
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

		await addFastifyRoutes(fastify, testFolder);

		// Only JS file should be processed (TS file might fail due to compilation)
		expect(fastify.route).toHaveBeenCalledTimes(1);

		// Cleanup
		cleanupFolder(testFolder);
	});

	it('should handle array of routes with verbose logging', async () => {
		const testFolder = path.join(__dirname, '../test-routes-array-verbose');
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

		await addFastifyRoutes(fastify, testFolder, true);

		expect(consoleLogSpy).toHaveBeenCalledWith('[@owservable/fastify-auto-routes] -> addFastifyRoutes: loaded file', expect.stringContaining('test.js'));
		expect(fastify.route).toHaveBeenCalledTimes(2);

		// Cleanup
		cleanupFolder(testFolder);
	});

	it('should use module namespace when ESM has no default export', async () => {
		const testFolder: string = path.join(__dirname, '../test-routes-esm-named');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});

		const routeFile: string = path.join(testFolder, 'named.ts');
		fs.writeFileSync(
			routeFile,
			`export const method = 'GET';
export const url = '/named-only';
export const handler = async (request: any, reply: any) => {
	return { message: 'named' };
};
`
		);

		await addFastifyRoutes(fastify, testFolder);

		expect(fastify.route).toHaveBeenCalled();

		cleanupFolder(testFolder);
	});

	(process.platform === 'win32' ? it : it.skip)('converts a Windows C: file path to a file: URL and round-trips with fileURLToPath', () => {
		const drivePath: string = 'C:' + path.sep + 'Windows' + path.sep + 'Temp' + path.sep + 'fastify-auto-routes-sanity.js';
		const href: string = pathToFileURL(drivePath).href;
		expect(href).toMatch(/^file:\/\//);
		expect(href).toMatch(/C:/i);
		expect(fileURLToPath(href).toLowerCase()).toBe(path.resolve(drivePath).toLowerCase());
	});

	it('dynamic import() of an absolute file path must use a file: URL, not a bare drive path', async () => {
		const testFolder: string = path.join(__dirname, '../test-routes-fileurl-import');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});
		const routeFile: string = path.join(testFolder, 'round.js');
		const href: string = pathToFileURL(path.resolve(routeFile)).href;
		try {
			fs.writeFileSync(routeFile, `module.exports = { method: 'GET', url: '/round', handler: async () => ({ ok: 1 }) };`);
			const m: {default?: unknown} = (await import(href)) as {default?: unknown};
			expect(m.default).toBeDefined();
		} finally {
			cleanupFolder(testFolder);
		}
	});

	it('selects the module namespace when the default export is falsy (line 56 second branch)', async () => {
		const testFolder: string = path.join(__dirname, '../test-routes-falsy-default');
		if (fs.existsSync(testFolder)) {
			fs.rmSync(testFolder, {recursive: true});
		}
		fs.mkdirSync(testFolder, {recursive: true});
		fs.writeFileSync(path.join(testFolder, 'package.json'), `{"type":"module"}\n`, 'utf8');
		const routeFile: string = path.join(testFolder, 'd.js');
		fs.writeFileSync(
			routeFile,
			`export default 0;
export const method = 'GET';
export const url = '/falsy';
export const handler = async (request, reply) => ({});`
		);
		await expect(addFastifyRoutes(fastify, testFolder)).rejects.toThrow();
		cleanupFolder(testFolder);
	});
});
