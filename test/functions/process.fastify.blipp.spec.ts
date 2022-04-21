import {expect} from 'chai';

import processFastifyBlipp from '../../src/functions/process.fastify.blipp';

describe('process.fastify.blipp.ts tests', () => {
	it('processFastifyBlipp', () => {
		expect(processFastifyBlipp).to.exist;
		expect(processFastifyBlipp).to.be.a('function');
	});
});
