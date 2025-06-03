'use strict';

import * as _ from 'lodash';

const fixTags: Function = (route: any, relativeFilePath: string): string[] => {
	const schema: any = route.schema || {};
	const tags: string[] = schema.tags || [];
	if (!_.isEmpty(tags)) return _.map(tags, _.toUpper);

	const firstPath: string = _.first(_.words(relativeFilePath));
	return [_.toUpper(firstPath), _.toUpper(route.method)];
};
export default fixTags;
