'use strict';

import cleanRelativePath from '../../src/functions/clean.relative.path';

const ext = '.ts';
const rootFolder = 'C:/git/github/reactive-stack-js-backend/src/routes';
describe('cleanRelativePath tests', () => {
	it.each([
		{absoluteFilePath: 'C:/git/github/reactive-stack-js-backend/src/routes/root.ts', expected: '/'},
		{absoluteFilePath: 'C:/git/github/reactive-stack-js-backend/src/routes/api/image.ts', expected: '/api/image/'},
		{absoluteFilePath: 'C:/git/github/reactive-stack-js-backend/src/routes/api/latest.iteration.ts', expected: '/api/latest.iteration/'},
		{absoluteFilePath: 'C:/git/github/reactive-stack-js-backend/src/routes/api/checklist/waive.ts', expected: '/api/checklist/waive/'},
		{absoluteFilePath: 'C:/git/github/reactive-stack-js-backend/src/routes/auth/sso.ts', expected: '/auth/sso/'}
	])('expect $expected', ({absoluteFilePath, expected}) => {
		const clear = cleanRelativePath(rootFolder, absoluteFilePath, ext);
		expect(clear).toBe(expected);
	});
});
