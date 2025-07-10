'use strict';

export default class RoutesMap {
	public static add(method: string, route: string): void {
		method = method.toUpperCase();
		let routes: string[] = RoutesMap._routes.get(method) || [];
		routes.push(route);
		routes = Array.from(new Set(routes)).filter(Boolean).sort();
		RoutesMap._routes.set(method, routes);
	}

	public static getMethods(): string[] {
		return Array.from(RoutesMap._routes.keys()).filter(Boolean).sort();
	}

	public static getRoutes(method: string): string[] | null {
		return RoutesMap._routes.get(method?.toUpperCase() || '');
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
				let parts: string[] = route.split('/');
				parts = parts.filter(Boolean);
				const last: string = parts.join('.');
				// Replace lodash _.set with native object assignment
				const keys = last.split('.');
				let current = apis;
				for (let i = 0; i < keys.length - 1; i++) {
					if (!(keys[i] in current)) {
						current[keys[i]] = {};
					}
					current = current[keys[i]];
				}
				current[keys[keys.length - 1]] = true;
			}
			obj[method] = apis;
		}
		return obj;
	}

	private static readonly _routes: Map<string, string[]> = new Map<string, string[]>();
}
