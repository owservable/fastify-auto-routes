'use strict';

import * as _ from 'lodash';

export default class RoutesMap {
	public static add(method: string, route: string): void {
		method = _.toUpper(method);
		let routes: string[] = RoutesMap._routes.get(method) || [];
		routes.push(route);
		routes = _.sortBy(_.compact(_.uniq(routes)));
		RoutesMap._routes.set(method, routes);
	}

	public static getMethods(): string[] {
		return _.sortBy(_.compact(Array.from(RoutesMap._routes.keys())));
	}

	public static getRoutes(method: string): string[] | null {
		return RoutesMap._routes.get(_.toUpper(method));
	}

	public static keys(): string[] {
		return Array.from(RoutesMap._routes.keys());
	}

	public static values(): string[][] {
		return Array.from(RoutesMap._routes.values());
	}

	public static clear(): void {
		RoutesMap._routes.clear();
	}

	public static list(): any {
		const obj: any = {};
		const methods: string[] = RoutesMap.getMethods();
		for (const method of methods) {
			obj[method] = RoutesMap.getRoutes(method);
		}
		return obj;
	}

	public static json(): any {
		const obj: any = {};
		const methods: string[] = RoutesMap.getMethods();
		for (const method of methods) {
			const apis: any = {};
			const routes: string[] = RoutesMap.getRoutes(method);
			for (const route of routes) {
				let parts: string[] = _.split(route, '/');
				parts = _.compact(parts);
				const last: string = _.join(parts, '.');
				_.set(apis, last, true);
			}
			obj[method] = apis;
		}
		return obj;
	}

	private static readonly _routes: Map<string, string[]> = new Map<string, string[]>();
}
