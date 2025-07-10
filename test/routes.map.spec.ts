'use strict';

import * as _ from 'lodash';
import {faker} from '@faker-js/faker';

import RoutesMap from '../src/routes.map';

const _methods = (): string[] => _.sortBy(_.map(faker.lorem.words(3).split(' '), _.toUpper));
const _route = (): string => _.join(_.map(faker.lorem.words(_.random(2, 5)).split(' '), _.toLower), '/');
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
			expect((RoutesMap as any)._routes.size).toBe(0);

			const methods = _methods();
			const routes = [_routes(3), _routes(2), _routes(4)];

			RoutesMap.add(_.toLower(methods[0]), routes[0][0]);
			expect((RoutesMap as any)._routes.size).toBeGreaterThan(0);
			expect(Array.from((RoutesMap as any)._routes.keys())).toHaveLength(1);
			expect(Array.from((RoutesMap as any)._routes.values())).toHaveLength(1);
			expect(Array.from((RoutesMap as any)._routes.values())[0]).toHaveLength(1);

			RoutesMap.add(_.toLower(methods[0]), routes[0][1]);
			expect(Array.from((RoutesMap as any)._routes.keys())).toHaveLength(1);
			expect(Array.from((RoutesMap as any)._routes.values())).toHaveLength(1);
			expect(Array.from((RoutesMap as any)._routes.values())[0]).toHaveLength(2);

			RoutesMap.add(_.toLower(methods[0]), routes[0][2]);
			expect(Array.from((RoutesMap as any)._routes.keys())).toHaveLength(1);
			expect(Array.from((RoutesMap as any)._routes.values())).toHaveLength(1);
			expect(Array.from((RoutesMap as any)._routes.values())[0]).toHaveLength(3);

			RoutesMap.add(_.toLower(methods[1]), routes[1][0]);
			RoutesMap.add(_.toLower(methods[1]), routes[1][1]);
			expect(Array.from((RoutesMap as any)._routes.keys())).toHaveLength(2);
			expect(Array.from((RoutesMap as any)._routes.values())).toHaveLength(2);
			expect(Array.from((RoutesMap as any)._routes.values())[1]).toHaveLength(2);
		});
	});

	describe('RoutesMap::getMethods', () => {
		it('empty', () => {
			expect(RoutesMap.getMethods()).toHaveLength(0);
		});

		it('not empty', () => {
			const methods = _methods();
			(RoutesMap as any)._routes.set(methods[0], _routes(3));
			expect(RoutesMap.getMethods().length).toBeGreaterThan(0);
			expect(RoutesMap.getMethods()).toHaveLength(1);
			(RoutesMap as any)._routes.set(methods[1], _routes(2));
			(RoutesMap as any)._routes.set(methods[2], _routes(4));
			expect(RoutesMap.getMethods()).toHaveLength(3);
		});
	});

	describe('RoutesMap::getRoutes', () => {
		it('null', () => {
			expect(RoutesMap.getRoutes(null)).toBeUndefined();
			expect(RoutesMap.getRoutes(faker.lorem.word())).toBeUndefined();
		});

		it('not null', () => {
			const methods = _methods();
			(RoutesMap as any)._routes.set(methods[0], _routes(3));
			expect(RoutesMap.getRoutes(methods[0]).length).toBeGreaterThan(0);
			expect(RoutesMap.getRoutes(methods[0])).toHaveLength(3);
			(RoutesMap as any)._routes.set(methods[1], _routes(2));
			expect(RoutesMap.getRoutes(methods[1])).toHaveLength(2);
			(RoutesMap as any)._routes.set(methods[2], _routes(4));
			expect(RoutesMap.getRoutes(methods[2])).toHaveLength(4);
		});
	});

	describe('RoutesMap::keys', () => {
		it('empty', () => {
			expect(RoutesMap.keys()).toHaveLength(0);
		});

		it('not empty', () => {
			const methods = _methods();
			(RoutesMap as any)._routes.set(methods[0], _routes(3));
			expect(RoutesMap.keys().length).toBeGreaterThan(0);
			expect(RoutesMap.keys()).toHaveLength(1);
			(RoutesMap as any)._routes.set(methods[1], _routes(2));
			expect(RoutesMap.keys()).toHaveLength(2);
			(RoutesMap as any)._routes.set(methods[2], _routes(4));
			expect(RoutesMap.keys()).toHaveLength(3);
			expect(RoutesMap.keys()).toEqual(methods);
		});
	});

	describe('RoutesMap::values', () => {
		it('empty', () => {
			expect(RoutesMap.values()).toHaveLength(0);
		});

		it('not empty', () => {
			const methods = _methods();
			const routes = [_routes(3), _routes(2), _routes(4)];
			(RoutesMap as any)._routes.set(methods[0], routes[0]);
			expect(RoutesMap.values().length).toBeGreaterThan(0);
			expect(RoutesMap.values()).toHaveLength(1);
			(RoutesMap as any)._routes.set(methods[1], routes[1]);
			expect(RoutesMap.values()).toHaveLength(2);
			(RoutesMap as any)._routes.set(methods[2], routes[2]);
			expect(RoutesMap.values()).toHaveLength(3);
			expect(RoutesMap.values()).toEqual(routes);
		});
	});

	describe('RoutesMap::clear', () => {
		it('empty', () => {
			expect((RoutesMap as any)._routes.size).toBe(0);
		});

		it('not empty', () => {
			(RoutesMap as any)._routes.set(faker.lorem.word(), _routes(3));
			expect((RoutesMap as any)._routes.size).toBeGreaterThan(0);

			RoutesMap.clear();
			expect((RoutesMap as any)._routes.size).toBe(0);
		});
	});

	describe('RoutesMap::list', () => {
		it('empty', () => {
			expect(Object.keys(RoutesMap.list())).toHaveLength(0);
		});

		it('not empty', () => {
			const methods = _methods();
			const routes = [_routes(3), _routes(2), _routes(4)];
			(RoutesMap as any)._routes.set(methods[0], routes[0]);
			expect(Object.keys(RoutesMap.list()).length).toBeGreaterThan(0);
			expect(_.keys(RoutesMap.list())).toHaveLength(1);

			(RoutesMap as any)._routes.set(methods[1], routes[1]);
			expect(_.keys(RoutesMap.list())).toHaveLength(2);

			(RoutesMap as any)._routes.set(methods[2], routes[2]);
			expect(_.keys(RoutesMap.list())).toHaveLength(3);

			expect(_.sortBy(_.keys(RoutesMap.list()))).toEqual(methods);

			const test = {};
			for (const i in methods) _.set(test, methods[i], routes[i]);
			expect(RoutesMap.list()).toEqual(test);
		});
	});

	describe('RoutesMap::json', () => {
		it('empty', () => {
			expect(Object.keys(RoutesMap.json())).toHaveLength(0);
		});

		it('not empty', () => {
			const methods = _methods();
			const routes = [_routes(3), _routes(2), _routes(4)];
			(RoutesMap as any)._routes.set(methods[0], routes[0]);
			expect(Object.keys(RoutesMap.json()).length).toBeGreaterThan(0);
			expect(_.keys(RoutesMap.json())).toHaveLength(1);

			(RoutesMap as any)._routes.set(methods[1], routes[1]);
			expect(_.keys(RoutesMap.json())).toHaveLength(2);

			(RoutesMap as any)._routes.set(methods[2], routes[2]);
			expect(_.keys(RoutesMap.json())).toHaveLength(3);

			expect(_.sortBy(_.keys(RoutesMap.json()))).toEqual(methods);
		});
	});
});
