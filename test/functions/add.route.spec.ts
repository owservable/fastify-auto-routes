'use strict';

import {expect} from 'chai';
import addRoute from '../../src/functions/add.route';
import rewire = require('rewire');

const addRouteModule = rewire('../../src/functions/add.route');
const ALLOWED_METHODS = addRouteModule.__get__('ALLOWED_METHODS');

describe('add.route.ts tests', () => {
	it('addRoute exists', () => {
		expect(addRoute).to.exist;
		expect(addRoute).to.be.a('function');
	});

	it('ALLOWED_METHODS', () => {
		expect(ALLOWED_METHODS).to.exist;
		expect(ALLOWED_METHODS).to.deep.equal(['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']);
	});

	it('should be implemented');
});
