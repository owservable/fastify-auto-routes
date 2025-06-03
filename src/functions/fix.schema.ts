'use strict';

const fixSchema: Function = (route: any): string[] => {
	return route.schema || {};
};
export default fixSchema;
