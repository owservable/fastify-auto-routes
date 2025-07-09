'use strict';

import * as FastifyAutoRoutes from '../src/fastify.auto.routes';

describe('fastify.auto.routes.ts tests', () => {
	it('FastifyAutoRoutes', () => {
		expect(FastifyAutoRoutes).toBeDefined();
	});

	it('FastifyAutoRoutes::RoutesMap:', () => {
		expect(FastifyAutoRoutes.RoutesMap).toBeDefined();
		expect(typeof FastifyAutoRoutes.RoutesMap).toBe('function');
	});

	it('FastifyAutoRoutes::addActionRoutes:', () => {
		expect(FastifyAutoRoutes.addActionRoutes).toBeDefined();
		expect(typeof FastifyAutoRoutes.addActionRoutes).toBe('function');
	});

	it('FastifyAutoRoutes::addFastifyRoutes:', () => {
		expect(FastifyAutoRoutes.addFastifyRoutes).toBeDefined();
		expect(typeof FastifyAutoRoutes.addFastifyRoutes).toBe('function');
	});

	it('FastifyAutoRoutes::cleanRelativePath:', () => {
		expect(FastifyAutoRoutes.cleanRelativePath).toBeDefined();
		expect(typeof FastifyAutoRoutes.cleanRelativePath).toBe('function');
	});

	it('FastifyAutoRoutes::default', () => {
		expect(FastifyAutoRoutes.default).toBeDefined();
		expect(Object.keys(FastifyAutoRoutes.default)).toHaveLength(0);
		expect(FastifyAutoRoutes.default).toEqual({});
	});
});
