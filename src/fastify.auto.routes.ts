'use strict';

// routing
import RoutesMap from './routes.map';

import addFastifyRoutes from './functions/add.fastify.routes';
import cleanRelativePath from './functions/clean.relative.path';
import processFastifyBlipp from './functions/process.fastify.blipp';

export {
	// routing
	RoutesMap,
	// routing functions
	addFastifyRoutes,
	cleanRelativePath,
	processFastifyBlipp
};

const FastifyAutoRoutes = {};
export default FastifyAutoRoutes;
