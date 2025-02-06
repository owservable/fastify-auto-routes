'use strict';

import * as fs from 'fs';
import * as path from 'path';

import * as _ from 'lodash';

import {IncomingMessage, Server, ServerResponse} from 'http';
import {FastifyBaseLogger, FastifyInstance, FastifyTypeProviderDefault} from 'fastify';

import addRoute from './add.route';
import cleanRelativePath from './clean.relative.path';

let routesRootFolder: string;

const addFastifyRoutes = (
	fastify: FastifyInstance<Server<typeof IncomingMessage, typeof ServerResponse>, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProviderDefault>,
	folder: string,
	verbose: boolean = false
): void => {
	if (verbose) console.log('\n[@owservable/fastify-auto-routes] -> addFastifyRoutes:', folder);
	if (!routesRootFolder) routesRootFolder = folder;

	const fileNames: string[] = fs.readdirSync(folder);
	const files: string[] = _.filter(fileNames, (name) => !fs.lstatSync(path.join(folder, name)).isDirectory());
	if (verbose) console.log('[@owservable/fastify-auto-routes] -> addFastifyRoutes:', folder, `${files.length} files`);

	for (const file of files) {
		if (verbose) console.log('[@owservable/fastify-auto-routes] -> addFastifyRoutes: processing...', folder, file);
		const ext: string = path.extname(file);
		if (ext !== '.ts' && ext !== '.js') return;

		const absoluteFilePath: string = path.join(folder, file);
		const relativeFilePath: string = cleanRelativePath(routesRootFolder, absoluteFilePath, ext);

		const routes = require(absoluteFilePath);
		if (_.isArray(routes)) {
			if (verbose) console.log('[@owservable/fastify-auto-routes] -> addFastifyRoutes:', folder, file, `${routes.length} routes`);
			for (const route of routes) {
				addRoute(fastify, route, relativeFilePath, verbose);
			}
		} else {
			if (verbose) console.log('[@owservable/fastify-auto-routes] -> addFastifyRoutes:', folder, file, '1 route');
			addRoute(fastify, routes, relativeFilePath, verbose);
		}
	}

	const folders: string[] = _.filter(fileNames, (name: string) => fs.lstatSync(path.join(folder, name)).isDirectory());
	if (verbose) console.log('[@owservable/fastify-auto-routes] -> addFastifyRoutes:', folder, 'subfolders:', `${folders.length} subfolders`);
	for (const sub of folders) {
		addFastifyRoutes(fastify, path.join(folder, sub), verbose);
	}
};
export default addFastifyRoutes;
