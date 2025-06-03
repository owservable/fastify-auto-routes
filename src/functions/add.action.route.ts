'use strict';

import {FastifyInstance} from 'fastify';
import {IncomingMessage, Server, ServerResponse} from 'http';

import {ActionAsControllerInterface} from '@owservable/actions';

import RoutesMap from '../routes.map';

import fixTags from './fix.tags';
import fixSchema from './fix.schema';
import fixRouteMethod from './fix.route.method';

const addActionRoute: Function = (
	fastify: FastifyInstance<Server<typeof IncomingMessage, typeof ServerResponse>, IncomingMessage, ServerResponse<IncomingMessage>>,
	action: ActionAsControllerInterface,
	config: any,
	verbose: boolean = false
): void => {
	config.method = fixRouteMethod(config, verbose);
	config.schema = fixSchema(config);
	config.schema.tags = fixTags(config, 'action');
	config.handler = action.asController;

	fastify.route(config);
	RoutesMap.add(config.method, config.url);
};
export default addActionRoute;
