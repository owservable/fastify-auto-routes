'use strict';

import * as _ from 'lodash';
import fixUrl from './fix.url';
import RoutesMap from '../routes.map';

const ALLOWED_METHODS: string[] = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'];

const addRoute = (fastify: any, route: any, relativeFilePath: string, verbose: boolean = false): void => {
	if (!_.isPlainObject(route)) {
		if (verbose) console.log('[@owservable/fastify-auto-routes] -> addRoute: ROUTE PROBLEM', relativeFilePath, route);
		return;
	}

	if (_.has(route, 'method')) route.method = _.toUpper(route.method);
	else _.set(route, 'method', 'GET');
	if (!ALLOWED_METHODS.includes(route.method)) {
		if (verbose) console.log('[@owservable/fastify-auto-routes] -> addRoute: METHOD PROBLEM', relativeFilePath, route);
		return;
	}

	if (!_.has(route, 'url')) {
		if (verbose) console.log('[@owservable/fastify-auto-routes] -> addRoute: MISSING URL WARNING', relativeFilePath);
		_.set(route, 'url', '/');
	}

	const {url} = route;
	if (!_.startsWith(_.toLower(url), relativeFilePath)) _.set(route, 'url', fixUrl(url, relativeFilePath));

	fastify[route.method] = route;
	RoutesMap.add(route.method, route.url);
	if (verbose) console.log('[@owservable/fastify-auto-routes] -> addRoute: Added route', route.method, route.url, '\n');
};
export default addRoute;
