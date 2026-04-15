'use strict';

import type {RouteHandlerMethod} from 'fastify';

export interface RouteDefinition {
	url: string;
	method?: string;
	schema?: any;
	handler?: RouteHandlerMethod;
	[key: string]: any;
}
