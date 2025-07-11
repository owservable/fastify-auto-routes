'use strict';

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
	if (verbose) console.log('\n[@owservable/fastify-auto-routes] -> addActionRoutes:', folderName);
	const actionPaths: string[] = listSubfoldersFilesByFolderName(root, folderName);

	for (const actionPath of actionPaths) {
		if (verbose) console.log('[@owservable/fastify-auto-routes] -> Initializing route', actionPath);

		// tslint:disable-next-line:callable-types
		const ActionClass: new () => ActionAsControllerInterface = require(actionPath).default;
		const action: ActionAsControllerInterface = new ActionClass();

		if (typeof action.routes === 'function' && typeof action.asController === 'function') {
			const config = await action.routes();
			if (Array.isArray(config)) {
				config.forEach((conf) => {
					addActionRoute(fastify, action, conf, verbose);
				});
			} else {
				addActionRoute(fastify, action, config, verbose);
			}
		}
	}
};
export default addActionRoutes;
