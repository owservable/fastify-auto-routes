'use strict';

import {expect} from 'chai';

import fixUrl from '../../src/functions/fix.url';

describe('fix.url.ts tests', () => {
	it('fixUrl exists', () => {
		expect(fixUrl).to.exist;
		expect(fixUrl).to.be.a('function');
	});
	it('fixUrl works', () => {
		let url = '/path/to/file';
		let relativeFilePath = '/blah/blah/blah';

		const fixed = fixUrl(url, relativeFilePath);
		expect(fixed).to.be.a('string');
		expect(fixed).to.equal('/blah/blah/blah/path/to/file');
	});
	it('fixUrl works with //', () => {
		let url = '/path/to/file/';
		let relativeFilePath = '/blah/blah/blah';

		const fixed = fixUrl(url, relativeFilePath);
		expect(fixed).to.be.a('string');
		expect(fixed).to.equal('/blah/blah/blah/path/to/file');
	});
	it('fixUrl works with end /', () => {
		let url = '/path/to/file';
		let relativeFilePath = '/blah/blah/blah/';

		const fixed = fixUrl(url, relativeFilePath);
		expect(fixed).to.be.a('string');
		expect(fixed).to.equal('/blah/blah/blah/path/to/file');
	});
	it('fixUrl works with // and end /', () => {
		let url = '/path/to/file/';
		let relativeFilePath = '/blah/blah/blah/';

		const fixed = fixUrl(url, relativeFilePath);
		expect(fixed).to.be.a('string');
		expect(fixed).to.equal('/blah/blah/blah/path/to/file');
	});
});
