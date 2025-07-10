'use strict';

import addRoute from '../../src/functions/add.route';

describe('add.route.ts tests', () => {
	it('addRoute exists', () => {
		expect(addRoute).toBeDefined();
		expect(typeof addRoute).toBe('function');
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should add route to fastify and RoutesMap when route is valid', () => {
		const mockFastify = {
			route: jest.fn()
		};
		const route = {
			url: '/test',
			method: 'GET',
			handler: () => {}
		};
		const relativeFilePath = '/api';

		addRoute(mockFastify, route, relativeFilePath);

		expect(mockFastify.route).toHaveBeenCalledWith(
			expect.objectContaining({
				url: '/api/test',
				method: 'GET',
				schema: expect.any(Object)
			})
		);
	});

	it('should return early if route is not a plain object', () => {
		const mockFastify = {
			route: jest.fn()
		};
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

		addRoute(mockFastify, 'not an object', '/api', true);

		expect(mockFastify.route).not.toHaveBeenCalled();
		expect(consoleSpy).toHaveBeenCalledWith('[@owservable/fastify-auto-routes] -> addRoute: ROUTE PROBLEM', '/api', 'not an object');

		consoleSpy.mockRestore();
	});

	it('should set default url to / if missing', () => {
		const mockFastify = {
			route: jest.fn()
		};
		const route: any = {
			method: 'POST',
			handler: () => {}
		};
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

		addRoute(mockFastify, route, '/api', true);

		expect(route.url).toBe('/api'); // URL gets fixed with relative path
		expect(consoleSpy).toHaveBeenCalledWith('[@owservable/fastify-auto-routes] -> addRoute: MISSING URL WARNING', '/api');
		expect(mockFastify.route).toHaveBeenCalled();

		consoleSpy.mockRestore();
	});

	it('should fix URL when it does not start with relative path', () => {
		const mockFastify = {
			route: jest.fn()
		};
		const route = {
			url: '/test',
			method: 'GET',
			handler: () => {}
		};

		addRoute(mockFastify, route, '/api');

		expect(route.url).toBe('/api/test');
	});

	it('should not modify URL when it already starts with relative path', () => {
		const mockFastify = {
			route: jest.fn()
		};
		const route = {
			url: '/api/test',
			method: 'GET',
			handler: () => {}
		};

		addRoute(mockFastify, route, '/api');

		expect(route.url).toBe('/api/test');
	});

	it('should log when verbose is enabled', () => {
		const mockFastify = {
			route: jest.fn()
		};
		const route = {
			url: '/test',
			method: 'GET',
			handler: () => {}
		};
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

		addRoute(mockFastify, route, '/api', true);

		expect(consoleSpy).toHaveBeenCalledWith('[@owservable/fastify-auto-routes] -> addRoute: Added route', 'GET', '/api/test', '\n');

		consoleSpy.mockRestore();
	});

	it('should not log when verbose is disabled', () => {
		const mockFastify = {
			route: jest.fn()
		};
		const route = {
			url: '/test',
			method: 'GET',
			handler: () => {}
		};
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

		addRoute(mockFastify, route, '/api', false);

		expect(consoleSpy).not.toHaveBeenCalled();

		consoleSpy.mockRestore();
	});
});
