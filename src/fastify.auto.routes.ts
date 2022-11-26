'use strict';

// routing
import RoutesMap from './routes.map';

import addActionRoutes from './functions/add.action.routes';
import addFastifyRoutes from './functions/add.fastify.routes';
import cleanRelativePath from './functions/clean.relative.path';

export {
	// routing
	RoutesMap,

	// routing functions
	addActionRoutes,
	addFastifyRoutes,
	cleanRelativePath
};

const FastifyAutoRoutes = {};
export default FastifyAutoRoutes;
