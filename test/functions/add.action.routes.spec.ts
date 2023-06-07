'use strict';

import {expect} from 'chai';

import addActionRoutes from '../../src/functions/add.action.routes';

describe('add.action.routes tests', () => {
	it('addActionRoutes exists', () => {
		expect(addActionRoutes).to.exist;
		expect(addActionRoutes).to.be.a('function');
	});

	it('should be implemented');
});
