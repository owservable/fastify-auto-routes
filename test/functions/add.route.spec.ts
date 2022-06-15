import {expect} from 'chai';
import addRoute from '../../src/functions/add.route';
import rewire = require('rewire');

const addRouteModule = rewire('../../src/functions/add.route');
const METHODS = addRouteModule.__get__('METHODS');

describe('add.route.ts tests', () => {
	it('addRoute exists', () => {
		expect(addRoute).to.exist;
		expect(addRoute).to.be.a('function');
	});

	it('METHODS', () => {
		expect(METHODS).to.exist;
		expect(METHODS).to.deep.equal(['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']);
	});
});
