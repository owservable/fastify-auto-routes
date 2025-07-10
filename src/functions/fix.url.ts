'use strict';

const fixUrl = (url: string, relativeFilePath: string): string => {
	url = relativeFilePath + url;
	url = url.split('//').join('/');
	if (url.endsWith('/')) url = url.slice(0, -1);
	return url;
};
export default fixUrl;
