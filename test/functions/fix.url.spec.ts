import {expect} from 'chai';
import fixUrl from '../../src/functions/fix.url';

describe('fix.url.ts tests', () => {
	it('fixUrl exists', () => {
		expect(fixUrl).to.exist;
		expect(fixUrl).to.be.a('function');
	});
});
