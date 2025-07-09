'use strict';

import * as fs from 'fs';
import * as path from 'path';
import addFastifyRoutes from '../../src/functions/add.fastify.routes';

describe('add.fastify.routes.ts tests', () => {
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

	it('addFastifyRoutes exists', () => {
		expect(addFastifyRoutes).toBeDefined();
		expect(typeof addFastifyRoutes).toBe('function');
	});

	it('should handle verbose logging when enabled', () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		const mockFastify = {} as any;
		
		addFastifyRoutes(mockFastify, testDir, true);
		
		expect(consoleSpy).toHaveBeenCalledWith('\n[@owservable/fastify-auto-routes] -> addFastifyRoutes:', testDir);
		
		consoleSpy.mockRestore();
	});

	it('should not log when verbose is disabled', () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		const mockFastify = {} as any;
		
		addFastifyRoutes(mockFastify, testDir, false);
		
		expect(consoleSpy).not.toHaveBeenCalledWith('\n[@owservable/fastify-auto-routes] -> addFastifyRoutes:', testDir);
		
		consoleSpy.mockRestore();
	});
});

const fail =
	'🏷️  Routes:\n' + //
	'OPTIONS *\n' +
	'GET     /\n' +
	'GET     /api/configs';

const test =
	'OPTIONS	*\n' +
	'GET	/\n' +
	'GET	/api/configs\n' +
	'GET	/api/latest.iteration/:collection/:id\n' +
	'GET	/api/locales\n' +
	'POST	/api/logger/:level\n' +
	'POST	/api/logger\n' +
	'POST	/api/dl/add.filter\n' +
	'POST	/api/dl/delete.dl\n' +
	'POST	/api/dl/delete.filter\n' +
	'POST	/api/dl/save.dl.roles\n' +
	'POST	/api/dl/sync.dls\n' +
	'POST	/api/dl/update.filter\n' +
	'POST	/api/global/enum/enum/:name\n' +
	'POST	/api/global/favorites/favorite\n' +
	'POST	/api/global/favorites/unfavorite\n' +
	'POST	/api/role/create.role\n' +
	'POST	/api/role/delete.role\n' +
	'POST	/api/role/update.role\n' +
	'GET	/api/user/image/:id\n' +
	'GET	/api/user/permissions.data/:id\n' +
	'GET	/api/user/permissions/:id\n' +
	'GET	/api/user/permissions/:id/:force\n' +
	'POST	/api/user/save.user.roles\n' +
	'POST	/auth/sso\n' +
	'GET	/ws';

// describe('process.fastify.blipp.ts tests', () => {
// 	it('fail', () => {
// 		processFastifyBlipp(fail);
// 		expect(RoutesMap.keys()).to.be.empty;
// 		expect(RoutesMap.values()).to.be.empty;
// 	});
//
// 	it('pass', () => {
// 		expect(processFastifyBlipp).to.exist;
// 		expect(processFastifyBlipp).to.be.a('function');
//
// 		processFastifyBlipp(test);
//
// 		expect(RoutesMap.keys()).to.deep.equal(['OPTIONS', 'GET', 'POST']);
// 		expect(RoutesMap.values()).to.deep.equal([
// 			['*'],
// 			[
// 				'/',
// 				'/api/configs',
// 				'/api/latest.iteration/:collection/:id',
// 				'/api/locales',
// 				'/api/user/image/:id',
// 				'/api/user/permissions.data/:id',
// 				'/api/user/permissions/:id',
// 				'/api/user/permissions/:id/:force',
// 				'/ws'
// 			],
// 			[
// 				'/api/dl/add.filter',
// 				'/api/dl/delete.dl',
// 				'/api/dl/delete.filter',
// 				'/api/dl/save.dl.roles',
// 				'/api/dl/sync.dls',
// 				'/api/dl/update.filter',
// 				'/api/global/enum/enum/:name',
// 				'/api/global/favorites/favorite',
// 				'/api/global/favorites/unfavorite',
// 				'/api/logger',
// 				'/api/logger/:level',
// 				'/api/role/create.role',
// 				'/api/role/delete.role',
// 				'/api/role/update.role',
// 				'/api/user/save.user.roles',
// 				'/auth/sso'
// 			]
// 		]);
// 	});
// });
