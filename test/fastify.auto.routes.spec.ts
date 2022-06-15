import {expect} from 'chai';

import * as FastifyAutoRoutes from '../src/fastify.auto.routes';

describe('fastify.auto.routes.ts tests', () => {
	it('FastifyAutoRoutes', () => {
		expect(FastifyAutoRoutes).to.exist;
	});

	it('FastifyAutoRoutes::RoutesMap:', () => {
		expect(FastifyAutoRoutes.RoutesMap).to.exist;
		expect(FastifyAutoRoutes.RoutesMap).to.be.a('function');
	});

	it('FastifyAutoRoutes::addFastifyRoutes:', () => {
		expect(FastifyAutoRoutes.addFastifyRoutes).to.exist;
		expect(FastifyAutoRoutes.addFastifyRoutes).to.be.a('function');
	});

	it('FastifyAutoRoutes::cleanRelativePath:', () => {
		expect(FastifyAutoRoutes.cleanRelativePath).to.exist;
		expect(FastifyAutoRoutes.cleanRelativePath).to.be.a('function');
	});

	it('FastifyAutoRoutes::default', () => {
		expect(FastifyAutoRoutes.default).to.exist;
		expect(FastifyAutoRoutes.default).to.be.empty;
		expect(FastifyAutoRoutes.default).to.deep.equal({});
	});
});
