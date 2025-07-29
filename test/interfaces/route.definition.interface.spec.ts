'use strict';

import {RouteDefinition} from '../../src/interfaces/route.definition.interface';

describe('route.definition.interface tests', () => {
	it('should accept valid route definition', () => {
		const route: RouteDefinition = {
			url: '/api/test',
			method: 'GET',
			handler: () => {}
		};

		expect(route.url).toBe('/api/test');
		expect(route.method).toBe('GET');
		expect(typeof route.handler).toBe('function');
	});

	it('should accept route with additional properties', () => {
		const route: RouteDefinition = {
			url: '/api/users',
			method: 'POST',
			schema: {body: {type: 'object'}},
			customProperty: 'test-value'
		};

		expect(route.url).toBe('/api/users');
		expect(route.customProperty).toBe('test-value');
	});

	it('should work with minimal route definition', () => {
		const route: RouteDefinition = {
			url: '/'
		};

		expect(route.url).toBe('/');
		expect(route.method).toBeUndefined();
	});
});
