'use strict';

import fixSchema from '../../src/functions/fix.schema';

describe('fix.schema.ts tests', () => {
	it('fixSchema exists', () => {
		expect(fixSchema).toBeDefined();
		expect(typeof fixSchema).toBe('function');
	});

	it('should return route.schema if it exists', () => {
		const route = {
			schema: {
				body: { type: 'object' },
				response: { 200: { type: 'object' } }
			}
		};
		const result = fixSchema(route);
		expect(result).toEqual({
			body: { type: 'object' },
			response: { 200: { type: 'object' } }
		});
	});

	it('should return empty object if route.schema does not exist', () => {
		const route = {};
		const result = fixSchema(route);
		expect(result).toEqual({});
	});

	it('should throw error if route is null', () => {
		const route: any = null;
		expect(() => fixSchema(route)).toThrow();
	});

	it('should throw error if route is undefined', () => {
		const route: any = undefined;
		expect(() => fixSchema(route)).toThrow();
	});
});