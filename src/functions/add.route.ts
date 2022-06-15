'use strict';

import * as _ from 'lodash';
import fixUrl from './fix.url';
import RoutesMap from '../routes.map';

const METHODS = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'];

const addRoute = (fastify: any, route: any, relativeFilePath: string): void => {
	if (!_.has(route, 'url')) route.url = '/';

	const {url} = route;
	if (!_.startsWith(_.toLower(url), relativeFilePath)) route.url = fixUrl(url, relativeFilePath);

	if (_.has(route, 'method')) route.method = _.toUpper(route.method);
	else route.method = 'GET';

	if (_.isPlainObject(route) && METHODS.includes(route.method)) {
		fastify.route(route);
		RoutesMap.add(route.method, route.url);
	}
};
export default addRoute;
