'use strict';

import fixTags from '../../src/functions/fix.tags';

describe('fix.tags.ts tests', () => {
	it('fixTags exists', () => {
		expect(fixTags).toBeDefined();
		expect(typeof fixTags).toBe('function');
	});

	it.each([
		{name: 'existing tags in uppercase when present', route: {schema: {tags: ['user', 'auth', 'admin']}}, relativeFilePath: '/api/users', expected: ['USER', 'AUTH', 'ADMIN']},
		{name: 'default tags when no schema tags exist', route: {}, relativeFilePath: '/api/users/profile', expected: ['API']},
		{name: 'default tags when schema is empty', route: {schema: {}}, relativeFilePath: '/auth/login', expected: ['AUTH']},
		{name: 'default tags when tags array is empty', route: {schema: {tags: [] as string[]}}, relativeFilePath: '/api/data/update', expected: ['API']},
		{name: 'single word relative path', route: {}, relativeFilePath: '/users', expected: ['USERS']},
		{name: 'empty relative path', route: {}, relativeFilePath: '', expected: ['']},
		{name: 'complex relative paths', route: {}, relativeFilePath: '/api/v1/users/admin/settings', expected: ['API']},
		{name: 'route without schema', route: {}, relativeFilePath: '/api/test', expected: ['API']}
	])('should handle $name', ({route, relativeFilePath, expected}) => {
		const result = fixTags(route, relativeFilePath);
		expect(result).toEqual(expected);
	});
});
