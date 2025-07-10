'use strict';

import * as fs from 'fs';
import * as path from 'path';
import {hrtime} from 'node:process';

import {IncomingMessage, Server, ServerResponse} from 'http';
import {FastifyInstance} from 'fastify';

import addRoute from './add.route';
import cleanRelativePath from './clean.relative.path';

let routesRootFolder: string;

const NS_PER_SEC: number = 1e9;

const addFastifyRoutes = (
	fastify: FastifyInstance<Server<typeof IncomingMessage, typeof ServerResponse>, IncomingMessage, ServerResponse<IncomingMessage>>,
	folder: string,
	verbose: boolean = false
): void => {
	if (verbose) console.log('\n[@owservable/fastify-auto-routes] -> addFastifyRoutes:', folder);
	if (!routesRootFolder) routesRootFolder = folder;

	const fileNames: string[] = fs.readdirSync(folder);
	const files: string[] = fileNames.filter((name) => !fs.lstatSync(path.join(folder, name)).isDirectory());
	if (verbose) console.log('[@owservable/fastify-auto-routes] -> addFastifyRoutes:', folder, `${files.length} files`);

	for (const file of files) {
		if (verbose) console.log('[@owservable/fastify-auto-routes] -> addFastifyRoutes: processing...', `${folder}/${file}`);
		const ext: string = path.extname(file);
		if (ext !== '.ts' && ext !== '.js') continue;

		const absoluteFilePath: string = path.join(folder, file);
		const relativeFilePath: string = cleanRelativePath(routesRootFolder, absoluteFilePath, ext);

		const start: number = Number(hrtime.bigint());
		if (verbose) console.log('[@owservable/fastify-auto-routes] -> addFastifyRoutes: loading file...', absoluteFilePath);
		const routes = require(absoluteFilePath);

		const time: number = Number(Number(hrtime.bigint()) - start) / NS_PER_SEC;
		if (verbose) console.log('[@owservable/fastify-auto-routes] -> addFastifyRoutes: loaded file', `[${time.toFixed(3)}s] ${folder}/${file}`);
		if (Array.isArray(routes)) {
			if (verbose) console.log('[@owservable/fastify-auto-routes] -> addFastifyRoutes:', absoluteFilePath, `${routes.length} routes`);
			for (const route of routes) {
				addRoute(fastify, route, relativeFilePath, verbose);
			}
		} else {
			if (verbose) console.log('[@owservable/fastify-auto-routes] -> addFastifyRoutes:', absoluteFilePath, '1 route');
			addRoute(fastify, routes, relativeFilePath, verbose);
		}
	}

	const folders: string[] = fileNames.filter((name: string) => fs.lstatSync(path.join(folder, name)).isDirectory());
	if (verbose) console.log('[@owservable/fastify-auto-routes] -> addFastifyRoutes:', folder, 'subfolders:', `${folders.length} subfolders`);
	for (const sub of folders) {
		addFastifyRoutes(fastify, path.join(folder, sub), verbose);
	}
};
export default addFastifyRoutes;
