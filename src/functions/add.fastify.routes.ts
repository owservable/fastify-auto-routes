'use strict';

import * as fs from 'node:fs';
import * as path from 'node:path';
import {hrtime} from 'node:process';
import {IncomingMessage, Server, ServerResponse} from 'node:http';

import {FastifyInstance} from 'fastify';

import type {ItemStat} from '@owservable/folders';

import addRoute from './add.route';
import cleanRelativePath from './clean.relative.path';
import getMillisecondsFrom from './performance/get.milliseconds.from';

let routesRootFolder: string;

const addFastifyRoutes = async (
	fastify: FastifyInstance<Server<typeof IncomingMessage, typeof ServerResponse>, IncomingMessage, ServerResponse<IncomingMessage>>,
	folder: string,
	verbose: boolean = false
): Promise<void> => {
	if (!routesRootFolder) routesRootFolder = folder;

	const fileNames: string[] = await fs.promises.readdir(folder);
	const stats: ItemStat[] = await Promise.all(
		fileNames.map(async (name): Promise<ItemStat> => ({
			name,
			fullPath: path.join(folder, name),
			isDirectory: (await fs.promises.lstat(path.join(folder, name))).isDirectory()
		}))
	);

	const files: ItemStat[] = stats.filter((stat: ItemStat): boolean => !stat.isDirectory);
	const folders: ItemStat[] = stats.filter((stat: ItemStat): boolean => stat.isDirectory);

	// Process files in parallel batches for better performance
	const BATCH_SIZE = 10; // Process up to 10 files concurrently
	const validFiles: ItemStat[] = files.filter((file: ItemStat): boolean => {
		const ext: string = path.extname(file.name);
		return ext === '.ts' || ext === '.js';
	});

	const processFile = async (file: ItemStat): Promise<void> => {
		const start: number = Number(hrtime.bigint());

		const ext: string = path.extname(file.name);
		const relativeFilePath: string = cleanRelativePath(routesRootFolder, file.fullPath, ext as '.ts' | '.js');

		const routeModule: {default?: unknown} = require(file.fullPath) as {default?: unknown};
		const routes: unknown = routeModule.default || routeModule;

		if (verbose) console.log('[@owservable/fastify-auto-routes] -> addFastifyRoutes: loaded file', `[${getMillisecondsFrom(start).toFixed(3)}ms]${folder}/${file.name}`);

		if (Array.isArray(routes)) {
			for (const route of routes) {
				addRoute(fastify, route, relativeFilePath, verbose);
			}
		} else {
			addRoute(fastify, routes, relativeFilePath, verbose);
		}
	};

	// Process files in parallel batches
	for (let i = 0; i < validFiles.length; i += BATCH_SIZE) {
		const batch: ItemStat[] = validFiles.slice(i, i + BATCH_SIZE);
		await Promise.all(batch.map(processFile));
	}

	// Process subdirectories in parallel for better performance
	await Promise.all(
		folders.map(async (sub: ItemStat): Promise<void> => {
			await addFastifyRoutes(fastify, sub.fullPath, verbose);
		})
	);
};

export default addFastifyRoutes;
