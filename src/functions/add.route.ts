'use strict';

import RoutesMap from '../routes.map';

import fixUrl from './fix.url';
import fixTags from './fix.tags';
import fixSchema from './fix.schema';
import fixRouteMethod from './fix.route.method';

const addRoute: Function = (fastify: any, route: any, relativeFilePath: string, verbose: boolean = false): void => {
	if (!route || typeof route !== 'object' || Array.isArray(route)) {
		if (verbose) console.log('[@owservable/fastify-auto-routes] -> addRoute: ROUTE PROBLEM', relativeFilePath, route);
		return;
	}

	if (!('url' in route)) {
		if (verbose) console.log('[@owservable/fastify-auto-routes] -> addRoute: MISSING URL WARNING', relativeFilePath);
		route.url = '/';
	}

	const {url} = route;
	if (!url.toLowerCase().startsWith(relativeFilePath)) route.url = fixUrl(url, relativeFilePath);

	route.method = fixRouteMethod(route, verbose);
	route.schema = fixSchema(route);
	route.schema.tags = fixTags(route, relativeFilePath);

	fastify.route(route);
	RoutesMap.add(route.method, route.url);
	if (verbose) console.log('[@owservable/fastify-auto-routes] -> addRoute: Added route', route.method, route.url);
};
export default addRoute;
