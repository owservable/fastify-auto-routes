'use strict';

import fixRouteMethod from '../../src/functions/fix.route.method';

describe('fix.route.method.ts tests', () => {
	it('fixRouteMethod exists', () => {
		expect(fixRouteMethod).toBeDefined();
		expect(typeof fixRouteMethod).toBe('function');
	});

	it('should return uppercase method for valid HTTP methods', () => {
		const allowedMethods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'];
		
		allowedMethods.forEach(method => {
			expect(fixRouteMethod({ method: method.toLowerCase() })).toBe(method);
			expect(fixRouteMethod({ method: method.toUpperCase() })).toBe(method);
		});
	});

	it('should return GET for invalid methods', () => {
		expect(fixRouteMethod({ method: 'INVALID' })).toBe('GET');
		expect(fixRouteMethod({ method: 'TRACE' })).toBe('GET');
		expect(fixRouteMethod({ method: 'CONNECT' })).toBe('GET');
		expect(fixRouteMethod({ method: '' })).toBe('GET');
	});

	it('should return GET for missing method', () => {
		expect(fixRouteMethod({})).toBe('GET');
		expect(fixRouteMethod({ method: null })).toBe('GET');
		expect(fixRouteMethod({ method: undefined })).toBe('GET');
	});

	it('should handle verbose logging for invalid methods', () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		
		fixRouteMethod({ method: 'INVALID' }, true);
		expect(consoleSpy).toHaveBeenCalledWith('[@owservable/fastify-auto-routes] -> INVALID METHOD', { method: 'INVALID' });
		
		consoleSpy.mockRestore();
	});

	it('should not log when verbose is false', () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		
		fixRouteMethod({ method: 'INVALID' }, false);
		expect(consoleSpy).not.toHaveBeenCalled();
		
		consoleSpy.mockRestore();
	});

	it('should not log when verbose is not provided', () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		
		fixRouteMethod({ method: 'INVALID' });
		expect(consoleSpy).not.toHaveBeenCalled();
		
		consoleSpy.mockRestore();
	});
});