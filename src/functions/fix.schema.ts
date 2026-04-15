'use strict';

const fixSchema = (route: any): string[] => {
	return route.schema || {};
};
export default fixSchema;
