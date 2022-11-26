'use strict';

import {each, isArray} from 'lodash';

import {FastifyInstance} from 'fastify';
import {IncomingMessage, Server, ServerResponse} from 'http';

import {ActionAsControllerInterface} from '@owservable/actions';
import {listSubfoldersFilesByFolderName} from '@owservable/folders';

import RoutesMap from '../routes.map';

export default async function addActionRoutes(fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>, root: string, folderName: string) {
	const actionPaths: string[] = listSubfoldersFilesByFolderName(root, folderName);

	for (const actionPath of actionPaths) {
		// tslint:disable-next-line:callable-types
		const ActionClass: {new (): ActionAsControllerInterface} = require(actionPath).default;
		const action: ActionAsControllerInterface = new ActionClass();

		if (typeof action.routes === 'function' && typeof action.asController === 'function') {
			const config = await action.routes();
			if (isArray(config)) {
				each(config, (conf) => {
					conf.handler = action.asController;
					fastify.route(conf);
					RoutesMap.add(conf.method, conf.url);
				});
			} else {
				config.handler = action.asController;
				fastify.route(config);
				RoutesMap.add(config.method, config.url);
			}
		}
	}
}
