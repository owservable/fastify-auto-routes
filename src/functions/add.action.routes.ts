'use strict';

import {each, isArray} from 'lodash';

import {IncomingMessage, Server, ServerResponse} from 'http';
import {FastifyInstance} from 'fastify';

import {ActionAsControllerInterface} from '@owservable/actions';
import {listSubfoldersFilesByFolderName} from '@owservable/folders';

import RoutesMap from '../routes.map';
import fixRouteMethod from './fix.route.method';

const addActionRoutes: Function = async (
	fastify: FastifyInstance<Server<typeof IncomingMessage, typeof ServerResponse>, IncomingMessage, ServerResponse<IncomingMessage>>,
	root: string,
	folderName: string,
	verbose: boolean = false
): Promise<void> => {
	const actionPaths: string[] = listSubfoldersFilesByFolderName(root, folderName);

	for (const actionPath of actionPaths) {
		if (verbose) console.log('[@owservable/fastify-auto-routes] -> Initializing route', actionPath);

		// tslint:disable-next-line:callable-types
		const ActionClass: new () => ActionAsControllerInterface = require(actionPath).default;
		const action: ActionAsControllerInterface = new ActionClass();

		if (typeof action.routes === 'function' && typeof action.asController === 'function') {
			const config = await action.routes();
			if (isArray(config)) {
				each(config, (conf) => {
					conf.method = fixRouteMethod(conf, verbose);
					conf.handler = action.asController;
					fastify.route(conf);
					RoutesMap.add(conf.method, conf.url);
				});
			} else {
				config.method = fixRouteMethod(config, verbose);
				config.handler = action.asController;
				fastify.route(config);
				RoutesMap.add(config.method, config.url);
			}
		}
	}
};
export default addActionRoutes;
