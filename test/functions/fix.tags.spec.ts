'use strict';

import fixTags from '../../src/functions/fix.tags';

describe('fix.tags.ts tests', () => {
	it('fixTags exists', () => {
		expect(fixTags).toBeDefined();
		expect(typeof fixTags).toBe('function');
	});

	it('should return existing tags in uppercase when present', () => {
		const route = {
			method: 'GET',
			schema: {
				tags: ['user', 'auth', 'admin']
			}
		};
		const result = fixTags(route, '/api/users');
		expect(result).toEqual(['USER', 'AUTH', 'ADMIN']);
	});

	it('should return default tags when no schema tags exist', () => {
		const route = {
			method: 'post'
		};
		const result = fixTags(route, '/api/users/profile');
		expect(result).toEqual(['API', 'POST']);
	});

	it('should return default tags when schema is empty', () => {
		const route = {
			method: 'get',
			schema: {}
		};
		const result = fixTags(route, '/auth/login');
		expect(result).toEqual(['AUTH', 'GET']);
	});

	it('should return default tags when tags array is empty', () => {
		const route = {
			method: 'put',
			schema: {
				tags: [] as string[]
			}
		};
		const result = fixTags(route, '/api/data/update');
		expect(result).toEqual(['API', 'PUT']);
	});

	it('should handle single word relative path', () => {
		const route = {
			method: 'delete'
		};
		const result = fixTags(route, '/users');
		expect(result).toEqual(['USERS', 'DELETE']);
	});

	it('should handle empty relative path', () => {
		const route = {
			method: 'options'
		};
		const result = fixTags(route, '');
		expect(result).toEqual(['', 'OPTIONS']);
	});

	it('should handle complex relative paths', () => {
		const route = {
			method: 'patch'
		};
		const result = fixTags(route, '/api/v1/users/admin/settings');
		expect(result).toEqual(['API', 'PATCH']);
	});

	it('should handle route without method', () => {
		const route = {
			schema: {}
		};
		const result = fixTags(route, '/api/test');
		expect(result).toEqual(['API', '']);
	});
});