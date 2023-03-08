'use strict';

import * as fs from 'fs';
import * as path from 'path';

import * as _ from 'lodash';

import {FastifyInstance} from 'fastify';
import {IncomingMessage, Server, ServerResponse} from 'http';
import {Http2Server, Http2ServerRequest, Http2ServerResponse} from 'http2';

import addRoute from './add.route';
import cleanRelativePath from './clean.relative.path';

let routesRootFolder: string;

// TODO: convert to a fastify plugin! See: https://github.com/fastify/fastify-routes
const addFastifyRoutes = (
	fastify: FastifyInstance<Server, IncomingMessage, ServerResponse> | FastifyInstance<Http2Server, Http2ServerRequest, Http2ServerResponse>,
	folder: string
): void => {
	if (!routesRootFolder) routesRootFolder = folder;

	const fileNames = fs.readdirSync(folder);
	const files = _.filter(fileNames, (name) => !fs.lstatSync(path.join(folder, name)).isDirectory());
	_.each(files, (file: string) => {
		const ext = path.extname(file);
		if (ext !== '.ts' && ext !== '.js') return;

		const absoluteFilePath = path.join(folder, file);
		const relativeFilePath = cleanRelativePath(routesRootFolder, absoluteFilePath, ext);

		const route = require(absoluteFilePath);
		if (_.isArray(route)) _.each(route, (r: any) => addRoute(fastify, r, relativeFilePath));
		else addRoute(fastify, route, relativeFilePath);
	});

	const folders = _.filter(fileNames, (name: string) => fs.lstatSync(path.join(folder, name)).isDirectory());
	_.each(folders, (sub: string) => addFastifyRoutes(fastify, path.join(folder, sub)));
};
export default addFastifyRoutes;
