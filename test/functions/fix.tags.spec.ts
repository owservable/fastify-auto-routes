'use strict';

import fixTags from '../../src/functions/fix.tags';

describe('fix.tags.ts tests', () => {
	it('fixTags exists', () => {
		expect(fixTags).toBeDefined();
		expect(typeof fixTags).toBe('function');
	});

	it('should return existing tags in uppercase when present', () => {
		const route = {
			schema: {
				tags: ['user', 'auth', 'admin']
			}
		};
		const result = fixTags(route, '/api/users');
		expect(result).toEqual(['USER', 'AUTH', 'ADMIN']);
	});

	it('should return default tags when no schema tags exist', () => {
		const route = {};
		const result = fixTags(route, '/api/users/profile');
		expect(result).toEqual(['API']);
	});

	it('should return default tags when schema is empty', () => {
		const route = {
			schema: {}
		};
		const result = fixTags(route, '/auth/login');
		expect(result).toEqual(['AUTH']);
	});

	it('should return default tags when tags array is empty', () => {
		const route = {
			schema: {
				tags: [] as string[]
			}
		};
		const result = fixTags(route, '/api/data/update');
		expect(result).toEqual(['API']);
	});

	it('should handle single word relative path', () => {
		const route = {};
		const result = fixTags(route, '/users');
		expect(result).toEqual(['USERS']);
	});

	it('should handle empty relative path', () => {
		const route = {};
		const result = fixTags(route, '');
		expect(result).toEqual(['']);
	});

	it('should handle complex relative paths', () => {
		const route = {};
		const result = fixTags(route, '/api/v1/users/admin/settings');
		expect(result).toEqual(['API']);
	});

	it('should handle route without schema', () => {
		const route = {};
		const result = fixTags(route, '/api/test');
		expect(result).toEqual(['API']);
	});
});
