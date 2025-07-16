'use strict';

import addActionRoute from '../../src/functions/add.action.route';

describe('add.action.route.ts tests', () => {
	it('addActionRoute exists', () => {
		expect(addActionRoute).toBeDefined();
		expect(typeof addActionRoute).toBe('function');
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should add action route to fastify and RoutesMap', () => {
		const mockFastify = {
			route: jest.fn()
		};
		const mockAction = {
			asController: jest.fn()
		};
		const config: any = {
			url: '/test',
			method: 'POST'
		};

		addActionRoute(mockFastify, mockAction, config);

		expect(mockFastify.route).toHaveBeenCalledWith(
			expect.objectContaining({
				url: '/test',
				method: 'POST',
				schema: expect.any(Object),
				handler: mockAction.asController
			})
		);
	});

	it('should fix method using fixRouteMethod', () => {
		const mockFastify = {
			route: jest.fn()
		};
		const mockAction = {
			asController: jest.fn()
		};
		const config: any = {
			url: '/test',
			method: 'invalid_method'
		};

		addActionRoute(mockFastify, mockAction, config);

		expect(config.method).toBe('GET'); // Should default to GET for invalid method
	});

	it('should set schema with tags', () => {
		const mockFastify = {
			route: jest.fn()
		};
		const mockAction = {
			asController: jest.fn()
		};
		const config: any = {
			url: '/test',
			method: 'GET'
		};

		addActionRoute(mockFastify, mockAction, config);

		expect(config.schema).toBeDefined();
		expect(config.schema.tags).toEqual(['ACTION']);
	});

	it('should log when verbose is enabled', () => {
		const mockFastify = {
			route: jest.fn()
		};
		const mockAction = {
			asController: jest.fn()
		};
		const config: any = {
			url: '/test',
			method: 'GET'
		};
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

		addActionRoute(mockFastify, mockAction, config, true);

		expect(consoleSpy).toHaveBeenCalledWith('[@owservable/fastify-auto-routes] -> addActionRoute: Added route', 'GET', '/test', '\n');

		consoleSpy.mockRestore();
	});

	it('should not log when verbose is disabled', () => {
		const mockFastify = {
			route: jest.fn()
		};
		const mockAction = {
			asController: jest.fn()
		};
		const config: any = {
			url: '/test',
			method: 'GET'
		};
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

		addActionRoute(mockFastify, mockAction, config, false);

		expect(consoleSpy).not.toHaveBeenCalled();

		consoleSpy.mockRestore();
	});

	it('should use existing schema if provided', () => {
		const mockFastify = {
			route: jest.fn()
		};
		const mockAction = {
			asController: jest.fn()
		};
		const config: any = {
			url: '/test',
			method: 'GET',
			schema: {
				body: {type: 'object'},
				response: {200: {type: 'object'}}
			}
		};

		addActionRoute(mockFastify, mockAction, config);

		expect(config.schema.body).toEqual({type: 'object'});
		expect(config.schema.response).toEqual({200: {type: 'object'}});
		expect(config.schema.tags).toEqual(['ACTION']);
	});
});
