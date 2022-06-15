'use strict';

import * as _ from 'lodash';

const fixUrl = (url: string, relativeFilePath: string): string => {
	url = relativeFilePath + url;
	url = _.join(_.split(url, '//'), '/');
	if (_.endsWith(url, '/')) url = url.slice(0, -1);
	return url;
};
export default fixUrl;
