'use strict';

import * as fs from 'fs';
import * as path from 'path';

import * as _ from 'lodash';

import {IncomingMessage, Server, ServerResponse} from 'http';
import {FastifyBaseLogger, FastifyInstance, FastifyTypeProviderDefault} from 'fastify';

import addRoute from './add.route';
import cleanRelativePath from './clean.relative.path';

let routesRootFolder: string;

// TODO: convert to a fastify plugin! See: https://github.com/fastify/fastify-routes
const addFastifyRoutes = (
	fastify: FastifyInstance<Server<typeof IncomingMessage, typeof ServerResponse>, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProviderDefault>,
	folder: string,
	verbose: boolean = false
): void => {
	if (!routesRootFolder) routesRootFolder = folder;

	const fileNames: string[] = fs.readdirSync(folder);
	const files: string[] = _.filter(fileNames, (name) => !fs.lstatSync(path.join(folder, name)).isDirectory());

	for (const file of files) {
		const ext: string = path.extname(file);
		if (ext !== '.ts' && ext !== '.js') return;

		const absoluteFilePath: string = path.join(folder, file);
		const relativeFilePath: string = cleanRelativePath(routesRootFolder, absoluteFilePath, ext);

		const routes = require(absoluteFilePath);
		if (_.isArray(routes)) {
			for (const route of routes) {
				addRoute(fastify, route, relativeFilePath, verbose);
			}
		} else {
			addRoute(fastify, routes, relativeFilePath, verbose);
		}
	}

	const folders: string[] = _.filter(fileNames, (name: string) => fs.lstatSync(path.join(folder, name)).isDirectory());
	for (const sub of folders) {
		addFastifyRoutes(fastify, path.join(folder, sub));
	}
};
export default addFastifyRoutes;
