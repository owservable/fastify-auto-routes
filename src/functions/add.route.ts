'use strict';

import * as _ from 'lodash';

import fixUrl from './fix.url';
import RoutesMap from '../routes.map';
import fixRouteMethod from './fix.route.method';

const addRoute: Function = (fastify: any, route: any, relativeFilePath: string, verbose: boolean = false): void => {
	if (!_.isPlainObject(route)) {
		if (verbose) console.log('[@owservable/fastify-auto-routes] -> addRoute: ROUTE PROBLEM', relativeFilePath, route);
		return;
	}

	route.method = fixRouteMethod(route, verbose);

	if (!_.has(route, 'url')) {
		if (verbose) console.log('[@owservable/fastify-auto-routes] -> addRoute: MISSING URL WARNING', relativeFilePath);
		_.set(route, 'url', '/');
	}

	const {url} = route;
	if (!_.startsWith(_.toLower(url), relativeFilePath)) _.set(route, 'url', fixUrl(url, relativeFilePath));

	fastify.route(route);
	RoutesMap.add(route.method, route.url);
	if (verbose) console.log('[@owservable/fastify-auto-routes] -> addRoute: Added route', route.method, route.url, '\n');
};
export default addRoute;
