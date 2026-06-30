'use strict';

import {hrtime} from 'node:process';
import {FastifyInstance} from 'fastify';
import {IncomingMessage, Server, ServerResponse} from 'node:http';

import type {ActionAsControllerInterface} from '@owservable/actions';

import RoutesMap from '../routes.map';

import fixTags from './fix.tags';
import fixSchema from './fix.schema';
import fixRouteMethod from './fix.route.method';
import getMillisecondsFrom from './performance/get.milliseconds.from';

const addActionRoute = (
	fastify: FastifyInstance<Server<typeof IncomingMessage, typeof ServerResponse>, IncomingMessage, ServerResponse<IncomingMessage>>,
	action: ActionAsControllerInterface,
	config: any,
	verbose: boolean = false
): void => {
	const start: number = Number(hrtime.bigint());

	config.method = fixRouteMethod(config, verbose);
	config.schema = fixSchema(config);
	config.schema.tags = fixTags(config, 'action');
	config.handler = action.asController;

	fastify.route(config);
	RoutesMap.add(config.method, config.url);

	if (verbose) {
		console.log('[@owservable/fastify-auto-routes] -> addActionRoute: Added route', `[${getMillisecondsFrom(start).toFixed(3)}ms]`, config.method, config.url, '\n');
	}
};
export default addActionRoute;
