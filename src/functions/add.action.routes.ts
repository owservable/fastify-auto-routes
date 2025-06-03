'use strict';

import * as _ from 'lodash';

import {FastifyInstance} from 'fastify';
import {IncomingMessage, Server, ServerResponse} from 'http';

import {ActionAsControllerInterface} from '@owservable/actions';
import {listSubfoldersFilesByFolderName} from '@owservable/folders';

import addActionRoute from './add.action.route';

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
			if (_.isArray(config)) {
				_.each(config, (conf) => {
					addActionRoute(fastify, conf, actionPath, verbose);
				});
			} else {
				addActionRoute(fastify, config, actionPath, verbose);
			}
		}
	}
};
export default addActionRoutes;
