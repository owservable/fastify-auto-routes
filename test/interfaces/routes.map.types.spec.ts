'use strict';

import {RoutesList, RoutesJson} from '../../src/interfaces/routes.map.types';

describe('routes.map.types tests', () => {
	it('should accept valid RoutesList structure', () => {
		const routesList: RoutesList = {
			GET: ['/api/users', '/api/posts'],
			POST: ['/api/users'],
			DELETE: undefined
		};

		expect(routesList['GET']).toEqual(['/api/users', '/api/posts']);
		expect(routesList['POST']).toEqual(['/api/users']);
		expect(routesList['DELETE']).toBeUndefined();
	});

	it('should accept valid RoutesJson structure', () => {
		const routesJson: RoutesJson = {
			GET: {
				'api.users': true,
				'api.posts': {comments: true}
			},
			POST: {
				'api.users': true
			}
		};

		expect(routesJson['GET']['api.users']).toBe(true);
		expect(routesJson['GET']['api.posts']['comments']).toBe(true);
		expect(routesJson['POST']['api.users']).toBe(true);
	});
});
