'use strict';

export interface RouteDefinition {
	url: string;
	method?: string;
	schema?: any; // Keep as any for flexibility with Fastify schemas
	handler?: Function;
	[key: string]: any; // Allow additional properties for flexibility
}
