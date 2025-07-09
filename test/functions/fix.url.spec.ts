'use strict';

import fixUrl from '../../src/functions/fix.url';

describe('fix.url.ts tests', () => {
	it('fixUrl exists', () => {
		expect(fixUrl).toBeDefined();
		expect(typeof fixUrl).toBe('function');
	});

	it('should combine url and relativeFilePath', () => {
		expect(fixUrl('/path/to/file', '/blah/blah/blah')).toBe('/blah/blah/blah/path/to/file');
	});

	it('should handle double slashes', () => {
		expect(fixUrl('/path/to/file/', '/blah/blah/blah')).toBe('/blah/blah/blah/path/to/file');
	});

	it('should handle trailing slash in relativeFilePath', () => {
		expect(fixUrl('/path/to/file', '/blah/blah/blah/')).toBe('/blah/blah/blah/path/to/file');
	});

	it('should handle both trailing slashes', () => {
		expect(fixUrl('/path/to/file/', '/blah/blah/blah/')).toBe('/blah/blah/blah/path/to/file');
	});

	it('should handle root path', () => {
		expect(fixUrl('/', '/api')).toBe('/api');
	});

	it('should handle empty url', () => {
		expect(fixUrl('', '/api')).toBe('/api');
	});

	it('should handle parameters in url', () => {
		expect(fixUrl('/:id', '/api/users')).toBe('/api/users/:id');
	});
});
