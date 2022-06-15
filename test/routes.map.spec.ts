import {expect} from 'chai';

import * as _ from 'lodash';
import {faker} from '@faker-js/faker';

import RoutesMap from '../src/routes.map';

const _methods = (): string[] => _.sortBy(_.map(faker.random.words(3).split(' '), _.toUpper));
const _route = (): string => _.join(_.map(faker.random.words(_.random(2, 5)).split(' '), _.toLower), '/');
const _routes = (count: number): string[] => {
	const routes: string[] = [];
	_.each(_.range(count), (i) => routes.push(_route()));
	return _.sortBy(routes);
};

describe('routes.map.ts tests', () => {
	beforeEach(async () => {
		(RoutesMap as any)._routes.clear();
	});

	describe('RoutesMap::add', () => {
		it('add', () => {
			expect((RoutesMap as any)._routes).to.be.empty;

			const methods = _methods();
			const routes = [_routes(3), _routes(2), _routes(4)];

			RoutesMap.add(_.toLower(methods[0]), routes[0][0]);
			expect((RoutesMap as any)._routes).to.not.be.empty;
			expect(Array.from((RoutesMap as any)._routes.keys())).to.have.length(1);
			expect(Array.from((RoutesMap as any)._routes.values())).to.have.length(1);
			expect(Array.from((RoutesMap as any)._routes.values())[0]).to.have.length(1);

			RoutesMap.add(_.toLower(methods[0]), routes[0][1]);
			expect(Array.from((RoutesMap as any)._routes.keys())).to.have.length(1);
			expect(Array.from((RoutesMap as any)._routes.values())).to.have.length(1);
			expect(Array.from((RoutesMap as any)._routes.values())[0]).to.have.length(2);

			RoutesMap.add(_.toLower(methods[0]), routes[0][2]);
			expect(Array.from((RoutesMap as any)._routes.keys())).to.have.length(1);
			expect(Array.from((RoutesMap as any)._routes.values())).to.have.length(1);
			expect(Array.from((RoutesMap as any)._routes.values())[0]).to.have.length(3);

			RoutesMap.add(_.toLower(methods[1]), routes[1][0]);
			RoutesMap.add(_.toLower(methods[1]), routes[1][1]);
			expect(Array.from((RoutesMap as any)._routes.keys())).to.have.length(2);
			expect(Array.from((RoutesMap as any)._routes.values())).to.have.length(2);
			expect(Array.from((RoutesMap as any)._routes.values())[1]).to.have.length(2);
		});
	});

	describe('RoutesMap::getMethods', () => {
		it('empty', () => {
			expect(RoutesMap.getMethods()).to.be.empty;
		});

		it('not empty', () => {
			const methods = _methods();
			(RoutesMap as any)._routes.set(methods[0], _routes(3));
			expect(RoutesMap.getMethods()).to.not.be.empty;
			expect(RoutesMap.getMethods()).to.have.length(1);
			(RoutesMap as any)._routes.set(methods[1], _routes(2));
			(RoutesMap as any)._routes.set(methods[2], _routes(4));
			expect(RoutesMap.getMethods()).to.have.length(3);
		});
	});

	describe('RoutesMap::getRoutes', () => {
		it('null', () => {
			expect(RoutesMap.getRoutes(null)).to.be.undefined;
			expect(RoutesMap.getRoutes(faker.random.word())).to.be.undefined;
		});

		it('not null', () => {
			const methods = _methods();
			(RoutesMap as any)._routes.set(methods[0], _routes(3));
			expect(RoutesMap.getRoutes(methods[0])).to.not.be.empty;
			expect(RoutesMap.getRoutes(methods[0])).to.have.length(3);
			(RoutesMap as any)._routes.set(methods[1], _routes(2));
			expect(RoutesMap.getRoutes(methods[1])).to.have.length(2);
			(RoutesMap as any)._routes.set(methods[2], _routes(4));
			expect(RoutesMap.getRoutes(methods[2])).to.have.length(4);
		});
	});

	describe('RoutesMap::keys', () => {
		it('empty', () => {
			expect(RoutesMap.keys()).to.be.empty;
		});

		it('not empty', () => {
			const methods = _methods();
			(RoutesMap as any)._routes.set(methods[0], _routes(3));
			expect(RoutesMap.keys()).to.not.be.empty;
			expect(RoutesMap.keys()).to.have.length(1);
			(RoutesMap as any)._routes.set(methods[1], _routes(2));
			expect(RoutesMap.keys()).to.have.length(2);
			(RoutesMap as any)._routes.set(methods[2], _routes(4));
			expect(RoutesMap.keys()).to.have.length(3);
			expect(RoutesMap.keys()).to.deep.equal(methods);
		});
	});

	describe('RoutesMap::values', () => {
		it('empty', () => {
			expect(RoutesMap.values()).to.be.empty;
		});

		it('not empty', () => {
			const methods = _methods();
			const routes = [_routes(3), _routes(2), _routes(4)];
			(RoutesMap as any)._routes.set(methods[0], routes[0]);
			expect(RoutesMap.values()).to.not.be.empty;
			expect(RoutesMap.values()).to.have.length(1);
			(RoutesMap as any)._routes.set(methods[1], routes[1]);
			expect(RoutesMap.values()).to.have.length(2);
			(RoutesMap as any)._routes.set(methods[2], routes[2]);
			expect(RoutesMap.values()).to.have.length(3);
			expect(RoutesMap.values()).to.deep.equal(routes);
		});
	});

	describe('RoutesMap::clear', () => {
		it('empty', () => {
			expect((RoutesMap as any)._routes).to.be.empty;
		});

		it('not empty', () => {
			(RoutesMap as any)._routes.set(faker.random.word(), _routes(3));
			expect((RoutesMap as any)._routes).to.not.be.empty;

			RoutesMap.clear();
			expect((RoutesMap as any)._routes).to.be.empty;
		});
	});

	describe('RoutesMap::list', () => {
		it('empty', () => {
			expect(RoutesMap.list()).to.be.empty;
		});

		it('not empty', () => {
			const methods = _methods();
			const routes = [_routes(3), _routes(2), _routes(4)];
			(RoutesMap as any)._routes.set(methods[0], routes[0]);
			expect(RoutesMap.list()).to.not.be.empty;
			expect(_.keys(RoutesMap.list())).to.have.length(1);

			(RoutesMap as any)._routes.set(methods[1], routes[1]);
			expect(_.keys(RoutesMap.list())).to.have.length(2);

			(RoutesMap as any)._routes.set(methods[2], routes[2]);
			expect(_.keys(RoutesMap.list())).to.have.length(3);

			expect(_.sortBy(_.keys(RoutesMap.list()))).to.deep.equal(methods);

			const test = {};
			for (const i in methods) _.set(test, methods[i], routes[i]);
			expect(RoutesMap.list()).to.deep.equal(test);
		});
	});

	describe('RoutesMap::json', () => {
		it('empty', () => {
			expect(RoutesMap.json()).to.be.empty;
		});

		it('not empty', () => {
			const methods = _methods();
			const routes = [_routes(3), _routes(2), _routes(4)];
			(RoutesMap as any)._routes.set(methods[0], routes[0]);
			expect(RoutesMap.json()).to.not.be.empty;
			expect(_.keys(RoutesMap.json())).to.have.length(1);

			(RoutesMap as any)._routes.set(methods[1], routes[1]);
			expect(_.keys(RoutesMap.json())).to.have.length(2);

			(RoutesMap as any)._routes.set(methods[2], routes[2]);
			expect(_.keys(RoutesMap.json())).to.have.length(3);

			expect(_.sortBy(_.keys(RoutesMap.json()))).to.deep.equal(methods);
		});
	});
});
