'use strict';

const ALLOWED_METHODS: string[] = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'];

const fixRouteMethod: Function = (route: any, verbose: boolean = false): string => {
	if (ALLOWED_METHODS.includes(route.method?.toUpperCase())) return route.method.toUpperCase();
	if (verbose) console.log('[@owservable/fastify-auto-routes] -> INVALID METHOD', route);
	return 'GET';
};
export default fixRouteMethod;
