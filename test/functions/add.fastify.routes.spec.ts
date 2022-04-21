import {expect} from 'chai';

import addFastifyRoutes from '../../src/functions/add.fastify.routes';
import rewire = require('rewire');

const addFastifyRoutesModule = rewire('../../src/functions/add.fastify.routes');
const METHODS = addFastifyRoutesModule.__get__('METHODS');
const _fixUrl = addFastifyRoutesModule.__get__('_fixUrl');
const _addRoute = addFastifyRoutesModule.__get__('_addRoute');

describe('add.fastify.routes.ts tests', () => {
	it('addFastifyRoutes', () => {
		expect(addFastifyRoutes).to.exist;
		expect(addFastifyRoutes).to.be.a('function');
	});

	it('METHODS', () => {
		expect(METHODS).to.exist;
		expect(METHODS).to.deep.equal(['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']);
	});

	it('_fixUrl', () => {
		expect(_fixUrl).to.exist;
		expect(_fixUrl).to.be.a('function');
	});

	it('_addRoute', () => {
		expect(_addRoute).to.exist;
		expect(_addRoute).to.be.a('function');
	});
});
