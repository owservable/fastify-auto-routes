'use strict';

import * as _ from 'lodash';

const ALLOWED_METHODS: string[] = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'];

const fixRouteMethod: Function = (route: any, verbose: boolean = false): string => {
	if (ALLOWED_METHODS.includes(_.toUpper(route.method))) return _.toUpper(route.method);
	if (verbose) console.log('[@owservable/fastify-auto-routes] -> INVALID METHOD', route);
	return 'GET';
};
export default fixRouteMethod;
