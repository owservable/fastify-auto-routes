'use strict';
// process.env.NODE_ENV = 'test';

import cleanRelativePath from '../../src/functions/clean.relative.path';

const ext = '.ts';
const rootFolder = 'C:/git/github/reactive-stack-js-backend/src/routes';
describe('cleanRelativePath tests', () => {
	it('expect /', () => {
		const absoluteFilePath = 'C:/git/github/reactive-stack-js-backend/src/routes/root.ts';
		const clear = cleanRelativePath(rootFolder, absoluteFilePath, ext);
		expect(clear).toBe('/');
	});
	it('expect /api/image/', () => {
		const absoluteFilePath = 'C:/git/github/reactive-stack-js-backend/src/routes/api/image.ts';
		const clear = cleanRelativePath(rootFolder, absoluteFilePath, ext);
		expect(clear).toBe('/api/image/');
	});
	it('expect /api/latest.iteration/', () => {
		const absoluteFilePath = 'C:/git/github/reactive-stack-js-backend/src/routes/api/latest.iteration.ts';
		const clear = cleanRelativePath(rootFolder, absoluteFilePath, ext);
		expect(clear).toBe('/api/latest.iteration/');
	});
	it('expect /api/checklist/waive/', () => {
		const absoluteFilePath = 'C:/git/github/reactive-stack-js-backend/src/routes/api/checklist/waive.ts';
		const clear = cleanRelativePath(rootFolder, absoluteFilePath, ext);
		expect(clear).toBe('/api/checklist/waive/');
	});
	it('expect /auth/sso/', () => {
		const absoluteFilePath = 'C:/git/github/reactive-stack-js-backend/src/routes/auth/sso.ts';
		const clear = cleanRelativePath(rootFolder, absoluteFilePath, ext);
		expect(clear).toBe('/auth/sso/');
	});
});
